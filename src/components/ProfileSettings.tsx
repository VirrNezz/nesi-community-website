import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Check, AlertTriangle, Shield, Fingerprint, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useProfile } from '../ProfileContext';

export default function ProfileSettings() {
  const { profilePic, updateProfilePic } = useProfile();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file size (10MB maximum)
    if (file.size > 10 * 1024 * 1024) {
      setError("PAYLOAD_EXCEEDS_MAX_CAPACITY: File exceeds 10MB limit.");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("INVALID_FILE_SIGNATURE: Only image payloads are permitted.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    try {
      const response = await fetch("/api/upload-pfp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP_GATEWAY_ERROR: Status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.url) {
        updateProfilePic(data.url);
        setSuccess(true);
        // Clear success message after 4 seconds
        setTimeout(() => setSuccess(false), 4000);
      } else {
        throw new Error(data.error || "UNKNOWN_UPLOAD_HANDSHAKE_FAILURE");
      }
    } catch (err: any) {
      setError(err.message || "NETWORK_TRANSMISSION_FAILED: Connection terminated.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border border-cyan-500/30 rounded-lg p-5 md:p-6 bg-slate-950/40 backdrop-blur-md relative overflow-hidden transition-all duration-300">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
      
      {/* Laser line design */}
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

      <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-3 mb-5">
        <Shield className="w-4.5 h-4.5 text-cyan-400" />
        <h3 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-100 bg-clip-text text-transparent">
          CORE IDENTITY MANAGEMENT
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Left Side: Avatar Preview */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-400 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative w-24 h-24 rounded-full border-2 border-cyan-400 overflow-hidden bg-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            {profilePic ? (
              <img 
                src={profilePic} 
                alt="Profile Matrix Mirror" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=nesinezz';
                }}
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-cyan-500/50" />
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Upload controls & instructions */}
        <div className="flex-1 w-full space-y-4">
          <div className="text-left font-mono text-[10.5px] text-slate-400 leading-relaxed">
            <span className="text-cyan-400 font-bold block mb-1">SECURE TERMINAL BROADCAST:</span>
            Drag and drop your personalized avatar matrix below, or click to load a local PNG/JPG asset from your file system. Loaded assets will instantly replicate across all global navigation elements in real-time.
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerSelect}
            className={`border border-dashed rounded-md p-4 text-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]' 
                : 'border-cyan-800/30 hover:border-cyan-500/50 hover:bg-slate-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
              disabled={loading}
            />

            <div className="flex flex-col items-center gap-1.5 py-1">
              <Upload className={`w-5 h-5 transition-transform ${dragActive ? 'text-cyan-400 -translate-y-0.5' : 'text-slate-500 group-hover:text-cyan-400'}`} />
              <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest font-bold">
                {dragActive ? "DROP FILE TO INGEST" : "CLICK OR DRAG IMAGE"}
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">
                PNG, JPG OR GIF UP TO 10MB
              </span>
            </div>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-start gap-2 p-2.5 bg-red-950/30 border border-red-500/20 rounded text-red-400 font-mono text-[10px] text-left"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold uppercase block text-red-500 mb-0.5">MATRIX_ERROR</span>
                  {error}
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-start gap-2 p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded text-emerald-400 font-mono text-[10px] text-left"
              >
                <Check className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold uppercase block text-emerald-400 mb-0.5">SYNC_COMPLETE</span>
                  Avatar broadcasted successfully. Decentralized nodes updated.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
