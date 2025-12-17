
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { initialProducts } from './data';
import { Product, CartItem, PageType, ViewMode, User, Language } from './types';
import ProductCard from './components/ProductCard';
import MenuSidebar from './components/MenuSidebar';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import AccountPage from './components/AccountPage';
import AdminPanel from './components/AdminPanel';
import HelpPage from './components/HelpPage';
import AboutPage from './components/AboutPage';
import CheckoutPage from './components/CheckoutPage';
import ToastNotification from './components/ToastNotification';
import WhatsAppButton from './components/WhatsAppButton';

// Gemini API
import { GoogleGenAI } from "@google/genai";

// Firebase Modülleri
import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    onSnapshot,
    addDoc,
    setDoc, 
    deleteDoc, 
    doc, 
    updateDoc, 
    getDoc,
    query,
    orderBy
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCW4UqAK1s9_kEhXb4l5jJGjKvP54auRj4",
  authDomain: "petra-home.firebaseapp.com",
  projectId: "petra-home",
  storageBucket: "petra-home.firebasestorage.app",
  messagingSenderId: "1005064184722",
  appId: "1:1005064184722:web:b25b31d8520285de64174b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DICTIONARY = {
    tr: {
        newCollection: 'YENİ KOLEKSİYON',
        productsFound: 'ÜRÜN BULUNDU',
        search: 'ARA',
        login: 'GİRİŞ YAP',
        bag: 'SEPET',
        admin: 'YÖNETİM',
        productAdded: 'ÜRÜN SEPETİNİZE EKLENDİ',
        goToBag: 'SEPETE GİT',
        welcome: 'Hoş geldiniz',
        accountCreated: 'Hesabınız oluşturuldu',
        loggedOut: 'Oturum kapatıldı',
        favAdded: 'Favorilere eklendi',
        favRemoved: 'Favorilerden çıkarıldı',
        loginRequired: 'Favorilere eklemek için lütfen giriş yapın.',
        home: 'PETRA HOME',
        help: 'YARDIM',
        about: 'HAKKIMIZDA',
        aiAssistant: 'PETRA AI ASİSTAN',
        aiPlaceholder: 'Dekorasyon tavsiyesi isteyin...',
        aiThinking: 'Düşünüyor...',
        aiGrounding: 'Kaynaklar:'
    },
    en: {
        newCollection: 'NEW COLLECTION',
        productsFound: 'PRODUCTS FOUND',
        search: 'SEARCH',
        login: 'LOG IN',
        bag: 'BAG',
        admin: 'ADMIN',
        productAdded: 'ADDED TO BAG',
        goToBag: 'VIEW BAG',
        welcome: 'Welcome',
        accountCreated: 'Account created',
        loggedOut: 'Logged out',
        favAdded: 'Added to favorites',
        favRemoved: 'Removed from favorites',
        loginRequired: 'Please log in to add to favorites.',
        home: 'PETRA HOME',
        help: 'HELP',
        about: 'ABOUT US',
        aiAssistant: 'PETRA AI ASSISTANT',
        aiPlaceholder: 'Ask for decoration advice...',
        aiThinking: 'Thinking...',
        aiGrounding: 'Sources:'
    }
};

const CATEGORY_TRANSLATIONS: {[key: string]: string} = {
    'TÜMÜ': 'ALL',
    'AYNA': 'MIRRORS',
    'AYDINLATMA': 'LIGHTING',
    'DEKORATİF AKSESUAR': 'DECORATION',
    'TABLO': 'ARTWORKS',
    'MUM VE ODA KOKUSU': 'FRAGRANCES',
    'HALI': 'RUGS'
};

