import React from 'react';
import { Product, CartItem, Language } from '../types';

interface ProductDetailProps {
    product: Product;
    cart: CartItem[];
    onClose: () => void;
    onAddToCart: (product: Product) => void;
    onUpdateQuantity: (productId: number, delta: number) => void;
    onGoToCart: () => void;
    language: Language;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, cart, onClose, onAddToCart, onGoToCart, language }) => {
    const t = (tr: string, en: string) => language === 'tr' ? tr : en;

    const features = product.features || [t('Özellikler henüz girilmemiştir.', 'Features not yet available.')];
    const description = product.description || t('Bu ürünle ilgili detaylı açıklama yakında eklenecektir.', 'Detailed description coming soon.');
    
    // Ürünün sepette olup olmadığını kontrol et
    const isInCart = cart.some(item => item.id === product.id);
    
    const allImages = [
        { src: product.imageMain, alt: `${product.name}` },
        { src: product.imageHover, alt: `${product.name}` },
    ];

    // Fiyat Formatlama: 3,190.00 TL
    const formattedPrice = product.price.toLocaleString('en-US', {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    });

    return (
        <div className="py-10 animate-fade-in">
            {/* Geri Butonu */}
            <button 
                onClick={onClose} 
                className="text-lg font-semibold uppercase mb-6 flex items-center hover:opacity-70 transition-opacity"
            >
                <span className="text-2xl mr-2">&larr;</span> {t('GERİ', 'BACK')}
            </button>

            {/* Ürün Detay İçeriği */}
            <div className="flex flex-col md:flex-row gap-10">
                
                {/* Sol: Görsel Alanı */}
                <div className="md:w-3/5 space-y-4">
                    {allImages.map((image, index) => (
                        <div key={index}>
                            <img 
                                src={image.src} 
                                alt={image.alt} 
                                className={`w-full h-auto object-cover border border-gray-100 ${index > 0 ? 'aspect-[4/5] md:aspect-[4/5]' : 'aspect-auto'}`} 
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
                
                {/* Sağ: Bilgi ve Eylem Alanı */}
                <div className="md:w-2/5 p-0 md:p-4 sticky top-20 h-full self-start"> 
                    
                    <p className="text-sm tracking-widest text-gray-700">{product.category}</p>
                    <h1 className="text-3xl md:text-4xl font-light uppercase text-black mt-2">{product.name}</h1>
                    <p className="text-xl font-semibold text-black mt-4">{formattedPrice} TL</p>
                    
                    {/* Eylem Butonları */}
                    <div className="mt-8 space-y-3">
                        {isInCart ? (
                            <button 
                                onClick={onGoToCart}
                                className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors border border-black"
                            >
                                {t('SEPETİ GÖR', 'VIEW BAG')}
                            </button>
                        ) : (
                            <button 
                                onClick={() => onAddToCart(product)}
                                className="w-full bg-black text-white py-3 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors"
                            >
                                {t('EKLE', 'ADD')}
                            </button>
                        )}

                        <p className="text-xs text-gray-600 text-center md:text-left">{t('Teslimat Süresi: 3-5 İş Günü', 'Delivery: 3-5 Business Days')}</p>
                    </div>

                    {/* Açıklama ve Özellikler */}
                    <div className="mt-10 space-y-6 border-t border-gray-200 pt-6">
                        
                        <div className="pb-4">
                            <h3 className="text-lg font-semibold uppercase border-b border-black/50 pb-2 mb-3">{t('AÇIKLAMA', 'DESCRIPTION')}</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                        </div>

                        <div className="pb-4">
                            <h3 className="text-lg font-semibold uppercase border-b border-black/50 pb-2 mb-3">{t('ÖZELLİKLER', 'FEATURES')}</h3>
                            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                                {features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;