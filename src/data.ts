import { Friend, Connection, FAQItem, SoftwareItem, StackItem, Contributor } from './types';

export const aboutWebHtml = `
  <p class="text-slate-300 leading-relaxed text-sm md:text-base">
    Selamat datang di <span class="text-cyan-400 font-mono font-bold">NesiNezz's Website Connection</span>. 
    Platform ini dirancang khusus sebagai jembatan intervensi data personal, jaringan pertemanan (Friendlist), serta integrasi media sosial secara dinamis. 
    Dengan arsitektur cybernetic, kami menggabungkan modul neon estetik berbasis 
    <span class="text-yellow-400 font-mono">Tailwind CSS</span> dan fungsionalitas reaktif 
    <span class="text-pink-400 font-mono">React / TypeScript</span>.
  </p>
  <p class="text-slate-400 leading-relaxed mt-3 text-xs md:text-sm">
    Sistem ini memfasilitasi akses database virtual lokal yang aman dengan enkripsi estetika tingkat tinggi. 
    Anda dapat menavigasi berkas koneksi media sosial pemrogram secara instan tanpa perlu memutus konektivitas utama, mempertahankan sesi interaktif tetap utuh saat menjelajahi dunia cybernetic virtual kami.
  </p>
`;

export const aboutWebHtmlEn = `
  <p class="text-slate-300 leading-relaxed text-sm md:text-base">
    Welcome to <span class="text-cyan-400 font-mono font-bold">NesiNezz's Website Connection</span>. 
    This platform is specifically designed as a dynamic bridge for personal database intervention, friend network tracking, and social media integration. 
    Utilizing cybernetic architecture, we combine aesthetic neon modules based on 
    <span class="text-yellow-400 font-mono">Tailwind CSS</span> and reactive functionalities powered by 
    <span class="text-pink-400 font-mono">React / TypeScript</span>.
  </p>
  <p class="text-slate-400 leading-relaxed mt-3 text-xs md:text-sm">
    This system facilitates a secure virtual local database with aesthetic, high-grade encryption. 
    You can instantly navigate through the developer's social connections without dropping the primary connection, keeping your interactive session intact as you venture into our cybernetic virtual world.
  </p>
`;

export const contributors: Contributor[] = [
  {
    id: 'c1',
    name: 'Nesinezz',
    role: ['Owner', 'Web Development', 'Dragon :v'],
    role_en: ['Owner', 'Web Development', 'Dragon :v'],
    specs: 'Intel Core9 v-Pro // System Overlord & Core Developer',
    specs_en: 'Intel Core9 v-Pro // System Overlord & Core Developer',
    avatarSeed: 'nesinezz',
    avatarUrl: 'https://d.uguu.se/cgahxrjH.jpg',
    handle: '@NesNezz_Overlord',
    bio: "Saya adalah programmer fullstack otodidak dan penjelajah keamanan gray hat. Sangat tertarik dengan synthwave, fursuiting, terminal konsol kontras tinggi, dan estetika furry.",
    bio_en: "I'm a self-taught fullstack programmer and gray hat security explorer. Fascinated by synthwave, fursuiting, high-contrast console terminals, and furry aesthetics.",
    email: 'Nesxxxxx@gmail.com',
    phone: '+62xxxxxxxxx',
    location: 'Java Grid Node, Jakarta // Indonesia',
    location_en: 'Java Grid Node, Jakarta // Indonesia',
    registration: 'SYSTEM_ACCESS_EST_2018'
  },
  {
    id: 'c2',
    name: 'Rezxx',
    role: ['Assistant', 'Web Design'],
    role_en: ['Assistant', 'Web Design'],
    specs: 'RTX 5090 // High-Fidelity Creative UI Designer',
    specs_en: 'RTX 5090 // High-Fidelity Creative UI Designer',
    avatarSeed: 'rezxx',
    avatarUrl: 'https://n.uguu.se/ZoKjkLKu.jpg'
  },
  {
    id: 'c3',
    name: 'Arthur',
    role: ['Donator', 'Cyber Security', 'Programmer'],
    role_en: ['Donor', 'Cyber Security', 'Programmer'],
    specs: 'Quantum Security Core // Network Protocols Guard',
    specs_en: 'Quantum Security Core // Network Protocols Guard',
    avatarSeed: 'arthur',
    avatarUrl: 'https://h.uguu.se/uwnbiuXP.jpg'
  }
];

