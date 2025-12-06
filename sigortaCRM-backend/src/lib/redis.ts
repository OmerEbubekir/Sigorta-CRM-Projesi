
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL as string, {
    // Hata olursa 5 saniyede bir tekrar dene (
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    // Bağlantı hatalarını sessizce yönet 
    maxRetriesPerRequest: null
});

// Sadece bir kere 'Ready' olduğunda yazsın (Connect yerine Ready kullanıyoruz)
redis.once('ready', () => {
    console.log('🚀 Redis Hazır ve Bağlı!');
});

// Hataları sadece kritikse gösterelim
redis.on('error', (err: any) => {
    // ECONNRESET hataları normaldir, loglamaya gerek yok. 
    // Sadece farklı bir hata varsa göster.
    if (err.code !== 'ECONNRESET') {
        console.error('❌ Redis Hatası:', err.message);
    }
});

export default redis;