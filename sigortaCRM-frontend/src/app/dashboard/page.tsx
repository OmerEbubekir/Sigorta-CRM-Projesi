'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { Users, FileText, CreditCard, AlertTriangle, LogOut, Search, ChevronLeft, ChevronRight, Loader2, UserPlus, FileDown, ArrowUpDown, RotateCcw, Mail, Ban } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// --- TİP TANIMLAMALARI ---
interface DashboardStats {
  totalPolicies: number;
  totalCustomers: number;
  expiringSoon: number;
  totalRevenue: number;
}

interface Policy {
  id: string;
  policyNumber: string;
  productName?: string;
  company: string;
  plate: string;
  startDate: string;
  endDate: string;
  grossPrice: string;
  netPrice: string;
  daysLeft: number;
  status: string;
  policyType: string;
  insuredName?: string;
  insuredTaxId?: string;
  customer: {
    name: string;
    taxId: string;
    phone: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  
  // --- STATE'LER ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isBanned, setIsBanned] = useState(false);
  // Filtreler
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mavi Kutu aylık hesaplamalar
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState({ count: 0, revenue: 0 });
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  // Sayfalama
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('endDate'); 
  const [sortOrder, setSortOrder] = useState('asc'); 

  // --- VERİ ÇEKME FONKSİYONLARI ---

  // 1. İstatistikleri Çek
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (error) { console.error(error); }
  }, []);

  // 2. Aylık Veriyi Çek
  const fetchMonthlyStats = useCallback(async () => {
    setMonthlyLoading(true);
    try {
      const res = await api.get('/dashboard/monthly', {
        params: { month: selectedMonth, year: selectedYear }
      });
      setMonthlyStats(res.data);
    } catch (error) { console.error(error); } 
    finally { setMonthlyLoading(false); }
  }, [selectedMonth, selectedYear]);

  // 3. Tabloyu Çek
  const fetchPolicies = useCallback(async () => {
    setTableLoading(true);
    try {
      const res = await api.get('/policy', {
        params: {
          page: page,
          limit: 10,
          search: debouncedSearch,
          type: typeFilter || undefined,
          status: statusFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortBy: sortBy,
          sortOrder: sortOrder
        }
      });
      setPolicies(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotalRecords(res.data.meta.total);
    } catch (error) { console.error(error); } 
    finally { setTableLoading(false); }
  }, [page, debouncedSearch, typeFilter, statusFilter, startDate, endDate, sortBy, sortOrder]);


  // --- USE EFFECTLER ---

  // Debounce 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // İlk Açılış
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setAgencyName(localStorage.getItem('agencyName') || '');

    const initData = async () => {
      try {
        // 1. Önce sadece Dashboard verisini çekmeye çalış.
        // Bu endpoint 'requireVerification' middleware'i ile korunuyor.
        const res = await api.get('/dashboard');
        
        // Eğer 200 OK geldiyse, kesinlikle onaylıdır.
        setStats(res.data);
        setIsVerified(true); 

        // Onaylı olduğu için diğer verileri de çekebiliriz
        // (Burada hata olsa bile isVerified'ı etkilememeli!)
        fetchMonthlyStats();
        fetchPolicies();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // --- HATA YÖNETİMİ ---
        console.error("Dashboard erişim hatası:", error);

        if (error.response) {
          if (error.response.status === 403) {
            const code = error.response.data.code;
            if (code === 'BANNED') {
              setIsBanned(true); // <--- YENİ
          } else {
              setIsVerified(false); // Sadece onaysız
          }
          } else if (error.response.status === 401) {
            // TOKEN GEÇERSİZ
            localStorage.clear();
            router.push('/login');
          } else {
             // Başka bir hata (örn 500) olsa bile verified olabilir, false yapma!
             // Sadece hata mesajı göster.
             toast.error("Veriler yüklenirken bir sorun oluştu.");
             // Önemli: setIsVerified(false) BURADA ÇAĞRILMAMALI
          }
        }
      } finally {
        setInitialLoading(false);
      }
    };

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Güncellemeler (Sadece Onaylıysa)
  useEffect(() => { if (isVerified === true && !initialLoading) fetchPolicies(); }, [fetchPolicies, isVerified, initialLoading]);
  useEffect(() => { if (isVerified === true && !initialLoading) fetchMonthlyStats(); }, [fetchMonthlyStats, isVerified, initialLoading]);


  // --- AKSİYON FONKSİYONLARI ---

  // Silme İşlemi 
  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    const toastId = toast.loading('Siliniyor...');
    try {
      await api.delete(`/policy/${id}`);
      setPolicies(prev => prev.filter(p => p.id !== id));
      
      fetchStats(); 
      fetchMonthlyStats(); 
      
      toast.success('Silindi', { id: toastId });
    } catch { 
      toast.error('Hata oluştu', { id: toastId }); 
    }
  };

  const handlePeriodChange = (newMonth: number, newYear: number) => {
    setSelectedMonth(newMonth); setSelectedYear(newYear);
    const firstDay = new Date(newYear, newMonth - 1, 1);
    const lastDay = new Date(newYear, newMonth, 0); 
    const formatYMD = (date: Date) => {
        const y = date.getFullYear(); const m =String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };
    setStartDate(formatYMD(firstDay)); setEndDate(formatYMD(lastDay)); setPage(1);
    toast.success(`${newMonth}. Ay verileri listeleniyor`);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(column); setSortOrder('asc'); }
  };

  const exportToExcel = () => {
    const dataToExport = policies.map(p => ({
      'Poliçe Türü': p.policyType, 'Sigortalı': p.insuredName || p.customer.name, 
      'Sigorta Ettiren': p.customer.name, 'TC/Vergi No': p.insuredTaxId || p.customer.taxId,
      'İletişim': p.customer.phone || '-','Ürün Adı': p.productName || '-', 'Poliçe Şirketi': p.company, 'Poliçe No': p.policyNumber,
      'Plaka': p.plate, 'Başlangıç': new Date(p.startDate).toLocaleDateString('tr-TR'), 'Bitiş': new Date(p.endDate).toLocaleDateString('tr-TR'),
      'Kalan Gün': p.daysLeft, 'Brüt Fiyat': p.grossPrice, 'Net Fiyat': p.netPrice, 'Durum': p.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport); const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Poliçeler"); XLSX.writeFile(workbook, "Policeler.xlsx"); toast.success('Excel indirildi!');
  };

  const resetFilters = () => {
    setSearchInput(''); setDebouncedSearch(''); setTypeFilter(''); setStatusFilter(''); 
    setStartDate(''); setEndDate(''); setPage(1); setSortBy('endDate'); setSortOrder('asc');
    setSelectedMonth(new Date().getMonth() + 1); setSelectedYear(new Date().getFullYear());
    toast.success('Filtreler temizlendi ✨');
  };

  const handleResend = async () => {
    const email = localStorage.getItem('email'); 
    if (!email) { toast.error("Oturum süreniz dolmuş."); return; }
    const toastId = toast.loading('Mail gönderiliyor...');
    try {
      await api.post('/agency/resend-verification', { email });
      toast.success('Doğrulama maili gönderildi!', { id: toastId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) { toast.error(err.response?.data?.error || 'Hata oluştu.', { id: toastId }); }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('tr-TR');
  const formatMoney = (amount: string) => Number(amount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  const getRowColor = (days: number, status: string) => {
    if (status === 'CANCELLED') return 'bg-gray-100 text-gray-400 line-through';
    if (days <= 3) return 'bg-red-50 text-red-900 border-l-4 border-red-500';
    if (days <= 7) return 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400';
    if (days <= 14) return 'bg-green-50 text-green-800 border-l-4 border-green-500';
    return 'bg-white hover:bg-gray-50';
  };

  // --- RENDER ---

  if (initialLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-blue-600 font-medium"><Loader2 className="animate-spin mr-2"/> Kontrol Ediliyor...</div>;
  }
  if (isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white border border-red-500 p-10 rounded-2xl shadow-2xl w-full max-w-lg text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="text-red-600" size={40} /> 
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erişim Engellendi</h1>
          <p className="text-red-600 font-semibold mb-6">Hesabınız yönetici tarafından askıya alınmıştır.</p>
          <p className="text-gray-500 text-sm mb-8">
            Bu işlemin bir hata olduğunu düşünüyorsanız lütfen destek ekibiyle iletişime geçin.
          </p>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }
  if (isVerified === false) {
    // Kullanıcının emailini alalım
    const email = typeof window !== 'undefined' ? localStorage.getItem('email') : '';
    
    // Mail sağlayıcısını tahmin etme fonksiyonu
    const getMailProviderLink = () => {
        if (!email) return null;
        if (email.includes('@gmail.com')) return { name: 'Gmail', link: 'https://mail.google.com/' };
        if (email.includes('@outlook') || email.includes('@hotmail') || email.includes('@live')) return { name: 'Outlook', link: 'https://outlook.live.com/' };
        if (email.includes('@yahoo')) return { name: 'Yahoo Mail', link: 'https://mail.yahoo.com/' };
        if (email.includes('@yandex')) return { name: 'Yandex Mail', link: 'https://mail.yandex.com/' };
        return null; // Bilinmeyen sağlayıcı
    };

    const mailProvider = getMailProviderLink();

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white border border-red-200 p-10 rounded-2xl shadow-xl w-full max-w-lg text-center">
          
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Mail className="text-red-600" size={40} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">E-Posta Doğrulaması Gerekli</h1>
          <p className="text-sm text-gray-500 font-medium mb-6 bg-gray-100 py-1 px-3 rounded-full inline-block">
            {email}
          </p>
          
          <p className="text-gray-600 mb-8 leading-relaxed text-sm">
            Güvenliğiniz için sisteme erişim kısıtlanmıştır. Lütfen yukarıdaki adrese gönderdiğimiz onay bağlantısına tıklayın.
          </p>

          <div className="space-y-3">
            
            {/* 1. AKILLI MAİL BUTONU (Varsa Göster) */}
            {mailProvider && (
                <a 
                  href={mailProvider.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-lg hover:bg-blue-700 transition font-bold shadow-md flex items-center justify-center gap-2 mb-4"
                >
                  {mailProvider.name} Gelen Kutusunu Aç ↗
                </a>
            )}

            {/* 2. TEKRAR GÖNDER BUTONU */}
            <button 
              onClick={handleResend}
              className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw size={16}/> Doğrulama Mailini Tekrar Gönder
            </button>
            
            {/* 3. ÇIKIŞ BUTONU */}
            <button 
              onClick={() => { localStorage.clear(); router.push('/login'); }} 
              className="text-xs text-gray-400 hover:text-gray-600 mt-6 underline"
            >
              Farklı bir hesaba giriş yap
            </button>
          </div>
        </div>
      </div>
    );
  }
  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Hoşgeldin, {agencyName} 👋</h1><p className="text-gray-500 text-sm">Portföy durumun aşağıdadır.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/add-customer" className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition"><UserPlus size={18} /> Müşteri Ekle</Link>
          <Link href="/dashboard/add-policy" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition"><FileText size={18} /> Poliçe Ekle</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 text-sm"><LogOut size={16} /> Çıkış</button>
        </div>
      </div>

      {/* İSTATİSTİKLER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox icon={<FileText size={20}/>} color="blue" title="Toplam Poliçe" value={stats?.totalPolicies} />
        <StatBox icon={<Users size={20}/>} color="purple" title="Müşteriler" value={stats?.totalCustomers} />
        <StatBox icon={<AlertTriangle size={20}/>} color="red" title="Yaklaşan (30 Gün)" value={stats?.expiringSoon} />
        <StatBox icon={<CreditCard size={20}/>} color="green" title="Toplam Ciro" value={stats?.totalRevenue ? formatMoney(stats.totalRevenue.toString()) : '0 ₺'} />
      </div>

      {/* AYLIK PERFORMANS */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2"><CreditCard size={20} className="text-blue-200" /> Dönemsel Performans</h2>
          <p className="text-blue-100 text-sm mb-4">Seçtiğiniz ayın verilerini tabloda listeler.</p>
          <div className="flex gap-3 text-gray-800">
            <select value={selectedMonth} onChange={(e) => handlePeriodChange(Number(e.target.value), selectedYear)} className="p-2 rounded-lg text-sm font-medium outline-none cursor-pointer">
              {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleDateString('tr-TR', { month: 'long' })}</option>))}
            </select>
            <select value={selectedYear} onChange={(e) => handlePeriodChange(selectedMonth, Number(e.target.value))} className="p-2 rounded-lg text-sm font-medium outline-none cursor-pointer">
              <option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option>
            </select>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <div className="text-center"><p className="text-blue-200 text-xs uppercase font-bold tracking-wider">Kesilen Poliçe</p>{monthlyLoading ? <Loader2 className="animate-spin mx-auto mt-1" /> : <p className="text-3xl font-bold">{monthlyStats.count}</p>}</div>
          <div className="w-px h-12 bg-blue-400/30"></div>
          <div className="text-center"><p className="text-blue-200 text-xs uppercase font-bold tracking-wider">Toplam Ciro</p>{monthlyLoading ? <Loader2 className="animate-spin mx-auto mt-1" /> : <p className="text-3xl font-bold text-green-300">{Number(monthlyStats.revenue).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>}</div>
        </div>
      </div>

      {/* TABLO */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        {tableLoading && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}
        <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="Ara..." className="w-full pl-10 p-2.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            </div>
            <select className="p-2.5 bg-white border rounded-lg text-sm outline-none cursor-pointer" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Tüm Kayıt Türleri</option>
              <option value="POLICE">Sadece Poliçeler</option>
              <option value="ZEYIL">Sadece Zeyiller</option>
              <option value="PORTFOY_DISI">Portföy Dışı Poliçeler</option> {/* İsim Güncellendi */}
            </select>
            <select className="p-2.5 bg-white border rounded-lg text-sm outline-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Tüm Durumlar</option><option value="ACTIVE">Aktif</option><option value="EXPIRED">Süresi Dolmuş</option><option value="CANCELLED">İptal Edilenler</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
              <span className="text-xs text-gray-500 pl-2">Tarih:</span>
              <input type="date" className="p-1.5 text-sm outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="text-gray-400">-</span>
              <input type="date" className="p-1.5 text-sm outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button onClick={resetFilters} title="Temizle" className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-red-600 transition flex items-center justify-center"><RotateCcw size={18} /></button>
            <button onClick={exportToExcel} className="w-full md:w-auto p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm shadow-sm transition"><FileDown size={16} /> Excel</button>
          </div>
        </div>

        <div className="overflow-x-auto"> 
          <table className="w-full text-left border-collapse min-w-[2000px]"> 
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <SortableHeader label="Tür" sortKey="policyType" currentSort={sortBy} sortOrder={sortOrder} onClick={handleSort} />
                <SortableHeader label="Durum" sortKey="status" currentSort={sortBy} sortOrder={sortOrder} onClick={handleSort} />
                <SortableHeader label="Sigorta Ettiren" sortKey="customer.name" currentSort={sortBy} sortOrder={sortOrder} onClick={handleSort} />
                <th className="p-4 font-semibold">Sigortalı</th>
                <th className="p-4 font-semibold">TC / Vergi No</th>
                <th className="p-4 font-semibold">İletişim</th>
                <th className="p-4 font-semibold">Plaka</th>
                <th className="p-4 font-semibold">Seri No</th>
                <th className="p-4 font-semibold">Ürün</th>
                <th className="p-4 font-semibold">Poliçe Şirketi</th>
                <SortableHeader label="Poliçe No" sortKey="policyNumber" currentSort={sortBy} sortOrder={sortOrder} onClick={handleSort} />
                <SortableHeader label="Başlangıç" sortKey="startDate" currentSort={sortBy} sortOrder={sortOrder} onClick={handleSort} />
                <SortableHeader label="Bitiş" sortKey="endDate" currentSort={sortBy} sortOrder={sortOrder} onClick={handleSort} />
                <th className="p-4 font-semibold">Kalan Gün</th>
                <th className="p-4 font-semibold text-right">Brüt Fiyat</th>
                <SortableHeader label="Net Fiyat" sortKey="netPrice" currentSort={sortBy} sortOrder={sortOrder} onClick={handleSort} />
                <th className="p-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <tr key={policy.id} className={`transition duration-150 ${getRowColor(policy.daysLeft, policy.status)}`}>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${policy.policyType === 'ZEYIL' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{policy.policyType}</span></td>
                    <td className="p-4">
                        {policy.status === 'CANCELLED' && <span className="text-red-600 font-bold text-xs">İPTAL</span>}
                        {policy.status === 'EXPIRED' && <span className="text-gray-500 font-bold text-xs">BİTTİ</span>}
                        {policy.status === 'ACTIVE' && <span className="text-green-600 font-bold text-xs">AKTİF</span>}
                    </td>
                    <td className="p-4 font-bold">{policy.customer.name}</td>
                    <td className="p-4 opacity-90">{policy.insuredName || policy.customer.name}</td>
                    <td className="p-4 text-xs opacity-80">{policy.insuredTaxId || policy.customer.taxId}</td>
                    <td className="p-4 text-xs opacity-80">{policy.customer.phone || '-'}</td>
                    <td className="p-4 font-mono font-medium">{policy.plate || '-'}</td>
                    <td className="p-4 opacity-50">-</td>
                    <td className="p-4 font-medium text-gray-700">{policy.productName || '-'}</td>
                    <td className="p-4">{policy.company}</td>
                    <td className="p-4 font-medium">{policy.policyNumber}</td>
                    <td className="p-4">{formatDate(policy.startDate)}</td>
                    <td className="p-4 font-bold">{formatDate(policy.endDate)}</td>
                    <td className="p-4">{policy.status === 'CANCELLED' ? '-' : `${policy.daysLeft} Gün`}</td>
                    <td className="p-4 text-right">{formatMoney(policy.grossPrice)}</td>
                    <td className="p-4 font-medium text-right">{formatMoney(policy.netPrice)}</td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button onClick={() => router.push(`/dashboard/edit-policy/${policy.id}`)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">Düz.</button>
                      <button onClick={() => handleDelete(policy.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">Sil</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={16} className="p-8 text-center text-gray-400">Kayıt bulunamadı.</td></tr> 
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-500">Toplam <b>{totalRecords}</b> kayıttan <b>{(page - 1) * 10 + 1}</b> - <b>{Math.min(page * 10, totalRecords)}</b> arası gösteriliyor.</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded hover:bg-white disabled:opacity-50"><ChevronLeft size={16} /></button>
            <span className="p-2 px-4 bg-white border rounded text-sm font-medium">{page}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border rounded hover:bg-white disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- YARDIMCI BİLEŞENLER ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatBox({ icon, color, title, value }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colors: any = { blue: 'bg-blue-100 text-blue-600', purple: 'bg-purple-100 text-purple-600', red: 'bg-red-100 text-red-600', green: 'bg-green-100 text-green-600' };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-full ${colors[color]}`}>{icon}</div>
      <div><p className="text-xs text-gray-500 font-bold uppercase">{title}</p><h3 className="text-xl font-bold text-gray-800">{value ?? 0}</h3></div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SortableHeader({ label, sortKey, currentSort, onClick }: any) {
  return (
    <th className="p-4 font-semibold cursor-pointer hover:bg-gray-200 transition select-none group" onClick={() => onClick(sortKey)}>
      <div className="flex items-center gap-1">{label}<ArrowUpDown size={14} className={`text-gray-400 ${currentSort === sortKey ? 'text-blue-600' : 'group-hover:text-gray-600'}`} /></div>
    </th>
  );
}