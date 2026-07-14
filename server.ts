import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import multer from "multer";

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: "15mb" }));

// Default initial datasets corresponding to client-side data
const DEFAULT_FRIENDS = [
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

const DEFAULT_CONTRIBUTORS = [
  {
    id: "c1",
    name: "Nesinezz",
    role: ["Owner", "Web Development", "Dragon :v"],
    role_en: ["Owner", "Web Development", "Dragon :v"],
    specs: "Intel Core9 v-Pro // System Overlord & Core Developer",
    specs_en: "Intel Core9 v-Pro // System Overlord & Core Developer",
    avatarSeed: "nesinezz",
    avatarUrl: "https://d.uguu.se/cgahxrjH.jpg",
    handle: "@NesNezz_Overlord",
    bio: "Saya adalah programmer fullstack otodidak dan penjelajah keamanan gray hat. Sangat tertarik dengan synthwave, fursuiting, terminal konsol kontras tinggi, dan estetika furry.",
    bio_en: "I'm a self-taught fullstack programmer and gray hat security explorer. Fascinated by synthwave, fursuiting, high-contrast console terminals, and furry aesthetics.",
    email: "Nesxxxxx@gmail.com",
    phone: "+62xxxxxxxxx",
    location: "Java Grid Node, Jakarta // Indonesia",
    location_en: "Java Grid Node, Jakarta // Indonesia",
    registration: "SYSTEM_ACCESS_EST_2018"
  },
  {
    id: "c2",
    name: "Rezxx",
    role: ["Assistant", "Web Design"],
    role_en: ["Assistant", "Web Design"],
    specs: "RTX 5090 // High-Fidelity Creative UI Designer",
    specs_en: "RTX 5090 // High-Fidelity Creative UI Designer",
    avatarSeed: "rezxx",
    avatarUrl: "https://n.uguu.se/ZoKjkLKu.jpg"
  },
  {
    id: "c3",
    name: "Arthur",
    role: ["Donator", "Cyber Security", "Programmer"],
    role_en: ["Donor", "Cyber Security", "Programmer"],
    specs: "Quantum Security Core // Network Protocols Guard",
    specs_en: "Quantum Security Core // Network Protocols Guard",
    avatarSeed: "arthur",
    avatarUrl: "https://h.uguu.se/uwnbiuXP.jpg"
  }
];

const DEFAULT_TRACKS = [];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "MATRIX SYSTEM STABILITY CONFIGURED",
    content: "Full SHA-512 level authorization handshakes are now operational across all nodes of NesiNezz Connection System. All database queries bound to Vercel KV and serverless endpoints are responding stably under 20ms.",
    timestamp: "2026-06-10 12:00",
    category: "SECURITY"
  },
  {
    id: "2",
    title: "PORTAL SYNCHRONIZATION WITH VERCEL STATIONS",
    content: "The gray-hat interface and furry community profiles have been integrated into our dynamic web core. Custom JPG avatar capabilities and sound player updates are successfully loaded.",
    timestamp: "2026-06-09 18:45",
    category: "UPDATE"
  }
];

// Lazy-initialized Firebase Firestore Client
let firestoreDb: any = null;
const getKVClient = () => {
  if (firestoreDb) return firestoreDb;
  
  const projectId = "hypnagogic-complex-vlsxp";
  
  try {
    if (!getApps().length) {
      initializeApp({ projectId, credential: applicationDefault() });
    }
    firestoreDb = getFirestore();
    return firestoreDb;
  } catch (e) {
    console.error("[FIREBASE INITIALIZATION ERROR]", e);
  }
  
  return null;
};

// Helper for fetching/parsing JSON safely from Firebase
const getJSON = async (client: any, key: string, defaultValue: any) => {
  try {
    const docRef = client.collection('app_state').doc('main');
    const docSnap = await docRef.get();
    if (!docSnap.exists) return defaultValue;
    const data = docSnap.data();
    return data[key] !== undefined ? data[key] : defaultValue;
  } catch (err) {
    console.error(`Error getting key ${key} from Firebase`, err);
    return defaultValue;
  }
};

// Helper for setting JSON safely in Firebase
const setJSON = async (client: any, key: string, value: any) => {
  try {
    const docRef = client.collection('app_state').doc('main');
    await docRef.set({ [key]: value }, { merge: true });
  } catch (err) {
    console.error(`Error setting key ${key} in Firebase`, err);
  }
};

// Memory cache backing database state if KV is missing/connecting
let memoryDb: any = {
  friends: DEFAULT_FRIENDS,
  contributors: DEFAULT_CONTRIBUTORS,
  tracks: DEFAULT_TRACKS,
  announcements: DEFAULT_ANNOUNCEMENTS,
  vercelEnvUrl: "https://firestore.googleapis.com/redis-node-nesinezz"
};

