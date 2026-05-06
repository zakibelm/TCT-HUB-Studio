import { useState, useEffect } from "react";
import { 
  Download, RefreshCw, Play, Shield, CheckCircle, 
  AlertCircle, Loader2, LayoutDashboard, Library, 
  Share2, Trash2, CheckSquare, Square, Video, Image as ImageIcon,
  ExternalLink, Send, ArrowRight, X, Layers, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════════
   OPENROUTER MODEL CATALOG (EXTENDED)
═══════════════════════════════════════════════════ */
const MODELS = [
  // --- IMAGES ---
  {
    id: "black-forest-labs/flux.1.1-pro",
    label: "FLUX 1.1 Pro",
    badge: "BFL",
    badgeColor: "#FF6B35",
    modalities: ["image"],
    type: "image",
    cost: "~0,08$/img",
    note: "Ultra-rapide, photoréalisme de pointe"
  },
  {
    id: "google/imagen-3",
    label: "Imagen 3",
    badge: "Google",
    badgeColor: "#4285F4",
    modalities: ["image"],
    type: "image",
    cost: "~0,03$/img",
    note: "Excellent rendu de texte et compréhension spatiale"
  },
  {
    id: "recraft/recraft-v3",
    label: "Recraft V3",
    badge: "Recraft",
    badgeColor: "#E91E63",
    modalities: ["image"],
    type: "image",
    cost: "~0,05$/img",
    note: "Style graphique et vectoriel inégalé"
  },
  {
    id: "openai/gpt-4o-canmore", 
    label: "DALL-E 3 (GPT-4o)",
    badge: "OpenAI",
    badgeColor: "#10A37F",
    modalities: ["image"],
    type: "image",
    cost: "~0,10$/img",
    note: "Créativité sémantique maximale"
  },
  // --- VIDEO ---
  {
    id: "luma/ray-v2",
    label: "Luma Ray V2",
    badge: "Luma",
    badgeColor: "#7C3AED",
    modalities: ["video"],
    type: "video",
    cost: "~0,25$/vid",
    note: "Vidéo cinématique fluide"
  },
  {
    id: "kling/kling-v1-5-standard/video",
    label: "Kling 1.5 Std",
    badge: "Kling",
    badgeColor: "#F43F5E",
    modalities: ["video"],
    type: "video",
    cost: "~0,15$/vid",
    note: "Réalisme physique impressionnant"
  },
  {
    id: "minimax/video-01",
    label: "MiniMax Video",
    badge: "MiniMax",
    badgeColor: "#10B981",
    modalities: ["video"],
    type: "video",
    cost: "~0,20$/vid",
    note: "Mouvements naturels et cohérence temporelle"
  },
  {
    id: "CUSTOM",
    label: "Modèle personnalisé",
    badge: "CUSTOM",
    badgeColor: "#555",
    modalities: ["image", "text"],
    type: "any",
    cost: "—",
    note: "Entre ton model ID OpenRouter (ex: haiper/haiper-v1)"
  }
];

/* ═══════════════════════════════════════════════════
   EMOTION SKILL
═══════════════════════════════════════════════════ */
const EMOTIONS = {
  RÉASSURANCE:   { icon:"🤝", color:"#2980B9", desc:"Calme l'anxiété, crée la confiance",     visual:"Emotionally reassuring atmosphere, soft warm lighting, calm and confident subjects, stable blue and warm white palette, quiet reliability" },
  SOULAGEMENT:   { icon:"😮‍💨", color:"#27AE60", desc:"Tension résolue, problème réglé",         visual:"Visual tension-release energy, before/after contrast, subjects show visible relief and relaxed body language, exhale moment, green tones of resolution" },
  PROTECTION:    { icon:"🛡️", color:"#8E44AD", desc:"Quelqu'un veille sur toi",                  visual:"Strong protective atmosphere, enveloping warm lighting, subjects feel sheltered and cared for, deep protective purple blending into warm amber" },
  APPARTENANCE:  { icon:"🏘️", color:"#E67E22", desc:"Tu fais partie de quelque chose",           visual:"Community belonging warmth, authentic local Quebec neighborhood, humans connecting naturally, amber earth tones, cozy winter street backdrop" },
  HONTE_ZÉRO:   { icon:"🤲", color:"#16A085", desc:"Sans jugement, on comprend",               visual:"Non-judgmental open composition, no harsh shadows, soft teal-green acceptance tones, open body language, zero stigma visual language" },
  FIERTÉ_LOCALE: { icon:"❤️", color:"#C0392B", desc:"Acheter local, garder l'argent ici",        visual:"Local civic pride energy, confident composition, Terrebonne Quebec character, gold and deep red tones, upright posture, shared community success" },
  PAIX_D_ESPRIT: { icon:"😌", color:"#3498DB", desc:"Tu peux arrêter de t'inquiéter",           visual:"Peaceful resolution, serene blue night tones dissolving into warm safety, subjects relaxed and at peace, gentle lighting, all tension dissolved" },
  CONFIANCE:     { icon:"🔒", color:"#F5C518", desc:"Mérite ta confiance depuis longtemps",      visual:"Deep earned trust visual language, solid gold and charcoal tones of established reliability, quiet competence, decades of experience implied" },
};

/* ═══════════════════════════════════════════════════
   AD PROMPTS
═══════════════════════════════════════════════════ */
const ADS = [
  { id:1,  pattern:"CONFIANCE",       emotion:"CONFIANCE",     label:"Zéro Frais Cachés",         prompt: `Swiss editorial poster meta ad, portrait 9:16 format. Deep black background with subtle white grid lines. Top small caps "CO-OP TAXI TERREBONNE" in taxi yellow. Center: massive bold stacked uppercase — "ZÉRO FRAIS" in white, "CACHÉS." in white, "JAMAIS." in taxi yellow. Below: dark grey inset rectangle with three checkmarks: "Taximètre certifié / Tarif réglementé par loi / Ce que tu vois = ce que tu paies". Bottom full-width yellow bar black text "RÉSERVER TCT — (450) 964-1234". Swiss grid, perfect French typography.` },
  { id:2,  pattern:"TAXIMÈTRE",       emotion:"CONFIANCE",     label:"Le Compteur Ne Ment Pas",   prompt: `Typographic editorial meta ad, portrait 9:16. Warm cream background. Top grey monospace "TRANSPARENCE TARIFAIRE". Center: detailed vintage analog taximeter illustration with mechanical dial and needle. Massive bold dark headline "LE TAXIMÈTRE NE MENT PAS." Black box yellow text "CERTIFIÉ — CONTRÔLÉ — RÉGLEMENTÉ". Three monospace lines: "Tu montes. / Le compteur tourne. / Tu descends. Tu paies ce que tu vois." Bottom dark bar yellow text "TRANSPORT DE CONFIANCE — CO-OP TCT". French, editorial clean.` },
  { id:3,  pattern:"RACCOMPAGNEMENT", emotion:"PROTECTION",    label:"Rentre en Sécurité",        prompt: `Nightlife safety meta ad, portrait 9:16. Dark background with blurred purple bokeh city lights. Top badge shield icon "RACCOMPAGNEMENT SÉCURITAIRE" in purple. Stacked headline: "T'AS SORTI." in white, "RENTRE EN" in bright taxi yellow, "SÉCURITÉ." in white. Dark purple card green checkmarks: "Chauffeur professionnel certifié / Disponible 24h/24 / Sans jugement. Sans danger." Bottom yellow bar "APPELER TCT — TOUJOURS LÀ". French.` },
  { id:4,  pattern:"RACCOMPAGNEMENT", emotion:"HONTE_ZÉRO",   label:"Tu As Bu — C'est Correct",  prompt: `Responsible messaging meta ad, portrait 9:16. Dark forest green background. Small caps "RESPONSABILITÉ PARTAGÉE" in green. Bold stacked: "TU AS BU." in grey, "C'EST CORRECT." in white, "APPELLE TCT." in bright yellow. Three green checkmarks: "Ton auto reste là / Tu rentres sain et sauf / Chauffeur professionnel, sans sermon". Yellow CTA bar "(450) 964-1234 — 24H/24". French.` },
  { id:5,  pattern:"RACCOMPAGNEMENT", emotion:"SOULAGEMENT",  label:"POV Vendredi Soir",          prompt: `Conversational POV meta ad, portrait 9:16. Very dark navy background. Top yellow monospace "POV : VENDREDI 23H30". Two chat bubbles: dark blue "Ton ami : Tu conduis ou tu appelles quelqu'un ?" then dark green "Toi : J'appelle TCT. 5 minutes." Bold white "LE BON CHOIX" then "C'EST ÇA." in yellow. Green section checkmarks. Yellow CTA "APPELER TCT MAINTENANT". French.` },
  { id:12, pattern:"HÉRITAGE",        emotion:"FIERTÉ_LOCALE",label:"Depuis 1982",                prompt: `Vintage heritage meta ad, portrait 9:16. Aged cream paper with crosshatch texture, thick dark brown border. Header strip "TERREBONNE, QC" and "EST. 1982" in gold monospace. Large vintage bold: "40 ANS" then "DE" in dark brown, "CONFIANCE." in deep rust red. Center: stylized vintage yellow Quebec taxi. Below "TAXIMÈTRE CERTIFIÉ — CHAUFFEUR VÉRIFIÉ". Bottom bar "FIABLE — CERTIFIÉ — LOCAL" in gold. French, heritage nostalgic.` }
];

const SOCIAL_NETWORKS = [
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0077B5' },
  { id: 'facebook', label: 'Facebook', icon: '👥', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000000' },
  { id: 'youtube', label: 'YouTube Shorts', icon: '📹', color: '#FF0000' },
  { id: 'twitter', label: 'X / Twitter', icon: '𝕏', color: '#000000' },
];

const buildPrompt = (ad: any, emotionKey: string) =>
  `${ad.prompt}\n\nEMOTIONAL ATMOSPHERE: ${EMOTIONS[emotionKey as keyof typeof EMOTIONS].visual}`;

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
interface LibraryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  model: string;
  adLabel: string;
  emotion: string;
  addedAt: number;
  platforms: string[];
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function App() {
  const [activeTab,    setActiveTab]   = useState<"studio" | "hub">("studio");
  const [apiKey,      setApiKey]      = useState("");
  const [modelId,     setModelId]     = useState("black-forest-labs/flux.1.1-pro");
  const [customModel, setCustomModel] = useState("");
  const [images,      setImages]      = useState<Record<number, { src: string; emotion: string; model: string; type: string }>>({});
  const [loading,     setLoading]     = useState<Record<number, boolean>>({});
  const [errors,      setErrors]      = useState<Record<number, string | null>>({});
  const [filterPat,   setFilterPat]   = useState("TOUS");
  const [library,     setLibrary]     = useState<LibraryItem[]>([]);
  const [sharingItem, setSharingItem] = useState<LibraryItem | null>(null);
  const [shareConfig, setShareConfig] = useState<Record<string, boolean>>({});

  // Local Storage Sync
  useEffect(() => {
    const saved = localStorage.getItem("tct_hub_media");
    if (saved) setLibrary(JSON.parse(saved));
    const savedKey = localStorage.getItem("tct_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    localStorage.setItem("tct_hub_media", JSON.stringify(library));
  }, [library]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("tct_api_key", key);
  };

  const activeModel   = modelId === "CUSTOM" ? customModel.trim() : modelId;
  const modelCfg      = MODELS.find(m => m.id === modelId) || MODELS[0];
  const patterns      = ["TOUS", ...new Set(ADS.map(a => a.pattern))];
  const filtered      = ADS
    .filter(a => filterPat === "TOUS" || a.pattern === filterPat);

  /* ── GENERATE ── */
  const generate = async (ad: any) => {
    if (!apiKey.trim() || !activeModel) { alert("Clé API et modèle requis."); return; }
    const emotionKey = ad.emotion;
    const finalPrompt = buildPrompt(ad, emotionKey);

    setLoading(p => ({ ...p, [ad.id]: true }));
    setErrors(p  => ({ ...p, [ad.id]: null  }));

    try {
      const isVideo = modelCfg.type === 'video';
      
      const body = {
        model: activeModel,
        messages: [{ role: "user", content: finalPrompt }],
        ...(modelCfg.modalities && { modalities: modelCfg.modalities }),
        // Note: For video or specific image models, OpenRouter might need different payloads.
        // We assume standard chat/completions for now as per OR docs for multi-modal.
      };

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
          "X-Title": "TCT Ad Studio"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);

      const msg = data.choices?.[0]?.message;
      const mediaArr = isVideo ? msg?.videos : msg?.images;

      if (!mediaArr || mediaArr.length === 0) {
        // Fallback or specific error if the model didn't return media in the expected format
        throw new Error(`Aucune ${isVideo ? 'vidéo' : 'image'} reçue. Vérifiez que le modèle "${activeModel}" supporte bien la génération directe.`);
      }

      setImages(p => ({ 
        ...p, 
        [ad.id]: { src: mediaArr[0], emotion: emotionKey, model: activeModel, type: isVideo ? 'video' : 'image' } 
      }));
    } catch(e: any) {
      setErrors(p => ({ ...p, [ad.id]: e.message }));
    } finally {
      setLoading(p => ({ ...p, [ad.id]: false }));
    }
  };

  /* ── HUB ACTIONS ── */
  const addToHub = (ad: any, media: any) => {
    const newItem: LibraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: media.src,
      type: media.type,
      model: media.model,
      adLabel: ad.label,
      emotion: ad.emotion,
      addedAt: Date.now(),
      platforms: []
    };
    setLibrary(p => [newItem, ...p]);
  };

  const removeFromHub = (id: string) => {
    if (confirm("Supprimer cet asset du Hub ?")) {
      setLibrary(p => p.filter(item => item.id !== id));
    }
  };

  /* ── DISTRIBUTION ── */
  const openShare = (item: LibraryItem) => {
    setSharingItem(item);
    const initialConfig: Record<string, boolean> = {};
    SOCIAL_NETWORKS.forEach(net => {
      initialConfig[net.id] = item.platforms.includes(net.id);
    });
    setShareConfig(initialConfig);
  };

  const togglePlatform = (netId: string) => {
    setShareConfig(p => ({ ...p, [netId]: !p[netId] }));
  };

  const diffuseMedia = () => {
    if (!sharingItem) return;
    const platforms = Object.entries(shareConfig)
      .filter(([_, val]) => val)
      .map(([key]) => key);
    
    setLibrary(p => p.map(item => 
      item.id === sharingItem.id ? { ...item, platforms } : item
    ));
    setSharingItem(null);
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-[#F5F2EC] font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* ── SIDEBAR ── */}
      <nav className="w-64 border-r border-[#1A1A1A] bg-[#0A0A0A] flex flex-col flex-shrink-0 z-20">
        <div className="p-6 border-b-4 border-[#F5C518]">
          <div className="text-[10px] tracking-[4px] text-[#F5C518] font-mono mb-1">ASTROMEDIA</div>
          <h1 className="font-['Bebas_Neue'] text-3xl tracking-wide">TCT HUB STUDIO</h1>
        </div>
        
        <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-3 px-6 py-4 transition-all text-left ${activeTab === "studio" ? "bg-[#1A1A1A] text-[#F5C518] border-r-4 border-[#F5C518]" : "text-[#555] hover:text-white"}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-mono text-xs font-bold tracking-widest">STUDIO CRÉATIF</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("hub")}
            className={`flex items-center gap-3 px-6 py-4 transition-all text-left ${activeTab === "hub" ? "bg-[#1A1A1A] text-[#F5C518] border-r-4 border-[#F5C518]" : "text-[#555] hover:text-white"}`}
          >
            <Library size={20} />
            <span className="font-mono text-xs font-bold tracking-widest flex items-center justify-between flex-1">
              HUB MEDIA {library.length > 0 && <span className="text-[10px] bg-[#F5C518] text-black px-1.5 py-0.5 rounded-full">{library.length}</span>}
            </span>
          </button>
        </div>

        <div className="p-6 border-t border-[#1A1A1A] bg-black/40">
          <label className="text-[9px] text-[#444] font-mono mb-2 uppercase tracking-widest block">API KEY (OpenRouter)</label>
          <input 
            type="password" 
            placeholder="sk-or-v1-..."
            value={apiKey}
            onChange={(e) => saveApiKey(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded px-3 py-2.5 text-[10px] font-mono outline-none focus:border-[#F5C518] transition-colors"
          />
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        
        <AnimatePresence mode="wait">
          {activeTab === "studio" ? (
            <motion.div 
              key="studio"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="p-10 max-w-[1600px] mx-auto"
            >
              <header className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-5xl font-['Bebas_Neue'] mb-3 flex items-center gap-4">
                    <Sparkles className="text-[#F5C518]" /> STUDIO GÉNÉRATEUR
                  </h2>
                  <p className="text-[#666] font-mono text-xs max-w-xl leading-relaxed uppercase tracking-wider">
                    Générez, comparez et choisissez les meilleurs assets publicitaires propulsés par les modèles d'IA d'OpenRouter.
                  </p>
                </div>
                <div className="flex gap-3">
                   <div className="bg-[#111] border border-[#222] rounded-lg p-3 text-center">
                     <div className="text-[9px] font-mono text-[#444] mb-1">MODE</div>
                     <div className="text-[10px] font-bold text-white flex items-center gap-2">
                       {modelCfg.type === 'video' ? <Video size={12} className="text-[#F43F5E]"/> : <ImageIcon size={12} className="text-[#4285F4]"/>}
                       {modelCfg.type === 'video' ? "CINÉMATIQUE" : "STATIQUE"}
                     </div>
                   </div>
                </div>
              </header>

              {/* Models Grid */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6 text-[#F5C518]">
                  <div className="w-1 h-5 bg-[#F5C518]" />
                  <span className="font-mono text-xs uppercase tracking-[4px] font-bold">Catalogues des Modèles</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {MODELS.map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => setModelId(m.id)}
                      className={`relative p-5 rounded-2xl border transition-all text-left flex flex-col justify-between h-32 group ${modelId === m.id ? "bg-[#1A1A1A] border-[#F5C518] shadow-[0_0_20px_rgba(245,197,24,0.1)]" : "bg-[#0D0D0D] border-[#1A1A1A] hover:border-[#333]"}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] px-2 py-0.5 rounded font-mono uppercase tracking-widest" style={{ backgroundColor: `${m.badgeColor}22`, color: m.badgeColor }}>{m.badge}</span>
                        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                          {m.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                        </div>
                      </div>
                      <div>
                        <div className={`text-base font-bold tracking-tight ${modelId === m.id ? "text-white" : "text-[#777]"}`}>{m.label}</div>
                        <div className="text-[10px] text-[#444] font-mono mt-1">{m.cost}</div>
                      </div>
                      {modelId === m.id && (
                        <div className="absolute -top-2 -right-2 bg-[#F5C518] text-black rounded-full p-1.5 shadow-2xl z-10">
                          <CheckCircle size={14} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {modelId === "CUSTOM" && (
                   <div className="mt-4 flex gap-2">
                     <input 
                        className="flex-1 bg-[#0D0D0D] border border-[#333] focus:border-[#F5C518] rounded-xl px-5 py-3 text-xs font-mono outline-none transition-all"
                        placeholder="ID Modèle OpenRouter personnalisé (ex: tencent/hunyuan-video)"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                      />
                   </div>
                )}
              </div>

              {/* Toolbar */}
              <div className="flex justify-between items-center bg-[#0D0D0D] border border-[#1A1A1A] p-4 rounded-2xl mb-10">
                <div className="flex gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[#333] uppercase">Style Ad</span>
                    <select 
                      value={filterPat} 
                      onChange={(e) => setFilterPat(e.target.value)}
                      className="bg-[#111] border border-[#222] rounded-lg px-4 py-2 text-xs font-mono outline-none focus:border-[#F5C518]"
                    >
                      {patterns.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#333] uppercase">
                  {filtered.length} TEMPLATES PRÊTS
                </div>
              </div>

              {/* Generator Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map(ad => {
                  const media = images[ad.id];
                  const busy = loading[ad.id];
                  const err = errors[ad.id];
                  const emo = EMOTIONS[ad.emotion as keyof typeof EMOTIONS];

                  return (
                    <div key={ad.id} className="group relative bg-[#0D0D0D] border border-[#181818] rounded-3xl overflow-hidden flex flex-col hover:border-[#F5C518]/20 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                      <div className="aspect-[9/16] bg-black relative flex items-center justify-center overflow-hidden border-b border-[#111]">
                        {media ? (
                          media.type === 'video' ? (
                            <video src={media.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={media.src} alt={ad.label} className="w-full h-full object-cover" />
                          )
                        ) : busy ? (
                          <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                              <Loader2 className="w-12 h-12 text-[#F5C518] animate-spin" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles size={16} className="text-[#F5C518] animate-pulse" />
                              </div>
                            </div>
                            <div className="text-[10px] font-mono text-[#444] tracking-[4px] font-bold">OPTIMISATION...</div>
                          </div>
                        ) : err ? (
                          <div className="p-8 text-center max-w-[280px]">
                            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <div className="text-xs text-red-400 font-mono mb-6 leading-relaxed">{err}</div>
                            <button onClick={() => generate(ad)} className="w-full bg-red-600/10 text-red-500 border border-red-600/20 px-6 py-3 rounded-xl font-mono text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all">RE-TENTER GÉNÉRATION</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center opacity-10 group-hover:opacity-30 transition-all scale-100 group-hover:scale-110 duration-700">
                            <Layers size={80} strokeWidth={1} />
                          </div>
                        )}

                        {/* Ad Details Badge */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <div className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold font-mono border border-white/10 flex items-center gap-2">
                              <span className="text-[#F5C518]">{ad.pattern}</span>
                           </div>
                           <div className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold font-mono border border-white/10">
                              {emo.icon} {ad.emotion}
                           </div>
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-1">
                        <div className="mb-8">
                          <h4 className="font-['Bebas_Neue'] text-3xl tracking-wide text-white mb-2">{ad.label}</h4>
                          <p className="text-[10px] text-[#444] font-mono line-clamp-2 leading-relaxed">{ad.prompt}</p>
                        </div>

                        <div className="mt-auto flex gap-3">
                          <button 
                            disabled={busy}
                            onClick={() => generate(ad)}
                            className="flex-1 bg-white text-black font-['Bebas_Neue'] text-2xl py-4 rounded-2xl hover:scale-[0.98] active:scale-[0.95] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                          >
                            {busy ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                            {media ? "RÉGÉNÉRER" : "GÉNÉRER"}
                          </button>
                          
                          {media && (
                             <motion.button 
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               onClick={() => addToHub(ad, media)}
                               className="w-16 bg-[#F5C518] text-black rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(245,197,24,0.3)]"
                             >
                               <Library size={24} />
                             </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-10 max-w-[1600px] mx-auto"
            >
              <header className="mb-10 flex justify-between items-start">
                <div>
                  <h2 className="text-5xl font-['Bebas_Neue'] mb-3 flex items-center gap-4">
                    <Library className="text-[#F5C518]" /> HUB MEDIA LIBRARY
                  </h2>
                  <p className="text-[#666] font-mono text-xs max-w-xl leading-relaxed uppercase tracking-wider">
                    Gérez, exportez et diffusez vos créations validées sur vos réseaux sociaux.
                  </p>
                </div>
                <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                   <div className="text-[9px] font-mono text-[#444] mb-1">TOTAL ASSETS</div>
                   <div className="text-xl font-bold font-mono text-[#F5C518]">{library.length}</div>
                </div>
              </header>

              {library.length === 0 ? (
                 <div className="h-[60vh] border-2 border-dashed border-[#1A1A1A] rounded-[40px] flex flex-col items-center justify-center gap-6 opacity-30">
                    <Library size={100} strokeWidth={0.5} />
                    <div className="text-center">
                       <p className="font-['Bebas_Neue'] text-3xl tracking-widest">HÉLAS, C'EST VIDE</p>
                       <button onClick={() => setActiveTab("studio")} className="mt-4 text-[#F5C518] font-mono text-sm underline tracking-[3px]">RETOURNER AU STUDIO</button>
                    </div>
                 </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {library.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      className="group bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden hover:border-[#F5C518]/50 transition-all flex flex-col h-fit"
                    >
                      <div className="aspect-[9/16] bg-black relative overflow-hidden group">
                        {item.type === 'video' ? (
                          <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.url} alt={item.adLabel} className="w-full h-full object-cover" />
                        )}
                        
                        {/* Status Overlay */}
                        {item.platforms.length > 0 ? (
                           <div className="absolute top-4 left-4 bg-[#27AE60] text-white text-[8px] font-bold font-mono px-2 py-1 rounded-full uppercase tracking-widest shadow-xl">
                              ✓ Diffusé
                           </div>
                        ) : (
                           <div className="absolute top-4 left-4 bg-[#111]/80 backdrop-blur-md text-[#444] text-[8px] font-bold font-mono px-2 py-1 rounded-full uppercase tracking-widest border border-white/10">
                              En attente
                           </div>
                        )}

                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-4 transition-all duration-300">
                          <button 
                            onClick={() => openShare(item)}
                            className="bg-[#F5C518] text-black w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-2xl"
                          >
                            <Share2 size={24} />
                          </button>
                          <div className="flex gap-2">
                             <a 
                                href={item.url} download target="_blank" rel="noreferrer"
                                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#F5F2EC]"
                              >
                                <Download size={18} />
                              </a>
                              <button 
                                onClick={() => removeFromHub(item.id)}
                                className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-500"
                              >
                                <Trash2 size={18} />
                              </button>
                          </div>
                        </div>

                        {/* Platform Badges */}
                        {item.platforms.length > 0 && (
                          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                             {item.platforms.map(p => (
                               <div key={p} className="w-6 h-6 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center text-[11px] border border-white/10" title={p}>
                                 {SOCIAL_NETWORKS.find(n => n.id === p)?.icon}
                               </div>
                             ))}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                         <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="text-[9px] font-mono text-[#F5C518] border border-[#F5C518]/30 px-1.5 py-0.5 rounded">{item.type.toUpperCase()}</span>
                            <span className="text-[10px] font-mono text-[#333]">{new Date(item.addedAt).toLocaleDateString()}</span>
                         </div>
                         <h5 className="font-bold text-xs truncate text-white/90">{item.adLabel}</h5>
                         <div className="text-[9px] font-mono text-[#444] mt-1 uppercase tracking-tighter truncate">{item.model.split("/").pop()}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DISTRIBUTION MODAL ── */}
        <AnimatePresence>
          {sharingItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSharingItem(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-lg"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-[#0F0F0F] border border-[#1A1A1A] rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
              >
                {/* Media Preview (Left) */}
                <div className="w-full md:w-80 aspect-[9/16] md:aspect-auto bg-black border-b md:border-b-0 md:border-r border-[#1A1A1A] relative">
                  {sharingItem.type === 'video' ? (
                    <video src={sharingItem.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={sharingItem.url} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5">
                     <p className="text-[10px] font-mono text-[#666] tracking-widest uppercase mb-1">Aperçu Agency</p>
                     <p className="text-sm font-bold truncate">{sharingItem.adLabel}</p>
                  </div>
                </div>
                
                {/* Options (Right) */}
                <div className="flex-1 p-12 flex flex-col">
                  <header className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="text-5xl font-['Bebas_Neue'] tracking-wider leading-none">CANAL DE DIFFUSION</h3>
                      <p className="text-[11px] font-mono text-[#444] mt-3 uppercase tracking-[4px]">Sélectionnez les destinations</p>
                    </div>
                    <button 
                       onClick={() => setSharingItem(null)} 
                       className="w-12 h-12 rounded-full bg-[#1A1A1A] text-[#444] hover:text-white hover:bg-[#222] transition-all flex items-center justify-center active:scale-90"
                    >
                      <X size={24} />
                    </button>
                  </header>

                  <div className="grid grid-cols-2 gap-4 mb-12 flex-1 items-start content-start">
                    {SOCIAL_NETWORKS.map(net => (
                      <button 
                        key={net.id}
                        onClick={() => togglePlatform(net.id)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border transition-all relative overflow-hidden group ${shareConfig[net.id] ? "bg-[#1A1A1A] border-[#F5C518] text-white" : "bg-[#050505] border-[#1A1A1A] text-[#444] hover:border-[#333]"}`}
                      >
                         {shareConfig[net.id] && (
                            <div className="absolute top-0 right-0 w-8 h-8 bg-[#F5C518] text-black flex items-center justify-center rounded-bl-xl">
                               <CheckSquare size={16} />
                            </div>
                         )}
                        <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{net.icon}</div>
                        <div className="text-left">
                          <div className={`text-base font-bold ${shareConfig[net.id] ? "text-white" : "text-[#444]"}`}>{net.label}</div>
                          <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Optimisé Format</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button 
                       onClick={diffuseMedia}
                       disabled={!Object.values(shareConfig).some(v => v)}
                       className="flex-1 bg-[#F5C518] text-black font-['Bebas_Neue'] text-3xl py-6 rounded-[30px] hover:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(245,197,24,0.2)] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                    >
                       TÉLÉPROTÉ PARTOUT <Send size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        body { margin: 0; background: #080808; overflow: hidden; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A1A1A; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #F5C518; }
        
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-30deg); }
          100% { transform: translateX(200%) skewX(-30deg); }
        }
        
        .shine-effect { position: relative; overflow: hidden; }
        .shine-effect::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}
