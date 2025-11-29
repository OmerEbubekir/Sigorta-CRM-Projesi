import { Request } from 'express';
// Genişletilmiş Request arayüzü için tip tanımlamaları
declare global {
    namespace Express {
        interface Request {
            user?: { id: string; email: string };
        }
    }
}