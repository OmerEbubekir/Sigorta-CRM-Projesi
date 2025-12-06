/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
// Bunu birazdan oluşturacağız
import { useRouter } from 'next/navigation';
import { getPayloadFromToken } from '@/lib/utils';

interface TokenPayload {
    id: string;
    email: string;
    role: 'ADMIN' | 'AGENCY';
}

const useAuth = () => {
    const [role, setRole] = useState<'AGENCY' | 'ADMIN' | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Token'ın içindeki rol bilgisini decode edelim
                const payload: TokenPayload = getPayloadFromToken(token);
                setTimeout(() => {
                    setRole(payload.role);
                }, 0);

            } catch (e) {
                // Token bozuksa veya süresi dolduysa
                localStorage.clear();
                router.push('/login');
            }
        } else {
            // Token yoksa
            setTimeout(() => {
                setRole(null);
            }, 0);
            router.push('/login');
        }

        setTimeout(() => {
            setIsCheckingAuth(false);
        }, 0);
    }, []);

    return {
        role,
        isAdmin: role === 'ADMIN',
        isAgency: role === 'AGENCY',
        isAuthenticated: !!role,
        isCheckingAuth,
    };
};

export default useAuth;