import React, { useState, useEffect } from 'react';
import { AdminPanelProps, Product } from '../types';

const AdminPanel: React.FC<AdminPanelProps> = ({
    products,
    categories,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onAddCategory,
    onDeleteCategory,
    onBackToHome
}) => {
    // Kategori State
    const [newCategory, setNewCategory] = useState('');

    // Ürün Form State
    const [editingId, setEditingId] = useState<number | null>(null);
    
    // Form verilerini yöneten tek bir state objesi
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        imageMain: '',
        imageHover: '',
        description: '',
        features: ''
    });
    
    const [formError, setFormError] = useState('');

    // Düzenlenen ürün listeden silinirse formu temizle
    useEffect(() => {
        if (editingId && !products.find(p => p.id === editingId)) {
            resetForm();
        }
    }, [products, editingId]);

    // Input Değişikliklerini Yöneten Genel Fonksiyon
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Düzenleme moduna geçince formu doldur
    const handleEditClick = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            imageMain: product.imageMain,
            imageHover: product.imageHover,
            description: product.description,
            features: product.features.join('\n')
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Formu temizle
    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            category: '',
            price: '',
            imageMain: '',
            imageHover: '',
            description: '',
            features: ''
        });
        setFormError('');
    };

    // Ürün Kaydet (Ekle veya Güncelle)
    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        // Validasyon
        if (!formData.name.trim()) { setFormError('Ürün adı boş olamaz.'); return; }
        if (!formData.category) { setFormError('Kategori seçilmelidir.'); return; }
        if (Number(formData.price) <= 0) { setFormError('Fiyat 0\'dan büyük olmalıdır.'); return; }
        if (!formData.imageMain.trim()) { setFormError('Ana görsel URL zorunludur.'); return; }

        const featureList = formData.features.split('\n').filter(f => f.trim() !== '');

        const productPayload: Product = {
            id: editingId ? editingId : Date.now(), // Yeni ise timestamp ID
            name: formData.name.toUpperCase(),
            category: formData.category,
            price: Number(formData.price),
            imageMain: formData.imageMain,
            imageHover: formData.imageHover || formData.imageMain, // Hover yoksa ana görseli kullan
            imageDetail2: formData.imageMain,
            imageDetail3: formData.imageMain,
            description: formData.description,
            features: featureList
        };

        if (editingId) {
            onUpdateProduct(productPayload);
        } else {
            onAddProduct(productPayload);
        }
        resetForm();
    };

    // Kategori Ekle
    const handleSaveCategory = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.toUpperCase());
            setNewCategory('');
        }
    };

    // Güvenli Silme İşlemi Wrapper
    const handleDeleteClick = (id: number) => {
        if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            onDeleteProduct(id);
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        });
    };

    const inputClasses = "w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-2 text-sm transition-colors placeholder-gray-400";
    const labelClasses = "block text-[10px] text-gray-500 mb-1 uppercase tracking-wider";

    return (
        <div className="py-10 animate-fade-in min-h-screen bg-white max-w-7xl mx-auto px-6">
            
            {/* PAGE HEADER */}
            <div className="flex justify-between items-end mb-8 border-b border-black/10 pb-6">
                <div>
                    <h1 className="text-3xl font-light uppercase tracking-widest text-black mb-2">YÖNETİM PANELİ</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Ürün ve Kategori Düzenleme Merkezi</p>
                </div>
                <button 
                    onClick={onBackToHome} 
                    className="text-xs uppercase font-semibold border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                >
                    MAĞAZAYA DÖN
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* SOL KOLON: KATEGORİ YÖNETİMİ (3 SPAN) */}
                <div className="md:col-span-3 space-y-8">
                    <div className="bg-white border border-black/10 p-6 shadow-sm">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black/10 pb-2">KATEGORİLER</h2>
                        
                        {/* Ekleme Input */}
                        <div className="flex items-end gap-2 mb-6">
                            <input 
                                type="text" 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="YENİ EKLE"
                                className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-1 text-xs uppercase"
                            />
                            <button 
                                type="button"
                                onClick={handleSaveCategory} 
                                className="text-xs bg-black text-white px-2 py-1 hover:bg-gray-800"
                            >
                                +
                            </button>
                        </div>

                        {/* Liste */}
                        <ul className="space-y-1">
                            {categories.filter(c => c !== 'TÜMÜ').map(cat => (
                                <li key={cat} className="flex justify-between items-center text-xs text-gray-600 py-2 px-2 hover:bg-black/5 rounded-sm transition-colors group relative">
                                    <span>{cat}</span>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (window.confirm(`"${cat}" kategorisini silmek istediğinize emin misiniz?`)) {
                                                onDeleteCategory(cat);
                                            }
                                        }}
                                        className="text-gray-400 hover:text-red-600 transition-colors font-bold text-lg p-2 cursor-pointer z-10 relative"
                                        title="Sil"
                                    >
                                        &times;
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* SAĞ KOLON: ÜRÜN YÖNETİMİ (9 SPAN) */}
                <div className="md:col-span-9 space-y-10">
                    
                    {/* ÜRÜN EKLEME/DÜZENLEME FORMU - KART STİLİ */}
                    <div className="bg-white border border-black/10 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest">
                                {editingId ? 'ÜRÜNÜ DÜZENLE' : 'YENİ ÜRÜN EKLE'}
                            </h2>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="text-[10px] underline text-gray-500 uppercase">
                                    Vazgeç
                                </button>
                            )}
                        </div>
                        
                        {formError && <div className="bg-red-50 text-red-600 p-3 mb-6 text-xs uppercase border border-red-100">{formError}</div>}

                        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Satır 1 */}
                            <div>
                                <label className={labelClasses}>ÜRÜN ADI</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    placeholder="ÖRN: VAZO"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>FİYAT (TL)</label>
                                <input 
                                    type="number" 
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Satır 2 */}
                            <div>
                                <label className={labelClasses}>KATEGORİ</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} bg-white appearance-none cursor-pointer`}
                                >
                                    <option value="">SEÇİNİZ</option>
                                    {categories.filter(c => c !== 'TÜMÜ').map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>GÖRSEL URL (ANA)</label>
                                <input 
                                    type="text" 
                                    name="imageMain"
                                    value={formData.imageMain}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Satır 3 */}
                            <div>
                                <label className={labelClasses}>GÖRSEL URL (HOVER)</label>
                                <input 
                                    type="text" 
                                    name="imageHover"
                                    value={formData.imageHover}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    placeholder="https://..."
                                />
                            </div>
                            
                            {/* Geniş Alanlar */}
                            <div className="md:col-span-2">
                                <label className={labelClasses}>AÇIKLAMA</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} h-20 resize-none`}
                                    placeholder="Ürün hikayesi ve detayları..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClasses}>ÖZELLİKLER (HER SATIR YENİ MADDE)</label>
                                <textarea 
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} h-24 resize-none`}
                                    placeholder="Örn: Malzeme: %100 Pamuk"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                                {editingId && (
                                    <button type="button" onClick={resetForm} className="border border-black/20 text-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
                                        İPTAL
                                    </button>
                                )}
                                <button type="submit" className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                    {editingId ? 'GÜNCELLE' : 'KAYDET'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ÜRÜN LİSTESİ TABLOSU */}
                    <div className="bg-white">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">MEVCUT ENVANTER ({products.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black/10 text-gray-400">
                                        <th className="py-3 text-[10px] font-normal uppercase tracking-wider w-16">GÖRSEL</th>
                                        <th className="py-3 text-[10px] font-normal uppercase tracking-wider">ÜRÜN ADI</th>
                                        <th className="py-3 text-[10px] font-normal uppercase tracking-wider">KATEGORİ</th>
                                        <th className="py-3 text-[10px] font-normal uppercase tracking-wider">FİYAT</th>
                                        <th className="py-3 text-[10px] font-normal uppercase tracking-wider text-right">İŞLEM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                            <td className="py-3">
                                                <img src={product.imageMain} alt="" className="w-10 h-12 object-cover border border-gray-100" />
                                            </td>
                                            <td className="py-3 text-xs uppercase font-medium text-black">{product.name}</td>
                                            <td className="py-3 text-[10px] text-gray-500 uppercase tracking-wide">{product.category}</td>
                                            <td className="py-3 text-xs font-sans">{formatPrice(product.price)} TL</td>
                                            <td className="py-3 text-right space-x-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-[10px] text-black border-b border-black hover:opacity-60 uppercase"
                                                >
                                                    DÜZENLE
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(product.id);
                                                    }}
                                                    className="text-[10px] text-red-600 hover:text-red-800 uppercase cursor-pointer"
                                                >
                                                    SİL
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminPanel;