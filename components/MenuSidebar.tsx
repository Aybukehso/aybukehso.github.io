import React from 'react';
import { MenuSidebarProps } from '../types';

const MenuSidebar: React.FC<MenuSidebarProps> = ({ isOpen, onClose, categories, selectedCategory, onSelectCategory, onLoginClick, onHelpClick, onAboutClick, user, language }) => {
    const menuFontClass = 'font-sans text-xs tracking-widest uppercase text-white hover:text-gray-400 transition-colors block py-3 px-6 cursor-pointer text-left w-full';

    const getCategoryName = (cat: string) => {
        if (language !== 'en') return cat;
        const translations: {[key: string]: string} = {
            'TÜMÜ': 'ALL',
            'AYNA': 'MIRRORS',
            'AYDINLATMA': 'LIGHTING',
            'DEKORATİF AKSESUAR': 'DECORATION',
            'TABLO': 'ARTWORKS',
            'MUM VE ODA KOKUSU': 'FRAGRANCES',
            'HALI': 'RUGS'
        };
        return translations[cat] || cat;
    };

    const t = (tr: string, en: string) => language === 'tr' ? tr : en;

    return (
        <>
            {/* Overlay - z-50 to cover footer (z-40) */}
            <div 
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Sidebar Panel - z-[60] to be above overlay */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-[60] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Menü Başlığı ve Kapatma Butonu */}
                <div className="flex justify-between items-center h-16 border-b border-gray-800 px-6">
                    <h2 className="text-lg font-semibold tracking-widest uppercase">{t('MENÜ', 'MENU')}</h2>
                    <button onClick={onClose} className="text-white text-2xl hover:text-gray-400 transition-colors">
                        &times;
                    </button>
                </div>
                
                {/* Kategori Listesi */}
                <nav className="pt-4 flex flex-col items-start">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                onSelectCategory(cat);
                                onClose();
                            }}
                            className={`${menuFontClass} ${selectedCategory === cat ? 'font-bold bg-gray-900' : 'font-light'}`}
                        >
                            {getCategoryName(cat)}
                        </button>
                    ))}
                    <div className="h-px bg-gray-800 my-4 mx-6 w-[calc(100%-3rem)]"></div>
                    {/* Ek navigasyon öğeleri */}
                    <button 
                        className={`${menuFontClass} opacity-60`}
                        onClick={() => {
                            onAboutClick();
                            onClose();
                        }}
                    >
                        {t('HAKKIMIZDA', 'ABOUT US')}
                    </button>
                    <button 
                        className={`${menuFontClass} opacity-60`}
                        onClick={() => {
                            onHelpClick();
                            onClose();
                        }}
                    >
                        {t('YARDIM', 'HELP')}
                    </button>
                    <button 
                        className={`${menuFontClass} opacity-60`}
                        onClick={() => {
                            onLoginClick();
                            onClose();
                        }}
                    >
                        {user ? `${t('HESABIM', 'ACCOUNT')} (${user.name})` : t('GİRİŞ YAP', 'LOG IN')}
                    </button>
                </nav>
            </div>
        </>
    );
};

export default MenuSidebar;