import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import agencyRoutes from './routes/agencyRoutes';
import customerRoutes from './routes/customerRoutes';
import policyRoutes from './routes/policyRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { generalLimiter } from './middleware/rateLimiter';

dotenv.config();
// Express uygulamasını başlat
const app = express();
const PORT = process.env.PORT || 3000;
// Orta katmanlar
app.use(cors());
app.use(express.json());
app.use(generalLimiter);// Genel hız sınırlayıcıyı tüm API için uygulama
// Rotalar
app.use('/api/agency', agencyRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Uygulamanın ana rotası
app.get('/', (req, res) => {
    res.send('Sigorta CRM API Çalışıyor! ');
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});