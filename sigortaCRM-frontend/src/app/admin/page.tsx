/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import useAuth from '@/hooks/useAuth'; // Eğer useAuth hook'unu oluşturduysak
import AdminAgenciesTable from '@/components/AdminAgenciesTable';

const AdminPage = () => {
    const router = useRouter();
    const { isAdmin, isCheckingAuth } = useAuth(); // Admin rolünü kontrol edecek hook
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAgencies = async () => {
        try {
            const res = await api.get('/admin/agencies');
            setAgencies(res.data);
            setLoading(false);
        } catch (error: any) {
            // Eğer 403 (Forbidden) hatası gelirse, Admin değilsin demektir.
            if (error.response?.status === 403) {
                toast.error("Bu sayfaya erişim yetkiniz yok.");
                router.push('/dashboard');
            } else {
                toast.error("Acente verileri yüklenirken bir hata oluştu.");
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!isCheckingAuth) { // Yetki kontrolü bittiyse
            if (isAdmin) {
                fetchAgencies();
            } else {
                // Admin değilse direkt Dashboard'a yönlendir
                toast.error("Yönetici yetkisi gereklidir.");
                router.push('/dashboard'); 
            }
        }
    }, [isAdmin, isCheckingAuth]);

    if (isCheckingAuth || loading) {
        return <div className="container mx-auto p-4 text-center mt-10">Yükleniyor...</div>;
    }

    if (!isAdmin) {
        // Bu kısım zaten useEffect'te yakalanacak ama ek koruma.
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">👑 Yönetim Paneli</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b pb-2">Acenteler ({agencies.length})</h2>
                
                {/* 2. Adımda oluşturacağımız tablo bileşenini çağıracağız */}
                <AdminAgenciesTable agencies={agencies} />
            </div>
            
            {/* Loglar kısmı (bir sonraki aşama) buraya gelecek */}
            
        </div>
    );
};

export default AdminPage;