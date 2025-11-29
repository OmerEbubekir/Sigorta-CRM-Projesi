import axios from 'axios';

// Backend adresimiz (Motorun çalıştığı yer)
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Her istekten önce çalışacak "Güvenlik Kontrolü"
api.interceptors.request.use((config) => {
  // Eğer tarayıcıda çalışıyorsak (Sunucu tarafı değilse)
  if (typeof window !== 'undefined') {
    // Cebimizdeki bileti (Token) kontrol et
    const token = localStorage.getItem('token');
    
    // Bilet varsa, isteğin başlığına ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;