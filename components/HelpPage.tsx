import React, { useState } from 'react';
import { HelpPageProps } from '../types';

const HelpPage: React.FC<HelpPageProps> = ({ onBackToHome, onSubmitRequest, language }) => {
    const t = (tr: string, en: string) => language === 'tr' ? tr : en;

    const [topic, setTopic] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic && message && name && email) {
            onSubmitRequest(topic, message);
            // Form reset logic can be handled by parent or here, but ideally we wait for success
            setTopic('');
            setMessage('');
            setName('');
            setEmail('');
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            q: t('SİPARİŞİM NE ZAMAN KARGOYA VERİLİR?', 'WHEN WILL MY ORDER BE SHIPPED?'),
            a: t('Siparişleriniz 1-3 iş günü içerisinde özenle hazırlanarak kargoya teslim edilmektedir.', 'Your orders are carefully prepared and delivered to cargo within 1-3 business days.')
        },
        {
            q: t('İADE PROSEDÜRÜ NEDİR?', 'WHAT IS THE RETURN PROCEDURE?'),
            a: t('Ürünleri teslim aldıktan sonra 14 gün içerisinde ücretsiz olarak iade edebilirsiniz. Ürünlerin kullanılmamış ve orijinal ambalajında olması gerekmektedir.', 'You can return the products free of charge within 14 days after receiving them. Products must be unused and in their original packaging.')
        },
        {
            q: t('KIRIK/HASARLI ÜRÜN GELİRSE NE YAPMALIYIM?', 'WHAT SHOULD I DO IF A BROKEN/DAMAGED PRODUCT ARRIVES?'),
            a: t('Hasarlı ürün durumunda, kargo tutanağı ile birlikte 24 saat içinde bizimle iletişime geçmeniz gerekmektedir. Yeni ürün gönderimi hemen sağlanacaktır.', 'In case of damaged product, you must contact us within 24 hours with the cargo report. New product shipment will be provided immediately.')
        }
    ];

    // Ortak Input Stili
    const inputClasses = "w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-500 tracking-wide bg-transparent appearance-none rounded-none";
    
    // Özel Select Stili (SVG Arrow eklenmiş hali)
    // Data URI ile minimal bir aşağı ok ikonu ekliyoruz
    const selectClasses = `
        ${inputClasses} 
        cursor-pointer 
        bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] 
        bg-[length:1.25rem] 
        bg-no-repeat 
        bg-right
    `;

    return (
        <div className="py-10 animate-fade-in max-w-2xl mx-auto min-h-[70vh]">
            {/* Geri Butonu */}
            <button 
                onClick={onBackToHome} 
                className="text-lg font-semibold uppercase mb-10 flex items-center hover:opacity-70 transition-opacity"
            >
                <span className="text-2xl mr-2">&larr;</span> {t('GERİ', 'BACK')}
            </button>

            <h1 className="text-3xl font-light uppercase tracking-widest text-black mb-2 text-center">
                {t('YARDIM', 'HELP')}
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest text-center mb-16">
                {t('SİZE NASIL YARDIMCI OLABİLİRİZ?', 'HOW CAN WE HELP YOU?')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                
                {/* SOL: İLETİŞİM FORMU */}
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-black pb-2">
                        {t('BİZE ULAŞIN', 'CONTACT US')}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <select 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)}
                                className={`${selectClasses} ${topic === '' ? 'text-gray-500' : 'text-black'}`}
                                required
                            >
                                <option value="" disabled className="text-gray-500">{t('KONU SEÇİNİZ', 'SELECT TOPIC')}</option>
                                <option value="ORDER" className="text-black">{t('SİPARİŞ DURUMU', 'ORDER STATUS')}</option>
                                <option value="RETURN" className="text-black">{t('İADE VE DEĞİŞİM', 'RETURN & EXCHANGE')}</option>
                                <option value="PRODUCT" className="text-black">{t('ÜRÜN BİLGİSİ', 'PRODUCT INFO')}</option>
                                <option value="OTHER" className="text-black">{t('DİĞER', 'OTHER')}</option>
                            </select>
                        </div>
                        
                        <div>
                            <input 
                                type="text" 
                                placeholder={t('AD SOYAD', 'NAME SURNAME')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>

                        <div>
                            <input 
                                type="email" 
                                placeholder={t('E-POSTA', 'EMAIL')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>

                        <div>
                            <textarea 
                                placeholder={t('MESAJINIZ', 'YOUR MESSAGE')}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className={`${inputClasses} resize-none h-24`}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors mt-4"
                        >
                            {t('GÖNDER', 'SEND')}
                        </button>
                    </form>
                </div>

                {/* SAĞ: SIKÇA SORULAN SORULAR */}
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-black pb-2">
                        {t('SIKÇA SORULANLAR', 'FAQ')}
                    </h2>
                    
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-100 pb-4">
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="w-full text-left flex justify-between items-center group"
                                >
                                    <span className="text-xs uppercase tracking-wide font-medium group-hover:text-gray-600 transition-colors pr-4">
                                        {faq.q}
                                    </span>
                                    <span className="text-lg font-light leading-none">
                                        {openFaqIndex === index ? '-' : '+'}
                                    </span>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-gray-50 text-center">
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{t('MÜŞTERİ HİZMETLERİ', 'CUSTOMER SERVICE')}</p>
                        <p className="text-lg font-bodoni text-black mb-1">0850 123 45 67</p>
                        <p className="text-[10px] text-gray-400">{t('HAFTA İÇİ 09:00 - 18:00', 'WEEKDAYS 09:00 - 18:00')}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HelpPage;