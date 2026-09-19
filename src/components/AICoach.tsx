'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AICoachProps {
  worldName?: string;
  adventureTitle?: string;
}

// Configurable API endpoints
const AI_CONFIG = {
  // Primary: OpenRouter (supports many models including Claude, GPT)
  primaryEndpoint: process.env.NEXT_PUBLIC_AI_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions',
  primaryModel: process.env.NEXT_PUBLIC_AI_MODEL || 'anthropic/claude-3.5-haiku',
  fallbackEndpoint: process.env.NEXT_PUBLIC_AI_FALLBACK || 'https://api.openai.com/v1/chat/completions',
  fallbackModel: process.env.NEXT_PUBLIC_AI_MODEL_FALLBACK || 'gpt-4o-mini',
};

const SYSTEM_PROMPT = `Tu es "Coach DE", l'assistant intelligent de Digital Explorers. 
Tu t'adresses à un jeune Africain de 12-18 ans curieux du numérique.
Rôle: aider à comprendre les concepts, encourager, donner des indices sans donner les réponses directes.
Style: chaleureux, motivant, en français simple. Utilise des emojis occasionnellement.
Contexte éducatif: Web, IA, Coding, Blockchain, Design, Cybersécurité, Innovation.
Si la question ne concerne pas le numérique ou l'éducation, redirige poliment vers les sujets de la plateforme.`;

export default function AICoach({ worldName, adventureTitle }: AICoachProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<'starter' | 'premium' | 'vip'>('premium');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = typeof window !== 'undefined' ? localStorage.getItem('de_profile') : null;
  const pseudonym = profile ? JSON.parse(profile).pseudonym : 'Explorateur';

  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = `Salut ${pseudonym}! 👋 Je suis Coach DE, ton assistant IA.\n\n`;
      const context = worldName ? `Tu explorais le monde **${worldName}**. ` : '';
      const adv = adventureTitle ? `Aventure en cours: *${adventureTitle}*.` : '';
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: `${greeting}${context}${adv}\n\nPose-moi n'importe quelle question sur ce que tu apprends, je suis là pour t'aider! 🚀`,
        timestamp: Date.now()
      }]);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open, pseudonym, worldName, adventureTitle, messages.length]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    const contextMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: text }
    ];

    try {
      // Try primary endpoint first
      const response = await fetch(AI_CONFIG.primaryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_KEY || ''}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Digital Explorers',
        },
        body: JSON.stringify({
          model: AI_CONFIG.primaryModel,
          messages: contextMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Je ne peux pas répondre pour le moment. Réessaie!';

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now()
      }]);
    } catch (err) {
      // Fallback to secondary endpoint
      try {
        const response2 = await fetch(AI_CONFIG.fallbackEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_KEY || ''}`,
          },
          body: JSON.stringify({
            model: AI_CONFIG.fallbackModel,
            messages: contextMessages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        if (!response2.ok) throw new Error(`Fallback API error: ${response2.status}`);
        const data2 = await response2.json();
        const reply = data2.choices?.[0]?.message?.content || 'Je ne peux pas répondre pour le moment.';
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now()
        }]);
      } catch (e2) {
        setError('Le service IA est temporairement indisponible. Réessaie plus tard.');
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Le Coach IA est momentanément indisponible. Reviens dans quelques instants! 💪',
          timestamp: Date.now()
        }]);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const quickActions = [
    { icon: '💡', label: "Explique-moi", query: "Peux-tu m'expliquer ce concept de manière simple?" },
    { icon: '🎯', label: "Donne-moi un indice", query: "Donne-moi un indice pour continuer sans me donner la réponse." },
    { icon: '📝', label: "Résume", query: "Peux-tu résumer ce que j'ai appris jusqu'à présent?" },
    { icon: '🚀', label: "Challenge", query: "Propose-moi un défi ou une question pour tester mes connaissances." },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all hover:scale-110 ${open ? 'rotate-0' : ''}`}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-sm bg-[#111827] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: 'min(500px, 80vh)' }}>
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Coach IA</div>
              <div className="text-xs text-violet-400 flex items-center gap-1"><Sparkles className="w-3 h-3" /> {tier === 'starter' ? 'Basique' : tier === 'premium' ? 'Premium' : 'VIP'}</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              En ligne
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-[#0f172a] text-gray-200 border border-white/5'}`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-xs opacity-50 mt-1">{new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#0f172a] border border-white/5 px-3 py-2 rounded-xl text-sm text-gray-400">
                  <div className="flex gap-1"><span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/><span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/><span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/></div>
                </div>
              </div>
            )}
            {error && <div className="text-xs text-red-400 text-center">{error}</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          {messages.length < 3 && (
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
              {quickActions.map((qa, i) => (
                <button key={i} onClick={() => sendMessage(qa.query)} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                  {qa.icon} {qa.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Pose ta question..."
              className="flex-1 bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
