import React from 'react';
import { AboutPageProps } from '../types';

const AboutPage: React.FC<AboutPageProps> = ({ onBackToHome, language }) => {
    const t = (tr: string, en: string) => language === 'tr' ? tr : en;

    return (
        <div className="py-10 animate-fade-in max-w-4xl mx-auto min-h-[80vh]">
            {/* Geri Butonu */}
            <button 
                onClick={onBackToHome} 
                className="text-lg font-semibold uppercase mb-16 flex items-center hover:opacity-70 transition-opacity"
            >
                <span className="text-2xl mr-2">&larr;</span> {t('GERİ', 'BACK')}
            </button>

            {/* İçerik Konteyner */}
            <div className="flex flex-col items-center text-center space-y-16 px-4">
                
                {/* Bölüm 1: Marka Başlığı ve Manifestosu */}
                <div className="max-w-2xl mx-auto space-y-6">
                    <h1 className="font-bodoni text-5xl md:text-6xl tracking-widest uppercase leading-none">
                        PETRA HOME
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                        EST. 2025
                    </p>
                    <div className="h-px w-20 bg-black mx-auto mt-8 mb-8"></div>
                    <p className="font-bodoni text-xl md:text-2xl leading-relaxed text-gray-800 italic">
                        "{t('Evin ruhunu, doğanın sessiz dokunuşlarıyla iyileştiriyoruz.', 'We heal the soul of the home with silent touches of nature.')}"
                    </p>
                </div>

                {/* Bölüm 2: Atmosfer Görseli */}
                <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 overflow-hidden relative group">
                    <img 
                        src="https://raw.githubusercontent.com/Aybukehso/petra-images/main/ATEL%C4%B0ER.jpg" 
                        alt="Atelier Mood" 
                        className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Bölüm 3: Metin Blokları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 text-left max-w-3xl">
                    <div className="space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest border-b border-black pb-2 mb-4">
                            {t('FELSEFEMİZ', 'OUR PHILOSOPHY')}
                        </h3>
                        <p className="text-sm font-light leading-7 text-gray-600">
                            {t(
                                'Petra Home, modern yaşamın hızı içinde bir duraklama noktasıdır. Wabi-sabi estetiğinden ilham alarak, kusurların güzelliğini ve doğal malzemelerin yaşanmışlığını kutluyoruz. Her parçamız, mekanınıza sadece bir obje değil, bir hikaye ve sakinlik katmak için seçilmiştir.',
                                'Petra Home is a pause point within the speed of modern life. Inspired by wabi-sabi aesthetics, we celebrate the beauty of imperfections and the lived-in feel of natural materials. Each piece is chosen not just as an object, but to add a story and calmness to your space.'
                            )}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest border-b border-black pb-2 mb-4">
                            {t('SÜRDÜRÜLEBİLİRLİK', 'SUSTAINABILITY')}
                        </h3>
                        <p className="text-sm font-light leading-7 text-gray-600">
                            {t(
                                'Doğaya saygı, üretim sürecimizin merkezindedir. Yerel zanaatkarlar ve sürdürülebilir kaynaklar kullanarak, karbon ayak izimizi minimize etmeyi hedefliyoruz. Plastikten uzak, doğal lifler, taş ve ahşabın saf hallerini evinize taşıyoruz.',
                                'Respect for nature is at the center of our production process. By using local artisans and sustainable sources, we aim to minimize our carbon footprint. We bring pure forms of natural fibers, stone, and wood into your home, away from plastics.'
                            )}
                        </p>
                    </div>
                </div>

                {/* Bölüm 4: İmza */}
                <div className="pt-16 pb-8">
                    <p className="font-bodoni text-3xl text-black">Petra</p>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;