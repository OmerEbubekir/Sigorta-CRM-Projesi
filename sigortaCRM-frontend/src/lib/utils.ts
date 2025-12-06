/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/utils.ts (Mevcut kodların yanına ekle)

// JWT payload'ını decode eden yardımcı fonksiyon
export const getPayloadFromToken = (token: string): any => {
    if (!token) return null;
    // Token üç parçadan oluşur: Header.Payload.Signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
        // Payload base64 URL formatındadır, decode edip JSON parse ediyoruz
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch (e) {
        console.error("Token decode hatası:", e);
        return null;
    }
};