import request from 'supertest';
import express from 'express';
import agencyRoutes from '../routes/agencyRoutes';
import { PrismaClient } from '@prisma/client';
import redis from '../lib/redis'; // Redis'i çağır
// 1. Test için küçük bir Express uygulaması ayağa kaldırıyoruz
const app = express();
app.use(express.json());
app.use('/api/agency', agencyRoutes);

const prisma = new PrismaClient();

// Testlerde kullanacağımız rastgele bir mail (Her testte çakışmasın diye)
const testEmail = `test_${Date.now()}@example.com`;

describe('Auth API Testleri', () => {

    // Test bittikten sonra veritabanı bağlantısını keselim ki terminal takılı kalmasın
    afterAll(async () => {
        await prisma.$disconnect(); // Veritabanını kapat
        redis.disconnect(); // Redis'i kapat (Test takılmasın)
    });

    // SENARYO 1: Yeni Acente Kaydı
    it('POST /api/agency/register -> Başarılı bir şekilde kayıt olmalı', async () => {
        const res = await request(app).post('/api/agency/register').send({
            name: 'Test Acente',
            email: testEmail,
            password: 'password123',
        });

        // Beklentilerimiz:
        expect(res.statusCode).toEqual(201); // Durum kodu 201 olmalı
        expect(res.body).toHaveProperty('message'); // Cevapta "message" olmalı
        expect(res.body.message).toContain('Kayıt başarılı'); // Mesaj bunu içermeli
    });

    // SENARYO 2: Aynı Mail ile Tekrar Kayıt (Hata Vermeli)
    it('POST /api/agency/register -> Aynı mail ile kayıtta hata vermeli', async () => {
        // Aynı maili tekrar gönderiyoruz
        const res = await request(app).post('/api/agency/register').send({
            name: 'Test Acente 2',
            email: testEmail, // YUKARIDAKİ İLE AYNI
            password: 'password123',
        });

        // Beklentilerimiz:
        expect(res.statusCode).not.toEqual(201); // Başarılı OLMAMALI
        // Muhtemelen 400 veya 500 dönecektir (Backend validasyonuna göre)
    });

});