import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import agencyRoutes from './routes/agencyRoutes';
import customerRoutes from './routes/customerRoutes';
import policyRoutes from './routes/policyRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { generalLimiter } from './middleware/rateLimiter';
import { checkBannedIp } from './middleware/ipBanMiddleware';
import adminRoutes from './routes/adminRoutes';
import cookieParser from 'cookie-parser';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();
// Express uygulamasını başlat
const app = express();
const PORT = process.env.PORT || 3000;
// Orta katmanlar
app.use(cors({
    origin: 'http://localhost:3001', // Frontend adresi (Yıldız * olmaz, tam adres şart)
    credentials: true // Cookie'lere izin ver
}));
app.use(cookieParser());
app.use(checkBannedIp);
app.use(express.json());
app.use(generalLimiter);// Genel hız sınırlayıcıyı tüm API için uygulama
// Rotalar
app.use('/api/agency', agencyRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
// Uygulamanın ana rotası
app.get('/', (req, res) => {
    res.send('Sigorta CRM API Çalışıyor! ');
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});