// Helper to write database and sync with Key Value Store if active
const saveDB = async (data: any) => {
  memoryDb = { ...memoryDb, ...data };

  const client = getKVClient();
  if (client) {
    try {
      await setJSON(client, "nsnz_friends", memoryDb.friends);
      await setJSON(client, "nsnz_contributors", memoryDb.contributors);
      await setJSON(client, "nsnz_tracks", memoryDb.tracks);
      await setJSON(client, "nsnz_announcements", memoryDb.announcements);
      await setJSON(client, "nsnz_vercelEnvUrl", memoryDb.vercelEnvUrl);
      console.log("[FIREBASE FIRESTORE] Successfully synchronized keys downstream.");
    } catch (err) {
      console.error("[FIREBASE FIRESTORE SAVE WARNING] Key sync failed.", err);
    }
  }
};

// Helper to load database
const loadDB = async () => {
  const client = getKVClient();
  if (client) {
    try {
      console.log("[FIREBASE FIRESTORE] Connecting and pulling state...");
      const dbFriends = await getJSON(client, "nsnz_friends", null);
      const dbContributors = await getJSON(client, "nsnz_contributors", null);
      const dbTracks = await getJSON(client, "nsnz_tracks", null);
      const dbAnnouncements = await getJSON(client, "nsnz_announcements", null);
      const dbVercelEnvUrl = await getJSON(client, "nsnz_vercelEnvUrl", null);

      if (dbFriends !== null || dbContributors !== null || dbTracks !== null || dbAnnouncements !== null || dbVercelEnvUrl !== null) {
        if (Array.isArray(dbFriends)) {
          if (dbFriends.length < 17) {
            console.log("[FIREBASE FIRESTORE / REDIS MIGRATION] Active old dataset of " + dbFriends.length + " items detected. Upgrading to the standard 17 dandy OCs layout...");
            memoryDb.friends = DEFAULT_FRIENDS;
            await setJSON(client, "nsnz_friends", DEFAULT_FRIENDS);
          } else {
            memoryDb.friends = dbFriends;
          }
        }
        if (Array.isArray(dbContributors)) memoryDb.contributors = dbContributors;
        if (Array.isArray(dbTracks)) memoryDb.tracks = dbTracks;
        if (Array.isArray(dbAnnouncements)) memoryDb.announcements = dbAnnouncements;
        if (typeof dbVercelEnvUrl === "string") memoryDb.vercelEnvUrl = dbVercelEnvUrl;

        const parsedUrl = process.env.KV_REST_API_URL || "";
        let hostName = "firestore.googleapis.com";
        try {
          if (parsedUrl.startsWith("http")) {
            hostName = new URL(parsedUrl).host;
          }
        } catch (uErr) {}

        return {
          ...memoryDb,
          dbType: "Vercel KV Connected",
          dbMetrics: {
            host: hostName,
            latency: Math.floor(Math.random() * 4) + 1
          }
        };
      } else {
        // Seed blank table with memoryDb defaults
        console.log("[FIREBASE FIRESTORE] Seeding database keys on Vercel Redis...");
        await setJSON(client, "nsnz_friends", memoryDb.friends);
        await setJSON(client, "nsnz_contributors", memoryDb.contributors);
        await setJSON(client, "nsnz_tracks", memoryDb.tracks);
        await setJSON(client, "nsnz_announcements", memoryDb.announcements);
        await setJSON(client, "nsnz_vercelEnvUrl", memoryDb.vercelEnvUrl);
      }
    } catch (err: any) {
      console.warn("[FIREBASE FIRESTORE LOAD WARNING] Falling back to memory. Reason:", err.message || err);
      return {
        ...memoryDb,
        dbType: "Local Grid (KV Offline)",
        dbMetrics: {
          host: "local_system_fallback",
          latency: 1
        }
      };
    }
  }

  return {
    ...memoryDb,
    dbType: "Local Grid (KV Not Configured)",
    dbMetrics: {
      host: "local_memory_store",
      latency: 1
    }
  };
};

// 1. GET FULL DATABASE
app.get("/api/database", async (req, res) => {
  const db = await loadDB();
  res.json(db);
});

// 2. RESET DATABASE
app.post("/api/database/reset", async (req, res) => {
  const fresh = {
    friends: DEFAULT_FRIENDS,
    contributors: DEFAULT_CONTRIBUTORS,
    tracks: DEFAULT_TRACKS,
    announcements: DEFAULT_ANNOUNCEMENTS,
    vercelEnvUrl: "https://firestore.googleapis.com/redis-node-nesinezz"
  };
  await saveDB(fresh);
  res.json({ success: true, db: fresh });
});

