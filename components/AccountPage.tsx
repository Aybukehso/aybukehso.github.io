import React, { useState } from 'react';
import { AccountPageProps, Address } from '../types';
import ProductCard from './ProductCard';

type AccountSection = 'ORDERS' | 'RETURNS' | 'PROFILE' | 'FAVORITES';

const AccountPage: React.FC<AccountPageProps> = ({ 
    user, 
    onLogout, 
    onBackToHome, 
    favoriteProducts, 
    onProductClick,
    onToggleFavorite,
    onAddAddress,
    language
}) => {
    const t = (tr: string, en: string) => language === 'tr' ? tr : en;

    const [activeSection, setActiveSection] = useState<AccountSection>('PROFILE');
    const [showAddressForm, setShowAddressForm] = useState(false);
    
    // Adres Formu State'leri
    const [addressTitle, setAddressTitle] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [city, setCity] = useState('');

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        const newAddress: Address = {
            id: Date.now().toString(),
            title: addressTitle.toUpperCase(),
            fullAddress: fullAddress,
            city: city.toUpperCase()
        };
        onAddAddress(newAddress);
        
        // Formu temizle ve kapat
        setAddressTitle('');
        setFullAddress('');
        setCity('');
        setShowAddressForm(false);
    };

    // Menü öğeleri
    const menuItems: { id: AccountSection; label: string }[] = [
        { id: 'ORDERS', label: t('SİPARİŞLERİM', 'MY ORDERS') },
        { id: 'RETURNS', label: t('İADELER', 'RETURNS') },
        { id: 'FAVORITES', label: t('FAVORİLERİM', 'FAVORITES') },
        { id: 'PROFILE', label: t('PROFİLİM', 'MY PROFILE') },
    ];

    // İçerik Render Fonksiyonu
    const renderContent = () => {
        switch (activeSection) {
            case 'ORDERS':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-light uppercase tracking-widest mb-6">{t('SİPARİŞLERİM', 'MY ORDERS')}</h2>
                        <div className="border border-gray-100 p-8 text-center text-gray-500 text-sm">
                            <p>{t('Henüz bir siparişiniz bulunmamaktadır.', 'You have no orders yet.')}</p>
                            <button onClick={onBackToHome} className="mt-4 underline hover:text-black">{t('Alışverişe Başla', 'Start Shopping')}</button>
                        </div>
                    </div>
                );
            case 'RETURNS':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-light uppercase tracking-widest mb-6">{t('İADELER', 'RETURNS')}</h2>
                        <div className="border border-gray-100 p-8 text-center text-gray-500 text-sm">
                            <p>{t('Aktif bir iade talebiniz bulunmamaktadır.', 'No active return requests.')}</p>
                        </div>
                    </div>
                );
            case 'FAVORITES':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-light uppercase tracking-widest mb-6">{t('FAVORİLERİM', 'FAVORITES')} ({favoriteProducts.length})</h2>
                        {favoriteProducts.length === 0 ? (
                            <div className="border border-gray-100 p-8 text-center text-gray-500 text-sm">
                                <p>{t('Favori listeniz boş.', 'Your favorites list is empty.')}</p>
                                <button onClick={onBackToHome} className="mt-4 underline hover:text-black">{t('Koleksiyonu Keşfet', 'Discover Collection')}</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {favoriteProducts.map(product => (
                                    <ProductCard 
                                        key={product.id}
                                        product={product}
                                        onProductClick={onProductClick}
                                        viewMode="grid"
                                        isFavorite={true}
                                        onToggleFavorite={onToggleFavorite}
                                        language={language}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'PROFILE':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-xl font-light uppercase tracking-widest mb-6">{t('PROFİL BİLGİLERİM', 'PROFILE INFORMATION')}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t('AD', 'NAME')}</label>
                                <div className="border-b border-gray-300 py-2 text-sm text-black">{user.name}</div>
                            </div>
                            <div className="group">
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t('SOYAD', 'SURNAME')}</label>
                                <div className="border-b border-gray-300 py-2 text-sm text-black">{user.surname}</div>
                            </div>
                            <div className="group md:col-span-2">
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t('E-POSTA', 'EMAIL')}</label>
                                <div className="border-b border-gray-300 py-2 text-sm text-black">{user.email}</div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 mt-8">
                             <h3 className="text-sm font-semibold uppercase tracking-widest mb-6">{t('ADRES DEFTERİM', 'ADDRESS BOOK')}</h3>
                             
                             {/* Adres Listesi */}
                             <div className="space-y-4 mb-6">
                                 {user.addresses && user.addresses.length > 0 ? (
                                     user.addresses.map(addr => (
                                         <div key={addr.id} className="border border-gray-200 p-4 relative group">
                                             <p className="font-semibold text-xs uppercase mb-2">{addr.title}</p>
                                             <p className="text-sm text-gray-600">{addr.fullAddress}</p>
                                             <p className="text-sm text-gray-800 font-medium mt-1 uppercase">{addr.city}</p>
                                             <button className="text-xs text-red-500 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">{t('SİL', 'DELETE')}</button>
                                         </div>
                                     ))
                                 ) : (
                                     !showAddressForm && <p className="text-sm text-gray-500 mb-4">{t('Kayıtlı adresiniz bulunmamaktadır.', 'No registered addresses.')}</p>
                                 )}
                             </div>

                             {/* Adres Formu veya Ekle Butonu */}
                             {showAddressForm ? (
                                 <form onSubmit={handleSaveAddress} className="bg-gray-50 p-6 space-y-4 border border-gray-100 animate-fade-in">
                                     <div>
                                         <input 
                                             type="text" 
                                             placeholder={t('ADRES BAŞLIĞI (EV, İŞ VB.)', 'ADDRESS TITLE (HOME, WORK ETC.)')} 
                                             value={addressTitle}
                                             onChange={(e) => setAddressTitle(e.target.value)}
                                             className="w-full border-b border-gray-300 bg-transparent py-2 text-sm focus:outline-none focus:border-black uppercase placeholder-gray-500"
                                             required
                                         />
                                     </div>
                                     <div>
                                         <input 
                                             type="text" 
                                             placeholder={t('ŞEHİR / İLÇE', 'CITY / DISTRICT')} 
                                             value={city}
                                             onChange={(e) => setCity(e.target.value)}
                                             className="w-full border-b border-gray-300 bg-transparent py-2 text-sm focus:outline-none focus:border-black uppercase placeholder-gray-500"
                                             required
                                         />
                                     </div>
                                     <div>
                                         <textarea 
                                             placeholder={t('AÇIK ADRES', 'FULL ADDRESS')} 
                                             value={fullAddress}
                                             onChange={(e) => setFullAddress(e.target.value)}
                                             className="w-full border-b border-gray-300 bg-transparent py-2 text-sm focus:outline-none focus:border-black placeholder-gray-500 resize-none h-20"
                                             required
                                         />
                                     </div>
                                     <div className="flex gap-4 pt-4">
                                         <button type="submit" className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">{t('KAYDET', 'SAVE')}</button>
                                         <button type="button" onClick={() => setShowAddressForm(false)} className="text-black border border-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">{t('İPTAL', 'CANCEL')}</button>
                                     </div>
                                 </form>
                             ) : (
                                 <button 
                                    onClick={() => setShowAddressForm(true)}
                                    className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                 >
                                    {t('YENİ ADRES EKLE', 'ADD NEW ADDRESS')}
                                 </button>
                             )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="py-10 animate-fade-in min-h-[60vh]">
            <div className="flex flex-col md:flex-row gap-12">
                
                {/* Sol Menü */}
                <aside className="md:w-1/4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-light uppercase text-black">{t('MERHABA', 'HELLO')}, {user.name}</h1>
                    </div>
                    <nav className="flex flex-col space-y-1">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`text-left py-2 text-sm uppercase tracking-widest transition-colors ${activeSection === item.id ? 'text-black font-semibold border-l-2 border-black pl-3' : 'text-gray-500 hover:text-black border-l-2 border-transparent pl-3'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <button 
                            onClick={onLogout}
                            className="text-left py-2 text-sm uppercase tracking-widest text-red-800 hover:text-red-600 border-l-2 border-transparent pl-3 mt-4 pt-4 border-t border-gray-100"
                        >
                            {t('OTURUMU KAPAT', 'LOG OUT')}
                        </button>
                    </nav>
                </aside>

                {/* Sağ İçerik */}
                <main className="md:w-3/4 bg-white md:pl-10 md:border-l border-gray-100">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AccountPage;