export const softwareList: SoftwareItem[] = [
  {
    id: 's1',
    name: 'Neural Link Audio Core',
    version: 'v2.4.9-Stable',
    type: 'WebAudio Synth',
    type_en: 'WebAudio Synth',
    status: 'ONLINE',
    description: 'Modul audio ambient dengan modulasi volume khusus, start/pause, dan pemutaran audio loop bertema terminal.',
    description_en: 'Ambient audio module with custom volume modulation, playback control, and loop playback with terminal skin themes.'
  },
  {
    id: 's2',
    name: 'Cryptographic Friend-Map',
    version: 'v4.1.0-Beta',
    type: 'GUI Canvas Map',
    type_en: 'GUI Canvas Map',
    status: 'SYS_ACTIVE',
    description: 'Sistem visualisasi silsilah pertemanan dengan auto-expand card neon yang disesuaikan berdasarkan tier pertemanan.',
    description_en: 'Friend lineage visualizer featuring neon auto-expand cards catered according to relation tiers.'
  },
  {
    id: 's3',
    name: 'Auto-Handshake Tunnel',
    version: 'v9.8.4',
    type: 'Tunnel Proxy',
    type_en: 'Tunnel Proxy',
    status: 'COMPLETED',
    description: 'Modul koneksi media sosial dengan latensi terkendali dan animasi transisi lateral terbang-masuk.',
    description_en: 'Interactive social tunnels utilizing latency control with lateral flying-in entry transition physics.'
  }
];

export const techStack: StackItem[] = [
  { id: 'st1', name: 'React 19 & TypeScript', category: 'Framework', category_en: 'Framework', proficiencyLevel: 95, color: 'from-cyan-500 to-indigo-500' },
  { id: 'st2', name: 'Tailwind CSS v4', category: 'Styling Engine', category_en: 'Styling Engine', proficiencyLevel: 90, color: 'from-cyan-400 to-teal-400' },
  { id: 'st3', name: 'Framer Motion (motion)', category: 'Animation Physics', category_en: 'Animation Physics', proficiencyLevel: 88, color: 'from-pink-500 to-purple-500' },
  { id: 'st4', name: 'Web Audio Synth Engine', category: 'Acoustic UI', category_en: 'Acoustic UI', proficiencyLevel: 85, color: 'from-yellow-400 to-amber-500' }
];

export const faqs: FAQItem[] = [
  {
    id: 'fq1',
    question: 'Apa tujuan utama dari NesiNezz Connection System?',
    question_en: 'What is the key purpose of the NesiNezz Connection System?',
    answer: 'Menghubungkan entitas pertemanan personal (termasuk rekan Furry/Fursuiters, Administrator, Programmers) dalam satu dasbor cybernetic interaktif. Memudahkan navigasi tautan media sosial secara instan tanpa meninggalkan portal utama.',
    answer_en: 'To connect personal friend entities (including Furry/Fursuiters, Administrators, and Programmers) inside a single scannable cybernetic dashboard. Facilitates instant navigation to social media networks without leaving the primary system landing gate.'
  },
  {
    id: 'fq2',
    question: 'Mengapa terdapat skema warna border yang berbeda?',
    question_en: 'Why are there different border color schemes?',
    answer: 'Kami mengkategorikan koneksi pertemanan berdasarkan intensitas relasi. Border Cyan melambangkan teman biasa/rekan, Border Gold mengkilap melambangkan Sahabat terpercaya, sedangkan Border Ungu-ke-Pink melambangkan Relationship khusus.',
    answer_en: 'We categorize friend connections based on relationship levels. Cyan borders represent regular friends/connections, shiny Gold borders represent trusted close Best Friends, while Purple-to-Pink borders represent a special Relationship.'
  },
  {
    id: 'fq3',
    question: 'Bagaimana cara memutar musik latar belakang?',
    question_en: 'How do I play the background audio track?',
    answer: 'Gunakan panel widget Cyber Player di bagian atas dasbor. Anda dapat menekan tombol PLAY/PAUSE, menyetel volume melalui slide-bar berkilau, dan melihat visualizer audio yang aktif menyala dalam waktu nyata.',
    answer_en: 'Utilize the Cyber Player widget at the header of the dashboard. Trigger the PLAY/PAUSE button anytime, modulate current volume via the shining slider-bar, and view real-time auditory pulses cascading in the visual screen.'
  },
  {
    id: 'fq4',
    question: 'Siapakah NesiNezz?',
    question_en: 'Who is NesiNezz?',
    answer: 'NesiNezz adalah seorang Web Developer, Programmer, Gray Hat enthusiast, dan anggota komunitas Furry yang menyukai desain bercorak Cyberpunk, Synthwave, dan Neon Interface.',
    answer_en: 'NesiNezz is a Web Developer, Programmer, Gray Hat enthusiast, and Furry community member who is fascinated with Cyberpunk art, Synthwave themes, and Neon UI aesthetics.'
  }
];

