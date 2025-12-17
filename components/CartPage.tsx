import React, { useMemo } from 'react';
import { CartPageProps } from '../types';

const CartPage: React.FC<CartPageProps> = ({ cart, onBackToHome, onRemoveFromCart, onCheckout, onUpdateQuantity, language }) => {
    
    const t = (tr: string, en: string) => language === 'tr' ? tr : en;

    // Toplam fiyatı hesapla
    const subtotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="py-10 animate-fade-in">
            {/* Geri Butonu */}
            <button 
                onClick={onBackToHome} 
                className="text-lg font-semibold uppercase mb-8 flex items-center hover:opacity-70 transition-opacity"
            >
                <span className="text-2xl mr-2">&larr;</span> {t('ALIŞVERİŞE DEVAM ET', 'CONTINUE SHOPPING')}
            </button>

            {/* Başlık */}
            <h1 className="text-lg font-normal uppercase tracking-widest text-black mb-10 border-b border-black/10 pb-4">
                {t('Sepet', 'Bag')} [{cart.length}]
            </h1>

            {cart.length === 0 ? (
                <div className="text-center py-20 border border-gray-100 p-8">
                    <p className="text-lg text-gray-600">{t('Sepetinizde henüz ürün bulunmamaktadır.', 'Your bag is empty.')}</p>
                    <button 
                        onClick={onBackToHome}
                        className="mt-6 bg-black text-white py-3 px-8 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        {t('KOLEKSİYONU KEŞFET', 'DISCOVER COLLECTION')}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-12">
                    
                    {/* Sepet Ürün Listesi */}
                    <div className="md:w-2/3 space-y-8">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8">
                                {/* Ürün Görseli */}
                                <div className="w-24 md:w-32 aspect-[3/4] flex-shrink-0">
                                    <img 
                                        src={item.imageMain} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                <div className="flex-grow flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium uppercase text-black leading-tight max-w-[70%]">{item.name}</p>
                                            <p className="text-sm font-medium text-black">{formatPrice(item.price * item.quantity)} TL</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{item.category}</p>
                                    </div>

                                    {/* Miktar Kontrolü */}
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center space-x-4">
                                            <button 
                                                onClick={() => {
                                                    if (item.quantity > 1) {
                                                        onUpdateQuantity(item.id, -1);
                                                    }
                                                }}
                                                disabled={item.quantity <= 1}
                                                className={`text-lg font-light text-black w-6 h-6 flex items-center justify-center transition-colors ${item.quantity <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-500'}`}
                                            >
                                                -
                                            </button>
                                            
                                            <span className="text-sm font-light text-black w-4 text-center">
                                                {item.quantity}
                                            </span>

                                            <button 
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                                className="text-lg font-light text-black hover:text-gray-500 transition-colors w-6 h-6 flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => onRemoveFromCart(item.id)}
                                            className="text-xs text-gray-500 border-b border-gray-300 pb-0.5 hover:text-black hover:border-black transition-colors uppercase tracking-wider"
                                        >
                                            {t('KALDIR', 'REMOVE')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Özet ve Ödeme */}
                    <div className="md:w-1/3 pt-4 md:pt-0">
                        <div className="bg-gray-50 p-8 sticky top-24">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">{t('SİPARİŞ ÖZETİ', 'ORDER SUMMARY')}</h3>
                            
                            <div className="space-y-4 border-b border-black/10 pb-6 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{t('Ara Toplam', 'Subtotal')}</span>
                                    <span>{formatPrice(subtotal)} TL</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{t('Kargo', 'Shipping')}</span>
                                    <span>{t('ÜCRETSİZ', 'FREE')}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-base font-bold text-black mb-8">
                                <span>{t('TOPLAM', 'TOTAL')}</span>
                                <span>{formatPrice(subtotal)} TL</span>
                            </div>

                            <button 
                                onClick={onCheckout}
                                className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors"
                            >
                                {t('ÖDEMEYİ TAMAMLA', 'CHECKOUT')}
                            </button>
                            
                            <p className="text-[10px] text-gray-500 mt-4 text-center leading-relaxed">
                                {t('Fiyatlara KDV dahildir. Kargo ücreti ödeme adımında hesaplanır (şu an ücretsiz).', 'VAT included. Shipping calculated at checkout (currently free).')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;