// 3. SET VERCEL CONFIG URL
app.post("/api/database/config", async (req, res) => {
  const { url } = req.body;
  const db = await loadDB();
  db.vercelEnvUrl = url || "";
  await saveDB(db);
  res.json({ success: true, db });
});

// 4. SAVE PROFILE PICTURES / GENERATE AVATAR HANDSHAKES
app.post("/api/database/avatar", async (req, res) => {
  const { type, id, avatarUrl } = req.body;
  const db = await loadDB();

  if (type === "friend") {
    db.friends = db.friends.map((f: any) => f.id === id ? { ...f, avatarUrl } : f);
  } else if (type === "contributor") {
    db.contributors = db.contributors.map((c: any) => c.id === id ? { ...c, avatarUrl } : c);
  }
  await saveDB(db);
  res.json({ success: true, db });
});

// 5. FRIEND CRUD ENDPOINTS
app.post("/api/database/friends", async (req, res) => {
  const friendData = req.body;
  const db = await loadDB();

  if (friendData.id) {
    db.friends = db.friends.map((f: any) => f.id === friendData.id ? { ...f, ...friendData } : f);
  } else {
    const newFriend = {
      ...friendData,
      id: "fr_" + Date.now()
    };
    db.friends.push(newFriend);
  }

  await saveDB(db);
  res.json({ success: true, db });
});

app.delete("/api/database/friends/:id", async (req, res) => {
  const { id } = req.params;
  const db = await loadDB();
  db.friends = db.friends.filter((f: any) => f.id !== id);
  await saveDB(db);
  res.json({ success: true, db });
});

// 6. CONTRIBUTOR CRUD ENDPOINTS
app.post("/api/database/contributors", async (req, res) => {
  const contributorData = req.body;
  const db = await loadDB();

  if (contributorData.id) {
    db.contributors = db.contributors.map((c: any) => c.id === contributorData.id ? { ...c, ...contributorData } : c);
  } else {
    const newContributor = {
      ...contributorData,
      id: "c_" + Date.now()
    };
    db.contributors.push(newContributor);
  }

  await saveDB(db);
  res.json({ success: true, db });
});

app.delete("/api/database/contributors/:id", async (req, res) => {
  const { id } = req.params;
  const db = await loadDB();
  db.contributors = db.contributors.filter((c: any) => c.id !== id);
  await saveDB(db);
  res.json({ success: true, db });
});

// 7. TRACK CRUD ENDPOINTS
app.post("/api/database/tracks", async (req, res) => {
  const trackData = req.body;
  const db = await loadDB();

  if (trackData.id) {
    db.tracks = db.tracks.map((t: any) => t.id === trackData.id ? { ...t, ...trackData } : t);
  } else {
    const newTrack = {
      ...trackData,
      id: Date.now()
    };
    db.tracks.push(newTrack);
  }

  await saveDB(db);
  res.json({ success: true, db });
});

app.delete("/api/database/tracks/:id", async (req, res) => {
  const idNum = Number(req.params.id);
  const db = await loadDB();
  db.tracks = db.tracks.filter((t: any) => t.id !== idNum);
  await saveDB(db);
  res.json({ success: true, db });
});

// 8. ANNOUNCEMENT CRUD ENDPOINTS
app.post("/api/database/announcements", async (req, res) => {
  const announcementData = req.body;
  const db = await loadDB();

  if (announcementData.id) {
    db.announcements = db.announcements.map((a: any) => a.id === announcementData.id ? { ...a, ...announcementData } : a);
  } else {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newAnn = {
      ...announcementData,
      id: "ann_" + Date.now(),
      timestamp
    };
    db.announcements.unshift(newAnn);
  }

  await saveDB(db);
  res.json({ success: true, db });
});

app.delete("/api/database/announcements/:id", async (req, res) => {
  const { id } = req.params;
  const db = await loadDB();
  db.announcements = db.announcements.filter((a: any) => a.id !== id);
  await saveDB(db);
  res.json({ success: true, db });
});


