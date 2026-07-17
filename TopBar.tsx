import { useEffect, useState } from 'react';
import { Users, Calendar, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase, type SocialClub, type ClubEvent } from '../lib/supabase';
import { Modal } from '../components/Modal';

const GALLERY_IMAGES = [
  'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1391941/pexels-photo-1391941.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3781170/pexels-photo-3781170.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/163064/play-stone-network-networked-163064.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/163064/play-stone-network-networked-163064.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export function ClubsView() {
  const [clubs, setClubs] = useState<SocialClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SocialClub | null>(null);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [joined, setJoined] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('social_clubs').select('*').order('name');
      if (error) console.error(error);
      setClubs((data as SocialClub[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function openClub(club: SocialClub) {
    setSelected(club);
    setEventsLoading(true);
    const { data } = await supabase.from('club_events').select('*').eq('club_id', club.id).order('event_date', { ascending: true });
    setEvents((data as ClubEvent[]) || []);
    setEventsLoading(false);
  }

  function joinClub(club: SocialClub) {
    if (joined.has(club.id)) return;
    setJoined(new Set([...joined, club.id]));
    setClubs((prev) => prev.map((c) => c.id === club.id ? { ...c, member_count: c.member_count + 1 } : c));
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center py-20 text-navy-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club, i) => {
            const isJoined = joined.has(club.id);
            return (
              <button key={club.id} onClick={() => openClub(club)}
                className="group text-left rounded-2xl bg-cream-50 border border-cream-300 overflow-hidden shadow-soft hover:shadow-card hover:border-navy-300 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="relative h-44 overflow-hidden">
                  {club.image_url && <img src={club.image_url} alt={club.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                  {club.category && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cream-50/90 backdrop-blur text-xs font-semibold text-navy-800">{club.category}</span>}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-cream-50 text-sm"><Users className="h-4 w-4" /><span className="font-medium">{club.member_count} üye</span></div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-navy-900 group-hover:text-navy-700">{club.name}</h3>
                  <p className="text-sm text-navy-500 line-clamp-2 mt-1">{club.description}</p>
                  {isJoined && <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-navy-600 bg-navy-50 px-2 py-1 rounded-full"><CheckCircle2 className="h-3.5 w-3.5" /> Üye oldunuz</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} maxWidth="max-w-2xl">
          <div className="space-y-5">
            {selected.image_url && <div className="relative h-48 rounded-xl overflow-hidden"><img src={selected.image_url} alt={selected.name} className="absolute inset-0 h-full w-full object-cover" /></div>}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-navy-600"><Users className="h-4 w-4 text-navy-400" /><span className="font-medium">{selected.member_count} üye</span></div>
              {selected.category && <span className="text-xs font-semibold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full">{selected.category}</span>}
            </div>
            {selected.description && <p className="text-sm text-navy-600 leading-relaxed">{selected.description}</p>}
            <button onClick={() => joinClub(selected)} disabled={joined.has(selected.id)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors ${joined.has(selected.id) ? 'bg-navy-50 text-navy-600 cursor-default' : 'bg-navy-600 text-cream-50 hover:bg-navy-700'}`}>
              {joined.has(selected.id) ? <><CheckCircle2 className="h-4 w-4" /> Bu kulübe üyesiniz</> : <><Users className="h-4 w-4" /> Kulübe Katıl</>}
            </button>
            <div>
              <h4 className="font-display font-semibold text-navy-900 mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-navy-500" /> Yaklaşan Etkinlikler</h4>
              {eventsLoading ? (
                <div className="flex items-center gap-2 text-sm text-navy-400 py-4"><Loader2 className="h-4 w-4 animate-spin" /> Etkinlikler yükleniyor…</div>
              ) : events.length === 0 ? (
                <p className="text-sm text-navy-400 py-4">Yaklaşan etkinlik yok.</p>
              ) : (
                <div className="space-y-2">
                  {events.map((e) => (
                    <div key={e.id} className="flex items-start gap-3 rounded-xl bg-cream-100 border border-cream-300 p-3">
                      <div className="h-10 w-10 rounded-lg bg-navy-600 text-cream-50 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-medium uppercase">{new Date(e.event_date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                        <span className="text-sm font-bold leading-none">{new Date(e.event_date).getDate()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy-900">{e.title}</p>
                        {e.location && <p className="flex items-center gap-1 text-xs text-navy-500 mt-0.5"><MapPin className="h-3 w-3" /> {e.location}</p>}
                        {e.description && <p className="text-xs text-navy-500 mt-1 line-clamp-2">{e.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-display font-semibold text-navy-900 mb-3">Geçmiş Etkinlik Galerisi</h4>
              <div className="grid grid-cols-3 gap-2">
                {GALLERY_IMAGES.map((img, i) => (<div key={i} className="aspect-square rounded-lg overflow-hidden"><img src={img} alt={`Galeri ${i + 1}`} className="h-full w-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer" /></div>))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
