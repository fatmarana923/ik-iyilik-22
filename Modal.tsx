import { useEffect, useState } from 'react';
import {
  Megaphone, Pin, AlertCircle, Handshake, Users, Tag, Stethoscope,
  FileText, Calendar, ArrowRight, TrendingUp, MessageSquare,
} from 'lucide-react';
import { supabase, type Announcement, type NewsItem } from '../lib/supabase';
import type { ViewKey } from '../App';

const PRIORITY_STYLES: Record<string, { ring: string; text: string; bg: string; label: string }> = {
  high: { ring: 'ring-red-200', text: 'text-red-700', bg: 'bg-red-50', label: 'Acil' },
  normal: { ring: 'ring-navy-200', text: 'text-navy-700', bg: 'bg-navy-50', label: 'Normal' },
  low: { ring: 'ring-cream-400', text: 'text-cream-600', bg: 'bg-cream-100', label: 'Düşük' },
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function DashboardView({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: annData }, { data: newsData }] = await Promise.all([
        supabase.from('announcements').select('*').eq('published', true).order('pinned', { ascending: false }).order('published_at', { ascending: false }),
        supabase.from('news').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3),
      ]);
      setAnnouncements((annData as Announcement[]) || []);
      setNews((newsData as NewsItem[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const quickLinks: { key: ViewKey; label: string; icon: typeof Handshake; desc: string; color: string }[] = [
    { key: 'partners', label: 'Anlaşmalı Firmalar', icon: Handshake, desc: 'İndirimler & avantajlar', color: 'text-navy-600 bg-navy-50' },
    { key: 'clubs', label: 'Sosyal Kulüpler', icon: Users, desc: 'Etkinlikler & aktiviteler', color: 'text-gold-600 bg-cream-100' },
    { key: 'classifieds', label: 'Satış İlanları', icon: Tag, desc: 'Pazar yeri', color: 'text-navy-600 bg-navy-50' },
    { key: 'doctor', label: 'Doktor Randevu', icon: Stethoscope, desc: 'İş yeri hekimi', color: 'text-navy-600 bg-navy-50' },
    { key: 'documents', label: 'Dokümanlar', icon: FileText, desc: 'Prosedür & belgeler', color: 'text-navy-600 bg-navy-50' },
    { key: 'chat', label: 'Sohbet Odaları', icon: MessageSquare, desc: 'Grup sohbetleri', color: 'text-navy-600 bg-navy-50' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 text-cream-50 p-6 sm:p-8 shadow-card">
        <div className="absolute top-0 right-0 w-64 h-64 bg-navy-500/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative">
          <p className="text-navy-200 text-sm font-medium mb-1">Hoş geldiniz</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">Genç İHH Personel Portalı</h2>
          <p className="text-navy-100 text-sm max-w-lg">
            Duyurularınızı takip edin, kulüp etkinliklerine katılın, randevu oluşturun ve meslektaşlarınızla sohbet edin.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => onNavigate('partners')} className="px-4 py-2 rounded-lg bg-cream-50 text-navy-800 text-sm font-semibold hover:bg-cream-100 transition-colors">İndirimleri Gör</button>
            <button onClick={() => onNavigate('chat')} className="px-4 py-2 rounded-lg bg-navy-600 text-cream-50 text-sm font-semibold hover:bg-navy-500 transition-colors">Sohbete Katıl</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Aktif Duyuru', value: announcements.length, icon: Megaphone, color: 'text-navy-600' },
          { label: 'Sosyal Kulüp', value: 6, icon: Users, color: 'text-gold-600' },
          { label: 'İndirim Firması', value: 12, icon: Handshake, color: 'text-navy-600' },
          { label: 'Sohbet Odası', value: 6, icon: MessageSquare, color: 'text-navy-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl bg-cream-50 border border-cream-300 p-4 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className={`h-8 w-8 rounded-lg bg-navy-50 flex items-center justify-center ${stat.color}`}><Icon className="h-4 w-4" /></span>
              </div>
              <p className="font-display text-2xl font-bold text-navy-900">{stat.value}</p>
              <p className="text-xs text-navy-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="font-display font-semibold text-navy-900 mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-navy-500" /> Hızlı Erişim</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button key={link.key} onClick={() => onNavigate(link.key)}
                className="group rounded-xl bg-cream-50 border border-cream-300 p-4 text-left hover:shadow-card hover:border-navy-300 hover:-translate-y-0.5 transition-all duration-200">
                <span className={`inline-flex h-10 w-10 rounded-lg items-center justify-center ${link.color} mb-2`}><Icon className="h-5 w-5" /></span>
                <p className="text-sm font-semibold text-navy-900 group-hover:text-navy-700">{link.label}</p>
                <p className="text-xs text-navy-400">{link.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-display font-semibold text-navy-900 mb-3 flex items-center gap-2"><Megaphone className="h-4 w-4 text-navy-500" /> Resmi Duyurular</h3>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="rounded-xl bg-cream-50 border border-cream-300 p-4"><div className="h-4 w-2/3 skeleton rounded mb-2" /><div className="h-3 w-full skeleton rounded" /></div>))}</div>
          ) : (
            <div className="space-y-3">
              {announcements.slice(0, 5).map((a, i) => {
                const p = PRIORITY_STYLES[a.priority] || PRIORITY_STYLES.normal;
                return (
                  <div key={a.id} className={`relative rounded-xl bg-cream-50 border border-cream-300 p-4 shadow-soft animate-fade-in ${a.pinned ? 'ring-2 ring-navy-200' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
                    {a.pinned && <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-semibold text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full"><Pin className="h-3 w-3" /> Sabit</span>}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ring-1 ${p.ring} ${p.text} ${p.bg}`}><AlertCircle className="h-3 w-3" /> {p.label}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-navy-900 mb-1 pr-8">{a.title}</h4>
                    <p className="text-xs text-navy-500 line-clamp-2">{a.body}</p>
                    <p className="text-[11px] text-navy-400 mt-2">{formatDate(a.published_at)}</p>
                  </div>
                );
              })}
              {announcements.length === 0 && <p className="text-sm text-navy-400 text-center py-8">Henüz duyuru yok.</p>}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display font-semibold text-navy-900 mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-navy-500" /> Son Haberler</h3>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="rounded-xl bg-cream-50 border border-cream-300 p-4"><div className="h-4 w-2/3 skeleton rounded mb-2" /><div className="h-3 w-full skeleton rounded" /></div>))}</div>
          ) : (
            <div className="space-y-3">
              {news.map((n, i) => (
                <button key={n.id} onClick={() => onNavigate('documents')} className="group block w-full text-left rounded-xl bg-cream-50 border border-cream-300 overflow-hidden hover:shadow-card hover:border-navy-300 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  {n.image_url && <div className="relative h-32 overflow-hidden"><img src={n.image_url} alt={n.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                  <div className="p-4">
                    {n.category && <span className="inline-block text-[11px] font-semibold text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full mb-2">{n.category}</span>}
                    <h4 className="font-semibold text-sm text-navy-900 group-hover:text-navy-700 line-clamp-2">{n.title}</h4>
                    <p className="text-xs text-navy-500 line-clamp-2 mt-1">{n.summary}</p>
                    <div className="flex items-center gap-1.5 text-xs text-navy-400 mt-2"><Calendar className="h-3.5 w-3.5" /> {formatDate(n.published_at)}<ArrowRight className="h-3.5 w-3.5 ml-auto group-hover:translate-x-0.5 transition-transform" /></div>
                  </div>
                </button>
              ))}
              {news.length === 0 && <p className="text-sm text-navy-400 text-center py-8">Henüz haber yok.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
