import { useEffect, useRef, useState } from 'react';
import {
  MessageSquare, Send, Loader2, Hash, ArrowLeft, Lock,
  Mail, User as UserIcon, LogIn,
} from 'lucide-react';
import { supabase, type ChatRoom, type ChatMessage } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Field, inputCls, ErrorBox } from '../components/Modal';

const ROOM_ICONS: Record<string, string> = {
  'banknote': '💰', 'share-2': '📱', 'briefcase': '💼', 'map-pin': '📍',
  'truck': '🚚', 'megaphone': '📢', 'message-circle': '💬',
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
}

export function ChatView() {
  const { session } = useAuth();

  if (!session) {
    return <SignInPrompt />;
  }

  return <ChatRooms />;
}

function SignInPrompt() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName } },
        });
        if (err) throw err;
        if (data.user && !data.session) {
          setError('Hesabınız oluşturuldu. Giriş yapabilirsiniz.');
          setMode('signin');
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-cream-50 border border-cream-300 shadow-card overflow-hidden">
          <div className="bg-gradient-to-br from-navy-700 to-navy-900 px-6 py-8 text-center">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-navy-500/15 items-center justify-center mb-3 ring-1 ring-navy-400/30">
              <MessageSquare className="h-7 w-7 text-navy-300" />
            </div>
            <h2 className="font-display text-xl font-bold text-cream-50">Sohbet Odaları</h2>
            <p className="text-sm text-navy-300 mt-1">Meslektaşlarınızla iletişim için giriş yapın</p>
          </div>

          <div className="p-6">
            <div className="flex gap-1 mb-5 bg-cream-100 rounded-xl p-1">
              <button onClick={() => setMode('signin')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signin' ? 'bg-navy-600 text-cream-50' : 'text-navy-600 hover:text-navy-800'}`}>Giriş Yap</button>
              <button onClick={() => setMode('signup')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-navy-600 text-cream-50' : 'text-navy-600 hover:text-navy-800'}`}>Kayıt Ol</button>
            </div>

            {error && <div className="mb-4"><ErrorBox message={error} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <Field label="Ad Soyad">
                  <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                    <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adınız Soyadınız" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
              )}
              <Field label="E-posta">
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@genihh.org" className={`${inputCls} pl-9`} />
                </div>
              </Field>
              <Field label="Şifre">
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                  <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputCls} pl-9`} />
                </div>
              </Field>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-600 text-cream-50 font-semibold hover:bg-navy-700 disabled:opacity-60 transition-colors">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> İşleniyor…</> : <><LogIn className="h-4 w-4" /> {mode === 'signin' ? 'Giriş Yap' : 'Hesap Oluştur'}</>}
              </button>
            </form>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-navy-400">Sohbet odalarına erişmek için personel girişi gerekir.</p>
      </div>
    </div>
  );
}

function ChatRooms() {
  const { session } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || 'Personel';

  useEffect(() => {
    async function loadRooms() {
      const { data, error } = await supabase.from('chat_rooms').select('*').order('name');
      if (error) console.error(error);
      setRooms((data as ChatRoom[]) || []);
      setLoadingRooms(false);
    }
    loadRooms();
  }, []);

  useEffect(() => {
    if (!activeRoom) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function loadMessages() {
      setLoadingMsgs(true);
      const { data, error } = await supabase.from('chat_messages').select('*').eq('room_id', activeRoom!.id).order('created_at', { ascending: true });
      if (error) console.error(error);
      setMessages((data as ChatMessage[]) || []);
      setLoadingMsgs(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    loadMessages();

    channel = supabase
      .channel(`room-${activeRoom.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${activeRoom.id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      })
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, [activeRoom]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !activeRoom || !session) return;
    setSending(true);
    const msgContent = content.trim();
    setContent('');
    const { error } = await supabase.from('chat_messages').insert({
      room_id: activeRoom.id,
      user_id: session.user.id,
      author_name: userName,
      content: msgContent,
    });
    setSending(false);
    if (error) {
      setContent(msgContent);
      console.error(error);
    }
  }

  if (loadingRooms) {
    return <div className="flex items-center justify-center py-20 text-navy-400"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  // Mobile: show either room list or messages
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-180px)]">
        {/* Room list */}
        <div className={`${activeRoom ? 'hidden lg:block' : 'block'} rounded-2xl bg-cream-50 border border-cream-300 shadow-soft overflow-hidden flex flex-col`}>
          <div className="px-4 py-3 border-b border-cream-200 bg-cream-100">
            <h3 className="font-display font-semibold text-navy-900 text-sm flex items-center gap-2"><Hash className="h-4 w-4 text-navy-400" /> Sohbet Odaları</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.map((room) => {
              const active = activeRoom?.id === room.id;
              return (
                <button key={room.id} onClick={() => setActiveRoom(room)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${active ? 'bg-navy-600 text-cream-50' : 'hover:bg-cream-200 text-navy-700'}`}>
                  <span className="h-9 w-9 rounded-lg bg-navy-50 flex items-center justify-center text-lg shrink-0">{ROOM_ICONS[room.icon || ''] || '💬'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{room.name}</p>
                    <p className={`text-xs truncate ${active ? 'text-navy-200' : 'text-navy-400'}`}>{room.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {activeRoom ? (
          <div className="rounded-2xl bg-cream-50 border border-cream-300 shadow-soft overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-cream-200 bg-cream-100 flex items-center gap-3">
              <button onClick={() => setActiveRoom(null)} className="lg:hidden p-1 rounded-lg text-navy-500 hover:bg-cream-200"><ArrowLeft className="h-5 w-5" /></button>
              <span className="h-9 w-9 rounded-lg bg-navy-50 flex items-center justify-center text-lg">{ROOM_ICONS[activeRoom.icon || ''] || '💬'}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-navy-900 text-sm truncate">{activeRoom.name}</h3>
                <p className="text-xs text-navy-400 truncate">{activeRoom.description}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex items-center justify-center py-10 text-navy-400"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-navy-400">
                  <MessageSquare className="h-10 w-10 mb-2 opacity-40" />
                  <p className="text-sm">Henüz mesaj yok. İlk mesajı gönderin!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.user_id === session?.user?.id;
                  const showDate = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
                  return (
                    <div key={msg.id}>
                      {showDate && <div className="flex items-center justify-center my-3"><span className="text-[11px] text-navy-400 bg-cream-100 px-3 py-1 rounded-full">{formatDate(msg.created_at)}</span></div>}
                      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                          {!isMine && <p className="text-xs font-medium text-navy-600 mb-1 px-1">{msg.author_name}</p>}
                          <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-navy-600 text-cream-50 rounded-br-md' : 'bg-cream-100 text-navy-800 rounded-bl-md border border-cream-200'}`}>
                            <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className="text-[10px] text-navy-400 mt-1 px-1">{formatTime(msg.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="px-4 py-3 border-t border-cream-200 bg-cream-100 flex items-center gap-2">
              <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mesajınızı yazın…" className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all" />
              <button type="submit" disabled={sending || !content.trim()} className="h-10 w-10 rounded-xl bg-navy-600 text-cream-50 flex items-center justify-center hover:bg-navy-700 disabled:opacity-50 transition-colors shrink-0">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden lg:flex rounded-2xl bg-cream-50 border border-cream-300 shadow-soft items-center justify-center">
            <div className="text-center text-navy-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Sohbet etmek için bir oda seçin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
