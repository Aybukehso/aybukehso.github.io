
import { Product } from './types';

// Petra Home için mock (sahte) ürün verisi
export const initialProducts: Product[] = [
  // 1. SIRADA: STONE CURVE MASA LAMBASI (ID 7)
  {
    id: 7,
    name: 'STONE CURVE MASA LAMBASI',
    name_en: 'STONE CURVE TABLE LAMP',
    category: 'AYDINLATMA',
    category_en: 'LIGHTING',
    price: 7999.00, 
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/ayd%C4%B1nlatma.JPG',
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/ayd%C4%B1nlatma%202.JPG',
    imageDetail2: 'https://source.unsplash.com/400x550/?lamp,shade,detail',
    imageDetail3: 'https://source.unsplash.com/400x550/?minimalist,lighting,styled',
    description: 'Stone Curve Masa Lambası, heykelsi formu ve yumuşak ışık dağılımıyla mekâna sakin bir atmosfer kazandırır. Doğal dokusu ve kavisli yapısı, Japandi ve minimal interior stillsle kusursuz uyum sağlar.',
    description_en: 'Stone Curve Table Lamp brings a calm atmosphere to the space with its sculptural form and soft light distribution. Its natural texture and curved structure blend perfectly with Japandi and minimal interior styles.',
    features: [
        'Malzeme: Taş dokulu gövde', 
        'Işık Tipi: Sıcak beyaz', 
        'Kullanım Alanı: İç mekân', 
        'Stil: Minimal / Japandi', 
        'Elektrik: Kablolu kullanım'
    ],
    features_en: [
        'Material: Stone textured body',
        'Light Type: Warm white',
        'Usage: Indoor',
        'Style: Minimal / Japandi',
        'Power: Corded'
    ],
    shopierLink: 'https://www.shopier.com/petrastudio/42261301'
  },
  // 2. SIRADA: WABI DARK KASE (ID 8)
  {
    id: 8,
    name: 'WABI DARK KASE',
    name_en: 'WABI DARK BOWL',
    category: 'DEKORATİF AKSESUAR',
    category_en: 'DECORATION',
    price: 3449.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/kase%201.JPG',
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/kase%202.JPG',
    imageDetail2: 'https://source.unsplash.com/400x550/?plate,styled,minimal',
    imageDetail3: 'https://source.unsplash.com/400x550/?white,seramic,detail',
    description: 'Wabi Dark Kase, düzensiz kenarları ve koyu yüzeyiyle wabi-sabi estetiğini yansıtır. Minimal ama karakterli duruşu sayesinde tek başına veya farklı objelerle birlikte dekoratif olarak kullanılabilir.',
    description_en: 'Wabi Dark Bowl reflects wabi-sabi aesthetics with its irregular edges and dark surface. With its minimal yet characteristic stance, it can be used decoratively alone or with other objects.',
    features: [
        'Malzeme: Kağıt Hamuru', 
        'Yüzey: Parlak sır', 
        'Çap: 28 cm', 
        'Kullanım: Sadece dekoratif amaçlı'
    ],
    features_en: [
        'Material: Paper Pulp',
        'Surface: Glossy glaze',
        'Diameter: 28 cm',
        'Usage: Decorative purpose only'
    ]
  },
  // 3. SIRADA: DOKULU DUVAR TABLOSU (ID 9)
  {
    id: 9, 
    name: 'DOKULU DUVAR TABLOSU',
    name_en: 'TEXTURED WALL ART',
    category: 'TABLO',
    category_en: 'ARTWORKS',
    price: 7899.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/tablo%202.JPG', 
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/tablo%203.JPG', 
    imageDetail2: 'https://github.com/Aybukehso/petra-images/raw/main/tablo%202.JPG', 
    imageDetail3: 'https://github.com/Aybukehso/petra-images/raw/main/tablo%203.JPG', 
    description: 'Dokulu Duvar Tablosu, doğal malzeme hissi veren yüzeyi ve sakin renk paletiyle mekânda sanatsal bir denge oluşturur. Işıkla birlikte değişen dokusu, duvarlarda derinlik hissi yaratır.',
    description_en: 'Textured Wall Art creates an artistic balance in the space with its surface giving a natural material feel and calm color palette. Its texture changing with light creates a sense of depth on the walls.',
    features: [
        'Stil: Dokulu / Sanatsal', 
        'Kullanım: Duvara asılabilir', 
        'Etki: Işıkla değişen yüzey dokusu', 
        'Kullanım Alanı: İç mekân'
    ],
    features_en: [
        'Style: Textured / Artistic',
        'Usage: Wall mountable',
        'Effect: Surface texture changing with light',
        'Usage Area: Indoor'
    ]
  },
  // 4. SIRADA: TERRA SILENCE SERAMİK VAZO SETİ (2’Lİ) (ID 3)
  {
    id: 3,
    name: 'TERRA SILENCE SERAMİK VAZO SETİ (2’Lİ)',
    name_en: 'TERRA SILENCE CERAMIC VASE SET (SET OF 2)',
    category: 'DEKORATİF AKSESUAR',
    category_en: 'DECORATION',
    price: 2950.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/vazo%201.JPG', 
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/vazo%202.JPG',
    imageDetail2: 'https://source.unsplash.com/400x550/?ceramic,vessel,styled',
    imageDetail3: 'https://source.unsplash.com/400x550/?ceramic,matte,detail',
    description: 'Terra Silence Vazo Seti taş tozu karışımıyla elde şekillendirilmiş, her biri benzersiz iki dekoratif vazodan oluşur. Yüzeydeki doğal geçişler ve kusurlu güzellik anlayışı, wabi-sabi felsefesini yansıtır.',
    description_en: 'Terra Silence Vase Set consists of two unique decorative vases shaped by hand with stone powder mixture. Natural transitions on the surface and imperfect beauty concept reflect wabi-sabi philosophy.',
    features: [
        'Malzeme: Taş tozu', 
        'Üretim: El yapımı', 
        'Set İçeriği: 2 adet vazo', 
        'Stil: Wabi-sabi / Organik', 
        'UYARI: Su ile temas ettirilmemelidir'
    ],
    features_en: [
        'Material: Stone powder',
        'Production: Handmade',
        'Set Content: 2 vases',
        'Style: Wabi-sabi / Organic',
        'WARNING: Do not contact with water'
    ]
  },
  // 5. SIRADA: WABI EARTH KASE (ID 2)
  {
    id: 2,
    name: 'WABI EARTH KASE',
    name_en: 'WABI EARTH BOWL',
    category: 'DEKORATİF AKSESUAR',
    category_en: 'DECORATION',
    price: 2999.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/wabi%20earth%20kase.png',
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/wabi%20sabi%20kase%202.JPG',
    imageDetail2: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/wabi%20sabi%20kase%202.JPG',
    imageDetail3: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/wabi%20sabi%20kase%202.JPG',
    description: 'Wabi Earth Kase, kağıt hamuru kullanılarak elde şekillendirilmiş, ayaklı formuyla güçlü bir duruş sergiler. Doğal yüzey dokusu ve organik renk geçişleri, onu dekoratif bir sanat objesine dönüştürür.',
    description_en: 'Wabi Earth Bowl displays a strong stance with its footed form shaped by hand using paper pulp. Natural surface texture and organic color transitions transform it into a decorative art object.',
    features: [
        'Malzeme: Kağıt hamuru', 
        'Üretim: El yapımı', 
        'Form: Ayaklı kase', 
        'Stil: Wabi-sabi', 
        'UYARI: Gıda ile temasa uygun değildir'
    ],
    features_en: [
        'Material: Paper pulp',
        'Production: Handmade',
        'Form: Footed bowl',
        'Style: Wabi-sabi',
        'WARNING: Not suitable for food contact'
    ]
  },
  // 6. SIRADA: PURE LINE UZUN BOY AYNA (ID 4)
  {
    id: 4,
    name: 'PURE LINE UZUN BOY AYNA',
    name_en: 'PURE LINE FLOOR MIRROR',
    category: 'AYNA',
    category_en: 'MIRRORS',
    price: 2850.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/ayna.png', 
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/ayna%202.png',
    imageDetail2: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/ayna%202.png', 
    imageDetail3: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/ayna%202.png',
    description: 'Pure Line Uzun Boy Ayna, ince çerçevesi ve sade formuyla mekânı daha ferah ve aydınlık gösterir. Minimal tasarımı sayesinde farklı dekorasyon stilleriyle kolayca uyum sağlar.',
    description_en: 'Pure Line Floor Mirror makes the space look more spacious and bright with its thin frame and simple form. Thanks to its minimal design, it easily adapts to different decoration styles.',
    features: [
        'Form: Uzun boy', 
        'Stil: Minimal', 
        'Kullanım: İç mekân', 
        'Çerçeve: İnce metal'
    ],
    features_en: [
        'Form: Full length',
        'Style: Minimal',
        'Usage: Indoor',
        'Frame: Thin metal'
    ]
  },
  // 7. SIRADA: NOIR CALM DOĞAL MUM (ID 5)
  {
    id: 5,
    name: 'NOIR CALM DOĞAL MUM',
    name_en: 'NOIR CALM NATURAL CANDLE',
    category: 'MUM VE ODA KOKUSU',
    category_en: 'FRAGRANCES',
    price: 599.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum%20main.png', 
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum.png', 
    imageDetail2: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum.png',
    imageDetail3: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum.png',
    description: 'Noir Calm Doğal Mum, sade tasarımı ve yumuşak aleviyle mekânda huzurlu bir atmosfer yaratır. Tek başına veya set ürünleriyle birlikte kullanılabilir.',
    description_en: 'Noir Calm Natural Candle creates a peaceful atmosphere in the space with its simple design and soft flame. Can be used alone or with set products.',
    features: [
        'Kullanım: İç mekân', 
        'Stil: Minimal', 
        'Ambalaj: Mat siyah cam'
    ],
    features_en: [
        'Usage: Indoor',
        'Style: Minimal',
        'Packaging: Matte black glass'
    ]
  },
  // 8. SIRADA: NOIR CALM MUM SETİ (3’LÜ) (ID 6)
  {
    id: 6,
    name: 'NOIR CALM MUM SETİ (3’LÜ)',
    name_en: 'NOIR CALM CANDLE SET (SET OF 3)',
    category: 'MUM VE ODA KOKUSU',
    category_en: 'FRAGRANCES',
    price: 749.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum%20seti.png',
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum%20seti.png',
    imageDetail2: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum%20seti.png',
    imageDetail3: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/mum%20seti.png',
    description: 'Noir Calm Mum Seti, farklı boyutlardaki üç parçadan oluşur. Birlikte kullanıldığında dengeli ve sofistike bir dekoratif görünüm sunar.',
    description_en: 'Noir Calm Candle Set consists of three pieces in different sizes. When used together, it offers a balanced and sophisticated decorative look.',
    features: [
        'Set İçeriği: 3 adet mum', 
        'Stil: Minimal', 
        'Kullanım: Dekoratif & ambiyans'
    ],
    features_en: [
        'Set Content: 3 candles',
        'Style: Minimal',
        'Usage: Decorative & ambiance'
    ]
  },
  // 9. SIRADA: LINEN CALM JÜT HALI (ID 1)
  {
    id: 1,
    name: 'LINEN CALM JÜT HALI',
    name_en: 'LINEN CALM JUTE RUG',
    category: 'HALI',
    category_en: 'RUGS',
    price: 4899.00,
    imageMain: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/hal%C4%B1.png', 
    imageHover: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/hal%C4%B1%202.png', 
    imageDetail2: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/hal%C4%B1%202.png', 
    imageDetail3: 'https://raw.githubusercontent.com/Aybukehso/petra-images/main/hal%C4%B1%202.png', 
    description: 'Linen Calm Jüt Halı, doğal lif dokusu ve yumuşak renk tonlarıyla yaşam alanlarında sade bir denge oluşturur. Zamansız tasarımı sayesinde salon, çalışma alanı ve yatak odalarında rahatlıkla kullanılabilir.',
    description_en: 'Linen Calm Jute Rug creates a simple balance in living spaces with its natural fiber texture and soft color tones. Thanks to its timeless design, it can be easily used in the living room, workspace, and bedroom.',
    features: [
        'Malzeme: Jüt', 
        'Dokuma: Düz dokuma', 
        'Renk: Doğal krem tonları', 
        'Stil: Minimal / Doğal', 
        'Kullanım: İç mekân'
    ],
    features_en: [
        'Material: Jute',
        'Weave: Flat weave',
        'Color: Natural cream tones',
        'Style: Minimal / Natural',
        'Usage: Indoor'
    ]
  },
];