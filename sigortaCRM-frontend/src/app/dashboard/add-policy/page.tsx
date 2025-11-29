'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { ArrowLeft, Save, UserPlus, CheckSquare } from 'lucide-react';

export default function AddPolicyPage() {
  const router = useRouter();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // YENİ: Sigortalı ile Ettiren aynı mı? (Varsayılan: Evet)
  const [isSamePerson, setIsSamePerson] = useState(true);

  const [formData, setFormData] = useState({
    customerId: '',
    productName: '',
    company: 'Allianz Sigorta',
    policyNumber: '',
    plate: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    grossPrice: '',
    netPrice: '',
    policyType: 'POLICE',
    // YENİ ALANLAR
    insuredName: '',
    insuredTaxId: ''
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customer');
        setCustomers(res.data);
      } catch (err) {
        
        console.error('Müşteriler yüklenemedi'+err);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Eğer "Aynı Kişi" seçiliyse, Sigortalı bilgilerini boş göndereriyoruz ki
    // Backend veya Frontend gösterirken Sigorta Ettiren'i baz alsın.
    const dataToSend = {
      ...formData,
      insuredName: isSamePerson ? null : formData.insuredName,
      insuredTaxId: isSamePerson ? null : formData.insuredTaxId
    };

    try {
      await api.post('/policy', dataToSend);
      alert('Poliçe başarıyla oluşturuldu! 🎉');
      router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.error || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Yeni Poliçe Ekle</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- BÖLÜM 1: MÜŞTERİ (SİGORTA ETTİREN) --- */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-bold text-blue-800 mb-2">Sigorta Ettiren (Müşteri)</label>
            <div className="flex gap-2">
              <select 
                required
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              >
                <option value="">-- Müşteri Seçiniz --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.taxId})</option>
                ))}
              </select>
              <button type="button" className="p-3 bg-white border rounded-lg text-gray-600 hover:bg-gray-50" title="Yeni Müşteri">
                <UserPlus size={20} />
              </button>
            </div>
          </div>

          {/* --- BÖLÜM 2: SİGORTALI BİLGİSİ --- */}
          <div className="border-b pb-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div 
                className={`w-5 h-5 border rounded flex items-center justify-center ${isSamePerson ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`}
                onClick={() => setIsSamePerson(!isSamePerson)}
              >
                {isSamePerson && <CheckSquare size={16} className="text-white" />}
              </div>
              <span className="text-gray-700 font-medium" onClick={() => setIsSamePerson(!isSamePerson)}>
                Sigortalı, Sigorta Ettiren ile aynı kişi
              </span>
            </label>

            {/* Eğer aynı kişi DEĞİLSE bu alanlar açılır */}
            {!isSamePerson && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sigortalı Adı Soyadı</label>
                  <input 
                    type="text" 
                    required={!isSamePerson} // Eğer farklıysa zorunlu olsun
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Ahmet Yılmaz"
                    value={formData.insuredName}
                    onChange={(e) => setFormData({...formData, insuredName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sigortalı TC / Vergi No</label>
                  <input 
                    type="text" 
                    required={!isSamePerson}
                    maxLength={11}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="11111111111"
                    value={formData.insuredTaxId}
                    onChange={(e) => setFormData({...formData, insuredTaxId: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          {/* --- BÖLÜM 3: POLİÇE DETAYLARI --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/*  (Poliçe Türü) -  */}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sigorta Şirketi</label>
              <input type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Örn: Axa Sigorta" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poliçe Numarası</label>
              <input type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="12345678" value={formData.policyNumber} onChange={(e) => setFormData({...formData, policyNumber: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plaka (Opsiyonel)</label>
              <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                placeholder="34 ABC 34" value={formData.plate} onChange={(e) => setFormData({...formData, plate: e.target.value})} />
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
                <option value="PORTFOY_DISI">Portföy Dışı Poliçe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
              <input type="date" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
              <input type="date" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brüt Prim (TL)</label>
              <input type="number" step="0.01" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00" value={formData.grossPrice} onChange={(e) => setFormData({...formData, grossPrice: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Prim (TL)</label>
              <input type="number" step="0.01" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00" value={formData.netPrice} onChange={(e) => setFormData({...formData, netPrice: e.target.value})} />
            </div>

          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : <><Save size={20} /> Poliçeyi Kaydet</>}
          </button>

        </form>
      </div>
    </div>
  );
}