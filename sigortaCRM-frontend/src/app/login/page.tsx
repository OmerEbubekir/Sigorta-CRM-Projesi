'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck,ArrowLeft} from 'lucide-react';

import api from '../../lib/api';
import Link from 'next/link';
export default function LoginPage() {
  const router = useRouter();

  // Ekran değişkenleri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfa yenilenmesin
    setLoading(true);
    setError('');

    try {
      // Backend'e kimlik bilgilerini gönder
      const response = await api.post('/agency/login', {
        email,
        password,
      });

      // Gelen Token'ı ve İsmi tarayıcıya kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('agencyName', response.data.agency.name);
      localStorage.setItem('email', email);
      // Başarılı! Dashboard'a yönlendirme işlemi eklenecek
      router.push('/dashboard'); 

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      // Hata mesajını ekrana bas
      if (err.response) {
        if (err.response.status === 401) {
            setError('Şifreniz hatalı. Lütfen tekrar deneyin.');
        } else if (err.response.status === 404) {
            setError('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.');
        } else {
            setError(err.response.data?.error || 'Giriş yapılamadı.');
        }
      } else {
          setError('Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium">
          <ArrowLeft size={20} /> Ana Sayfa
        </Link>
      </div>

<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Logo ve Başlık */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Acente Girişi</h1>
          <p className="text-gray-500 text-sm">CRM Paneline Erişim</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                required
                className="block w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="mail@acente.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                required
                className="block w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
    Şifremi unuttum?
  </Link>
</div>

          {/* Hata Kutusu (Varsa görünür) */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Buton */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kontrol Ediliyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}