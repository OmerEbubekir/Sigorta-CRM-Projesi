/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { ShieldCheck, BarChart3, Users, Clock, ArrowRight, Menu, X, Check, CreditCard, Star } from 'lucide-react';
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
              <a href="#fiyatlar" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Fiyatlar</a>
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
            <a href="#fiyatlar" className="text-gray-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Fiyatlar</a>
            <a href="#sss" className="text-gray-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>S.S.S.</a>
            <Link href="/login" className="text-blue-600 font-bold">Giriş Yap</Link>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION (GİRİŞ) --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            14 Gün Boyunca Ücretsiz Deneyin
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

      {/* --- DASHBOARD PREVIEW (RESİM ALANI) --- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-24 relative z-20">
        <div className="bg-gray-900 rounded-2xl p-2 shadow-2xl border border-gray-800">
          <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center group">
            {/* --- DASHBOARD EKRAN GÖRÜNTÜSÜ --- */}
            <img 
              src="/dashboard-screen.png" 
              alt="SigortaCRM Paneli" 
              className="w-full h-full object-cover object-top" 
            />
            {/* Hover Efekti */}
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
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
            <FeatureCard 
              icon={<Users size={24}/>} color="blue" 
              title="Müşteri Yönetimi" 
              desc="Tüm müşterilerinizin iletişim bilgilerini ve geçmiş poliçelerini tek bir güvenli havuzda saklayın." 
            />
            <FeatureCard 
              icon={<Clock size={24}/>} color="green" 
              title="Otomatik Hatırlatmalar" 
              desc="Poliçe bitiş tarihlerini kaçırmayın. Sistem, süresi yaklaşan poliçeleri size renkli uyarılarla bildirir." 
            />
            <FeatureCard 
              icon={<BarChart3 size={24}/>} color="purple" 
              title="Finansal Raporlama" 
              desc="Bu ay ne kadar ciro yaptınız? Hangi poliçeden ne kadar kazandınız? Tek tıkla Excel raporu alın." 
            />
          </div>
        </div>
      </section>

      {/* --- FİYATLANDIRMA (YENİ BÖLÜM) 💰 --- */}
      <section id="fiyatlar" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-bold tracking-wide uppercase">Paketler</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 sm:text-4xl">
              Sürpriz Yok, Şeffaf Fiyatlar
            </p>
            <p className="mt-4 text-xl text-gray-500">
              14 gün boyunca ücretsiz deneyin. Kredi kartı gerekmez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* AYLIK PAKET */}
            <div className="border border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition shadow-sm hover:shadow-lg relative">
              <h3 className="text-xl font-bold text-gray-900">Aylık Paket</h3>
              <p className="text-gray-500 text-sm mt-2">Esnek başlangıç için ideal.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">499.90 ₺</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Sınırsız Müşteri Ekleme" />
                <PricingFeature text="Sınırsız Poliçe Takibi" />
                <PricingFeature text="Gelişmiş Excel Raporları" />
                <PricingFeature text="E-Posta Desteği" />
              </ul>
              <Link href="/register" className="block w-full py-3 px-4 bg-blue-50 text-blue-700 font-bold text-center rounded-lg hover:bg-blue-100 transition">
                Ücretsiz Başla
              </Link>
            </div>

            {/* YILLIK PAKET (Vurgulu) */}
            <div className="border-2 border-blue-600 rounded-2xl p-8 shadow-xl relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                EN ÇOK TERCİH EDİLEN
              </div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Yıllık Paket <Star size={16} className="text-yellow-400 fill-yellow-400"/>
              </h3>
              <p className="text-gray-500 text-sm mt-2">Uzun vadeli düşünün, %16 kâr edin.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">4.999 ₺</span>
                <span className="text-gray-500">/yıl</span>
              </div>
              <p className="text-green-600 text-sm font-bold mb-6 bg-green-50 inline-block px-2 py-1 rounded">
                🎉 2 Ay Bedavaya Gelir!
              </p>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Tüm Aylık Özellikler" />
                <PricingFeature text="Öncelikli Destek Hattı" />
                <PricingFeature text="Erken Özellik Erişimi" />
                <PricingFeature text="Ücretsiz Veri Aktarımı" />
              </ul>
              <Link href="/register" className="block w-full py-3 px-4 bg-blue-600 text-white font-bold text-center rounded-lg hover:bg-blue-700 transition shadow-lg">
                Yıllık Planı Seç
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- NASIL ÇALIŞIR? --- */}
      <section id="nasil-calisir" className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
                3 Adımda Sisteme Dahil Olun
              </h2>
              <div className="space-y-8">
                <StepItem num="1" title="Hesabınızı Oluşturun" desc="E-posta adresinizle saniyeler içinde kaydolun. Kredi kartı gerekmez." />
                <StepItem num="2" title="14 Gün Ücretsiz Deneyin" desc="Sistemi tam yetkiyle kullanın. Müşteri ekleyin, poliçe kesin, rapor alın." />
                <StepItem num="3" title="Güvenle Ödeyin" desc="Deneme süresi bitince, panel içinden kredi kartınızla aboneliğinizi başlatın. Verileriniz asla silinmez." />
              </div>
            </div>
            <div className="mt-12 lg:mt-0 relative">
               {/* Görsel Süsleme */}
               <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl transform rotate-3 blur-sm"></div>
               <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-8 flex items-center justify-center h-64">
                  <div className="text-center">
                    <CreditCard size={48} className="mx-auto text-blue-600 mb-4" />
                    <h3 className="font-bold text-lg">Kolay Ödeme Entegrasyonu</h3>
                    <p className="text-gray-500 text-sm">Iyzico altyapısı ile güvenli ödeme.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SIK SORULAN SORULAR (FAQ) --- */}
      <section id="sss" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Sıkça Sorulan Sorular</h2>
          
          <div className="space-y-4">
            <FaqItem 
              question="Ödeme işlemini nasıl yapacağım?" 
              answer="Kayıt olduğunuzda sistem size otomatik 14 gün hediye eder. Süre dolduğunda paneliniz kilitlenir ve karşınıza 'Ödeme Yap' ekranı çıkar. Bu ekrandan kredi kartınızla güvenli bir şekilde paketinizi seçip ödeyebilirsiniz."
            />
            <FaqItem 
              question="Bu programı kullanmak için kurulum yapmam gerekir mi?" 
              answer="Hayır, SigortaCRM tamamen bulut tabanlıdır (SaaS). İnterneti olan herhangi bir bilgisayar, tablet veya telefondan tarayıcınızla girip kullanabilirsiniz."
            />
            <FaqItem 
              question="Verilerim güvende mi?" 
              answer="Kesinlikle. Verileriniz endüstri standardı şifreleme yöntemleriyle korunur ve düzenli olarak yedeklenir. Sadece siz ve yetki verdiğiniz kişiler erişebilir."
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

// --- YARDIMCI BİLEŞENLER ---

function FeatureCard({ icon, color, title, desc }: any) {
    const colors: any = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600' };
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center mb-6`}>{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{desc}</p>
        </div>
    )
}

function PricingFeature({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-gray-600">
            <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <Check size={12} strokeWidth={3} />
            </div>
            {text}
        </li>
    )
}

function StepItem({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{num}</div>
            <div>
                <h4 className="text-lg font-bold text-gray-900">{title}</h4>
                <p className="text-gray-500">{desc}</p>
            </div>
        </div>
    )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition">
        <span className="font-bold text-gray-800">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><ArrowRight size={18} className="text-gray-400" /></span>
      </button>
      {isOpen && <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{answer}</div>}
    </div>
  );
}