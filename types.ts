
export interface Product {
    id: number;
    name: string;
    name_en?: string; // İngilizce Adı
    category: string;
    category_en?: string; // İngilizce Kategorisi
    price: number;
    imageMain: string;
    imageHover: string;
    imageDetail2: string;
    imageDetail3: string;
    description: string;
    description_en?: string; // İngilizce Açıklama
    features: string[];
    features_en?: string[]; // İngilizce Özellikler
    shopierLink?: string; // Shopier Ödeme Linki
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Address {
    id: string;
    title: string;
    fullAddress: string;
    city: string;
}

export interface User {
    name: string;
    surname: string;
    email: string;
    addresses?: Address[];
    isAdmin?: boolean;
}

export type ViewMode = 'grid' | 'compact';
export type PageType = 'list' | 'detail' | 'cart' | 'login' | 'account' | 'admin' | 'help' | 'about';
export type Language = 'tr' | 'en';

// Helper types for Props
export interface ProductCardProps {
    product: Product;
    onProductClick: (product: Product) => void;
    viewMode: ViewMode;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
    language: Language; 
}

export interface ProductDetailProps {
    product: Product;
    cart: CartItem[];
    onClose: () => void;
    onAddToCart: (product: Product) => void;
    onUpdateQuantity: (productId: number, delta: number) => void;
    onGoToCart: () => void;
    language: Language; 
}

export interface AccountPageProps {
    user: User;
    onLogout: () => void;
    onBackToHome: () => void;
    favoriteProducts: Product[];
    onProductClick: (product: Product) => void;
    onToggleFavorite: (id: number) => void;
    onAddAddress: (address: Address) => void;
    language: Language; 
}

export interface AdminPanelProps {
    products: Product[];
    categories: string[];
    onAddProduct: (product: Product) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (id: number) => void;
    onAddCategory: (category: string) => void;
    onDeleteCategory: (category: string) => void;
    onBackToHome: () => void;
}

export interface CartPageProps {
    cart: CartItem[];
    onBackToHome: () => void;
    onRemoveFromCart: (productId: number) => void;
    onCheckout: () => void;
    onUpdateQuantity: (productId: number, delta: number) => void;
    language: Language; 
}

export interface MenuSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    onLoginClick: () => void;
    onHelpClick: () => void;
    onAboutClick: () => void;
    user: User | null;
    language: Language; 
}

export interface LoginPageProps {
    onBackToHome: () => void;
    onLoginAttempt: (email: string, password: string) => boolean;
    onRegisterAttempt: (user: User, password: string) => boolean;
    language: Language; 
}

export interface HelpPageProps {
    onBackToHome: () => void;
    onSubmitRequest: (topic: string, message: string) => void;
    language: Language;
}

export interface AboutPageProps {
    onBackToHome: () => void;
    language: Language;
}