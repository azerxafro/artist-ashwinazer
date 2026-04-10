import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { artistData } from '../data/artistData';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

// ── Knowledge Base ──
const knowledgeBase: { keywords: string[]; response: string; priority?: number }[] = [
  // Greetings
  {
    keywords: ['hi', 'hello', 'hey', 'yo', 'sup', 'what\'s up', 'whatsup', 'howdy', 'greetings'],
    response: 'Hey! 🔥 Welcome to Ashwin Azer\'s support page. I can help you with donations, payment methods, receipts, or anything about the artist. What do you need?',
    priority: 1,
  },
  // How to donate
  {
    keywords: ['how', 'donate', 'support', 'contribute', 'pay', 'give', 'help', 'fund'],
    response: 'Scroll up to the QR codes section! You have two options:\n\n🔴 **UPI Direct** — Scan with any UPI app (GPay, PhonePe, Paytm)\n🔵 **Razorpay** — Scan with BHIM UPI, cards, or net banking\n\nJust scan, pay any amount you want, and you\'re done! 🙏',
    priority: 2,
  },
  // Payment methods
  {
    keywords: ['upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'razorpay', 'payment', 'method', 'card', 'net banking', 'bhim'],
    response: 'We accept:\n\n• **UPI Direct** — Google Pay, PhonePe, Paytm, or any UPI app\n• **Razorpay** — BHIM UPI, debit/credit cards, net banking\n\nBoth QR codes are on this page. Scroll up to the "Choose Method" section!',
    priority: 2,
  },
  // Receipt
  {
    keywords: ['receipt', 'proof', 'confirmation', 'screenshot', 'transaction', 'id'],
    response: 'After your payment, just:\n\n1. 📸 Screenshot your payment (make sure Transaction ID is visible)\n2. ✉️ Email it to **admin@ashwinazer.me**\n3. Include your **name** and a **comment**\n\nYou\'ll get a receipt back! The email button is right below the QR codes.',
    priority: 3,
  },
  // Amount
  {
    keywords: ['amount', 'how much', 'minimum', 'maximum', 'price', 'cost', '₹', 'rupee', 'rupees', 'inr'],
    response: 'There\'s no minimum or maximum — donate whatever feels right! 💛\n\nHere are some tiers for inspiration:\n• ☕ **₹99+** — Supporter (buy me a coffee)\n• 🎵 **₹499+** — Believer (fund the next single)\n• ⭐ **₹999+** — Legend (early access to unreleased tracks)\n\nEvery rupee counts!',
    priority: 2,
  },
  // Who is Ashwin Azer
  {
    keywords: ['who', 'ashwin', 'azer', 'artist', 'about', 'lucid ash'],
    response: 'Ashwin Azer is an independent artist and producer — the founder of **Monadelta Productions**. He makes contemporary R&B and melodic Hip-Hop with two personas:\n\n🔴 **Ashwin Azer** — Hip-Hop, unfiltered, raw truth\n🟡 **Lucid Ash** — R&B, dreamlike, the alter ego\n\nDebut album **DESTINY** dropped in 2025, and **Legends & Lovers** is coming 2026! 🔥',
    priority: 2,
  },
  // Where does money go
  {
    keywords: ['where', 'money', 'go', 'goes', 'spend', 'use', 'allocation', 'transparency', 'studio'],
    response: 'Every rupee is invested back into the music:\n\n🎙️ **40%** — Studio Time\n🎬 **25%** — Music Videos\n📀 **20%** — Distribution\n🎤 **15%** — Live Shows\n\nNo middlemen. No label cuts. Straight from you to the art.',
    priority: 2,
  },
  // Monadelta
  {
    keywords: ['monadelta', 'label', 'production', 'company', 'collective'],
    response: 'Monadelta Productions is the artist-first collective founded by Ashwin Azer in 2024. Built from the ashes after a catastrophic data loss at a former distributor. It\'s an independent powerhouse — no corporate strings attached. 🏛️',
    priority: 2,
  },
  // Music / Spotify / Stream
  {
    keywords: ['music', 'spotify', 'stream', 'listen', 'apple music', 'song', 'album', 'destiny', 'legends'],
    response: 'You can stream Ashwin Azer everywhere:\n\n🟢 [Spotify](https://open.spotify.com/artist/6M1VSmwtcuwS1DnvXTGk7P)\n🔴 [Apple Music](https://music.apple.com/us/artist/ashwin-azer/1497428225)\n\n**DESTINY** (2025) — 11 tracks featuring Wa\'Cali and Marabukavi\n**Legends & Lovers** — Coming 2026!',
    priority: 2,
  },
  // Contact
  {
    keywords: ['contact', 'email', 'reach', 'message', 'dm', 'social', 'instagram', 'twitter'],
    response: 'Reach out anytime:\n\n✉️ **admin@ashwinazer.me** — for donations & receipts\n📸 [Instagram](https://instagram.com/theashwinazer)\n🐦 [Twitter](https://twitter.com/theashwinazer)\n🎬 [YouTube](https://www.youtube.com/@ashwinazer)',
    priority: 2,
  },
  // 369
  {
    keywords: ['369', 'three six nine', 'singularity', 'oneness', 'meaning'],
    response: '3 · 6 · 9 ✨\n\n"If you only knew the magnificence of the 3, 6, and 9, then you would have the key to the universe." — Nikola Tesla\n\nIt\'s a core part of Ashwin Azer\'s philosophy. Singularity & Oneness. You\'ll see it everywhere on the site.',
    priority: 2,
  },
  // Thanks
  {
    keywords: ['thanks', 'thank', 'thx', 'appreciate', 'grateful', 'awesome', 'great', 'cool', 'nice'],
    response: 'Much love! 🙏🔥 Your support means more than you know. Every bit of energy helps keep the independent music alive. 3 · 6 · 9 ✨',
    priority: 1,
  },
  // Safety / Trust
  {
    keywords: ['safe', 'secure', 'trust', 'legit', 'scam', 'real', 'genuine', 'fraud'],
    response: 'Totally legit! ✅\n\n• **UPI Direct** — payment goes straight to Ashwin Azer\'s verified UPI\n• **Razorpay** — India\'s largest payment gateway, registered to Ashwin Ramesh\n\nBoth are secure, instant, and you get a receipt from your payment app automatically.',
    priority: 3,
  },
  // Refund
  {
    keywords: ['refund', 'return', 'cancel', 'reverse', 'back'],
    response: 'Since these are voluntary donations, we generally don\'t process refunds. However, if there\'s an issue with your payment, email **admin@ashwinazer.me** with your Transaction ID and we\'ll sort it out. 🤝',
    priority: 3,
  },
  // International
  {
    keywords: ['international', 'abroad', 'foreign', 'outside india', 'usd', 'dollar', 'overseas'],
    response: 'Currently, the QR codes work best for **Indian UPI payments**. For international supporters, the **Razorpay QR** may support international cards. Email **admin@ashwinazer.me** for alternative payment methods if you\'re outside India! 🌍',
    priority: 3,
  },
];

const fallbackResponses = [
  'Hmm, I\'m not sure about that. Try asking about donations, payment methods, receipts, or anything about Ashwin Azer! 🎵',
  'I didn\'t quite catch that. I can help with: how to donate, payment options, getting a receipt, or info about the artist. What\'s up?',
  'Not sure I have an answer for that one. Ask me about supporting Ashwin Azer — donations, QR codes, receipts, the music, or Monadelta! 🔥',
];

function findResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  // Score each knowledge entry
  let bestMatch: { response: string; score: number } | null = null;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length + (entry.priority || 0);
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { response: entry.response, score };
    }
  }

  if (bestMatch) return bestMatch.response;
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

