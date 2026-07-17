import { useEffect, useState } from 'react';
import { Search, Plus, MapPin, Tag, Phone, User, Loader2, ImageIcon } from 'lucide-react';
import { supabase, type ClassifiedAd } from '../lib/supabase';
import { Modal, Field, inputCls, ErrorBox } from '../components/Modal';

const CATEGORIES = ['Araba', 'Ev', 'Elektronik', 'Mobilya', 'Spor', 'Diğer'];
const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Kocaeli'];

function formatPrice(n: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export function ClassifiedsView() {
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from('classified_ads').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    setAds((data as ClassifiedAd[]) || []);
    setLoading(false);
  }

  const filtered = ads.filter((a) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || a.title.toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q);
    const matchesCat = catFilter === 'all' || a.category === catFilter;
    const matchesCity = cityFilter === 'all' || a.city === cityFilter;
    return matchesQuery && matchesCat && matchesCity;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="İlan ara…" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-600 text-cream-50 text-sm font-semibold hover:bg-navy-700 transition-colors shadow-soft"><Plus className="h-4 w-4" /> İlan Ver</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-navy-500 font-medium shrink-0">Kategori:</span>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 cursor-pointer">
            <option value="all">Tümü</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-navy-500 font-medium shrink-0">Şehir:</span>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 cursor-pointer">
            <option value="all">Tümü</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-navy-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-navy-400"><Tag className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>Filtrelerle eşleşen ilan bulunamadı.</p></div>
      ) : (
        <>
          <p className="text-sm text-navy-500 mb-3">{filtered.length} ilan listeleniyor</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ad, i) => (
              <div key={ad.id} className="group rounded-2xl bg-cream-50 border border-cream-300 overflow-hidden shadow-soft hover:shadow-card hover:border-navy-300 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="relative h-40 overflow-hidden bg-cream-200">
                  {ad.image_url ? <img src={ad.image_url} alt={ad.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="absolute inset-0 flex items-center justify-center text-navy-300"><ImageIcon className="h-10 w-10" /></div>}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cream-50/90 backdrop-blur text-xs font-semibold text-navy-800">{ad.category}</span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-navy-700 text-cream-50 text-xs font-bold">{formatPrice(ad.price)}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-navy-900 group-hover:text-navy-700 line-clamp-1">{ad.title}</h3>
                  <p className="text-sm text-navy-500 line-clamp-2 mt-1">{ad.description}</p>
                  <div className="mt-3 pt-3 border-t border-cream-200 space-y-1">
                    <p className="flex items-center gap-1.5 text-xs text-navy-500"><MapPin className="h-3.5 w-3.5 text-navy-400" /> {ad.city}</p>
                    <p className="flex items-center gap-1.5 text-xs text-navy-500"><User className="h-3.5 w-3.5 text-navy-400" /> {ad.seller_name}</p>
                    {ad.seller_contact && <p className="flex items-center gap-1.5 text-xs text-navy-500"><Phone className="h-3.5 w-3.5 text-navy-400" /> {ad.seller_contact}</p>}
                  </div>
                  <p className="text-[11px] text-navy-400 mt-2">{formatDate(ad.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showForm && <AdForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}

function AdForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ title: '', category: 'Elektronik', price: '', city: 'İstanbul', description: '', image_url: '', seller_name: '', seller_contact: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from('classified_ads').insert({
      title: form.title, category: form.category, price: parseFloat(form.price) || 0,
      city: form.city, description: form.description || null, image_url: form.image_url || null,
      seller_name: form.seller_name, seller_contact: form.seller_contact || null,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
  }

  return (
    <Modal title="Yeni İlan Ver" onClose={onClose} maxWidth="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        {error && <ErrorBox message={error} />}
        <Field label="İlan Başlığı"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Örn: iPhone 14 Pro" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Fiyat (TL)"><input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="0" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Şehir"><select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Görsel URL (opsiyonel)"><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://…" /></Field>
        </div>
        <Field label="Açıklama"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputCls} placeholder="Ürün durumu, özellikler…" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Adınız Soyadınız"><input required value={form.seller_name} onChange={(e) => setForm({ ...form, seller_name: e.target.value })} className={inputCls} /></Field>
          <Field label="İletişim (telefon)"><input value={form.seller_contact} onChange={(e) => setForm({ ...form, seller_contact: e.target.value })} className={inputCls} placeholder="05xx xxx xx xx" /></Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-cream-200 transition-colors">İptal</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-600 text-cream-50 text-sm font-semibold hover:bg-navy-700 disabled:opacity-60 transition-colors">{saving && <Loader2 className="h-4 w-4 animate-spin" />} İlanı Yayınla</button>
        </div>
      </form>
    </Modal>
  );
}
