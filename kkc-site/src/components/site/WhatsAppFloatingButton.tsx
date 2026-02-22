"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/250788318876";

export function WhatsAppFloatingButton() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 text-white shadow-2xl shadow-brand-orange-500/35 ring-1 ring-white/40 transition hover:from-brand-orange-400 hover:to-brand-orange-600"
      initial={{ opacity: 0, y: 18, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Chat on WhatsApp</span>
    </motion.a>
  );
}