interface DBUser extends User {
    password: string;
    savedFavorites: number[];
}

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('tr');
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [productsRaw, setProductsRaw] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['TÜMÜ', 'AYNA', 'AYDINLATMA', 'DEKORATİF AKSESUAR', 'TABLO', 'MUM VE ODA KOKUSU', 'HALI']);

  const t = (key: keyof typeof DICTIONARY['tr']) => DICTIONARY[language][key];
  const getCategoryName = (cat: string) => (language === 'en' && CATEGORY_TRANSLATIONS[cat]) ? CATEGORY_TRANSLATIONS[cat] : cat;

  // --- ANLIK VERİ TAKİBİ (ONSNAPSHOT) ---
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('id', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbData = snapshot.docs.map(doc => ({ 
          ...doc.data(), 
          id: Number(doc.id) 
      } as Product));
      
      if (dbData.length > 0) {
        setProductsRaw(dbData);
        setDbConnected(true);
      } else {
        // DB tamamen boşsa başlangıç verilerini yükle
        console.log("DB Boş, başlangıç verileri yükleniyor...");
        initialProducts.forEach(async p => {
          await setDoc(doc(db, 'products', String(p.id)), p);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setProductsRaw(initialProducts);
      setDbConnected(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('TÜMÜ');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 
  const [cartRaw, setCartRaw] = useState<CartItem[]>([]); 
  const [favorites, setFavorites] = useState<number[]>([]); 
  const [toastMessage, setToastMessage] = useState<string>(''); 
  const [toastAction, setToastAction] = useState<{ label: string, action: () => void } | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('list');
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); 
  const [user, setUser] = useState<User | null>(null);

  const filteredProducts = useMemo(() => {
    let filtered = productsRaw;
    if (selectedCategory !== 'TÜMÜ') filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered;
  }, [selectedCategory, searchTerm, productsRaw]);

  // --- ÜRÜN İŞLEMLERİ ---
  const handleAddProduct = async (newProduct: Product) => {
      try {
          // ID'yi doküman adı olarak kullan
          await setDoc(doc(db, 'products', String(newProduct.id)), newProduct);
          setToastMessage('Ürün buluta eklendi.');
      } catch (e: any) {
          alert("Ekleme hatası: " + e.message);
      }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
      try {
          // merge: true ile sadece değişen alanları güncelle, diğerlerini (EN versiyonlar gibi) koru
          await setDoc(doc(db, 'products', String(updatedProduct.id)), updatedProduct, { merge: true });
          setToastMessage('Ürün güncellendi.');
      } catch (e: any) {
          alert("Güncelleme hatası: " + e.message);
      }
  };

  const handleDeleteProduct = async (id: number) => {
      try {
          await deleteDoc(doc(db, 'products', String(id)));
          setToastMessage('Ürün silindi.');
      } catch (e: any) {
          alert("Silme hatası: " + e.message);
      }
  };

  const handleLoginAttempt = async (emailInput: string, passwordInput: string): Promise<boolean> => {
      if (emailInput === 'petra' && passwordInput === '1234') {
          setUser({ name: 'PETRA', surname: 'ADMIN', email: 'admin@petrahome.com', isAdmin: true });
          setCurrentPage('admin');
          return true;
      }
      try {
          const userDoc = await getDoc(doc(db, 'users', emailInput.toLowerCase()));
          if (userDoc.exists()) {
              const data = userDoc.data() as DBUser;
              if (data.password === passwordInput) {
                  setUser({ name: data.name, surname: data.surname, email: data.email, isAdmin: data.isAdmin });
                  setFavorites(data.savedFavorites || []);
                  setCurrentPage('list');
                  return true;
              }
          }
      } catch (e: any) { alert(e.message); }
      return false;
  };

  const handleRegisterAttempt = async (newUser: User, passwordInput: string): Promise<boolean> => {
      try {
          const userRef = doc(db, 'users', newUser.email.toLowerCase());
          const dbUser: DBUser = { ...newUser, password: passwordInput, savedFavorites: [], isAdmin: false };
          await setDoc(userRef, dbUser);
          setUser(newUser);
          setCurrentPage('list');
          setToastMessage(t('accountCreated'));
          return true;
      } catch (e: any) { alert(e.message); return false; }
  };

  const handleLogout = () => { setUser(null); setFavorites([]); setCurrentPage('list'); setToastMessage(t('loggedOut')); };

  const handleProductClick = (product: Product) => { setSelectedProduct(product); setCurrentPage('detail'); setIsMenuOpen(false); window.scrollTo(0, 0); };
  const handleBackToList = () => { setSelectedProduct(null); setCurrentPage('list'); };
  const handleGoHome = () => { setSelectedCategory('TÜMÜ'); setSearchTerm(''); setSelectedProduct(null); setCurrentPage('list'); setIsMenuOpen(false); window.scrollTo(0, 0); };
  const handleGoToCart = () => { setCurrentPage('cart'); setSelectedProduct(null); setIsMenuOpen(false); window.scrollTo(0, 0); };
  const handleGoToLogin = () => { if (user) setCurrentPage('account'); else setCurrentPage('login'); setSelectedProduct(null); setIsMenuOpen(false); window.scrollTo(0, 0); };

  const addToCart = (product: Product) => {
    setCartRaw(prev => {
        const idx = prev.findIndex(item => item.id === product.id);
        if (idx > -1) { const n = [...prev]; n[idx].quantity += 1; return n; }
        return [...prev, { ...product, quantity: 1 }];
    });
    setToastMessage(t('productAdded'));
    setToastAction({ label: t('goToBag'), action: handleGoToCart });
    setTimeout(() => { setToastMessage(''); setToastAction(null); }, 4000);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="font-bodoni text-3xl tracking-[0.3em] mb-4 animate-pulse uppercase">PETRA HOME</div>
        <div className="text-[10px] tracking-widest text-gray-400 uppercase">Bulut Bağlantısı Kuruluyor...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-32 relative">
      <MenuSidebar 
        isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} categories={categories} selectedCategory={selectedCategory}
        onSelectCategory={(cat) => { setSelectedCategory(cat); handleBackToList(); }}
        onLoginClick={handleGoToLogin} onHelpClick={() => setCurrentPage('help')} onAboutClick={() => setCurrentPage('about')}
        user={user} language={language}
      />
      
      <header className="fixed top-0 left-0 w-full bg-white z-20 border-b border-black/5 h-16 flex items-center px-8">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMenuOpen(true)} className="text-xl hover:opacity-50 transition-opacity">☰</button>
            <h1 className="font-bodoni text-2xl cursor-pointer tracking-widest uppercase" onClick={handleGoHome}>PETRA HOME</h1>
          </div>
          <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest font-medium">
            <input type="text" placeholder={t('search')} className="border-b border-black/20 outline-none w-32 pb-1 bg-transparent focus:border-black transition-colors" onChange={(e) => setSearchTerm(e.target.value)} />
            <button onClick={handleGoToLogin} className="hover:opacity-60">{user ? user.name : t('login')}</button>
            <button onClick={handleGoToCart} className="hover:opacity-60">{t('bag')} ({cartRaw.length})</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-24 px-8">
        {currentPage === 'login' ? <LoginPage onBackToHome={handleBackToList} onLoginAttempt={handleLoginAttempt} onRegisterAttempt={handleRegisterAttempt} language={language} /> :
         currentPage === 'cart' ? <CartPage cart={cartRaw.map(i => ({ ...i, ...productsRaw.find(p => p.id === i.id) })) as CartItem[]} onBackToHome={handleBackToList} onRemoveFromCart={(id) => setCartRaw(prev => prev.filter(i => i.id !== id))} onCheckout={() => setCurrentPage('checkout')} onUpdateQuantity={(id, d) => setCartRaw(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} language={language} /> :
         currentPage === 'detail' && selectedProduct ? <ProductDetail product={selectedProduct} cart={cartRaw} onClose={handleBackToList} onAddToCart={addToCart} onUpdateQuantity={() => {}} onGoToCart={handleGoToCart} language={language} /> :
         currentPage === 'account' && user ? <AccountPage user={user} onLogout={handleLogout} onBackToHome={handleBackToList} favoriteProducts={productsRaw.filter(p => favorites.includes(p.id))} onProductClick={handleProductClick} onToggleFavorite={(id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} onAddAddress={() => {}} language={language} /> :
         currentPage === 'admin' ? <AdminPanel products={productsRaw} categories={categories} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onAddCategory={async () => {}} onDeleteCategory={async () => {}} onBackToHome={handleBackToList} isCloudMode={dbConnected} /> :
         currentPage === 'checkout' ? <CheckoutPage cart={cartRaw} subtotal={cartRaw.reduce((s,i) => s + (i.price*i.quantity), 0)} onBackToCart={() => setCurrentPage('cart')} onPaymentSuccess={() => { setToastMessage('Sipariş Alındı'); handleGoHome(); setCartRaw([]); }} language={language} /> :
         <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light uppercase tracking-[0.2em]">{getCategoryName(selectedCategory)}</h2>
                {!dbConnected && <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">Bulut Bağlantısı Yok</div>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} onProductClick={handleProductClick} viewMode={viewMode} isFavorite={favorites.includes(p.id)} onToggleFavorite={(id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} language={language} />)}
            </div>
         </>
        }
      </main>

      <div className="fixed bottom-8 left-0 w-full h-10 bg-white/95 border-t border-black/5 flex justify-between items-center px-8 text-[10px] uppercase tracking-[0.2em] z-40 font-bold">
          <button onClick={handleGoHome} className="hover:opacity-50 transition-opacity">PETRA HOME © 2025</button>
          <div className="flex space-x-6">
              <button onClick={() => setLanguage('tr')} className={`${language === 'tr' ? 'text-black' : 'text-gray-300'} transition-colors`}>TR</button>
              <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'text-black' : 'text-gray-300'} transition-colors`}>EN</button>
          </div>
      </div>
      
      <ToastNotification message={toastMessage} isVisible={!!toastMessage} actionLabel={toastAction?.label} onAction={toastAction?.action} />
      <WhatsAppButton />
    </div>
  );
};

export default App;