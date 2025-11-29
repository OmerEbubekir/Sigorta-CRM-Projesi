'use client';
import { useEffect, useState, Suspense } from 'react'; // Suspense eklendi
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!token) { setStatus('error'); return; }
    
    api.post('/agency/verify-email', { token })
      .then(() => {
        setStatus('success');
        setTimeout(() => router.push('/login'), 3000);
      })
      .catch(() => setStatus('error'));
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        {status === 'loading' && <><Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48}/><h2 className="text-xl font-bold">Doğrulanıyor...</h2></>}
        {status === 'success' && <><CheckCircle2 className="mx-auto text-green-500 mb-4" size={48}/><h2 className="text-xl font-bold text-gray-800">Hesap Doğrulandı! 🎉</h2><p className="text-gray-500 mt-2">Giriş ekranına yönlendiriliyorsunuz...</p></>}
        {status === 'error' && <><XCircle className="mx-auto text-red-500 mb-4" size={48}/><h2 className="text-xl font-bold text-gray-800">Doğrulama Başarısız</h2><p className="text-gray-500 mt-2">Link geçersiz veya daha önce kullanılmış.</p></>}
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="text-center p-10">Yükleniyor...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}