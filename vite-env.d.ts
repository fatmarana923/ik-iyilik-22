import { useEffect, useState } from 'react';
import { Heart, Shirt, BedDouble, Phone, MapPin, Loader2, ChevronDown } from 'lucide-react';
import { supabase, type PartnerDiscount } from '../lib/supabase';

const CATEGORIES = [
  { key: 'saglik', label: 'Sağlık', icon: Heart, color: 'text-red-600 bg-red-50' },
  { key: 'giyim', label: 'Giyim', icon: Shirt, color: 'text-navy-600 bg-navy-50' },
  { key: 'konaklama', label: 'Konaklama', icon: BedDouble, color: 'text-gold-600 bg-cream-100' },
] as const;

export function PartnersView() {
  const [partners, setPartners] = useState<PartnerDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saglik');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('partner_discounts').select('*').order('name');
      if (error) console.error(error);
      setPartners((data as PartnerDiscount[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = partners.filter((p) => p.category === activeTab);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
      <div className="flex gap-2 mb-6 bg-cream-50 border border-cream-300 rounded-xl p-1.5 shadow-soft overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = activeTab === cat.key;
          return (
            <button key={cat.key} onClick={() => { setActiveTab(cat.key); setExpanded(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${active ? 'bg-navy-700 text-cream-50 shadow-soft' : 'text-navy-600 hover:bg-cream-200'}`}>
              <Icon className="h-4 w-4" /> {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-cream-50/20' : 'bg-cream-200 text-navy-500'}`}>{partners.filter((p) => p.category === cat.key).length}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-navy-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => {
            const cat = CATEGORIES.find((c) => c.key === p.category)!;
            const Icon = cat.icon;
            const isOpen = expanded === p.id;
            return (
              <div key={p.id} className="rounded-xl bg-cream-50 border border-cream-300 shadow-soft overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <button onClick={() => setExpanded(isOpen ? null : p.id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-cream-100 transition-colors">
                  <span className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}><Icon className="h-6 w-6" /></span>
                  <div className="flex-1 min-w-0"><h3 className="font-semibold text-navy-900 truncate">{p.name}</h3><p className="text-sm text-navy-600 font-medium">{p.discount_text}</p></div>
                  <ChevronDown className={`h-5 w-5 text-navy-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 animate-fade-in">
                    <div className="border-t border-cream-200 pt-3 space-y-3">
                      {p.description && <p className="text-sm text-navy-600 leading-relaxed">{p.description}</p>}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {p.phone && <span className="flex items-center gap-1.5 text-navy-600"><Phone className="h-4 w-4 text-navy-400" /> {p.phone}</span>}
                        {p.address && <span className="flex items-center gap-1.5 text-navy-600"><MapPin className="h-4 w-4 text-navy-400" /> {p.address}</span>}
                      </div>
                      <button onClick={() => alert(`${p.name} ile iletişime geçildi. Personel kimliğinizle indirimden yararlanabilirsiniz.`)} className="px-4 py-2 rounded-lg bg-navy-600 text-cream-50 text-sm font-medium hover:bg-navy-700 transition-colors">İletişime Geç</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-center py-20 text-navy-400">Bu kategoride henüz firma yok.</p>}
        </div>
      )}
    </div>
  );
}
