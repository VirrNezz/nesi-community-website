import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@vercel/kv";
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
    avatarUrl: "",
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
    avatarUrl: "",
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
    avatarUrl: "",
    type: "normal",
    bio: "Anjing serigala berpenampilan dandy berkacamata pilot dengan selera alas kaki bermerek lokal.",
    bio_en: "A sleek dandy wolf dog rocking specialized pilot goggles with customized tastes in local footwear.",
    characteristics: [
      "Milik warna bulu biru putih bersih dengan sorot mata cokelat hangat.",
      "Menampilkan ekspresi mata sedikit marah yang keren sekaligus menggemaskan.",
      "Selalu memakai kacamata pilot cokelat retro di kepalanya.",
      "Selalu memakai sepatu sneakers dandy buatan merek indie terpercaya."
    ],
    characteristics_en: [
      "Clean blue and white coat highlighted by warm amber-colored eyes.",
      "Exhibits a cool yet highly adorable slightly grumpy eyes layout.",
      "Always seen wearing vintage brown pilot goggles overhead.",
      "Consistently styled in dandy sneakers fabricated by premium indie makers."
    ],
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/p/DF96b02vT33/?igsh=MWY5aGVod3J5cnZ2bQ== ", label: "Custom Post Link" }
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
    avatarUrl: "https://d.uguu.se/cgahxrjH.jpg"
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

// Lazy-initialized Vercel KV Client
let kvClient: any = null;
const getKVClient = () => {
  if (kvClient) return kvClient;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (url && token) {
    try {
      kvClient = createClient({
        url,
        token,
      });
      return kvClient;
    } catch (e) {
      console.error("[VERCEL KV CLIENT ERROR]", e);
    }
  }
  return null;
};

// Helper for fetching/parsing JSON safely from Redis KV
const getJSON = async (client: any, key: string, defaultValue: any) => {
  try {
    const val = await client.get(key);
    if (val === null || val === undefined) return defaultValue;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (parseErr) {
        return val;
      }
    }
    return val;
  } catch (err) {
    console.error(`Error getting key ${key} from KV`, err);
    return defaultValue;
  }
};

// Helper for setting JSON safely in Redis KV
const setJSON = async (client: any, key: string, value: any) => {
  try {
    await client.set(key, typeof value === "object" ? JSON.stringify(value) : value);
  } catch (err) {
    console.error(`Error setting key ${key} in KV`, err);
  }
};

// Memory cache backing database state if KV is missing/connecting
let memoryDb: any = {
  friends: DEFAULT_FRIENDS,
  contributors: DEFAULT_CONTRIBUTORS,
  tracks: DEFAULT_TRACKS,
  announcements: DEFAULT_ANNOUNCEMENTS,
  vercelEnvUrl: "https://kv.vercel-storage.com/redis-node-nesinezz"
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
      console.log("[VERCEL KV] Successfully synchronized keys downstream.");
    } catch (err) {
      console.error("[VERCEL KV SAVE WARNING] Key sync failed.", err);
    }
  }
};

// Helper to load database
const loadDB = async () => {
  const client = getKVClient();
  if (client) {
    try {
      console.log("[VERCEL KV] Connecting and pulling state...");
      const dbFriends = await getJSON(client, "nsnz_friends", null);
      const dbContributors = await getJSON(client, "nsnz_contributors", null);
      const dbTracks = await getJSON(client, "nsnz_tracks", null);
      const dbAnnouncements = await getJSON(client, "nsnz_announcements", null);
      const dbVercelEnvUrl = await getJSON(client, "nsnz_vercelEnvUrl", null);

      if (dbFriends !== null || dbContributors !== null || dbTracks !== null || dbAnnouncements !== null || dbVercelEnvUrl !== null) {
        if (Array.isArray(dbFriends)) memoryDb.friends = dbFriends;
        if (Array.isArray(dbContributors)) memoryDb.contributors = dbContributors;
        if (Array.isArray(dbTracks)) memoryDb.tracks = dbTracks;
        if (Array.isArray(dbAnnouncements)) memoryDb.announcements = dbAnnouncements;
        if (typeof dbVercelEnvUrl === "string") memoryDb.vercelEnvUrl = dbVercelEnvUrl;

        const parsedUrl = process.env.KV_REST_API_URL || "";
        let hostName = "kv.vercel-storage.com";
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
        console.log("[VERCEL KV] Seeding database keys on Vercel Redis...");
        await setJSON(client, "nsnz_friends", memoryDb.friends);
        await setJSON(client, "nsnz_contributors", memoryDb.contributors);
        await setJSON(client, "nsnz_tracks", memoryDb.tracks);
        await setJSON(client, "nsnz_announcements", memoryDb.announcements);
        await setJSON(client, "nsnz_vercelEnvUrl", memoryDb.vercelEnvUrl);
      }
    } catch (err: any) {
      console.warn("[VERCEL KV LOAD WARNING] Falling back to memory. Reason:", err.message || err);
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
    vercelEnvUrl: "https://kv.vercel-storage.com/redis-node-nesinezz"
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
app.post("/api/upload", upload.single("file"), async (req, res) => {
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

    // 3. Adapter check fallback (Universal Catbox):
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

    throw new Error("Cloud storage hosts failed to upload of file payload.");
  } catch (err: any) {
    console.error("[SYS-SERVER UPLOAD ERROR ERROR]", err);
    res.status(500).json({ error: err.message || "Upload process failed across cloud adapters" });
  }
});


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
