'use client';

import { useState, useEffect, use } from 'react'; // 'use' hook'u Next.js 15+ için gerekli olabilir
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api'; // API bağlantısı (4 klasör yukarı çıktık)
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';


export default function EditPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Params'ı çözümle (Unwrap)
  const resolvedParams = use(params);
  const policyId = resolvedParams.id;
  const [isSamePerson, setIsSamePerson] = useState(true);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customers, setCustomers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    customerId: '',
    company: '',
    policyNumber: '',
    plate: '',
    productName: '',
    startDate: '',
    endDate: '',
    grossPrice: '',
    netPrice: '',
    policyType: 'POLICE',
    insuredName: '', 
    insuredTaxId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Müşterileri Çek (Dropdown için)
        const custRes = await api.get('/customer');
        setCustomers(custRes.data);

        // 2. Düzenlenecek Poliçeyi Çek (ARTIK DOĞRUDAN ID İLE İSTEK ATIYORUZ)
        // Backend rotamız: GET /api/policy/:id
        const policyRes = await api.get(`/policy/${policyId}`);
        const policy = policyRes.data;

        if (policy) {
          setFormData({
            customerId: policy.customerId,
            company: policy.company,
            policyNumber: policy.policyNumber,
            plate: policy.plate || '',
            // Tarihleri input formatına (YYYY-MM-DD) çevir
            startDate: new Date(policy.startDate).toISOString().split('T')[0],
            endDate: new Date(policy.endDate).toISOString().split('T')[0],
            grossPrice: policy.grossPrice,
            netPrice: policy.netPrice,
            policyType: policy.policyType,
            productName: policy.productName || '',
            // Eğer Sigortalı bilgileri varsa doldur, yoksa boş bırak
            insuredName: policy.insuredName || '',
            insuredTaxId: policy.insuredTaxId || '',
          });
          
          // Eğer sigortalı bilgisi varsa "Aynı Kişi" tikini kaldır
          if (policy.insuredName) {
            setIsSamePerson(false);
          }
        }
      } catch (err) {
        console.error('Veri yüklenemedi', err);
        // Alert yerine toast kullanmak daha şık olur (eğer import ettiysen)
        // toast.error('Poliçe bulunamadı veya yetkiniz yok.');
        alert('Poliçe bilgileri alınamadı.'); 
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [policyId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Butonu pasif yap

    // Yükleniyor mesajı göster (İstersen)
    const loadingToast = toast.loading('Güncelleniyor...');

    try {
      await api.put(`/policy/${policyId}`, formData);
      
      // Yükleniyor mesajını sil, BAŞARILI mesajı göster
      toast.dismiss(loadingToast);
      toast.success('Poliçe başarıyla güncellendi! 🎉');
      
      // Yönlendir (Toast mesajı ekranda kalmaya devam eder)
      router.push('/dashboard'); 
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.dismiss(loadingToast);
      // HATA mesajı göster
      toast.error(err.response?.data?.error || 'Güncelleme sırasında hata oluştu.');
      setLoading(false); // Hata varsa loading'i kapat ki tekrar deneyebilsin
    }
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Poliçeyi Düzenle</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Müşteri (Disabled yaptık, genelde poliçe sahibi değişmez ama istersen açabilirsin) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri</label>
            <select 
              disabled
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-500 outline-none"
              value={formData.customerId}
              onChange={(e) => setFormData({...formData, customerId: e.target.value})}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Diğer Alanlar (Add Policy ile Aynı) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* YENİ: Ürün Adı (Poliçe Türü) - Şirketten Önce */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (Trafik, Kasko vb.)</label>
              <input 
                type="text" required 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Örn: Trafik Sigortası"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şirket</label>
              <input type="text" required className="w-full p-3 border rounded-lg" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poliçe No</label>
              <input type="text" required className="w-full p-3 border rounded-lg" value={formData.policyNumber} onChange={(e) => setFormData({...formData, policyNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plaka</label>
              <input type="text" className="w-full p-3 border rounded-lg uppercase" value={formData.plate} onChange={(e) => setFormData({...formData, plate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Türü</label>
              <select 
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.policyType} 
                onChange={(e) => setFormData({...formData, policyType: e.target.value})}
              >
                <option value="POLICE">Poliçe (Standart)</option>
                <option value="ZEYIL">Zeyil</option>
                {/* Müşterinin istediği isimle: */}
                <option value="PORTFOY_DISI">Portföy Dışı Poliçe (Takip İçin)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
              <input type="date" required className="w-full p-3 border rounded-lg" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
              <input type="date" required className="w-full p-3 border rounded-lg" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brüt (TL)</label>
              <input type="number" step="0.01" required className="w-full p-3 border rounded-lg" value={formData.grossPrice} onChange={(e) => setFormData({...formData, grossPrice: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net (TL)</label>
              <input type="number" step="0.01" required className="w-full p-3 border rounded-lg" value={formData.netPrice} onChange={(e) => setFormData({...formData, netPrice: e.target.value})} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 text-white p-4 rounded-lg font-bold hover:bg-orange-600 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? 'Güncelleniyor...' : <><Save size={20} /> Değişiklikleri Kaydet</>}
          </button>
        </form>
      </div>
    </div>
  );
}