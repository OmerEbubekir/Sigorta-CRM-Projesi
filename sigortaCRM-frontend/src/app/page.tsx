'use client';

import Link from 'next/link';
import { ShieldCheck, BarChart3, Users, Clock, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Sigorta<span className="text-blue-600">CRM</span>
              </span>
            </div>

            {/* Desktop Linkler */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#ozellikler" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Özellikler</a>
              <a href="#nasil-calisir" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Nasıl Çalışır?</a>
              <a href="#sss" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">S.S.S.</a>
            </div>

            {/* Desktop Butonlar */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Giriş Yap
              </Link>
              <Link href="/register" className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                Ücretsiz Dene
              </Link>
            </div>

            {/* Mobil Menü Butonu */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg">
            <a href="#ozellikler" className="text-gray-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Özellikler</a>
            <a href="#nasil-calisir" className="text-gray-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Nasıl Çalışır?</a>
            <Link href="/login" className="text-blue-600 font-bold">Giriş Yap</Link>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION (GİRİŞ) --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Yeni Nesil Sigorta Takip Sistemi
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            Sigorta Acentenizi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Dijitale Taşıyın
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
            Excel dosyalarıyla boğuşmayı bırakın. Müşterilerinizi, poliçelerinizi ve yenileme tarihlerini tek bir ekrandan, profesyonelce yönetin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
              Hemen Başlayın <ArrowRight size={20} />
            </Link>
            <a href="#ozellikler" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full text-lg font-bold hover:bg-gray-50 transition">
              Özellikleri İncele
            </a>
          </div>
        </div>

        {/* Arka Plan Süslemesi */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
           <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
           <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* --- DASHBOARD PREVIEW  --- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-24 relative z-20">
        <div className="bg-gray-900 rounded-2xl p-2 shadow-2xl border border-gray-800">
          <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center group">
            {/* BURAYA DASHBOARD EKRAN GÖRÜNTÜSÜ GELECEK */}
            <img 
              src="/dashboard-screen.png" 
              alt="SigortaCRM Paneli" 
              className="w-full h-full object-cover object-top" // object-top: Resmin üst kısmı görünsün
            />
            {/* Hover Efekti */}
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
          </div>
        </div>
      </section>

      {/* --- ÖZELLİKLER --- */}
      <section id="ozellikler" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-bold tracking-wide uppercase">Özellikler</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              İşinizi Büyütmek İçin İhtiyacınız Olan Her Şey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Özellik 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Müşteri Yönetimi</h3>
              <p className="text-gray-500 leading-relaxed">
                Tüm müşterilerinizin iletişim bilgilerini, vergi numaralarını ve geçmiş poliçelerini tek bir güvenli havuzda saklayın.
              </p>
            </div>

            {/* Özellik 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Otomatik Hatırlatmalar</h3>
              <p className="text-gray-500 leading-relaxed">
                Poliçe bitiş tarihlerini kaçırmayın. Sistem, süresi yaklaşan poliçeleri size renkli uyarılarla otomatik olarak bildirir.
              </p>
            </div>

            {/* Özellik 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Finansal Raporlama</h3>
              <p className="text-gray-500 leading-relaxed">
                Bu ay ne kadar ciro yaptınız? Hangi poliçeden ne kadar kazandınız? Tek tıkla Excel raporu alın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NASIL ÇALIŞIR? --- */}
      <section id="nasil-calisir" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
                Dakikalar İçinde Kullanmaya Başlayın
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Hesabınızı Oluşturun</h4>
                    <p className="text-gray-500">Sadece e-posta adresinizle saniyeler içinde acente hesabınızı açın.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Müşterilerinizi Ekleyin</h4>
                    <p className="text-gray-500">Mevcut portföyünüzü sisteme girin veya yeni gelen müşterileri kaydedin.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Arkanıza Yaslanın</h4>
                    <p className="text-gray-500">Yenileme tarihleri geldiğinde sistem sizi uyarır, raporlarınız otomatik hazırlanır.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
                {/* Sahte UI Elemanları */}
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-100 rounded"></div>
                    <div className="w-20 h-3 bg-gray-50 rounded"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-blue-50 rounded-lg w-full flex items-center px-4 text-blue-600 font-medium">Poliçe Başarıyla Eklendi ✅</div>
                  <div className="h-24 bg-gray-50 rounded-lg w-full"></div>
                  <div className="h-24 bg-gray-50 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SIK SORULAN SORULAR (FAQ) --- */}
      <section id="sss" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Sıkça Sorulan Sorular</h2>
          
          <div className="space-y-6">
            <FaqItem 
              question="Bu programı kullanmak için kurulum yapmam gerekir mi?" 
              answer="Hayır, SigortaCRM tamamen bulut tabanlıdır . İnterneti olan herhangi bir bilgisayar, tablet veya telefondan tarayıcınızla girip kullanabilirsiniz."
            />
            <FaqItem 
              question="Verilerim güvende mi?" 
              answer="Kesinlikle. Verileriniz endüstri standardı şifreleme yöntemleriyle korunur ve düzenli olarak yedeklenir. Sadece siz erişebilirsiniz."
            />
            <FaqItem 
              question="Excel'deki verilerimi aktarabilir miyim?" 
              answer="Evet, mevcut Excel tablolarınızdaki müşteri listesini kolayca sistemimize aktarabilir ve kaldığınız yerden devam edebilirsiniz."
            />
            <FaqItem 
              question="Aboneliğimi istediğim zaman iptal edebilir miyim?" 
              answer="Evet, hiçbir taahhüt yoktur. Memnun kalmazsanız dilediğiniz an kullanımı sonlandırabilirsiniz."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-blue-500" />
            <span className="text-xl font-bold">SigortaCRM</span>
          </div>

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} <span className="text-white font-semibold">Senin Yazılım Firman</span>. Tüm hakları saklıdır.
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Gizlilik</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Kullanım Şartları</a>
            <a href="#" className="text-gray-400 hover:text-white transition">İletişim</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Yardımcı SSS Bileşeni
function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-bold text-gray-800">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ArrowRight size={18} className="text-gray-400" />
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}