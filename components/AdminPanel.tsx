
import React, { useState } from 'react';
import { AdminPanelProps, Product } from '../types';

const AdminPanel: React.FC<AdminPanelProps> = ({
    products,
    categories,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onAddCategory,
    onDeleteCategory,
    onBackToHome,
    isCloudMode
}) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newCategory, setNewCategory] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        name_en: '', 
        category: '', 
        category_en: '',
        price: '', 
        imageMain: '', 
        description: '', 
        description_en: '', 
        features: '',
        features_en: ''
    });

    const handleEdit = (p: Product) => {
        setEditingProduct(p);
        setFormData({ 
            name: p.name, 
            name_en: p.name_en || '',
            category: p.category, 
            category_en: p.category_en || '',
            price: p.price.toString(), 
            imageMain: p.imageMain, 
            description: p.description, 
            description_en: p.description_en || '',
            features: p.features ? p.features.join('\n') : '',
            features_en: p.features_en ? p.features_en.join('\n') : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const reset = () => {
        setEditingProduct(null);
        setIsSaving(false);
        setFormData({ name: '', name_en: '', category: '', category_en: '', price: '', imageMain: '', description: '', description_en: '', features: '', features_en: '' });
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Eğer yeni ürünse ID'yi en büyük ID + 1 yap
        const nextId = editingProduct ? editingProduct.id : (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1);

        const p: Product = {
            id: nextId,
            name: formData.name.toUpperCase(),
            name_en: formData.name_en.toUpperCase(),
            category: formData.category,
            category_en: formData.category_en,
            price: Number(formData.price),
            imageMain: formData.imageMain,
            imageHover: formData.imageMain,
            imageDetail2: formData.imageMain,
            imageDetail3: formData.imageMain,
            description: formData.description,
            description_en: formData.description_en,
            features: formData.features.split('\n').filter(x => x.trim()),
            features_en: formData.features_en.split('\n').filter(x => x.trim())
        };

        try {
            if (editingProduct) await onUpdateProduct(p); else await onAddProduct(p);
            reset();
        } catch (err) {
            console.error("Kayıt hatası:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white min-h-screen pt-4 animate-fade-in pb-20">
            <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-8">
                <div>
                    <h1 className="text-3xl font-light uppercase tracking-[0.2em] text-black">YÖNETİM PANELİ</h1>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">
                        {isCloudMode ? 'BULUT MODU AKTİF' : 'BAĞLANTI HATASI'}
                    </p>
                </div>
                <button onClick={onBackToHome} className="text-[10px] font-bold border border-black px-8 py-3 hover:bg-black hover:text-white transition-all uppercase tracking-widest">Mağazaya Dön</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                <div className="md:col-span-12">
                    <div className="bg-gray-50 p-8 rounded-sm">
                        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">{editingProduct ? 'ÜRÜNÜ DÜZENLE' : 'YENİ ÜRÜN EKLE'}</h2>
                        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Ürün Adı (TR)</label>
                                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black uppercase bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Product Name (EN)</label>
                                <input value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black uppercase bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Kategori (TR)</label>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black bg-white" required>
                                    <option value="">SEÇİNİZ</option>
                                    {categories.filter(c => c !== 'TÜMÜ').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Category (EN)</label>
                                <input value={formData.category_en} onChange={e => setFormData({...formData, category_en: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black uppercase bg-transparent" placeholder="Örn: LIGHTING" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Fiyat (TL)</label>
                                <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="number" className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Görsel URL</label>
                                <input value={formData.imageMain} onChange={e => setFormData({...formData, imageMain: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Açıklama (TR)</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black h-16 resize-none bg-transparent" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Description (EN)</label>
                                <textarea value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black h-16 resize-none bg-transparent" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Özellikler (TR - Satır Satır)</label>
                                <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black h-20 resize-none bg-transparent" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Features (EN - Satır Satır)</label>
                                <textarea value={formData.features_en} onChange={e => setFormData({...formData, features_en: e.target.value})} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black h-20 resize-none bg-transparent" />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-4 mt-8">
                                {editingProduct && <button type="button" onClick={reset} className="px-8 py-3 text-[10px] uppercase border border-gray-300 hover:border-black transition-all">İPTAL</button>}
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="bg-black text-white px-12 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-all flex items-center gap-2"
                                >
                                    {isSaving && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                                    {editingProduct ? 'DEĞİŞİKLİKLERİ KAYDET' : 'BULUTA EKLE'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="pt-20">
                        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">MAĞAZA ENVANTERİ ({products.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="py-4 font-medium">Görsel</th>
                                        <th className="py-4 font-medium">ID / Ad</th>
                                        <th className="py-4 font-medium">Fiyat</th>
                                        <th className="py-4 font-medium text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] uppercase text-gray-700">
                                    {products.map(p => (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4">
                                                <img src={p.imageMain} className="w-12 h-16 object-cover bg-gray-100" />
                                            </td>
                                            <td className="py-4">
                                                <p className="text-[9px] text-gray-400">#{p.id}</p>
                                                <p className="font-bold">{p.name}</p>
                                            </td>
                                            <td className="py-4 font-sans">{p.price.toLocaleString('tr-TR')} TL</td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-6">
                                                    <button onClick={() => handleEdit(p)} className="text-black hover:opacity-50 transition-all border-b border-black pb-0.5">DÜZENLE</button>
                                                    <button 
                                                        onClick={() => { if(confirm('SİLİNSİN Mİ?')) onDeleteProduct(p.id); }} 
                                                        className="text-red-600 font-bold"
                                                    >
                                                        SİL
                                                    </button>
                                                </div>
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