const SupportChatbot: React.FC = () => {
  const { theme } = artistData;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: 'Hey! 👋 I\'m here to help with anything about donations, payments, or Ashwin Azer. Ask away!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    const delay = Math.random() * 800 + 600;
    setTimeout(() => {
      const response = findResponse(trimmed);
      const botMsg: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Parse markdown-lite (bold, links)
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      // Bold
      const boldMatch = part.match(/^\*\*(.+)\*\*$/);
      if (boldMatch) return <strong key={i} className="text-white/90 font-semibold">{boldMatch[1]}</strong>;
      // Link
      const linkMatch = part.match(/^\[(.+)\]\((.+)\)$/);
      if (linkMatch) return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
           className="underline underline-offset-2 transition-colors hover:text-white"
           style={{ color: theme.primaryColor }}>
          {linkMatch[1]}
        </a>
      );
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* ── Floating Chat Button ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          background: isOpen ? '#1a1a1a' : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientTo})`,
          boxShadow: isOpen ? 'none' : `0 0 30px ${theme.primaryColor}40`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-5 h-5 text-white/60" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-5 h-5 text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ background: '#0a0a0a' }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: `${theme.primaryColor}20` }}>
                <Bot className="w-4 h-4" style={{ color: theme.primaryColor }} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em]">AZER SUPPORT</p>
                <p className="text-[9px] text-white/30 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  ONLINE
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[360px] overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{
                      background: msg.role === 'bot' ? `${theme.primaryColor}15` : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {msg.role === 'bot' ? (
                      <Bot className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white/40" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-[12px] leading-[1.7] whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-white/[0.08] text-white/80 rounded-br-sm'
                        : 'border border-white/5 text-white/60 rounded-bl-sm'
                    }`}
                    style={msg.role === 'bot' ? { background: 'rgba(255,255,255,0.02)' } : undefined}
                  >
                    {renderText(msg.text)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="flex gap-2.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: `${theme.primaryColor}15` }}
                  >
                    <Bot className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
                  </div>
                  <div className="border border-white/5 bg-white/[0.02] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                        animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/5 focus-within:border-white/10 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about donations..."
                  className="flex-1 bg-transparent text-[12px] text-white/80 placeholder-white/20 outline-none tracking-wide"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-20"
                  style={{
                    background: input.trim() ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientTo})` : 'transparent',
                  }}
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
              <p className="text-center text-[8px] text-white/10 tracking-[0.2em] mt-2">
                POWERED BY AZER AI · 3 · 6 · 9
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatbot;