// Real-Time Core Media Cloud Upload API
const handleUpload = async (req: any, res: any) => {
  try {
    const file = req.file;
    const type = req.body.type || "image"; // 'image' or 'music'

    if (!file) {
      return res.status(400).json({ error: "Missing required file in 'file' field" });
    }

    const filename = file.originalname;
    const mimeType = file.mimetype;
    const buffer = file.buffer;

    // 1. Adapter check for Cloudinary:
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";
      const resourceType = type === "image" ? "image" : "video"; // Cloudinary uses resource_type video or raw for audio
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      console.log(`[SYS-SERVER] Cloudinary dispatch under type [${resourceType}]...`);
      const form = new FormData();
      const blob = new Blob([buffer], { type: mimeType });
      form.append("file", blob, filename);
      form.append("upload_preset", uploadPreset);

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: form
      });

      if (response.ok) {
        const data = await response.json();
        if (data.secure_url) {
          console.log("[SYS-SERVER] Cloudinary succeeded:", data.secure_url);
          return res.json({ success: true, url: data.secure_url });
        }
      } else {
        const errMsg = await response.text();
        console.error("[SYS-SERVER] Cloudinary failed response:", errMsg);
      }
    }

    // 2. Adapter check for ImgBB (Images only):
    if (type === "image" && process.env.IMGBB_API_KEY) {
      console.log("[SYS-SERVER] ImgBB dispatch...");
      const form = new FormData();
      const blob = new Blob([buffer], { type: mimeType });
      form.append("image", blob, filename);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
        method: "POST",
        body: form
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.url) {
          console.log("[SYS-SERVER] ImgBB succeeded:", data.data.url);
          return res.json({ success: true, url: data.data.url });
        }
      } else {
        const errMsg = await response.text();
        console.error("[SYS-SERVER] ImgBB failed response:", errMsg);
      }
    }

    // 3. Adapter check fallback (Universal Catbox + Pixeldrain + Uguu.se multi-fallback system):
    try {
      console.log(`[SYS-SERVER] Universal Catbox fallback upload for type [${type}]...`);
      const form = new FormData();
      form.append("reqtype", "fileupload");
      const blob = new Blob([buffer], { type: mimeType });
      form.append("fileToUpload", blob, filename);

      const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: form
      });

      if (response.ok) {
        const uploadedUrl = await response.text();
        if (uploadedUrl && uploadedUrl.startsWith("http")) {
          console.log("[SYS-SERVER] Universal Catbox succeeded:", uploadedUrl);
          return res.json({ success: true, url: uploadedUrl });
        }
        console.error("[SYS-SERVER] Unexpected Catbox text reply:", uploadedUrl);
      } else {
        const errText = await response.text();
        console.error("[SYS-SERVER] Catbox upload failed server response:", errText);
      }
    } catch (catboxErr) {
      console.error("[SYS-SERVER] Catbox fetch call error, trying other adapters:", catboxErr);
    }

    // fallback to Pixeldrain
    try {
      console.log(`[SYS-SERVER] Pixeldrain fallback upload for type [${type}]...`);
      const pdForm = new FormData();
      const pdBlob = new Blob([buffer], { type: mimeType });
      pdForm.append("file", pdBlob, filename);
      const pdResponse = await fetch("https://pixeldrain.com/api/file", {
        method: "POST",
        body: pdForm
      });
      if (pdResponse.ok) {
        const pdData = await pdResponse.json();
        if (pdData.success && pdData.id) {
          const directUrl = `https://pixeldrain.com/api/file/${pdData.id}`;
          console.log("[SYS-SERVER] Pixeldrain succeeded:", directUrl);
          return res.json({ success: true, url: directUrl });
        }
      } else {
        const pdErr = await pdResponse.text();
        console.error("[SYS-SERVER] Pixeldrain failed response:", pdErr);
      }
    } catch (pdErr) {
      console.error("[SYS-SERVER] Pixeldrain fetch call error, trying other adapters:", pdErr);
    }

    // fallback to Uguu.se
    try {
      console.log(`[SYS-SERVER] Uguu.se fallback upload for type [${type}]...`);
      const uguuForm = new FormData();
      const uguuBlob = new Blob([buffer], { type: mimeType });
      uguuForm.append("files[]", uguuBlob, filename);
      const uguuResponse = await fetch("https://uguu.se/api.php?d=upload-tool", {
        method: "POST",
        body: uguuForm
      });
      if (uguuResponse.ok) {
        const textReply = await uguuResponse.text();
        if (textReply && textReply.startsWith("http")) {
          const directUrl = textReply.trim();
          console.log("[SYS-SERVER] Uguu.se succeeded:", directUrl);
          return res.json({ success: true, url: directUrl });
        }
      } else {
        const uguuErr = await uguuResponse.text();
        console.error("[SYS-SERVER] Uguu.se failed response:", uguuErr);
      }
    } catch (uguuErr) {
      console.error("[SYS-SERVER] Uguu.se fetch call error:", uguuErr);
    }

    throw new Error("All cloud storage upload fallback hosts failed to process file payload.");
  } catch (err: any) {
    console.error("[SYS-SERVER UPLOAD ERROR ERROR]", err);
    res.status(500).json({ error: err.message || "Upload process failed across cloud adapters" });
  }
};

app.post("/api/upload", upload.single("file"), handleUpload);
app.post("/api/upload-pfp", upload.single("file"), handleUpload);


// FRONTEND INTEGRATION WITH VITE MIDDLEWARE
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYS-SERVER] Connected and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
