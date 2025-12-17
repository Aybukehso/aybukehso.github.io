import React, { useState } from 'react';
import { User, Language } from '../types';

interface LoginPageProps {
    onBackToHome: () => void;
    onLoginAttempt: (email: string, password: string) => boolean;
    onRegisterAttempt: (user: User, password: string) => boolean;
    language: Language;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onLoginAttempt, onRegisterAttempt, language }) => {
    const t = (tr: string, en: string) => language === 'tr' ? tr : en;

    const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
    const [error, setError] = useState<string>('');
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        setTimeout(() => {
            if (activeTab === 'REGISTER') {
                const newUser: User = {
                    name: name.trim().toUpperCase(), 
                    surname: surname.trim().toUpperCase(),
                    email: email.trim()
                };
                
                const success = onRegisterAttempt(newUser, password);
                if (!success) {
                    setError(t('Bu e-posta adresi ile daha önce kayıt olunmuş.', 'Email already registered.'));
                }
            } else {
                const success = onLoginAttempt(email.trim(), password);
                if (!success) {
                    setError(t('E-posta adresi veya parola hatalı.', 'Invalid email or password.'));
                }
            }
        }, 300);
    };

    return (
        <div className="py-10 animate-fade-in max-w-lg mx-auto min-h-[60vh]">
            {/* Geri Butonu */}
            <button 
                onClick={onBackToHome} 
                className="text-lg font-semibold uppercase mb-12 flex items-center hover:opacity-70 transition-opacity"
            >
                <span className="text-2xl mr-2">&larr;</span> {t('GERİ', 'BACK')}
            </button>

            <div className="flex flex-col items-center">
                {/* Tab Başlıkları */}
                <div className="flex space-x-8 mb-12">
                    <button 
                        onClick={() => { setActiveTab('REGISTER'); setError(''); }}
                        className={`text-sm tracking-widest uppercase pb-2 border-b transition-colors ${activeTab === 'REGISTER' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                    >
                        {t('KAYDOL', 'REGISTER')}
                    </button>
                    <button 
                        onClick={() => { setActiveTab('LOGIN'); setError(''); }}
                        className={`text-sm tracking-widest uppercase pb-2 border-b transition-colors ${activeTab === 'LOGIN' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                    >
                        {t('OTURUM AÇ', 'LOG IN')}
                    </button>
                </div>

                {/* Hata Mesajı */}
                {error && (
                    <div className="w-full bg-red-50 border border-red-100 text-red-600 px-4 py-3 mb-6 text-xs uppercase tracking-wide">
                        {error}
                    </div>
                )}

                {/* Form Alanı */}
                <form onSubmit={handleSubmit} className="w-full space-y-8">
                    <div className="space-y-6">
                        <div className="group">
                            <input 
                                type="text" 
                                placeholder={t('E-POSTA', 'EMAIL')} 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-500 tracking-wide bg-transparent"
                            />
                        </div>
                        <div className="group">
                            <input 
                                type="password" 
                                placeholder={t('PAROLA', 'PASSWORD')} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-500 tracking-wide bg-transparent"
                            />
                        </div>
                        
                        {activeTab === 'REGISTER' && (
                            <>
                                <div className="group">
                                    <input 
                                        type="text" 
                                        placeholder={t('AD', 'NAME')} 
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-500 tracking-wide bg-transparent"
                                    />
                                </div>
                                <div className="group">
                                    <input 
                                        type="text" 
                                        placeholder={t('SOYAD', 'SURNAME')} 
                                        required
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-500 tracking-wide bg-transparent"
                                    />
                                </div>
                                <div className="flex items-start mt-4">
                                    <input type="checkbox" id="privacy" className="mt-1 mr-3 accent-black" required />
                                    <label htmlFor="privacy" className="text-xs text-gray-600 leading-relaxed">
                                        {t('Kişisel verilerimin işlenmesine ilişkin aydınlatma metnini okudum ve kabul ediyorum.', 'I have read and accept the privacy policy regarding the processing of my personal data.')}
                                    </label>
                                </div>
                            </>
                        )}
                    </div>

                    {activeTab === 'LOGIN' && (
                        <div className="text-right">
                            <button type="button" className="text-xs text-gray-500 hover:text-black underline tracking-wide">
                                {t('PAROLANIZI MI UNUTTUNUZ?', 'FORGOT PASSWORD?')}
                            </button>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors mt-8"
                    >
                        {activeTab === 'LOGIN' ? t('OTURUM AÇ', 'LOG IN') : t('HESAP OLUŞTUR', 'CREATE ACCOUNT')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;