import { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Loader2, AlertCircle,
  CheckCircle2, RefreshCw, ArrowLeft, Search, Phone, MapPin, Briefcase,
  LogOut, Users,
} from 'lucide-react';
import { supabase, type StaffMember, type StaffStatus } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { issueTwoFactorCode, verifyTwoFactorCode } from '../lib/twofa';

const STATUS_META: Record<StaffStatus, { label: string; dot: string; badge: string }> = {
  active: { label: 'Aktif', dot: 'bg-navy-500', badge: 'bg-navy-50 text-navy-700 ring-navy-200' },
  on_leave: { label: 'İzinli', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  field_mission: { label: 'Saha Görevi', dot: 'bg-gold-500', badge: 'bg-cream-100 text-gold-600 ring-cream-400' },
  inactive: { label: 'Pasif', dot: 'bg-navy-300', badge: 'bg-cream-100 text-navy-500 ring-cream-300' },
};

const DEPARTMENTS = ['Saha Operasyonları', 'İnsan Kaynakları', 'Lojistik', 'Finans', 'İletişim'];

type Step = 'credentials' | 'twofa' | 'success';

export function DirectoryView() {
  const { session, manager, signOut } = useAuth();
  if (!session || !manager) return <HrLogin onSuccess={() => {}} />;
  return <Directory managerName={manager.full_name} onSignOut={signOut} />;
}

function HrLogin({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  useEffect(() => { if (step === 'twofa') inputsRef.current[0]?.focus(); }, [step]);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError || !data.session) { setError('E-posta veya şifre hatalı.'); setLoading(false); return; }
      const generated = await issueTwoFactorCode(email.trim());
      setIssuedCode(generated);
      setStep('twofa');
      setResendCooldown(30);
      await supabase.auth.signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş sırasında hata.');
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  }

  function handleCodeKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) inputsRef.current[idx - 1]?.focus();
  }

  function handleCodePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length) {
      const next = ['', '', '', '', '', ''];
      pasted.split('').forEach((d, i) => (next[i] = d));
      setCode(next);
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  }

  async function resendCode() {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      const generated = await issueTwoFactorCode(email.trim());
      setIssuedCode(generated);
      setResendCooldown(30);
    } catch { setError('Kod yeniden gönderilemedi.'); }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fullCode = code.join('');
    if (fullCode.length !== 6) { setError('6 haneli kodu eksiksiz girin.'); return; }
    setLoading(true);
    try {
      const ok = await verifyTwoFactorCode(email.trim(), fullCode);
      if (!ok) {
        setError('Kod hatalı veya süresi dolmuş.');
        setCode(['', '', '', '', '', '']);
        inputsRef.current[0]?.focus();
        setLoading(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) { setError('Kimlik doğrulama başarısız.'); setLoading(false); return; }
      setStep('success');
      setTimeout(() => onSuccess(), 1200);
    } catch {
      setError('Doğrulama sırasında hata.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-cream-50 border border-cream-300 shadow-card overflow-hidden">
          <div className="bg-gradient-to-br from-navy-800 to-navy-950 px-6 py-8 text-center">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-navy-500/15 items-center justify-center mb-3 ring-1 ring-navy-400/30"><ShieldCheck className="h-7 w-7 text-navy-300" /></div>
            <h2 className="font-display text-xl font-bold text-cream-50">
              {step === 'credentials' && 'İK Yönetici Girişi'}
              {step === 'twofa' && 'İki Faktörlü Doğrulama'}
              {step === 'success' && 'Giriş Başarılı'}
            </h2>
            <p className="text-sm text-navy-300 mt-1">
              {step === 'credentials' && 'Personel dizinine güvenli erişim'}
              {step === 'twofa' && `${email} adresine 6 haneli kod gönderildi`}
              {step === 'success' && 'Personel dizini yükleniyor…'}
            </p>
          </div>

          <div className="p-6">
            {error && <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700 animate-fade-in"><AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /><span>{error}</span></div>}

            {step === 'credentials' && (
              <form onSubmit={handleCredentials} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">E-posta</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ik@genihh.org" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-cream-100 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent focus:bg-cream-50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Şifre</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-cream-100 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent focus:bg-cream-50 transition-all" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-600 text-cream-50 font-semibold hover:bg-navy-700 disabled:opacity-60 transition-colors">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Doğrulanıyor…</> : <>Devam Et <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
            )}

            {step === 'twofa' && (
              <form onSubmit={verifyCode} className="space-y-5 animate-fade-in">
                <div className="flex justify-center"><div className="inline-flex h-12 w-12 rounded-xl bg-navy-50 items-center justify-center ring-1 ring-navy-200"><KeyRound className="h-6 w-6 text-navy-600" /></div></div>
                <p className="text-center text-sm text-navy-600">Doğrulama kodunu girin</p>
                {issuedCode && <p className="text-center text-xs text-navy-400">Demo ortamı — kod: <span className="font-mono font-semibold text-navy-600">{issuedCode}</span></p>}
                <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                  {code.map((d, i) => (
                    <input key={i} ref={(el) => { inputsRef.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d} onChange={(e) => handleCodeChange(i, e.target.value)} onKeyDown={(e) => handleCodeKeyDown(i, e)} className="h-14 w-12 text-center text-xl font-bold rounded-xl border border-cream-300 bg-cream-100 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent focus:bg-cream-50 transition-all" />
                  ))}
                </div>
                <button type="submit" disabled={loading || code.join('').length !== 6} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-600 text-cream-50 font-semibold hover:bg-navy-700 disabled:opacity-50 transition-colors">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Doğrulanıyor…</> : <>Doğrula ve Giriş <ArrowRight className="h-4 w-4" /></>}
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={() => { setStep('credentials'); setError(null); }} className="flex items-center gap-1 text-navy-500 hover:text-navy-800 transition-colors"><ArrowLeft className="h-4 w-4" /> Geri</button>
                  <button type="button" onClick={resendCode} disabled={resendCooldown > 0} className="flex items-center gap-1 text-navy-600 hover:text-navy-700 disabled:text-navy-300 disabled:cursor-not-allowed transition-colors"><RefreshCw className="h-3.5 w-3.5" />{resendCooldown > 0 ? `Yeniden (${resendCooldown}s)` : 'Kodu Yeniden Gönder'}</button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
                <div className="h-16 w-16 rounded-full bg-navy-50 flex items-center justify-center mb-4 animate-pulse-ring"><CheckCircle2 className="h-9 w-9 text-navy-600" /></div>
                <p className="font-display text-lg font-semibold text-navy-900">Hoş geldiniz!</p>
                <p className="text-sm text-navy-500 mt-1">Personel dizini yükleniyor…</p>
              </div>
            )}
          </div>
        </div>

        {step === 'credentials' && (
          <div className="mt-4 rounded-xl bg-cream-100 border border-cream-300 px-4 py-3 text-xs text-navy-500">
            <p className="font-medium text-navy-700 mb-0.5">Demo İK giriş bilgileri</p>
            <p>E-posta: <span className="font-mono text-navy-700">ik@yardimvakfi.org</span></p>
            <p>Şifre: <span className="font-mono text-navy-700">Helpdesk2025!</span></p>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-navy-400 flex items-center justify-center gap-1.5"><Lock className="h-3 w-3" /> 2FA korumalı · SSL şifreli</p>
      </div>
    </div>
  );
}

function Directory({ managerName, onSignOut }: { managerName: string; onSignOut: () => void }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('all');
  const [selected, setSelected] = useState<StaffMember | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('staff').select('*').order('first_name', { ascending: true });
      if (error) console.error(error);
      setStaff((data as StaffMember[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = staff.filter((s) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) || (s.position || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
    const matchesDept = dept === 'all' || s.department === dept;
    return matchesQuery && matchesDept;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-navy-600 flex items-center justify-center text-cream-50 font-semibold">{managerName.charAt(0)}</div>
          <div><p className="text-sm font-semibold text-navy-900">{managerName}</p><p className="text-xs text-navy-500">İK Yöneticisi · Giriş yapıldı</p></div>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-navy-600 hover:bg-cream-200 transition-colors"><LogOut className="h-4 w-4" /> Çıkış</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="İsim, görev veya e-posta ara…" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all" />
        </div>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className="px-3 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 cursor-pointer">
          <option value="all">Tüm Departmanlar</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-navy-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-navy-400"><Users className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>Eşleşen personel bulunamadı.</p></div>
      ) : (
        <>
          <p className="text-sm text-navy-500 mb-3">{filtered.length} personel</p>
          <div className="overflow-x-auto rounded-xl bg-cream-50 border border-cream-300 shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-300 text-left text-xs text-navy-500 uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Ad Soyad</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Departman</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Görev</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">Konum</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const sm = STATUS_META[s.status];
                  return (
                    <tr key={s.id} onClick={() => setSelected(s)} className="border-b border-cream-200 last:border-0 hover:bg-cream-100 cursor-pointer transition-colors animate-fade-in">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {s.avatar_url ? <img src={s.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="h-8 w-8 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-xs font-semibold">{s.first_name.charAt(0)}</div>}
                          <div><p className="font-medium text-navy-900">{s.first_name} {s.last_name}</p><p className="text-xs text-navy-400">{s.email}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-navy-600 hidden sm:table-cell">{s.department || '—'}</td>
                      <td className="px-4 py-3 text-navy-600 hidden md:table-cell">{s.position || '—'}</td>
                      <td className="px-4 py-3 text-navy-600 hidden lg:table-cell">{s.location || '—'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ring-1 ${sm.badge}`}><span className={`h-1.5 w-1.5 rounded-full ${sm.dot}`} /> {sm.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)}>
          <div className="bg-cream-50 rounded-2xl max-w-md w-full shadow-elevated animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-gradient-to-br from-navy-700 to-navy-900 p-6 text-cream-50">
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">✕</button>
              <div className="flex items-center gap-4">
                {selected.avatar_url ? <img src={selected.avatar_url} alt={selected.first_name} className="h-16 w-16 rounded-full object-cover ring-4 ring-cream-50/20" /> : <div className="h-16 w-16 rounded-full bg-white/15 flex items-center justify-center text-xl font-semibold ring-4 ring-cream-50/20">{selected.first_name.charAt(0)}{selected.last_name.charAt(0)}</div>}
                <div>
                  <h2 className="font-display text-xl font-bold">{selected.first_name} {selected.last_name}</h2>
                  <p className="text-navy-200 text-sm">{selected.position || '—'}</p>
                  <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs bg-white/15 px-2 py-0.5 rounded-full"><span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[selected.status].dot}`} /> {STATUS_META[selected.status].label}</span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                { icon: Briefcase, label: 'Departman', value: selected.department },
                { icon: MapPin, label: 'Aktif Görev Konumu', value: selected.location },
                { icon: Mail, label: 'E-posta', value: selected.email },
                { icon: Phone, label: 'Telefon', value: selected.phone },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3 py-2 border-b border-cream-200 last:border-0">
                    <span className="h-9 w-9 rounded-lg bg-cream-100 flex items-center justify-center text-navy-500 shrink-0"><Icon className="h-4 w-4" /></span>
                    <div><p className="text-xs text-navy-400">{row.label}</p><p className="text-sm text-navy-800 font-medium">{row.value || '—'}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
