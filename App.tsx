
import React, { useState, useMemo, useEffect } from 'react';
import { initialProducts } from './data';
import { Product, CartItem, PageType, ViewMode, User, Address, Language } from './types';
import ProductCard from './components/ProductCard';
import MenuSidebar from './components/MenuSidebar';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import AccountPage from './components/AccountPage';
import AdminPanel from './components/AdminPanel';
import HelpPage from './components/HelpPage';
import AboutPage from './components/AboutPage';
import ToastNotification from './components/ToastNotification';
import WhatsAppButton from './components/WhatsAppButton';

// Firebase Bağlantısı
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

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

// --- TRANSLATION DICTIONARY ---
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
        about: 'HAKKIMIZDA'
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
        about: 'ABOUT US'
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
  const [productsRaw, setProductsRaw] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['TÜMÜ', 'AYNA', 'AYDINLATMA', 'DEKORATİF AKSESUAR', 'TABLO', 'MUM VE ODA KOKUSU', 'HALI']);

  const t = (key: keyof typeof DICTIONARY['tr']) => DICTIONARY[language][key];
  
  const getCategoryName = (cat: string) => {
      if (language === 'en' && CATEGORY_TRANSLATIONS[cat]) return CATEGORY_TRANSLATIONS[cat];
      return cat;
  };

  const localizeProduct = (p: Product): Product => {
      if (language === 'tr') return p;
      return {
          ...p,
          name: p.name_en || p.name,
          category: p.category_en || p.category,
          description: p.description_en || p.description,
          features: p.features_en || p.features
      };
  };

  // Firestore'dan Veri Çekme
  useEffect(() => {
    const loadData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const dbProducts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: Number(doc.id)
          } as Product));
          setProductsRaw(dbProducts.sort((a, b) => a.id - b.id));
        } else {
          setProductsRaw(initialProducts);
          // Firestore'a ilk tohumları at
          for (const p of initialProducts) {
            await setDoc(doc(db, 'products', String(p.id)), p);
          }
        }

        // Kategorileri Çek
        const catSnapshot = await getDocs(collection(db, 'categories'));
        if (!catSnapshot.empty) {
            setCategories(['TÜMÜ', ...catSnapshot.docs.map(d => d.id)]);
        }
      } catch (error) {
        console.error("Firebase Veri Yükleme Hatası:", error);
        setProductsRaw(initialProducts);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const products = useMemo(() => {
      return productsRaw.map(localizeProduct);
  }, [productsRaw, language]);

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

  const [registeredUsers, setRegisteredUsers] = useState<DBUser[]>(() => {
    try {
        const savedUsers = localStorage.getItem('petra_users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    } catch (error) { return []; }
  });

  useEffect(() => {
      localStorage.setItem('petra_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'TÜMÜ') {
        const targetCategoryName = language === 'en' && CATEGORY_TRANSLATIONS[selectedCategory] 
            ? CATEGORY_TRANSLATIONS[selectedCategory] : selectedCategory;
        filtered = filtered.filter(p => p.category === targetCategoryName);
    }
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [selectedCategory, searchTerm, products, language]);

  const favoriteProducts = useMemo(() => {
    return products.filter(p => favorites.includes(p.id));
  }, [favorites, products]);

  // --- HANDLERS ---
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product); 
    setCurrentPage('detail'); 
    setIsMenuOpen(false); 
    window.scrollTo(0, 0);
  };
  
  const handleBackToList = () => {
    setSelectedProduct(null);
    setCurrentPage('list'); 
  };

  const handleGoHome = () => {
      setSelectedCategory('TÜMÜ');
      setSearchTerm('');
      setSelectedProduct(null);
      setCurrentPage('list');
      setIsMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
  };
  
  const handleGoToCart = () => {
    setCurrentPage('cart'); 
    setSelectedProduct(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleGoToLogin = () => {
    if (user) setCurrentPage('account'); else setCurrentPage('login');
    setSelectedProduct(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleGoToAdmin = () => {
      if (user && user.isAdmin) setCurrentPage('admin'); else setCurrentPage('login');
      setIsMenuOpen(false);
      window.scrollTo(0, 0);
  };

  // Kalıcı CRUD İşlemleri
  const handleAddProduct = async (newProduct: Product) => {
      try {
          await setDoc(doc(db, 'products', String(newProduct.id)), newProduct);
          setProductsRaw(prev => [newProduct, ...prev]);
          setToastMessage('Ürün başarıyla buluta eklendi.');
      } catch (e) { 
          console.error("Firestore Error:", e);
          setToastMessage('Ekleme hatası! İnternet bağlantınızı ve Firebase kurallarınızı kontrol edin.'); 
      }
      setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
      try {
          await setDoc(doc(db, 'products', String(updatedProduct.id)), updatedProduct, { merge: true });
          setProductsRaw(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          setToastMessage('Ürün güncellendi.');
      } catch (e) { setToastMessage('Güncelleme hatası.'); }
      setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDeleteProduct = async (id: number) => {
      try {
          await deleteDoc(doc(db, 'products', String(id)));
          setProductsRaw(prev => prev.filter(p => Number(p.id) !== Number(id)));
          setToastMessage('Ürün buluttan silindi.');
      } catch (e) { setToastMessage('Silme hatası.'); }
      setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddCategory = async (cat: string) => {
      try {
          await setDoc(doc(db, 'categories', cat.toUpperCase()), { name: cat.toUpperCase() });
          setCategories(prev => Array.from(new Set([...prev, cat.toUpperCase()])));
      } catch (e) { console.error(e); }
  };

  const handleDeleteCategory = async (cat: string) => {
      try {
          await deleteDoc(doc(db, 'categories', cat));
          setCategories(prev => prev.filter(c => c !== cat));
      } catch (e) { console.error(e); }
  };

  const handleLoginAttempt = async (emailInput: string, passwordInput: string): Promise<boolean> => {
      if (emailInput === 'petra' && passwordInput === '1234') {
          const adminUser: User = { name: 'PETRA', surname: 'ADMIN', email: 'admin@petrahome.com', isAdmin: true };
          setUser(adminUser);
          setFavorites([]);
          setToastMessage(t('welcome'));
          setCurrentPage('admin');
          return true;
      }
      const foundUser = registeredUsers.find(u => u.email === emailInput && u.password === passwordInput);
      if (foundUser) {
          setUser({ name: foundUser.name, surname: foundUser.surname, email: foundUser.email, addresses: foundUser.addresses || [] });
          setFavorites(foundUser.savedFavorites || []);
          setToastMessage(`${t('welcome')}, ${foundUser.name}`);
          setCurrentPage('list');
          return true;
      }
      return false;
  };

  const handleRegisterAttempt = async (newUser: User, password: string): Promise<boolean> => {
      if (registeredUsers.some(u => u.email === newUser.email)) return false;
      const newDBUser: DBUser = { ...newUser, password, savedFavorites: [], addresses: [] };
      setRegisteredUsers(prev => [...prev, newDBUser]);
      setUser(newUser);
      setFavorites([]);
      setToastMessage(t('accountCreated'));
      setCurrentPage('list');
      return true;
  };

  const handleLogout = () => {
      setUser(null);
      setFavorites([]); 
      setToastMessage(t('loggedOut'));
      setCurrentPage('list');
  };

  const toggleFavorite = (productId: number) => {
      if (!user) { setToastMessage(t('loginRequired')); setTimeout(() => setToastMessage(''), 3000); return; }
      let newFavorites: number[] = [];
      setFavorites(prev => {
          newFavorites = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
          setToastMessage(prev.includes(productId) ? t('favRemoved') : t('favAdded'));
          setTimeout(() => setToastMessage(''), 2000);
          return newFavorites;
      });
      setRegisteredUsers(prev => prev.map(u => u.email === user.email ? { ...u, savedFavorites: newFavorites } : u));
  };

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
    <div className="h-screen flex items-center justify-center bg-white">
      <p className="tracking-[0.5em] text-[10px] uppercase animate-pulse">PETRA HOME YÜKLENİYOR...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans pb-32 relative">
      <MenuSidebar 
        isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} categories={categories} selectedCategory={selectedCategory}
        onSelectCategory={(cat) => { setSelectedCategory(cat); handleBackToList(); }}
        onLoginClick={handleGoToLogin} onHelpClick={() => setCurrentPage('help')} onAboutClick={() => setCurrentPage('about')}
        user={user} language={language}
      />
      
      <header className="fixed top-0 left-0 w-full bg-white z-20 border-b border-black/10 h-16 flex items-center">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsMenuOpen(true)} className="h-10 w-10 flex items-center justify-center hover:opacity-70"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect y="3" width="20" height="2" fill="black"/><rect y="9" width="20" height="2" fill="black"/><rect y="15" width="20" height="2" fill="black"/></svg></button>
            <h1 className="font-bodoni tracking-[0.2em] text-2xl md:text-3xl font-medium uppercase cursor-pointer" onClick={handleGoHome}>PETRA HOME</h1>
          </div>
          <div className="flex items-center space-x-4">
            {currentPage !== 'admin' && <input type="text" placeholder={t('search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-20 md:w-32 bg-transparent border-b border-black/60 text-xs uppercase focus:outline-none pb-1" />}
            {user?.isAdmin && <button onClick={handleGoToAdmin} className="text-xs tracking-widest uppercase font-bold hidden md:block">{t('admin')}</button>}
            <button onClick={handleGoToLogin} className="text-xs tracking-widest uppercase hidden md:block">{user ? user.name : t('login')}</button>
            <span className="text-xs tracking-widest uppercase cursor-pointer" onClick={handleGoToCart}>{t('bag')} ({cartRaw.length})</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-24 px-4 md:px-8">
        {currentPage === 'login' ? <LoginPage onBackToHome={handleBackToList} onLoginAttempt={handleLoginAttempt} onRegisterAttempt={handleRegisterAttempt} language={language} /> :
         currentPage === 'help' ? <HelpPage onBackToHome={handleBackToList} onSubmitRequest={() => {}} language={language} /> :
         currentPage === 'about' ? <AboutPage onBackToHome={handleBackToList} language={language} /> :
         currentPage === 'account' && user ? <AccountPage user={user} onLogout={handleLogout} onBackToHome={handleBackToList} favoriteProducts={favoriteProducts} onProductClick={handleProductClick} onToggleFavorite={toggleFavorite} onAddAddress={() => {}} language={language} /> :
         currentPage === 'admin' ? <AdminPanel products={productsRaw} categories={categories} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} onBackToHome={handleBackToList} isCloudMode={true} /> :
         currentPage === 'cart' ? <CartPage cart={cartRaw.map(i => ({...products.find(p => p.id === i.id)!, quantity: i.quantity}))} onBackToHome={handleBackToList} onRemoveFromCart={(id) => setCartRaw(prev => prev.filter(i => i.id !== id))} onCheckout={() => {}} onUpdateQuantity={(id, d) => setCartRaw(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} language={language} /> :
         currentPage === 'detail' && selectedProduct ? <ProductDetail product={selectedProduct} cart={cartRaw} onClose={handleBackToList} onAddToCart={addToCart} onUpdateQuantity={() => {}} onGoToCart={handleGoToCart} language={language} /> :
         <>
            <div className="flex justify-between items-end mb-8">
                <div><h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest">{selectedCategory === 'TÜMÜ' ? t('newCollection') : getCategoryName(selectedCategory)}</h2><p className="text-sm text-gray-700 mt-2">{filteredProducts.length} {t('productsFound')}</p></div>
                <div className="flex space-x-2">
                    <button onClick={() => setViewMode('grid')} className={`p-1 border ${viewMode === 'grid' ? 'border-black' : 'border-gray-200'}`}><svg width="18" height="18" viewBox="0 0 20 20"><rect width="8" height="8" fill="black" x="0" y="0"/><rect width="8" height="8" fill="black" x="12" y="0"/><rect width="8" height="8" fill="black" x="0" y="12"/><rect width="8" height="8" fill="black" x="12" y="12"/></svg></button>
                    <button onClick={() => setViewMode('compact')} className={`p-1 border ${viewMode === 'compact' ? 'border-black' : 'border-gray-200'}`}><svg width="18" height="18" viewBox="0 0 20 20"><rect width="4" height="4" fill="black" x="0" y="0"/><rect width="4" height="4" fill="black" x="6" y="0"/><rect width="4" height="4" fill="black" x="12" y="0"/><rect width="4" height="4" fill="black" x="18" y="0"/></svg></button>
                </div>
            </div>
            <section className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 gap-6" : "grid grid-cols-3 md:grid-cols-6 gap-3"}>
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} onProductClick={handleProductClick} viewMode={viewMode} isFavorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite} language={language} />)}
            </section>
         </>
        }
      </main>

      <div className="fixed bottom-8 left-0 w-full h-10 bg-white/95 backdrop-blur-md border-t border-black/5 z-40 flex justify-between items-center px-6 md:px-8 text-[10px] uppercase tracking-widest font-medium">
          <div className="flex items-center text-black space-x-1">
              <button onClick={handleGoHome} className="hover:opacity-60 font-bold">{t('home')}</button>
              {selectedCategory !== 'TÜMÜ' && currentPage === 'list' && <><span className="text-gray-400">/</span><span className="text-gray-500">{getCategoryName(selectedCategory)}</span></>}
              {currentPage === 'detail' && selectedProduct && <><span className="text-gray-400">/</span><button onClick={() => { setSelectedCategory(selectedProduct.category); setCurrentPage('list'); setSelectedProduct(null); }} className="font-semibold">{getCategoryName(selectedProduct.category)}</button><span className="text-gray-400">/</span><span className="text-gray-500 line-clamp-1">{language === 'tr' ? selectedProduct.name : (selectedProduct.name_en || selectedProduct.name)}</span></>}
          </div>
          <div className="flex items-center space-x-3 text-black">
              <button onClick={() => setLanguage('tr')} className={language === 'tr' ? 'font-bold' : 'font-light'}>Türkçe</button>
              <span className="opacity-30">|</span>
              <button onClick={() => setLanguage('en')} className={language === 'en' ? 'font-bold' : 'font-light'}>English</button>
          </div>
      </div>
      
      <ToastNotification message={toastMessage} isVisible={!!toastMessage} actionLabel={toastAction?.label} onAction={toastAction?.action} />
      <WhatsAppButton />
    </div>
  );
};

export default App;