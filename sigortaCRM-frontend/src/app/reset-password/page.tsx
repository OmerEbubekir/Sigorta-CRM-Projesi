'use client';
import { useState, Suspense } from 'react'; 
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import toast from 'react-hot-toast';

// İçerik bileşeni
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/agency/reset-password', { token, newPassword: password });
      toast.success('Şifre değişti! Giriş yapabilirsiniz.');
      router.push('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error('Hata: Link geçersiz veya süresi dolmuş.');
    }
  };

  if (!token) return <div className="text-center p-10">Geçersiz Link</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Yeni Şifre Belirle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" required className="w-full p-3 border rounded-lg" placeholder="Yeni Şifreniz" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg">Şifreyi Değiştir</button>
        </form>
      </div>
    </div>
  );
}

// Ana bileşen (Suspense ile sarılmış)
export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="text-center p-10">Yükleniyor...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}