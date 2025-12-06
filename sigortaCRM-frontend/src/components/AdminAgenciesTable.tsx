/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/AdminAgenciesTable.tsx
import api from '@/lib/api';
import { Ban, CheckCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

// Agency tipini Backend'den gelen veri yapısına göre tanımlayalım
interface Agency {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'AGENCY';
    isVerified: boolean;
    createdAt: string;
    _count: {
        policies: number;
        customers: number;
    };
}

interface AdminAgenciesTableProps {
    agencies: Agency[];
}

const AdminAgenciesTable: React.FC<AdminAgenciesTableProps> = ({ agencies }) => {
    // Yerel state ile listeyi yönetelim ki sayfa yenilenmeden güncellensin
    const [agencyList, setAgencyList] = useState(agencies);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Bu acenteyi ${currentStatus ? 'ENGELLEMEK' : 'AKTİF ETMEK'} istediğinize emin misiniz?`)) return;
        
        setProcessingId(id);
        try {
            // Backend'deki toggle rotasına istek at
            const res = await api.patch(`/admin/agency/${id}/toggle`);
            
            // Listeyi güncelle (Backend'den dönen yeni durumla)
            setAgencyList(prev => prev.map(agency => 
                agency.id === id ? { ...agency, isVerified: res.data.isVerified } : agency
            ));

            toast.success(res.data.message);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "İşlem başarısız.");
        } finally {
            setProcessingId(null);
        }
    };
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acente Adı</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri Sayısı</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                        {agencyList.map((agency) => (
                        <tr key={agency.id} className={agency.role === 'ADMIN' ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agency.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agency.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agency.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                    {agency.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {agency.isVerified ? 'Aktif' : 'Onaysız/Pasif'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {agency._count.customers}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(agency.createdAt).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {agency.role !== 'ADMIN' && ( // Admin kendini banlayamasın :)
                                    <button
                                        onClick={() => handleToggleStatus(agency.id, agency.isVerified)}
                                        disabled={processingId === agency.id}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition ${
                                            agency.isVerified 
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        {processingId === agency.id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : agency.isVerified ? (
                                            <><Ban size={14} /> ENGELLE</>
                                        ) : (
                                            <><CheckCircle size={14} /> AKTİF ET</>
                                        )}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminAgenciesTable;