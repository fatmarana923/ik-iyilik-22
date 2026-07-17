import React, { useState } from 'react';
import { 
  Users, MessageSquare, ShieldAlert, Key, LogIn, LogOut, 
  BookOpen, Calendar, ShoppingBag, HeartHandshake, Send, X,
  FileText, User, Landmark, Clock, Award, Briefcase, GraduationCap, 
  Edit, AlertCircle, Heart, Mail, Sparkles, Smartphone, Bell, Search
} from 'lucide-react';

// --- ARATILABİLİR REHBER VE DETAYLI ÖRNEK ÇALIŞAN PROFİLLERİ ---
const INITIAL_EMPLOYEES = [
  { 
    id: 1, 
    name: 'Ahmet Yılmaz', 
    role: 'Saha Koordinatörü', 
    dept: 'Afet Yönetimi', 
    loc: 'Kahramanmaraş', 
    phone: '0555 111 2233',
    birthdate: '17.07.1991', 
    activeStatus: 'Aktif',
    lastSeen: 'Çevrimiçi',
    school: 'İstanbul Üniversitesi - Kamu Yönetimi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    personalInfo: { adSoyad: 'Ahmet Yılmaz', personelNo: 'IHH-2026-0941', departman: 'Afet Yönetimi', pozisyon: 'Saha Koordinatörü', yonetici: 'Hakan Terzi', iseGirisTarihi: '15.03.2020', calismaTuru: 'Tam Zamanlı' },
    maasOdeme: { guncelMaas: 'Mevcut', bordrolar: ['Ocak_2026_Bordro.pdf'], tarihler: 'Her ayın 15\'i', primGecmisi: 'Başarı Primi', yardim: 'Yemek Kartı + Yol', fazlaMesaiOdemesi: '3,200 TL' },
    izinBilgileri: { kalanYillik: 14, kullanilan: 12, planlanan: 4, onayDurumu: 'Onaylandı', gecmis: 'Sağlık İzni (2 Gün)' },
    calismaBilgileri: { girisCikis: '08:54 - 18:02', devamsizlik: 'Yok', fazlaMesai: '18 Saat', tatilTakvimi: 'Resmi Tatiller', saatleri: '09:00 - 18:00' },
    egitimGelisim: { alinanlar: 'Arama Kurtarma Eğitimi', sertifikalar: 'AFAD Akreditasyonu', zorunluEkt: 'Tamamlandı', yaklasan: 'Kriz Yönetimi' },
    belgeler: { sozlesme: 'İş Sözleşmesi.pdf', gizlilik: 'Taahhütname.pdf', evraklar: 'Eksiksiz' },
    bildirimler: ['İzin onaylandı.'],
    yanHaklar: { saglik: 'Özel Sağlık Sigortası', bes: 'Aktif', yemekKartı: 'Multinet', servis: 'Mevcut' },
    destek: { iletisim: 'ik@ihh.org.tr', talepler: 'Açık Talep Yok' }
  },
  { 
    id: 2, 
    name: 'Ayşe Kaya', 
    role: 'İK Uzmanı', 
    dept: 'İnsan Kaynakları', 
    loc: 'İstanbul Merkez', 
    phone: '0555 222 3344',
    birthdate: '24.05.1994', 
    activeStatus: 'Aktif',
    lastSeen: '10 dk önce',
    school: 'Marmara Üniversitesi - Çalışma Ekonomisi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    personalInfo: { adSoyad: 'Ayşe Kaya', personelNo: 'IHH-2026-1102', departman: 'İnsan Kaynakları', pozisyon: 'İK Uzmanı', yonetici: 'Hakan Terzi', iseGirisTarihi: '01.06.2021', calismaTuru: 'Tam Zamanlı' },
    maasOdeme: { guncelMaas: 'Mevcut', bordrolar: ['Ocak_2026_Bordro.pdf'], tarihler: 'Her ayın 15\'i', primGecmisi: 'Yok', yardim: 'Yemek Kartı', fazlaMesaiOdemesi: 'Yok' },
    izinBilgileri: { kalanYillik: 18, kullanilan: 5, planlanan: 0, onayDurumu: 'Yok', gecmis: 'Yok' },
    calismaBilgileri: { girisCikis: '09:00 - 18:00', devamsizlik: 'Yok', fazlaMesai: 'Yok', tatilTakvimi: 'Resmi Tatiller', saatleri: '09:00 - 18:00' },
    egitimGelisim: { alinanlar: 'Mülakat Teknikleri', sertifikalar: 'İK Uzmanlık Belgesi', zorunluEkt: 'Tamamlandı', yaklasan: 'Dinamik Bordrolama' },
    belgeler: { sozlesme: 'İş Sözleşmesi.pdf', gizlilik: 'Taahhütname.pdf', evraklar: 'Eksiksiz' },
    bildirimler: [],
    yanHaklar: { saglik: 'Özel Sağlık Sigortası', bes: 'Aktif', yemekKartı: 'Multinet', servis: 'Mevcut' },
    destek: { iletisim: 'ik@ihh.org.tr', talepler: 'Açık Talep Yok' }
  },
  { 
    id: 3, 
    name: 'Mehmet Demir', 
    role: 'Lojistik Sorumlusu', 
    dept: 'Destek Hizmetleri', 
    loc: 'Hatay Depo', 
    phone: '0555 333 4455',
    birthdate: '11.11.1988', 
    activeStatus: 'Saha Görevinde',
    lastSeen: 'Çevrimiçi',
    school: 'Anadolu Üniversitesi - Lojistik Yönetimi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    personalInfo: { adSoyad: 'Mehmet Demir', personelNo: 'IHH-2026-0412', departman: 'Destek Hizmetleri', pozisyon: 'Lojistik Sorumlusu', yonetici: 'Hakan Terzi', iseGirisTarihi: '10.10.2018', calismaTuru: 'Tam Zamanlı' },
    maasOdeme: { guncelMaas: 'Mevcut', bordrolar: ['Ocak_2026_Bordro.pdf'], tarihler: 'Her ayın 15\'i', primGecmisi: 'Saha Ödülü', yardim: 'Yemek Kartı', fazlaMesaiOdemesi: '4,500 TL' },
    izinBilgileri: { kalanYillik: 5, kullanilan: 15, planlanan: 2, onayDurumu: 'Beklemede', gecmis: 'Yol İzni' },
    calismaBilgileri: { girisCikis: 'Esnek', devamsizlik: 'Yok', fazlaMesai: '32 Saat', tatilTakvimi: 'Resmi Tatiller', saatleri: 'Saha Esnek' },
    egitimGelisim: { alinanlar: 'Tedarik Zinciri', sertifikalar: 'Lojistik Kartı', zorunluEkt: 'Tamamlandı', yaklasan: 'Depo Güvenliği' },
    belgeler: { sozlesme: 'Sözleşme.pdf', gizlilik: 'Taahhütname.pdf', evraklar: 'Eksiksiz' },
    bildirimler: [],
    yanHaklar: { saglik: 'Özel Sağlık', bes: 'Pasif', yemekKartı: 'Sodexo', servis: 'Saha Aracı' },
    destek: { iletisim: 'ik@ihh.org.tr', talepler: 'Açık Talep Yok' }
  }
];

// --- FOTOĞRAFLI VE DETAYLI İLETİŞİMLİ İLANLAR ---
const INITIAL_ADS = [
  { 
    id: 1, 
    title: 'Temiz Kullanılmış Satılık Araba', 
    category: 'Araba', 
    city: 'Bursa', 
    price: '450,000 TL', 
    desc: '2015 model, tüm bakımları zamanında yapılmıştır. İHH çalışanına özel ikram yapılır.', 
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60',
    owner: 'Ahmet Yılmaz',
    phone: '0555 111 2233',
    email: 'ahmet.yilmaz@ihh.org.tr',
    approved: true 
  },
  { 
    id: 2, 
    title: 'Merkeze Yakın Kiralık 2+1 Daire', 
    category: 'Ev', 
    city: 'İstanbul', 
    price: '18,000 TL / Ay', 
    desc: 'Metrobüs ve metro duraklarına 5 dakika yürüme mesafesinde, masrafsız aile evi.', 
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop&q=60',
    owner: 'Mehmet Demir',
    phone: '0555 333 4455',
    email: 'mehmet.demir@ihh.org.tr',
    approved: true 
  }
];

const PARTNERS = {
  saglik: [{ name: 'Özel Vatan Hastanesi', discount: '%20 İndirim', detail: 'Tüm muayene ve tahlillerde geçerli.' }],
  giyim: [{ name: 'LC Waikiki Kurumsal', discount: '%15 İndirim', detail: 'Tüm mağazalarda kurumsal kodla indirim.' }],
  konaklama: [{ name: 'Hilton Garden Inn', discount: '%25 İndirim', detail: 'Saha görevlerinde kurumsal fiyat.' }]
};

const CLUBS = [
  { 
    id: 'satranc', 
    name: 'Satranç Kulübü', 
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=500&auto=format&fit=crop&q=60',
    description: 'Zihinsel strateji geliştirmek ve turnuvalara hazırlanmak isteyen tüm personelimizi bekliyoruz.',
    events: [{ title: 'Haftalık Turnuva', date: 'Her Çarşamba 20:00', photo: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=400&auto=format&fit=crop&q=60' }]
  },
  { 
    id: 'doga', 
    name: 'Doğa Yürüyüşü Kulübü', 
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=60',
    description: 'Saha stresinden uzaklaşmak ve ekip ruhunu güçlendirmek için her ay bir rota keşfediyoruz.',
    events: [{ title: 'Bursa Uludağ Zirve Yürüyüşü', date: '26 Temmuz Pazar', photo: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&auto=format&fit=crop&q=60' }]
  }
];

const CHAT_TEMPLATES = [
  { id: 'dugun', name: '🤵 Düğün Daveti', text: 'Mutlu günümüz! ... tarihinde gerçekleştirilecek olan düğün törenimize tüm İHH ailesi davetlidir. Yer: ...' },
  { id: 'vefat', name: '🖤 Vefat Duyurusu', text: 'Acı kaybımız. Departmanımız çalışanlarından ...\'ın yakını ... vefat etmiştir. Cenazesi ... günü kaldırılacaktır.' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<'guest' | 'employee' | 'hr'>('guest');
  
  // Modals & Authentication
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectReason, setRedirectReason] = useState('');
  const [loginTab, setLoginTab] = useState<'employee' | 'hr'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');

  // Core Data Lists
  const [employees] = useState(INITIAL_EMPLOYEES);
  const [ads, setAds] = useState(INITIAL_ADS);
  const [selectedClub, setSelectedClub] = useState<typeof CLUBS[0] | null>(null);
  
  // Arama ve Filtreleme
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<typeof INITIAL_EMPLOYEES[0] | null>(null);
  const [showEvalPage, setShowEvalPage] = useState(false);
  const [hrDetailTab, setHrDetailTab] = useState('personalInfo');
  const [evalNote, setEvalNote] = useState('');

  // İlan Pazar Yeri Filtreleme
  const [filterCity, setFilterCity] = useState('Hepsi');
  const [filterCat, setFilterCat] = useState('Hepsi');
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [newAd, setNewAd] = useState({ title: '', category: 'Araba', city: '', price: '', desc: '' });

  // Chat States
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateInputs, setTemplateInputs] = useState<string[]>([]);
  const [globalMessages, setGlobalMessages] = useState([
    { sender: 'Hakan Terzi', role: 'Genel Sekreter', text: 'Tüm birimlerin dikkatine, saha operasyon raporları akşam İK sistemine girilmelidir.', time: '10:30' }
  ]);

  // AI Chat Widget
  const [isAiOpen, setIsAiOpen] = useState(false);

  // PWA & Simulators
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [isSubscribedOneSignal, setIsSubscribedOneSignal] = useState(false);
  const [activePushNotification, setActivePushNotification] = useState<string | null>(null);
  const [simulatedEmails, setSimulatedEmails] = useState<{id: number, title: string, content: string, time: string}[]>([]);
  const [showEmailInbox, setShowEmailInbox] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { id: 1, type: 'normal', date: 'Bugün', title: 'Yaz Dönemi Saha Planlaması', content: 'Saha destek gruplarımızın esnek çalışma saatleri netleşmiştir.' },
    { id: 2, type: 'acil', date: 'Şimdi', title: '🚨 ACİL: Kahramanmaraş Deprem Bölgesi Ekip Sevkiyatı', content: 'Kahramanmaraş merkez lojistik deposuna acil ek saha personeli sevkiyatı planlanmıştır.' }
  ]);
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnType, setNewAnnType] = useState('normal');

  // --- Basit profil verisi (giriş yapan personel için) ---
  const myProfile = {
    name: employees[0].name,
    title: employees[0].role,
    dept: employees[0].dept,
    school: employees[0].school,
    avatar: employees[0].avatar,
    certificates: employees[0].egitimGelisim.sertifikalar,
    clubs: 'Doğa Yürüyüşü Kulübü'
  };

  const triggerPushNotification = (text: string) => {
    setActivePushNotification(text);
    setTimeout(() => { setActivePushNotification(null); }, 5000);
  };

  const handleProtectedTab = (tabName: string) => {
    if (userRole === 'guest') {
      setRedirectReason('Bu kurumsal sayfaya erişmek ve işlem yapabilmek için portal girişi yapmanız gerekmektedir.');
      setShowLoginModal(true);
    } else {
      setActiveTab(tabName);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (loginTab === 'employee') {
      if (email === 'personel@ihh.org.tr' && password === 'personel123') {
        setUserRole('employee');
        setShowLoginModal(false);
      } else {
        setAuthError('Hatalı e-posta veya şifre!');
      }
    } else {
      if (email === 'ik@ihh.org.tr' && password === 'ihh123' && otp === '1947') {
        setUserRole('hr');
        setShowLoginModal(false);
      } else {
        setAuthError('Hatalı giriş bilgileri veya 2FA kodu!');
      }
    }
  };

  const handleSendTemplateChat = () => {
    if (!selectedTemplate) return;
    const template = CHAT_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;
    let finalText = template.text;
    templateInputs.forEach(input => { finalText = finalText.replace('...', input); });
    setGlobalMessages([...globalMessages, { sender: 'Ahmet Yılmaz', role: 'Saha Koordinatörü', text: finalText, time: 'Şimdi' }]);
    triggerPushNotification(`Yeni Duyuru: ${finalText.substring(0, 40)}...`);
    setSelectedTemplate('');
    setTemplateInputs([]);
  };

  // Birim başkanı değerlendirme formunu kaydeder
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    triggerPushNotification(`${selectedEmployee.name} için değerlendirme kaydedildi.`);
    setShowEvalPage(false);
    setSelectedEmployee(null);
    setEvalNote('');
  };

  // Yeni duyuru ekler; acil duyurular e-posta simülatörüne de düşer
  const handleAddAnnouncement = () => {
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    const newEntry = {
      id: Date.now(),
      type: newAnnType,
      date: 'Şimdi',
      title: newAnnTitle,
      content: newAnnContent
    };
    setAnnouncements([newEntry, ...announcements]);
    triggerPushNotification(`Yeni Duyuru: ${newAnnTitle}`);
    if (newAnnType === 'acil') {
      setSimulatedEmails([
        { id: Date.now(), title: `🚨 ${newAnnTitle}`, content: newAnnContent, time: 'Şimdi' },
        ...simulatedEmails
      ]);
    }
    setNewAnnTitle('');
    setNewAnnContent('');
    setNewAnnType('normal');
    setShowNewAnnouncementModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-gray-800 relative">
      
      {/* REALTIME PUSH NOTIFICATION POPUP */}
      {activePushNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm bg-[#1A3A2B] text-white p-4 rounded-2xl shadow-2xl border border-[#E2DEC5]/20 flex gap-3 items-start">
          <div className="bg-white/10 p-2 rounded-full text-[#E2DEC5]"><Bell className="h-5 w-5" /></div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#E2DEC5] mb-0.5">OneSignal Mobil Bildirim</p>
            <p className="font-medium text-gray-100">{activePushNotification}</p>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#1A3A2B] text-white flex flex-col justify-between p-4 shadow-xl select-none">
        <div>
          {/* OFFICIAL REVISED BRAND LOGO WITH EMBLEM */}
          <div className="flex flex-col items-center justify-center mb-6 border-b border-white/10 pb-6 pt-2 bg-white/5 rounded-xl p-3">
            <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full p-2 shadow-inner">
              <img 
                src="https://upload.wikimedia.org/wikipedia/tr/6/67/İHH_Logo.png" 
                alt="IHH Logo" 
                className="h-12 w-12 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://www.ihh.org.tr/public/images/logo.png"; }}
              />
            </div>
            <span className="text-sm font-black tracking-widest text-white uppercase text-center mt-3">IHH</span>
            <span className="text-[9px] font-bold tracking-wider text-[#E2DEC5] uppercase text-center mt-0.5">İNSANİ YARDIM VAKFI</span>
          </div>

          <nav className="space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <BookOpen className="h-4 w-4" /> Ana Sayfa / Duyurular
            </button>
            <button onClick={() => handleProtectedTab('profile')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'profile' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <User className="h-4 w-4" /> Profilim
            </button>
            <button onClick={() => handleProtectedTab('leave-management')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'leave-management' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <Calendar className="h-4 w-4" /> İzin Yönetimi & Talep
            </button>
            <button onClick={() => setActiveTab('partners')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'partners' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <Users className="h-4 w-4" /> Anlaşmalı Firmalar
            </button>
            <button onClick={() => handleProtectedTab('clubs')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'clubs' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <Users className="h-4 w-4" /> Sosyal Kulüpler
            </button>
            <button onClick={() => handleProtectedTab('ads')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'ads' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <ShoppingBag className="h-4 w-4" /> Satış İlanları
            </button>
            <button onClick={() => handleProtectedTab('procedures')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'procedures' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <FileText className="h-4 w-4" /> Prosedür Dokümanları
            </button>
            <button onClick={() => handleProtectedTab('chat')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'chat' ? 'bg-[#E2DEC5] text-[#1A3A2B]' : 'text-gray-300 hover:bg-white/5'}`}>
              <MessageSquare className="h-4 w-4" /> Kurumsal Ortak Sohbet
            </button>
            <button 
              onClick={() => {
                if (userRole === 'hr') { setActiveTab('hr-admin'); } 
                else { setRedirectReason('Sadece İK yetkililerinin erişebileceği 2FA alanıdır.'); setLoginTab('hr'); setShowLoginModal(true); }
              }} 
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'hr-admin' ? 'bg-red-950 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2.5 text-red-300"><ShieldAlert className="h-4 w-4" /> Personel Arama / İK Panel</span>
              <span className="text-[9px] bg-red-900 text-white px-1.5 py-0.5 rounded font-extrabold">2FA</span>
            </button>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
          {userRole === 'guest' ? (
            <button onClick={() => { setAuthError(''); setShowLoginModal(true); }} className="w-full bg-[#E2DEC5] hover:bg-[#d5d0b4] text-[#1A3A2B] text-xs py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5">
              <LogIn className="h-4 w-4" /> Giriş Yap
            </button>
          ) : (
            <div className="text-xs bg-white/5 p-3 rounded-xl">
              <p className="text-[#E2DEC5] font-bold">Aktif Oturum:</p>
              <p className="text-white truncate font-mono text-[10px] mt-0.5">{userRole === 'hr' ? 'ik@ihh.org.tr' : 'personel@ihh.org.tr'}</p>
              <button onClick={() => { setUserRole('guest'); setActiveTab('dashboard'); }} className="w-full mt-2 bg-red-900/40 hover:bg-red-900 text-white text-[11px] py-1 rounded transition-colors">Oturumu Kapat</button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen p-8 relative overflow-y-auto">
        
        {/* PWA & ONESIGNAL REALTIME TOOLBAR CONTROLS */}
        <div className="flex gap-4 items-center justify-end mb-6 text-xs bg-white p-3 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 border-r pr-4">
            <Smartphone className="h-4 w-4 text-[#1A3A2B]" />
            <span className="font-bold text-gray-600">PWA Altyapısı:</span>
            <button onClick={() => { setIsPwaInstalled(true); alert('Uygulama başarıyla mobil cihaz ana ekranına yüklendi.'); }} className={`px-2 py-1 rounded font-bold ${isPwaInstalled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}>
              {isPwaInstalled ? '✓ Ana Ekranda Aktif' : '+ Mobil Ekrana Ekle'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#1A3A2B]" />
            <span className="font-bold text-gray-600">OneSignal API:</span>
            <button onClick={() => { setIsSubscribedOneSignal(true); alert('OneSignal Web Push aboneliği onaylandı.'); }} className={`px-2 py-1 rounded font-bold ${isSubscribedOneSignal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}>
              {isSubscribedOneSignal ? '✓ İzin Verildi' : 'Push Bildirim İzni'}
            </button>
          </div>
        </div>

        {/* AUTOMATED EMAIL SIMULATOR BOX */}
        <div className="absolute top-24 right-8 z-40">
          <button onClick={() => setShowEmailInbox(!showEmailInbox)} className="bg-white border border-[#E9E4DB] hover:bg-gray-50 px-3 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 text-[#1A3A2B]">
            <Mail className="h-4 w-4" /> <span>Kurumsal E-posta Alıcısı</span>
            {simulatedEmails.length > 0 && <span className="bg-red-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center animate-bounce">{simulatedEmails.length}</span>}
          </button>
          {showEmailInbox && (
            <div className="absolute right-0 mt-2 bg-white border border-[#E9E4DB] rounded-2xl p-4 shadow-xl w-80 text-xs space-y-3 z-50">
              <div className="flex justify-between items-center border-b pb-1 font-bold text-[#1A3A2B]"><span>📬 Gelen Kutusu (Simülatör)</span><button onClick={() => setShowEmailInbox(false)}>✕</button></div>
              {simulatedEmails.length === 0 && <p className="text-gray-400 italic">Henüz e-posta yok.</p>}
              {simulatedEmails.map(mail => (
                <div key={mail.id} className="p-2 bg-red-50 border border-red-100 rounded-lg text-[11px]"><p className="font-bold text-red-950">{mail.title}</p><p className="text-gray-700 mt-1">{mail.content}</p></div>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🎂</span>
                <div>
                  <h3 className="font-bold text-base">Bugün Ahmet Yılmaz Arkadaşımızın Doğum Günü!</h3>
                  <p className="text-xs text-amber-50">İHH ailesi olarak hayırlı, uzun ve sağlıklı ömürler dileriz.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A3A2B] text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">İHH Çalışan & İK Entegre Dünyası</h2>
                <p className="text-xs text-[#E2DEC5]">Duyuruları kurumsal panel üzerinden anlık olarak takip edebilirsiniz.</p>
              </div>
              {userRole === 'hr' && <button onClick={() => setShowNewAnnouncementModal(true)} className="bg-[#E2DEC5] text-[#1A3A2B] font-bold text-xs px-4 py-2 rounded-xl">+ Yeni Duyuru Ekle</button>}
            </div>

            {/* PERSONEL REHBERİ VE SEÇKİN ARAMA ÇUBUĞU */}
            <div className="bg-white p-6 rounded-2xl border border-[#E9E4DB] shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-[#1A3A2B] uppercase tracking-wider">🔍 Kurumsal Personel Arama & Rehber</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Vakıf çalışanının adını, unvanını veya müdürlüğünü yazarak arayın... (Örn: Ayşe, Ahmet, Lojistik)" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#1A3A2B]"
                />
              </div>

              {searchTerm && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {employees
                    .filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.role.toLowerCase().includes(searchTerm.toLowerCase()) || emp.dept.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(emp => (
                      <div key={emp.id} className="p-4 border rounded-xl bg-[#FDFBF7] flex gap-3 items-center">
                        <img src={emp.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border" />
                        <div className="text-xs">
                          <p className="font-bold text-[#1A3A2B]">{emp.name}</p>
                          <p className="text-gray-500 font-medium">{emp.role} - {emp.dept}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">🎓 {emp.school}</p>
                          <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold">{emp.activeStatus}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* DİĞER ÖRNEK PROFİLLERİN LİSTESİ */}
              <div className="pt-4 border-t">
                <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase">Örnek Vakıf Çalışan Profilleri</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {employees.map(emp => (
                    <div key={emp.id} className="p-3 border bg-white rounded-xl shadow-sm flex items-center gap-3">
                      <img src={emp.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                      <div className="text-xs">
                        <p className="font-bold text-gray-800">{emp.name}</p>
                        <p className="text-gray-500 text-[11px]">{emp.role}</p>
                        <p className="text-[10px] text-gray-400 truncate w-40">🏫 {emp.school}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DUYURU AKIŞI */}
            <div className="bg-white p-6 rounded-2xl border border-[#E9E4DB] shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-[#1A3A2B] uppercase tracking-wider">📢 Güncel Bildiri Akışı</h3>
              {announcements.map(ann => (
                <div key={ann.id} className={`p-4 rounded-xl border ${ann.type === 'acil' ? 'bg-red-50 border-red-200' : 'bg-[#FDFBF7]'}`}>
                  <h4 className="font-bold text-xs text-gray-800">{ann.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE PAGE */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl border border-[#E9E4DB] shadow-sm overflow-hidden text-xs animate-fadeIn">
            <div className="h-28 bg-[#1A3A2B] relative text-right p-4"></div>
            <div className="px-6 pb-6 relative">
              <img src={myProfile.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 left-6 object-cover shadow" />
              <div className="pt-16 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1A3A2B]">{myProfile.name}</h2>
                  <p className="text-gray-600 font-bold">{myProfile.title} — {myProfile.dept}</p>
                  <p className="text-[#1A3A2B] font-bold font-mono mt-1">🎓 Mezun Olunan Okul: {myProfile.school}</p>
                </div>
                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border">
                    <span className="text-gray-400 block text-[10px] font-bold">📜 SERTİFİKALAR</span>
                    <p className="font-medium text-gray-800 mt-1">{myProfile.certificates}</p>
                  </div>
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border">
                    <span className="text-gray-400 block text-[10px] font-bold">👥 KULÜPLER</span>
                    <p className="font-medium text-gray-800 mt-1">{myProfile.clubs}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: NEW LEAVE MANAGEMENT MENU */}
        {activeTab === 'leave-management' && (
          <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl border border-[#E9E4DB] p-6 shadow-sm space-y-6 text-xs animate-fadeIn">
            <div className="border-b pb-2">
              <h2 className="text-xl font-bold text-[#1A3A2B]">🏖️ İzin Portföy Sorgulama & Resmi İzin Talepleri</h2>
              <p className="text-xs text-gray-500 mt-0.5">Kalan haklarınızı hesaplayabilir ve yeni izin formlarınızı İK onayına sunabilirsiniz.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FDFBF7] p-4 rounded-xl border text-center">
                <span className="text-gray-400 block font-bold text-[10px]">Kalan Kullanılabilir Yıllık İzin</span>
                <span className="text-2xl font-black text-[#1A3A2B] mt-1 block">14 İş Günü</span>
              </div>
              <div className="bg-[#FDFBF7] p-4 rounded-xl border text-center">
                <span className="text-gray-400 block font-bold text-[10px]">Mevcut Dönem Kullanılan İzin</span>
                <span className="text-2xl font-black text-gray-500 mt-1 block">12 İş Günü</span>
              </div>
            </div>
            <div className="bg-[#F9F7F2] p-4 rounded-xl border space-y-3">
              <h4 className="font-bold text-[#1A3A2B]">Yeni İzin Talep Formu</h4>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" className="border p-2 rounded-lg bg-white" />
                <select className="border p-2 rounded-lg bg-white text-gray-700">
                  <option>Yıllık İzin</option>
                  <option>Mazeret İzni</option>
                  <option>Sağlık / Rapor İzni</option>
                </select>
              </div>
              <button onClick={() => alert('İzin talep bildiriminiz İK yönetim havuzuna iletilmiştir.')} className="w-full bg-[#1A3A2B] text-white font-bold py-2 rounded-lg">
                İzin Talebini Resmi Onaya Gönder
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PARTNERS */}
        {activeTab === 'partners' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1A3A2B]">Anlaşmalı Kurumsal İndirimler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(PARTNERS).map(([category, list]) => (
                <div key={category} className="bg-white p-5 rounded-xl border border-[#E9E4DB] shadow-sm">
                  <h3 className="font-bold text-sm text-[#1A3A2B] capitalize border-b pb-2 mb-3">{category}</h3>
                  {list.map((item, idx) => (
                    <div key={idx} className="p-3 bg-[#F9F7F2] rounded-lg border text-xs">
                      <div className="flex justify-between font-bold text-[#1A3A2B]"><span>{item.name}</span><span className="text-emerald-800">{item.discount}</span></div>
                      <p className="text-gray-600 mt-1">{item.detail}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL CLUBS */}
        {activeTab === 'clubs' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1A3A2B]">Sosyal Kulüpler Galeri ve Albümler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CLUBS.map((club) => (
                <div key={club.id} className="bg-white rounded-xl border overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <img src={club.image} alt={club.name} className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-1"><h3 className="font-bold text-sm text-[#1A3A2B]">{club.name}</h3><p className="text-xs text-gray-600">{club.description}</p></div>
                  </div>
                  <div className="p-4 bg-[#F9F7F2] border-t">
                    <button onClick={() => setSelectedClub(club)} className="w-full bg-[#1A3A2B] text-white text-xs font-bold py-2 rounded-lg">Etkinlik Fotoğraflarını İncele 📸</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedClub && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2"><h3 className="font-bold text-sm text-[#1A3A2B]">{selectedClub.name} Fotoğraf Galerisi</h3><button onClick={() => setSelectedClub(null)}><X className="h-5 w-5" /></button></div>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedClub.events.map((evt, idx) => (
                      <div key={idx} className="border rounded-xl overflow-hidden text-xs">
                        <img src={evt.photo} alt="img" className="w-full h-32 object-cover" />
                        <div className="p-2 font-bold text-gray-700">{evt.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CLASSIFIED ADS MARKETPLACE */}
        {activeTab === 'ads' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1A3A2B]">Personel İlan Pazarı (Şehir ve Kategori Filtreli)</h2>
              <button onClick={() => setShowAddAdModal(true)} className="bg-[#1A3A2B] text-white text-xs font-bold px-4 py-2 rounded-lg">+ İlan Ver</button>
            </div>

            <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border shadow-sm text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Şehir Seçimi</label>
                <select onChange={(e) => setFilterCity(e.target.value)} className="border p-1.5 rounded-lg bg-white">
                  <option value="Hepsi">Tüm Şehirler</option>
                  <option value="Bursa">Bursa</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Kategori Türü</label>
                <select onChange={(e) => setFilterCat(e.target.value)} className="border p-1.5 rounded-lg bg-white">
                  <option value="Hepsi">Tüm Kategoriler</option>
                  <option value="Araba">Araba</option>
                  <option value="Ev">Ev</option>
                  <option value="Elektronik">Elektronik</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ads
                .filter(ad => (filterCity === 'Hepsi' || ad.city === filterCity) && (filterCat === 'Hepsi' || ad.category === filterCat))
                .map((ad) => (
                  <div key={ad.id} className="bg-white rounded-xl border shadow-sm flex flex-col justify-between overflow-hidden">
                    <div>
                      <img src={ad.image} alt="ilan" className="w-full h-40 object-cover border-b" />
                      <div className="p-4 space-y-2 text-xs">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                          <span>📍 {ad.city}</span>
                          <span className="bg-[#F9F7F2] border px-1.5 py-0.5 rounded">{ad.category}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1A3A2B]">{ad.title}</h3>
                        <p className="text-gray-600 text-[11px] leading-relaxed">{ad.desc}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#F9F7F2] border-t text-[11px] space-y-1 border-gray-100">
                      <p className="font-bold text-[#1A3A2B]">👤 İlan Sahibi: {ad.owner}</p>
                      <p className="text-gray-600 font-mono">📞 Tel: {ad.phone}</p>
                      <p className="text-gray-600 font-mono truncate">✉️ E-posta: {ad.email}</p>
                      <div className="pt-2 border-t mt-1 flex justify-between items-center">
                        <span className="font-black text-sm text-[#1A3A2B]">{ad.price}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold">Aktif İlan</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROCEDURES */}
        {activeTab === 'procedures' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#1A3A2B]">Kurumsal Prosedür El Kitapları</h2>
            <div className="bg-white rounded-xl border text-xs divide-y">
              <div className="p-4 flex justify-between items-center hover:bg-[#FDFBF7]">
                <span className="font-medium">İHH Afet Operasyon Yönetmeliği 2026.pdf</span>
                <span onClick={() => alert('Dosya indirme simüle edildi.')} className="text-[#1A3A2B] font-bold cursor-pointer underline">Görüntüle</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SHABLON BASED CHAT */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-[#E9E4DB] shadow-sm flex flex-col justify-between h-[500px] overflow-hidden text-xs animate-fadeIn">
            <div className="bg-[#F9F7F2] p-4 border-b flex justify-between items-center">
              <span className="font-bold text-sm text-[#1A3A2B]">💬 İHH Ortak Çalışan Haberleşme Kanalı</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
              {globalMessages.map((msg, idx) => (
                <div key={idx} className="bg-white border p-3 rounded-xl shadow-sm max-w-xl">
                  <div className="flex gap-2 text-[10px] text-gray-400 font-bold mb-1"><span>{msg.sender}</span><span>({msg.role})</span></div>
                  <p className="text-gray-800 font-medium">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-[#FDFBF7] border-t space-y-3">
              <select value={selectedTemplate} onChange={(e) => { setSelectedTemplate(e.target.value); setTemplateInputs([]); }} className="border p-2 rounded-lg bg-white w-full">
                <option value="">Duyuru Şablonu Seçin...</option>
                {CHAT_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {selectedTemplate && (
                <div className="p-3 bg-white border rounded-xl space-y-2">
                  <input type="text" placeholder="Gerekli alanları aralarına virgül koyarak doldurun..." onBlur={e => setTemplateInputs(e.target.value.split(','))} className="border p-1.5 rounded w-full" />
                  <button type="button" onClick={handleSendTemplateChat} className="bg-[#1A3A2B] text-white px-4 py-1 rounded font-bold">Gönder</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: HR SYSTEM PANEL */}
        {activeTab === 'hr-admin' && userRole === 'hr' && (
          <div className="space-y-6 animate-fadeIn text-xs">
            <div className="bg-red-50 text-red-950 p-4 rounded-xl border border-red-200 font-semibold">
              🔐 Yetkili İK Personel Arama Alanı. Bilgilerini detaylı incelemek istediğiniz çalışanın ismine tıklayın.
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F9F7F2] border-b font-bold text-[#1A3A2B]"><th className="p-3">Ad Soyad</th><th className="p-3">Rol</th><th className="p-3">Departman</th><th className="p-3">Mezuniyet</th><th className="p-3 text-center">İşlem</th></tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-[#1A3A2B] cursor-pointer hover:underline" onClick={() => { setSelectedEmployee(emp); setShowEvalPage(false); setHrDetailTab('personalInfo'); }}>{emp.name} 🔍</td>
                      <td className="p-3">{emp.role}</td>
                      <td className="p-3">{emp.dept}</td>
                      <td className="p-3 font-mono text-gray-500">{emp.school}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => { setSelectedEmployee(emp); setShowEvalPage(true); }} className="bg-[#1A3A2B] text-white font-bold px-2 py-1 rounded">Değerlendir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DETAILED DATA FILE CARD POPUP */}
        {selectedEmployee && !showEvalPage && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-xs">
              <div className="bg-[#1A3A2B] p-4 text-white flex justify-between items-center">
                <h3 className="font-bold text-base">{selectedEmployee.name} — Detaylı Kurumsal Özlük Dosyası</h3>
                <button onClick={() => setSelectedEmployee(null)}><X className="h-5 w-5" /></button>
              </div>
              <div className="flex bg-[#F9F7F2] border-b overflow-x-auto font-bold text-gray-600">
                <button onClick={() => setHrDetailTab('personalInfo')} className={`px-4 py-2.5 whitespace-nowrap ${hrDetailTab === 'personalInfo' ? 'bg-white text-[#1A3A2B] border-b-2 border-[#1A3A2B]' : ''}`}>📋 Kişisel Bilgiler</button>
                <button onClick={() => setHrDetailTab('maasOdeme')} className={`px-4 py-2.5 whitespace-nowrap ${hrDetailTab === 'maasOdeme' ? 'bg-white text-[#1A3A2B] border-b-2 border-[#1A3A2B]' : ''}`}>💰 Maaş & Ödemeler</button>
                <button onClick={() => setHrDetailTab('izinBilgileri')} className={`px-4 py-2.5 whitespace-nowrap ${hrDetailTab === 'izinBilgileri' ? 'bg-white text-[#1A3A2B] border-b-2 border-[#1A3A2B]' : ''}`}>🏖️ İzin Bilgileri</button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-3">
                {hrDetailTab === 'personalInfo' && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <p><b>Ad Soyad:</b> {selectedEmployee.personalInfo.adSoyad}</p>
                    <p><b>Personel No:</b> {selectedEmployee.personalInfo.personelNo}</p>
                    <p><b>Departman:</b> {selectedEmployee.personalInfo.departman}</p>
                    <p><b>Pozisyon:</b> {selectedEmployee.personalInfo.pozisyon}</p>
                    <p><b>Mezun Olunan Okul:</b> {selectedEmployee.school}</p>
                  </div>
                )}
                {hrDetailTab === 'maasOdeme' && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <p><b>Güncel Maaş:</b> {selectedEmployee.maasOdeme.guncelMaas}</p>
                    <p><b>Ödeme Tarihi:</b> {selectedEmployee.maasOdeme.tarihler}</p>
                    <p><b>Prim Geçmişi:</b> {selectedEmployee.maasOdeme.primGecmisi}</p>
                    <p><b>Yardımlar:</b> {selectedEmployee.maasOdeme.yardim}</p>
                    <p><b>Fazla Mesai Ödemesi:</b> {selectedEmployee.maasOdeme.fazlaMesaiOdemesi}</p>
                  </div>
                )}
                {hrDetailTab === 'izinBilgileri' && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <p><b>Kalan Yıllık İzin:</b> {selectedEmployee.izinBilgileri.kalanYillik} gün</p>
                    <p><b>Kullanılan İzin:</b> {selectedEmployee.izinBilgileri.kullanilan} gün</p>
                    <p><b>Planlanan İzin:</b> {selectedEmployee.izinBilgileri.planlanan} gün</p>
                    <p><b>Onay Durumu:</b> {selectedEmployee.izinBilgileri.onayDurumu}</p>
                    <p><b>Geçmiş:</b> {selectedEmployee.izinBilgileri.gecmis}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 8 QUESTIONS EVALUATION MODAL */}
        {showEvalPage && selectedEmployee && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 border overflow-y-auto max-h-[90vh] space-y-4 text-xs shadow-2xl">
              <div className="flex justify-between items-center border-b pb-2">
                <div><h3 className="font-bold text-sm text-[#1A3A2B]">Birim Başkanı Puanlama Formu</h3><p>Personel: {selectedEmployee.name}</p></div>
                <button type="button" onClick={() => setShowEvalPage(false)}>✕</button>
              </div>
              <form onSubmit={handleSaveEvaluation} className="space-y-4">
                {[
                  'Çalışan, kendisine verilen görevleri zamanında ve eksiksiz tamamlıyor mu?',
                  'İşini dikkatli, doğru ve kaliteli bir şekilde yerine getiriyor mu?',
                  'Ekip arkadaşlarıyla iş birliği içinde çalışıyor mu?',
                  'İletişim kurarken saygılı, açık ve profesyonel davranıyor mu?'
                ].map((question, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl space-y-2 border">
                    <p className="font-semibold text-gray-800">{index + 1}. {question}</p>
                    <div className="flex flex-wrap gap-3 text-[10px]">
                      {['yetersiz', 'geliştirilmeli', 'beklentiyi karşılıyor', 'iyi', 'çok iyi'].map((opt) => (
                        <label key={opt} className="flex items-center gap-1 cursor-pointer"><input type="radio" name={`q_${index}`} required className="text-[#1A3A2B]" /> <span className="capitalize">{opt}</span></label>
                      ))}
                    </div>
                  </div>
                ))}
                <textarea placeholder="Değerlendirme Notu..." value={evalNote} onChange={e => setEvalNote(e.target.value)} className="w-full border p-2 rounded-lg h-16" />
                <button type="submit" className="w-full bg-[#1A3A2B] text-white py-2 rounded-lg font-bold">Değerlendirmeyi Kaydet</button>
              </form>
            </div>
          </div>
        )}

        {/* GLOBAL LOGIN MODAL */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden text-xs">
              <div className="bg-[#1A3A2B] p-4 text-white flex justify-between items-center"><span className="font-bold">Hesap Giriş Paneli</span><button type="button" onClick={() => setShowLoginModal(false)}>✕</button></div>
              <form onSubmit={handleLogin} className="p-4 space-y-3">
                {authError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded font-semibold">{authError}</p>}
                {redirectReason && <p className="text-[11px] bg-amber-50 text-amber-900 p-2 rounded font-medium">{redirectReason}</p>}
                <div className="flex border-b text-center font-bold mb-2">
                  <button type="button" onClick={() => setLoginTab('employee')} className={`flex-1 py-2 ${loginTab === 'employee' ? 'border-b-2 border-[#1A3A2B] text-[#1A3A2B]' : 'text-gray-400'}`}>Personel</button>
                  <button type="button" onClick={() => setLoginTab('hr')} className={`flex-1 py-2 ${loginTab === 'hr' ? 'border-b-2 border-[#1A3A2B] text-[#1A3A2B]' : 'text-gray-400'}`}>İK / Başkan</button>
                </div>
                <input type="email" required placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded-lg" />
                <input type="password" required placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded-lg" />
                {loginTab === 'hr' && <input type="text" placeholder="2FA Kodu" required value={otp} onChange={e => setOtp(e.target.value)} className="w-full border p-2 rounded-lg text-center tracking-widest font-bold" />}
                <button type="submit" className="w-full bg-[#1A3A2B] text-white py-2 rounded-lg font-bold">Giriş Yap</button>
              </form>
            </div>
          </div>
        )}

        {/* NEW ANNOUNCEMENT MODAL */}
        {showNewAnnouncementModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 text-xs shadow-2xl border">
              <div className="flex justify-between items-center border-b pb-2"><h3 className="font-bold text-sm text-[#1A3A2B]">Duyuru Ekle</h3><button type="button" onClick={() => setShowNewAnnouncementModal(false)}>✕</button></div>
              <select value={newAnnType} onChange={e => setNewAnnType(e.target.value)} className="w-full border p-2 rounded-lg bg-white"><option value="normal">Normal</option><option value="acil">🚨 ACİL (E-Posta Gönderir)</option></select>
              <input type="text" required value={newAnnTitle} onChange={e => setNewAnnTitle(e.target.value)} placeholder="Duyuru Başlığı" className="w-full border p-2 rounded-lg" />
              <textarea required value={newAnnContent} onChange={e => setNewAnnContent(e.target.value)} placeholder="Duyuru metni..." className="w-full border p-2 rounded-lg h-24" />
              <button type="button" onClick={handleAddAnnouncement} className="w-full bg-[#1A3A2B] text-white py-1.5 rounded-lg font-bold">Yayınla</button>
            </div>
          </div>
        )}

        {/* FLOATING AI CHAT BOT */}
        <div className="fixed bottom-6 right-6 z-40">
          {!isAiOpen ? (
            <button onClick={() => setIsAiOpen(true)} className="bg-[#1A3A2B] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#E2DEC5]" /><span className="text-xs font-bold pr-1">Yapay Zeka İK Asistanı</span>
            </button>
          ) : (
            <div className="bg-white rounded-xl shadow-2xl border border-[#E9E4DB] w-80 h-[340px] flex flex-col justify-between overflow-hidden text-xs">
              <div className="bg-[#1A3A2B] p-3 text-white flex justify-between items-center"><span className="text-xs font-bold flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> İHH Akıllı Asistan</span><button type="button" onClick={() => setIsAiOpen(false)}>✕</button></div>
              <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#FDFBF7] text-gray-700 italic">Saha süreçleriniz ve izin entegrasyonu hakkında bana soru sorabilirsiniz.</div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}