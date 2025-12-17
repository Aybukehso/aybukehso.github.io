
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
    onBackToHome
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        name_en: '', 
        category: '', 
        price: '', 
        imageMain: '', 
        description: '', 
        description_en: '', 
        features: '' 
    });

    const handleEdit = (p: Product) => {
        setEditingId(p.id);
        setFormData({ 
            name: p.name, 
            name_en: p.name_en || '',
            category: p.category, 
            price: p.price.toString(), 
            imageMain: p.imageMain, 
            description: p.description, 
            description_en: p.description_en || '',
            features: p.features.join('\n') 
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const reset = () => {
        setEditingId(null);
        setIsSaving(false);
        setFormData({ name: '', name_en: '', category: '', price: '', imageMain: '', description: '', description_en: '', features: '' });
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        const p: Product = {
            id: editingId || Date.now(),
            name: formData.name.toUpperCase(),
            name_en: formData.name_en.toUpperCase(),
            category: formData.category,
            price: Number(formData.price),
            imageMain: formData.imageMain,
            imageHover: formData.imageMain,
            imageDetail2: formData.imageMain,
            imageDetail3: formData.imageMain,
            description: formData.description,
            description_en: formData.description_en,
            features: formData.features.split('\n').filter(x => x.trim())
        };

        try {
            if (editingId) await onUpdateProduct(p); else await onAddProduct(p);
            reset();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white min-h-screen pt-4 animate-fade-in">
            <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-8">
                <div>
                    <h1 className="text-3xl font-light uppercase tracking-[0.2em] text-black">YÖNETİM PANELİ</h1>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Mağaza ve Envanter Yönetimi (Firestore Aktif)</p>
                </div>
                <button onClick={onBackToHome} className="text-[10px] font-bold border border-black px-8 py-3 hover:bg-black hover:text-white transition-all uppercase tracking-widest">Mağazaya Dön</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                <div className="md:col-span-3 space-y-10">
                    <section>
                        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">Kategoriler</h2>
                        <div className="flex gap-2 mb-6">
                            <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="YENİ EKLE" className="flex-grow border-b border-gray-200 py-2 text-xs outline-none focus:border-black uppercase bg-transparent" />
                            <button onClick={() => { if(newCategory) onAddCategory(newCategory); setNewCategory(''); }} className="bg-black text-white px-4 py-2 text-xs hover:bg-gray-800 transition-colors">+</button>
                        </div>
                        <ul className="space-y-3">
                            {categories.filter(c => c !== 'TÜMÜ').map(c => (
                                <li key={c} className="flex justify-between items-center text-xs group py-1 border-b border-gray-50">
                                    <span className="text-gray-600 tracking-wide uppercase">{c}</span>
                                    <button onClick={(e) => { e.stopPropagation(); if(confirm(`${c} silinsin mi?`)) onDeleteCategory(c); }} className="text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all font-bold">SİL</button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="md:col-span-9 space-y-16">
                    <div className="bg-white p-0">
                        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">{editingId ? 'ÜRÜNÜ DÜZENLE' : 'YENİ ÜRÜN EKLE'}</h2>
                        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Ürün Adı (TR)</label>
                                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black uppercase bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Product Name (EN)</label>
                                <input value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black uppercase bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Fiyat (TL)</label>
                                <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="number" className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Kategori</label>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black bg-white" required>
                                    <option value="">SEÇİNİZ</option>
                                    {categories.filter(c => c !== 'TÜMÜ').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Görsel URL</label>
                                <input value={formData.imageMain} onChange={e => setFormData({...formData, imageMain: e.target.value})} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black bg-transparent" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Açıklama (TR)</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black h-16 resize-none bg-transparent" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Description (EN)</label>
                                <textarea value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black h-16 resize-none bg-transparent" />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[9px] text-gray-400 tracking-widest uppercase">Özellikler (Her Satır Bir Madde)</label>
                                <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black h-20 resize-none bg-transparent" />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                {editingId && <button type="button" onClick={reset} className="px-8 py-3 text-[10px] uppercase border border-gray-200 hover:border-black transition-all">İPTAL</button>}
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="bg-black text-white px-12 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
                                >
                                    {isSaving && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                                    {editingId ? 'GÜNCELLE' : 'BULUTA KAYDET'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="pt-10">
                        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">MEVCUT ÜRÜNLER ({products.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="py-4 font-medium">Görsel</th>
                                        <th className="py-4 font-medium">Ürün Bilgisi</th>
                                        <th className="py-4 font-medium">Fiyat</th>
                                        <th className="py-4 font-medium text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] uppercase text-gray-700">
                                    {products.map(p => (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4">
                                                <img src={p.imageMain} className="w-12 h-16 object-cover bg-gray-50 rounded-sm" />
                                            </td>
                                            <td className="py-4">
                                                <p className="font-bold">{p.name}</p>
                                                <p className="text-[9px] text-gray-400 mt-1">{p.category}</p>
                                            </td>
                                            <td className="py-4 font-sans text-gray-900">{p.price.toLocaleString('tr-TR')} TL</td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-6">
                                                    <button onClick={() => handleEdit(p)} className="text-gray-400 hover:text-black border-b border-transparent hover:border-black transition-all pb-0.5">DÜZENLE</button>
                                                    <button 
                                                        onClick={(e) => { 
                                                            e.preventDefault();
                                                            if(confirm('BU ÜRÜNÜ SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?')) onDeleteProduct(p.id); 
                                                        }} 
                                                        className="text-red-300 hover:text-red-600 font-bold transition-colors"
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
