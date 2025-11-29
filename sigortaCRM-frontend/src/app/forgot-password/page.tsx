'use client';
import { useState } from 'react';
import api from '../../lib/api';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/agency/forgot-password', { email });
      toast.success('Sıfırlama linki mailinize gönderildi!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <Link href="/login" className="flex items-center text-gray-500 mb-6 hover:text-blue-600"><ArrowLeft size={18}/> Geri Dön</Link>
        <h2 className="text-2xl font-bold mb-4">Şifremi Unuttum</h2>
        <p className="text-gray-500 mb-6 text-sm">Kayıtlı e-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20}/>
            <input type="email" required className="w-full pl-10 p-3 border rounded-lg" placeholder="Email adresiniz" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
          </button>
        </form>
      </div>
    </div>
  );
}