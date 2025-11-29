'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function AddCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    type: 'BIREYSEL', // Varsayılan
    phone: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/customer', formData);
      alert('Müşteri başarıyla kaydedildi! ✅');
      // İstersek buradan direkt "Poliçe Ekle" sayfasına yönlendirebilirmek istenirse aşagıda router ile degişmeli
      // router.push('/dashboard/add-policy'); 
      router.push('/dashboard'); // Şimdilik ana sayfaya dönsün
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.error || 'Müşteri eklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Yeni Müşteri Kartı</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Müşteri Tipi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Tipi</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="type" value="BIREYSEL"
                  checked={formData.type === 'BIREYSEL'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Bireysel</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="type" value="KURUMSAL"
                  checked={formData.type === 'KURUMSAL'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Kurumsal</span>
              </label>
            </div>
          </div>

          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'BIREYSEL' ? 'Adı Soyadı' : 'Şirket Ünvanı'}
            </label>
            <input 
              type="text" required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={formData.type === 'BIREYSEL' ? 'Örn: Mehmet Demir' : 'Örn: Demir İnşaat Ltd. Şti.'}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* TC / Vergi No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'BIREYSEL' ? 'TC Kimlik No' : 'Vergi Numarası'}
            </label>
            <input 
              type="text" required maxLength={11}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="11111111111"
              value={formData.taxId}
              onChange={(e) => setFormData({...formData, taxId: e.target.value})}
            />
          </div>

          {/* İletişim */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input 
                type="tel" required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="555 123 45 67"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
              <input 
                type="email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="mail@site.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : <><Save size={20} /> Müşteriyi Kaydet</>}
          </button>

        </form>
      </div>
    </div>
  );
}