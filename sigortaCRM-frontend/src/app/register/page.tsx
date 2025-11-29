'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Şifreler Eşleşiyor mu?
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Şifreler eşleşmiyor!');
      setLoading(false);
      return;
    }

    try {
      // passwordConfirm alanını backend'e göndermiyoruz
      const { passwordConfirm, ...dataToSend } = formData; 
      
      await api.post('/agency/register', dataToSend);
      toast.success('Kayıt başarılı! Lütfen mail kutunuzu kontrol edin.');
      router.push('/login');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Acente Kayıt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Ad-Soyad / Şirket Adı */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20}/>
            <input type="text" name="name" required className="w-full pl-10 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Acente/Şirket Adı" value={formData.name} onChange={handleChange}/>
          </div>
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20}/>
            <input type="email" name="email" required className="w-full pl-10 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Email adresiniz" value={formData.email} onChange={handleChange}/>
          </div>
          
          {/* Şifre */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20}/>
            <input type="password" name="password" required className="w-full pl-10 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Şifre" value={formData.password} onChange={handleChange}/>
          </div>
          
          {/* Şifre Tekrarı */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20}/>
            <input type="password" name="passwordConfirm" required className="w-full pl-10 p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Şifre Tekrarı" value={formData.passwordConfirm} onChange={handleChange}/>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center">
            {loading ? <Loader2 className="animate-spin mr-2" size={20}/> : 'Kayıt Ol'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Zaten hesabınız var mı? <Link href="/login" className="text-blue-600 font-medium hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}