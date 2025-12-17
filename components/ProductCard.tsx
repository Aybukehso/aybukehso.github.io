import React, { useState } from 'react';
import { ProductCardProps } from '../types';

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, viewMode, isFavorite, onToggleFavorite, language }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Görünüm moduna göre dinamik sınıflar
    const isGrid = viewMode === 'grid';
    // Resim oranları
    const imageAspectClass = isGrid ? 'aspect-[4/5] md:aspect-[4/6]' : 'aspect-[4/4.5]';
    const textPaddingClass = isGrid ? 'pt-3 pb-6' : 'pt-2 pb-4';
    const nameSizeClass = isGrid ? 'text-sm' : 'text-xs';
    const priceSizeClass = isGrid ? 'text-sm' : 'text-xs';

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(product.id);
    };

    // Fiyat Formatlama: 3,190.00 TL
    const formattedPrice = product.price.toLocaleString('en-US', {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    });

    return (
        <div 
            className="group flex flex-col cursor-pointer transition-opacity duration-300 hover:opacity-95"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onProductClick(product)}
        >
            <div className={`relative overflow-hidden bg-gray-100 ${imageAspectClass}`}>
                
                <button 
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full hover:scale-110 transition-transform"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill={isFavorite ? "black" : "none"} 
                        stroke={isFavorite ? "black" : "white"} 
                        strokeWidth={isFavorite ? "0" : "1.5"}
                        className="drop-shadow-sm" 
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>

                <img
                    src={isHovered ? product.imageHover : product.imageMain}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-150 ease-linear"
                    loading="lazy"
                />
            </div>
            
            <div className={textPaddingClass}>
                {isGrid && <p className="text-xs tracking-widest text-gray-700 font-sans">{product.category}</p>}
                <p className={`${nameSizeClass} font-semibold uppercase text-black mt-1`}>{product.name}</p>
                <p className={`${priceSizeClass} text-black mt-1 font-sans`}>{formattedPrice} TL</p>
            </div>
        </div>
    );
};

export default ProductCard;