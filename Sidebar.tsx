import { useEffect, useState } from 'react';
import { Search, FileText, Download, FolderOpen, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, type DocumentItem } from '../lib/supabase';

const CATEGORY_ICONS: Record<string, string> = {
  'İnsan Kaynakları': '👥', 'İş Sağlığı ve Güvenliği': '🦺', 'İdari İşler': '📋', 'Bilgi Teknolojileri': '💻',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function DocumentsView() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [downloaded, setDownloaded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('documents').select('*').order('name', { ascending: true });
      if (error) console.error(error);
      setDocs((data as DocumentItem[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(docs.map((d) => d.category)))];
  const filtered = docs.filter((d) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q);
    const matchesCat = activeCat === 'all' || d.category === activeCat;
    return matchesQuery && matchesCat;
  });

  function simulateDownload(doc: DocumentItem) {
    setDownloaded(doc.id);
    setTimeout(() => setDownloaded(null), 2000);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Doküman adında ara…" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all" />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCat(cat)} className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCat === cat ? 'bg-navy-600 text-cream-50' : 'bg-cream-50 text-navy-600 border border-cream-300 hover:border-navy-300 hover:text-navy-700'}`}>{cat === 'all' ? 'Tümü' : cat}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-navy-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-navy-400"><FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>Eşleşen doküman bulunamadı.</p></div>
      ) : (
        <div className="rounded-2xl bg-cream-50 border border-cream-300 shadow-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-cream-200 bg-cream-100 flex items-center gap-2 text-sm text-navy-600 font-medium"><FolderOpen className="h-4 w-4 text-navy-400" /> {filtered.length} doküman</div>
          <div className="divide-y divide-cream-200">
            {filtered.map((doc, i) => (
              <div key={doc.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-cream-100 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                <span className="h-11 w-11 rounded-xl bg-navy-50 flex items-center justify-center text-xl shrink-0">{CATEGORY_ICONS[doc.category] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-semibold text-navy-900 truncate">{doc.name}</p><span className="text-xs text-navy-400 shrink-0">.pdf</span></div>
                  <p className="text-xs text-navy-500 line-clamp-1 mt-0.5">{doc.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-navy-400">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {doc.file_size || '—'}</span>
                    <span>Güncelleme: {formatDate(doc.updated_at)}</span>
                    <span className="hidden sm:inline">{doc.category}</span>
                  </div>
                </div>
                <button onClick={() => simulateDownload(doc)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${downloaded === doc.id ? 'bg-navy-50 text-navy-600' : 'bg-navy-600 text-cream-50 hover:bg-navy-700'}`}>{downloaded === doc.id ? <><CheckCircle2 className="h-4 w-4" /> İndirildi</> : <><Download className="h-4 w-4" /> İndir</>}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
