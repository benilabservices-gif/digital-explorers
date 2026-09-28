'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

interface AICoachProps {
  worldName?: string;
  adventureTitle?: string;
}

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
  const [status, setStatus] = useState<'ok' | 'error'>('ok');
  const [pseudonym, setPseudonym] = useState('Explorateur');
  const idCounter = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nextId = useCallback(() => ++idCounter.current, []);

  // Pseudonyme depuis la session (plus de localStorage de_profile).
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const metaName = (user.user_metadata as Record<string, string> | null)?.full_name;
      setPseudonym(metaName || user.email?.split('@')[0] || 'Explorateur');
    });
  }, []);

  // Salutation seedée à l'ouverture, dans le handler (pas de set-state en effet).
  function toggleOpen() {
    const next = !open;
    if (next && messages.length === 0 && status === 'ok') {
      const greeting = `Salut ${pseudonym}! 👋 Je suis Coach DE, ton assistant IA.\n\n`;
      const context = worldName ? `Tu explorais le monde **${worldName}**. ` : '';
      const adv = adventureTitle ? `Aventure en cours: *${adventureTitle}*.` : '';
      setMessages([{
        id: nextId(),
        role: 'assistant',
        content: `${greeting}${context}${adv}\n\nPose-moi n'importe quelle question sur ce que tu apprends, je suis là pour t'aider! 🚀`,
      }]);
    }
    setOpen(next);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: nextId(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const contextMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: text },
    ];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'API error');

      const reply = data.choices?.[0]?.message?.content || 'Je ne peux pas répondre pour le moment.';

      setStatus('ok');
      setMessages(prev => [...prev, {
        id: nextId(),
        role: 'assistant',
        content: reply,
      }]);
    } catch {
      // Pas de requête de test au montage : on ne marque l'erreur
      // que si un vrai message échoue.
      setStatus('error');
      setMessages(prev => [...prev, {
        id: nextId(),
        role: 'assistant',
        content: "Désolé, le Coach IA n'est pas disponible pour le moment. Réessaie plus tard! 💪",
      }]);
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
    { icon: '🚀', label: "Challenge", query: "Propose-moi un défi pour tester mes connaissances." },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all hover:scale-110`}
        title="Ouvrir le Coach IA"
      >
        <MessageCircle className="w-6 h-6 text-white" />
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
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {status === 'ok' ? 'Prêt' : 'Indisponible'}
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
          </div>

          {messages.length === 0 && status === 'ok' && (
            <div className="flex-1 p-6 text-center text-gray-400 text-sm">Chargement...</div>
          )}

          {status === 'error' && messages.length === 0 && (
            <div className="flex-1 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-sm text-gray-300 mb-2">Coach IA indisponible</p>
              <p className="text-xs text-gray-500">Demande à un admin d&apos;ajouter la clé API.</p>
            </div>
          )}

          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${m.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-sm'
                    : 'bg-white/5 text-gray-200 rounded-bl-sm'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl px-3 py-2 text-sm text-gray-400">Coach réfléchit…</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {messages.length > 0 && messages.length < 3 && (
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
              {quickActions.map((qa, i) => (
                <button key={i} onClick={() => sendMessage(qa.query)} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                  {qa.icon} {qa.label}
                </button>
              ))}
            </div>
          )}

          {messages.length > 0 && (
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
          )}
        </div>
      )}
    </>
  );
}