export const friends: Friend[] = [
  {
    id: "fr1",
    name: "Pink salsabila layla (Layla)",
    species: "Hybrid Wolf & Dragon",
    species_en: "Hybrid Wolf & Dragon",
    avatarUrl: "https://images.unsplash.com/photo-1510853675831-4555f15b1980?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Seorang hibrida Wolf - Dragon berpenampilan pink energetik dengan ekor menyala layaknya Charmander.",
    bio_en: "A hybrid pink Wolf - Dragon showing high energy profiles with a flaming tail tip inspired by Charmander.",
    characteristics: [
      "Memiliki warna tubuh pink yang sangat mencolok dan imut.",
      "Memiliki dua pasang tanduk putih yang tegak berdiri di kepala.",
      "Terdapat corak warna ungu hiasan di bagian kedua pipinya.",
      "Gaya santai menggunakan hoodie tebal dipadukan dengan celana baggy jeans.",
      "Ekor berbulu pink lebat layaknya Charmander dengan ujung api menyala berwarna ungu."
    ],
    characteristics_en: [
      "Very striking and cute pink body coloration.",
      "Two pairs of white horns standing erect on the head.",
      "Purple decorative trace patterns adorning both cheeks.",
      "Relaxed casual fit with thick hoodie styled with baggy denim jeans.",
      "A dense pink feathered tail resembling Charmander with a purple flaming tip."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/rezkya_35?igsh=MW84b2xnZXJjemh2bA==", label: "@rezkya_35" }
    ]
  },
  {
    id: "fr2",
    name: "Hieronimus Lidon",
    species: "Hibrida Singa & Smilodon",
    species_en: "Prehistoric Lion & Smilodon Hybrid",
    avatarUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Singa Prasejarah Smilodon hibrida dengan kombinasi bulu menawan serta hobi menyantap buah-buahan.",
    bio_en: "A prehistoric hybrid lion Smilodon displaying exquisite fur coordinates with fruit-loving appetites.",
    characteristics: [
      "Warna bulu v1: coklat, coklat muda, dan cream dengan hidung berwarna pink.",
      "Warna bulu v2 (upgrade): kuning-cream, coklat, dan cream dengan hidung pink.",
      "Warna mata heterochromia unik: mata kiri biru langit, mata kanan cokelat kayu.",
      "Makanan favorit: pisang manis, buah apel segar, serta cokelat batang manis."
    ],
    characteristics_en: [
      "Fur colorway v1: brown, light brown, cream base with a pink nose accessory.",
      "Fur colorway v2 (upgraded): yellow-cream, brown, cream base keeping the pink nose.",
      "Unique heterochromatic irises: sky blue left eye, timber brown right eye.",
      "Preferred treats: sweet bananas, fresh crisp apples, and sweet chocolate bars."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/hieronimuslidon?igsh=NWx0a3RvMHVrMzJ5", label: "@hieronimuslidon" }
    ]
  },
  {
    id: "fr3",
    name: "Minthy",
    species: "Hybrid Wolf Inu",
    species_en: "Hybrid Wolf Inu",
    avatarUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Anjing serigala berpenampilan dandy berkacamata pilot dengan selera alas kaki bermerek lokal.",
    bio_en: "A sleek dandy wolf dog rocking specialized pilot goggles with customized tastes in local footwear.",
    characteristics: [
      "Milik warna bulu biru putih bersih dengan sorot mata cokelat hangat.",
      "Menampilkan ekspresi mata sedikit marah yang keren sekaligus menggemaskan.",
      "Selalu memakai kacamata pilot cokelat retro di kepalanya.",
      "Mengenakan sweater warna biru navy berkerah cokelat hangat.",
      "Gaya sepatu trendy (sepatu merk Wallace atau Aerostreet mirip model Nike Air 1)."
    ],
    characteristics_en: [
      "Crisp blue and clean white fur coat matched with warm brown gaze.",
      "Shows a slightly angry yet charmingly adorable eye expression.",
      "Always sporting brown retro pilot aviators on the head.",
      "Dressed in navy blue sweater displaying warm brown collar highlights.",
      "Trendy shoe setup (Wallace or Aerostreet local footwear styling resembling Air Force 1)."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/iam.minthy?igsh=dmhkNTZ4MnpyYWI2", label: "@iam.minthy" }
    ]
  },
  {
    id: "fr4",
    name: "Rocque",
    species: "Naga (Dragon)",
    species_en: "Kemono Dragon",
    avatarUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Naga berpenampilan kemono mengkilap yang gemar bersantai di kedai burger lokal.",
    bio_en: "A shiny Kemono-styled dragon who loves chilling and getting snacks at a local joint.",
    characteristics: [
      "Berwujud naga kemono imut dengan 2 tanduk kokoh di kepala.",
      "Memiliki rambut biru stylish dengan telinga warna biru tua berujung oranye.",
      "Terdapat tato bermotif ganda \"<<\" di bagian pipi kirinya.",
      "Sangat menyukai makanan cepat saji berupa cheeseburger dan kentang goreng renyah."
    ],
    characteristics_en: [
      "Adorable Kemono dragon form sporting 2 solid horns on the head.",
      "Has stylish blue hair with deep-blue ears tipped with bold orange.",
      "A dual \"<<\" tattoo mark adorns his left cheek block.",
      "Deeply loves fast food treats, specifically cheeseburgers and crispy fries."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/furry_rocque?igsh=bmoyZjA3ZDg1dnF2", label: "@furry_rocque" }
    ]
  },
  {
    id: "fr5",
    name: "Kaiishou Shiinarii (Shii/Kaiishii)",
    species: "Orange Dragon Kemono",
    species_en: "Orange Dragon Kemono",
    avatarUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Naga termuda bergelar The King of Pengendali Saham yang mendominasi bursa keuangan wilayahnya.",
    bio_en: "The youngest dragon crowned 'The King of Stock Arbitrage' guiding his region's financial stock indexes.",
    characteristics: [
      "Outfit andalan: Berkacamata bulat dengan setelan Jas Putih rapi lengkap.",
      "Merupakan naga paling muda di wilayah kekaisaran Kaienrida.",
      "Pemberani yang mencatatkan rekor mendapat gelar \"The King of Pengendali Saham\" pertama."
    ],
    characteristics_en: [
      "Signature outfit: Round glasses alongside a pristine white business suit.",
      "Stands out as the youngest dragon inside the Kaienrida empire territory.",
      "Courageously registered first record holder for 'The King of Stock Arbitrage' award."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/shiiwashere_?igsh=MWoyaG01Y3J4cDZ5MA==", label: "@shiiwashere_" }
    ]
  },
  {
    id: "fr6",
    name: "Malvin Relz Harry",
    species: "Wolf (Serigala)",
    species_en: "Black-White Wolf",
    avatarUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Serigala monokrom dengan ujung bulu kebiruan dan cap tanda bintang kosmik di bahunya.",
    bio_en: "A monochrome wolf featuring blue-hued fur extremities and a stellar star tattoo mark on his shoulder.",
    characteristics: [
      "Sosok serigala hitam putih gagah dengan paduan corak biru di bagian ujung bulu.",
      "Memiliki tanda bintang (star pattern) unik di bahu tangan sebagai ciri khas utama."
    ],
    characteristics_en: [
      "Sleek black-and-white wolf with blue hues lining the fur tips.",
      "Equipped with a primary unique star emblem pattern on his forearm plate."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/malvinthefurr?igsh=MThtMjBkZGozeTk1Ng==", label: "@malvinthefurr" }
    ]
  },
  {
    id: "fr7",
    name: "Kairu Xhintaka (Xhin/Kai)",
    species: "Rubah (Kitsune)",
    species_en: "White Kitsune Fox",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Rubah kitsune bermata tajam dengan setelan monokrom misterius yang gemar memakai masker.",
    bio_en: "A sharp-eyed Kitsune fox styled in a mysterious monochrome fit and signature face coverage.",
    characteristics: [
      "Gaya rambut berwarna putih acak-acakan (messy style) yang keren.",
      "Mata berwarna merah membara dengan sorot mata yang tajam dan misterius.",
      "Telinga rubah di atas kepala berwarna dominan putih berpadu aksen merah.",
      "Ekor lebat besar di belakang dengan perpaduan warna putih dan merah noda.",
      "Pakaian serba monokrom: Atasan hitam oversized, masker/syal hitam, celana putih."
    ],
    characteristics_en: [
      "Rocking a very stylish loose and messy white head hair presentation.",
      "Fiery crimson eyes projecting a sharp and mysterious focused gaze.",
      "Fox ears on head bearing white tones combined with customized red tips.",
      "Dense fluffy tail in back showing beautiful white and red splashes.",
      "Complete monochrome uniform: Oversized black top, black face scarf, clean white denim."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/kairu_xhintaka?igsh=MTc5YjJ1Mjc4MXppcg==", label: "@kairu_xhintaka" }
    ]
  },
  {
    id: "fr8",
    name: "Lewis Welby",
    species: "Kemono Rubah",
    species_en: "Furry Fox Kemono",
    avatarUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Rubah dwi-warna berpostur twink yang hobi membaca buku dan menggoda tuannya.",
    bio_en: "A vibrant dual-tone fox with a sleek slender model who loves flipping pages and teasing his master.",
    characteristics: [
      "Rubah dengan kombinasi warna merah dan biru, bagian tangan berwarna merah tegas.",
      "Memiliki bentuk fisik ramping (twink body) yang cekatan.",
      "Sangat gemar membaca buku cerita tebal serta suka menjahili menggoda tuannya."
    ],
    characteristics_en: [
      "Furry fox highlighting a bold layout of red and blue with solid crimson arms.",
      "Lightweight twink physical framework built for rapid, playful activities.",
      "Enjoys diving deep into hardback novels and gently teasing his human mentor."
    ],
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@fcthelewis0?is_from_webapp=1&sender_device=pc", label: "@fcthelewis0" }
    ]
  },
  {
    id: "fr9",
    name: "Dreadsdensetsu",
    species: "Fennec Fox (Rubah Gurun)",
    species_en: "Desert Fennec Fox",
    avatarUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Rubah fennec berbulu kuning cerah dengan gradasi ujung putih dan sorot mata sebiru langit.",
    bio_en: "A sweet golden-yellow fennec fox showing clean white gradients on all tips and eyes like clear horizons.",
    characteristics: [
      "Berwarna kuning cerah dan putih sejuk di bagian bulu tubuh.",
      "Memiliki corak warna putih bersih di setiap ujung telinga, ekor, tangan, dan kaki.",
      "Mata bersinar terang berwarna sebiru langit cerah."
    ],
    characteristics_en: [
      "Bright golden fields of yellow layered with snow white undercoat fur.",
      "Decorated beautifully with clean white tips on ears, tail, forearms, and claws.",
      "Reflects spectacular round eyes carrying the colors of a calm summer sky."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/dreadsdensetsu?igsh=NjIzMmZtMnR4Z2Fz", label: "@dreadsdensetsu" }
    ]
  },
  {
    id: "fr10",
    name: "AlonySky (Alony/Sky)",
    species: "Naga Reptil",
    species_en: "Reptile Dragon",
    avatarUrl: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=400&auto=format&fit=crop&q=80",
    type: "pacar",
    bio: "⚠️ SPESIAL RELATIONSHIP ⚠️ Naga reptil ungu anggun bertindik emas dengan pembawaan formal kharismatik.",
    bio_en: "⚠️ SPECIAL RELATIONSHIP ⚠️ Elegant purple reptile dragon with gold piercings and a charismatic formal demeanor.",
    characteristics: [
      "Naga Reptil berwarna ungu kontras berpaku tanduk dan duri warna ungu gelap.",
      "Terdapat dua buah tindik anting emas di bagian alis mata kirinya.",
      "Memakai cincin emas melingkar rapi di masing-masing jari manisnya.",
      "Tanduk di kepala tidak melengkung biasa, melainkan berbelok tajam mencolok.",
      "Berjari tangan 5 buah (bukan 4), dengan ekor berambut ungu terang panjang.",
      "Format kepala memiliki kuncir kuda rambut panjang (opsi kuncung botak diperkenankan).",
      "Lidah terbelah ganda di bagian tengah seperti ular, bersayap naga hebat.",
      "Mengenakan kacamata berbingkai persegi dengan rantai gantungan emas gaya dandy."
    ],
    characteristics_en: [
      "Contrast purple reptile dragon spiked with dark purple horns and spine ridges.",
      "Two gold eyebrow ring piercings on the left eye brow.",
      "Wearing neat circular gold rings on each ring finger.",
      "Horns on head bend sharply instead of curving normally, creating a striking focal point.",
      "Five fingers instead of four on each hand, alongside a tail with long bright purple hair.",
      "Head features a long ponytail (clean-shaved dome options permitted).",
      "Snake-like split tongue bifurcating in the middle, matched with grand dragon wings.",
      "Wears square-framed spectacles styled with dandy gold linkage chains."
    ],
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@alonysky?_r=1&_t=ZS-96Tq784Voc3", label: "@alonysky" }
    ]
  },
  {
    id: "fr11",
    name: "Xavia \"Exfive\" Nürhart",
    species: "Akita Inu × Dragon Hybrid",
    species_en: "Akita Inu × Dragon Hybrid",
    avatarUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Hybrid anjing Akita dan Naga betina yang chaotic, protektif, dan loyal luar biasa.",
    bio_en: "A beautiful Akita Inu and dragon hybrid listing high-agility specs, extreme loyalty, and protective charm.",
    characteristics: [
      "Bulu abu-abu putih lembut dikombinasikan aksen merah maroon gelap.",
      "Telinga lebar khas Akita Inu disertai tanduk naga berukuran kecil.",
      "Taring tajam berbaris dengan pola penanda khusus \"X\" dan \"5\" di tubuh.",
      "Ekor tebal nan mengembang kemerahan selembut awan naga.",
      "Sifat dasar: Geometric chaotic, penuh canda ceria, defensif protektif, dan loyal."
    ],
    characteristics_en: [
      "Soft gray and stark white fur coats highlighted with crimson maroon tracks.",
      "Large alert Akita ears accompanied by mini crown dragon horns.",
      "Endearing fangs showing clean signature branding markings \"X\" and \"5\".",
      "Thick fluffy tail displaying red fiery dragon scales undercoat.",
      "Personality indicators: High energy chaotic, cheerful playfulness, and high-fidelity loyalty."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/exfiveturbo?igsh=ZWVnMnJqZHdrZGx0", label: "@exfiveturbo" }
    ]
  },
  {
    id: "fr12",
    name: "Eric Savior",
    species: "Fox (Rubah)",
    species_en: "Smart Red Fox",
    avatarUrl: "https://images.unsplash.com/photo-1475809913362-28a064062ccd?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Rubah oranye berambut putih dengan seulas gradasi emas berkilau di ujung rambutnya.",
    bio_en: "A smart dandy orange fox whose pristine white hair is tipped with beautiful gold gradients.",
    characteristics: [
      "Bulu rubah oranye mengkilat khas hutan pinus.",
      "Gaya rambut putih bersih dengan sentuhan rona emas menyilaukan di bagian ujung rambut."
    ],
    characteristics_en: [
      "Radiant forest orange fur coat with sharp smart facial configurations.",
      "Dashing white hairstyle capped with glittering golden transition tips on top."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/ericsavior_fox?utm_source=qr&igsh=dnozYXpleDBjdGNn", label: "@ericsavior_fox" }
    ]
  },
  {
    id: "fr13",
    name: "Spot Dalmatian",
    species: "Anjing (Dalmatian)",
    species_en: "Dalmatian Dog",
    avatarUrl: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Anjing Dalmatian manja berbintik hitam yang ramah dan suka mencari perhatian.",
    bio_en: "A beautiful, spoiled Dalmatian pup layered in black spot circles, radiating high friendliness.",
    characteristics: [
      "Berasal dari ras anjing dalmatian dengan corak bintik hitam agak besar di sekujur tubuh.",
      "Sangat menyukai elusan di kepala dan memiliki sifat manja (spoiled pup) tinggi."
    ],
    characteristics_en: [
      "Bred from Dalmatian canine roots displaying elegant black circular spot arrays.",
      "Has a deeply affectionate, highly sweet spoiled nature seeking regular cuddles."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/spots_dalmation?igsh=MTdiNzQ2eW13MzhqZg==", label: "@spots_dalmation" }
    ]
  },
  {
    id: "fr14",
    name: "Aubrey Virtual",
    species: "Wolf (Serigala)",
    species_en: "Cyber White Wolf",
    avatarUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80",
    type: "sahabat",
    bio: "⚠️ SPESIAL SAHABAT ⚠️ Serigala putih bermata dwi-warna merah-biru yang menyukai kekuatan dari kristal benderang.",
    bio_en: "⚠️ BEST FRIEND ⚠️ Majestic white wolf with heterochromatic red-blue eyes who embraces the energy of radiant glowing crystals.",
    characteristics: [
      "Serigala putih salju anggun dengan ekor tebal berwarna senada.",
      "Selalu memakai masker hitam penutup moncong khas bernilai taktis.",
      "Mata heterochromia: Kanan sebiru kristal, kiri merah darah disertai bekas luka goresan.",
      "Tertarik mengoleksi batuan kristal bercahaya terang yang memiliki aliran energi."
    ],
    characteristics_en: [
      "Graceful snow white wolf with matching dense white tail.",
      "Always sporting a signature tactical black muzzle mask.",
      "Heterochromatic eyes: right crystal blue, left blood red with a facial scar.",
      "Passionate about collecting luminous glowing crystals carrying energy flows."
    ],
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@aubrey_virtual?_r=1&_t=ZS-96mv5qcqNFA", label: "@aubrey_virtual" }
    ]
  },
  {
    id: "fr15",
    name: "CapruK",
    species: "Hiu (Shark)",
    species_en: "Reef White-Blue Shark",
    avatarUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&auto=format&fit=crop&q=80",
    type: "sahabat",
    bio: "⚠️ SPESIAL SAHABAT ⚠️ Hiu putih kebiruan tangguh berpakaian gelap misterius dengan aura petualang pemberani.",
    bio_en: "⚠️ BEST FRIEND ⚠️ Tough white-blue shark clad in mysterious dark clothes with a bold adventurous aura.",
    characteristics: [
      "Fisik hiu putih kebiruan mulus dengan bagian punggung dan sirip atas berwarna biru muda.",
      "Moncong putih perkasa dengan barisan gigi tajam mencolok benderang siap tempur.",
      "Sepasang mata hitam legam dengan pandangan tajam, waspada, gagah, dan berkarisma.",
      "Setup kostum berwarna serba gelap laksana pengembara malam tangguh."
    ],
    characteristics_en: [
      "Smooth blue-white shark body with light blue back and upper fins.",
      "Powerful white snout showcasing bright razor-sharp teeth primed for battle.",
      "Solid dark eyes projecting sharp, alert, brave, and charismatic gazes.",
      "A completely black outfit setup mimicking a resilient night voyager."
    ],
    socials: [
      { platform: "YouTube", url: "https://www.youtube.com/@capruksihiu", label: "@capruksihiu" }
    ]
  },
  {
    id: "fr16",
    name: "Biorix Demos F.",
    species: "Tigershark (Hiu Macan)",
    species_en: "Muscular Tiger Shark",
    avatarUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Hiu harimau berambut merah membara dan berpostur atletik maskulin.",
    bio_en: "A broad-shouldered gray-shaded tiger shark showing high flame red hair streams and powerful swimming models.",
    characteristics: [
      "Berwarna abu-abu kegelapan bergaris loreng hiu macan merah menyala di sekujur tubuh.",
      "Memiliki rambut merah menyala terang berukuran tegap masculine nan berotot.",
      "Mata merah kecoklatan yang dikelilingi siluet hitam tajam berdaya magis.",
      "Ekor hiu fleksibel yang panjang ukurannya dapat bertambah lebar/panjang elastis."
    ],
    characteristics_en: [
      "Dark charcoal-gray shade with neon glowing red tiger stripe bands traversing his body.",
      "Presents thick red hair coordinates matched with a highly masculine build.",
      "Reddish brown eyes highlighted with stylish shadowy cosmetic lines.",
      "Flexible tail section engineered to alter its physical length."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/thereal_fxu?igsh=c2IyYmNsZ25ndWQ5", label: "@thereal_fxu" }
    ]
  },
  {
    id: "fr17",
    name: "Reykie",
    species: "Tiger (Harimau)",
    species_en: "Sleepy Cute Tiger",
    avatarUrl: "https://images.unsplash.com/photo-1474447976065-65d239025377?w=400&auto=format&fit=crop&q=80",
    type: "normal",
    bio: "Harimau tidur imut yang selalu penasaran dengan hal baru namun sangat malas bergerak.",
    bio_en: "An extremely adorable, cozy sleeping tiger who stays curious about novelties but loves rolling around.",
    characteristics: [
      "Harimau bermuka tembem imut, bersahabat, lucu, dan penyayang hal menggemaskan.",
      "Hobi mutlak: Tidur seharian, malas bergerak (rebahan mode) tanpa batas waktu.",
      "Bila terganggu, tidak menggigit, melainkan bersiap langsung ditelan bulat-bulat!"
    ],
    characteristics_en: [
      "Adorably round features foxing as an extremely friendly cozy tiger face layout.",
      "Absolute favorite hobby: sleeping all day, active laziness (prolonged bed rest).",
      "If bothered, does not bite—simply prepares to swallow the attacker whole."
    ],
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@something_spy?_r=1&_t=ZS-96nRfETvEzF", label: "@something_spy" }
    ]
  }
];

export const connections: Connection[] = [
  {
    id: 'c1',
    platform: 'Instagram Creative',
    url: 'https://www.instagram.com/nesi_dragon?igsh=ZnMxb3lsbzAyaDVn',
    handle: '@nesi_dragon',
    color: '#ec4899', // pink neon
    iconName: 'Instagram',
    status: 'SYNCED_STABLE'
  },
  {
    id: 'c2',
    platform: 'Barq Furry Node',
    url: 'https://barq.app/@NesiDrax',
    handle: '@NesiDrax',
    color: '#f97316', // Barq orange neon
    iconName: 'Zap',
    status: 'STABLE_LINK'
  },
  {
    id: 'c3',
    platform: 'TikTok Broadcast',
    url: 'https://www.tiktok.com/@nesinezz_?_r=1&_t=ZS-97MlW1bFqnl',
    handle: '@nesinezz_',
    color: '#25f4ee', // TikTok bright cyan
    iconName: 'Music',
    status: 'FEED_ACTIVE'
  }
];
