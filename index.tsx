import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  FileText, 
  X, 
  Edit2, 
  Eye, 
  Leaf, 
  Sprout, 
  Fish, 
  Utensils, 
  Beef, 
  Database, 
  PlusCircle,
  Printer,
  Package,
  Calendar,
  RefreshCw
} from 'lucide-react';

const COLORS = {
  GREEN: '#024930',
  PINK: '#FEACCF',
  MUTED_PINK: '#C197AB', 
};

const DEFAULT_ALLERGENS = [
  { code: 'A', name: 'Gluten' }, { code: 'B', name: 'Crustaceans' },
  { code: 'C', name: 'Eggs' }, { code: 'D', name: 'Fish' },
  { code: 'E', name: 'Peanuts' }, { code: 'F', name: 'Soy' },
  { code: 'G', name: 'Milk' }, { code: 'H', name: 'Nuts' },
  { code: 'L', name: 'Celery' }, { code: 'M', name: 'Mustard' },
  { code: 'N', name: 'Sesame' }, { code: 'O', name: 'Sulphites' },
];

interface BundleItem {
  id: string;
  item_name_de: string;
  item_name_en: string;
  allergens_de: string;
  diet_de: string;
}

interface Bundle {
  id: string;
  name_de: string;
  name_en: string;
  items: BundleItem[];
  created_at: string;
}

interface Selection {
  bundleId: string;
  quantity: number;
}

const DB_KEY = 'bb_label_db_v5';

const DietSymbol = ({ type, size = 20 }: { type: string, size?: number }) => {
  const t = type.toLowerCase();
  if (t.includes('vegan')) return <Leaf size={size} strokeWidth={2.5} className="text-emerald-600" />;
  if (t.includes('vege')) return <Sprout size={size} strokeWidth={2.5} className="text-emerald-500" />;
  if (t.includes('fish') || t.includes('fisch')) return <Fish size={size} strokeWidth={2.5} className="text-blue-500" />;
  if (t.includes('fleisch') || t.includes('meat') || t.includes('omni')) return <Beef size={size} strokeWidth={2.5} className="text-rose-700" />;
  return <Utensils size={size} strokeWidth={2.5} className="text-slate-400" />;
};

const LabelPreview = ({ bundle, date, lang }: { bundle: Bundle, date: string, lang: 'de' | 'en' }) => {
  const itemCount = bundle.items.length;
  
  const layout = useMemo(() => {
    if (itemCount <= 3) return { titleSize: 'text-3xl', itemSize: 'text-xl', allergenSize: 'text-[10px]', spacing: 'gap-8', iconSize: 28 };
    if (itemCount <= 5) return { titleSize: 'text-2xl', itemSize: 'text-lg', allergenSize: 'text-[9px]', spacing: 'gap-4', iconSize: 22 };
    return { titleSize: 'text-xl', itemSize: 'text-base', allergenSize: 'text-[8px]', spacing: 'gap-3', iconSize: 18 };
  }, [itemCount]);

  const displayBundleName = lang === 'de' ? bundle.name_de : bundle.name_en;

  return (
    <div 
      className="flex flex-col relative bg-white overflow-hidden" 
      style={{ width: '105mm', height: '148.5mm', boxSizing: 'border-box' }}
    >
      <div className="bg-[#024930] text-white p-8 flex flex-col justify-center items-center text-center min-h-[120px]">
        <h1 className={`font-extrabold uppercase tracking-tight leading-tight ${layout.titleSize}`}>
          {displayBundleName}
        </h1>
      </div>
      
      <div className="h-2 bg-[#FEACCF] w-full"></div>

      <div className={`flex-1 flex flex-col px-10 py-10 ${layout.spacing}`}>
        {bundle.items.map((item) => {
          const itemName = lang === 'de' ? item.item_name_de : item.item_name_en;
          return (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className={`font-extrabold text-[#024930] leading-tight mb-1 ${layout.itemSize}`}>
                  {itemName}
                </p>
                {item.allergens_de && (
                  <div className="flex flex-wrap gap-1">
                    {item.allergens_de.split(',').map((a, i) => (
                      <span key={i} className="bg-[#FEACCF] text-[#024930] px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">
                        {a.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center ml-4">
                <DietSymbol type={item.diet_de} size={layout.iconSize} />
                <span className="text-[9px] font-extrabold uppercase text-[#024930] mt-1">{item.diet_de}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-10 py-6 flex justify-between items-end bg-[#C197AB]">
        <div>
          <p className="text-[9px] font-bold uppercase text-slate-800 opacity-70">
            {lang === 'de' ? 'Abgepackt am' : 'Packed On'}
          </p>
          <p className="text-sm font-extrabold text-[#024930]">
            {new Date(date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-[#024930] leading-none">
            BELLA<span className="text-white">&</span>BONA
          </p>
        </div>
      </div>
    </div>
  );
};

const BundleModal = ({ bundle, onSave, onClose }: { bundle: any, onSave: (b: Bundle) => void, onClose: () => void }) => {
  const [data, setData] = useState<Bundle>(bundle || {
    id: Math.random().toString(36).substr(2, 9),
    name_de: '', name_en: '', items: [], created_at: new Date().toISOString()
  });

  const addItem = () => setData({
    ...data,
    items: [...data.items, { id: Math.random().toString(36).substr(2, 9), item_name_de: '', item_name_en: '', allergens_de: '', diet_de: 'Vegetarisch' }]
  });

  const updateItem = (id: string, field: string, value: string) => {
    setData({ ...data, items: data.items.map(i => i.id === id ? { ...i, [field]: value } : i) });
  };

  const removeItem = (id: string) => setData({ ...data, items: data.items.filter(i => i.id !== id) });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        <div className="p-8 border-b flex justify-between items-center">
          <h2 className="text-2xl font-black text-[#024930] uppercase">
            {bundle ? 'Edit Bundle' : 'New Bundle'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input 
              placeholder="Name (DE)" 
              className="bg-slate-50 rounded-xl p-4 border font-bold outline-none focus:border-[#FEACCF]"
              value={data.name_de} onChange={e => setData({...data, name_de: e.target.value})}
            />
            <input 
              placeholder="Name (EN)" 
              className="bg-slate-50 rounded-xl p-4 border font-bold outline-none focus:border-[#FEACCF]"
              value={data.name_en} onChange={e => setData({...data, name_en: e.target.value})}
            />
          </div>

          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Label Items</h3>
            <button onClick={addItem} className="bg-[#024930] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
              <Plus size={14} /> ADD ITEM
            </button>
          </div>
          
          <div className="space-y-3">
            {data.items.map((item) => (
              <div key={item.id} className="bg-slate-50 p-4 rounded-xl border relative">
                <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input placeholder="Name (DE)" className="bg-white border p-2 rounded-lg text-sm" value={item.item_name_de} onChange={e => updateItem(item.id, 'item_name_de', e.target.value)} />
                  <input placeholder="Name (EN)" className="bg-white border p-2 rounded-lg text-sm" value={item.item_name_en} onChange={e => updateItem(item.id, 'item_name_en', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Allergens (e.g. A, G)" className="bg-white border p-2 rounded-lg text-sm" value={item.allergens_de} onChange={e => updateItem(item.id, 'allergens_de', e.target.value)} />
                  <select className="bg-white border p-2 rounded-lg text-sm" value={item.diet_de} onChange={e => updateItem(item.id, 'diet_de', e.target.value)}>
                    <option value="Vegetarisch">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Fleisch">Meat</option>
                    <option value="Fisch">Fish</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
          <button onClick={() => onSave(data)} className="bg-[#FEACCF] text-[#024930] px-10 py-3 rounded-2xl font-black">
            SAVE BUNDLE
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [lang, setLang] = useState<'de' | 'en'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [packedOn, setPackedOn] = useState(new Date().toISOString().split('T')[0]);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) setBundles(JSON.parse(saved));
    else setBundles([{
      id: 'demo-1',
      name_de: 'Frühstücks-Set', name_en: 'Breakfast Set',
      created_at: new Date().toISOString(),
      items: [
        { id: '1', item_name_de: 'Buttercroissant', item_name_en: 'Butter Croissant', allergens_de: 'A, C, G', diet_de: 'Vegetarisch' },
        { id: '2', item_name_de: 'Frischer Obstsalat', item_name_en: 'Fresh Fruit Salad', allergens_de: '', diet_de: 'Vegan' }
      ]
    }]);
  }, []);

  useEffect(() => localStorage.setItem(DB_KEY, JSON.stringify(bundles)), [bundles]);

  const filtered = useMemo(() => bundles.filter(b => 
    b.name_de.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  ), [bundles, searchTerm]);

  const toggleSelection = (id: string) => {
    const exists = selections.find(s => s.bundleId === id);
    if (exists) setSelections(selections.filter(s => s.bundleId !== id));
    else setSelections([...selections, { bundleId: id, quantity: 1 }]);
  };

  const updateQuantity = (id: string, q: number) => {
    setSelections(selections.map(s => s.bundleId === id ? { ...s, quantity: Math.max(1, q) } : s));
  };

  const generatePDF = async (download: boolean = false) => {
    if (selections.length === 0) return;
    setIsGenerating(true);
    
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;
    const doc = new jsPDF('p', 'mm', 'a4');
    const container = document.getElementById('pdf-render-container')!;

    const printQueue: Bundle[] = [];
    selections.forEach(s => {
      const b = bundles.find(x => x.id === s.bundleId);
      if (b) for(let i=0; i < s.quantity; i++) printQueue.push(b);
    });

    for (let i = 0; i < printQueue.length; i++) {
      const wrapper = document.createElement('div');
      container.appendChild(wrapper);
      const root = createRoot(wrapper);
      root.render(<LabelPreview bundle={printQueue[i]} date={packedOn} lang={lang} />);
      
      await new Promise(r => setTimeout(r, 600)); 
      
      const canvas = await html2canvas(wrapper, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const x = (i % 2) * 105;
      const y = (Math.floor(i / 2) % 2) * 148.5;
      
      if (i > 0 && i % 4 === 0) doc.addPage();
      doc.addImage(imgData, 'PNG', x, y, 105, 148.5);
      container.removeChild(wrapper);
    }

    if (download) {
      doc.save(`Labels_${packedOn}.pdf`);
    } else {
      const blob = doc.output('blob');
      setPreviewUrl(URL.createObjectURL(blob));
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div id="pdf-render-container"></div>
      
      {editingBundle && (
        <BundleModal 
          bundle={editingBundle === 'new' ? null : editingBundle} 
          onClose={() => setEditingBundle(null)}
          onSave={(b) => {
            setBundles(prev => {
              const exists = prev.find(x => x.id === b.id);
              return exists ? prev.map(x => x.id === b.id ? b : x) : [b, ...prev];
            });
            setEditingBundle(null);
          }}
        />
      )}

      {previewUrl && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">PDF Preview</h2>
              <div className="flex gap-4">
                <button onClick={() => generatePDF(true)} className="bg-[#FEACCF] text-[#024930] px-6 py-2 rounded-xl font-bold">Download</button>
                <button onClick={() => setPreviewUrl(null)} className="p-2"><X size={24} /></button>
              </div>
            </div>
            <iframe src={previewUrl} className="flex-1 w-full" />
          </div>
        </div>
      )}

      <nav className="bg-[#024930] text-white px-10 py-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <FileText className="text-[#FEACCF]" size={32} />
          <h1 className="text-2xl font-black">BELLA<span className="text-[#FEACCF]">&</span>BONA</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-1 rounded-xl">
            <button onClick={() => setLang('de')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${lang === 'de' ? 'bg-[#FEACCF] text-[#024930]' : ''}`}>DE</button>
            <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${lang === 'en' ? 'bg-[#FEACCF] text-[#024930]' : ''}`}>EN</button>
          </div>
          <button onClick={() => setEditingBundle('new')} className="bg-[#FEACCF] text-[#024930] px-6 py-2 rounded-xl font-black text-sm flex items-center gap-2">
            <PlusCircle size={18} /> NEW BUNDLE
          </button>
        </div>
      </nav>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full grid grid-cols-12 gap-10">
        <div className="col-span-8 bg-white rounded-3xl p-8 shadow-sm border">
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-slate-400" size={20} />
              <input 
                placeholder="Search bundles..." 
                className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-3 font-bold outline-none border focus:border-[#FEACCF]"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <input 
              type="date" 
              value={packedOn} 
              onChange={e => setPackedOn(e.target.value)}
              className="bg-slate-50 border px-4 rounded-xl font-bold outline-none"
            />
          </div>

          <div className="space-y-3">
            {filtered.map(b => (
              <div 
                key={b.id} 
                className={`p-6 rounded-2xl flex justify-between items-center border-2 transition-all cursor-pointer ${selections.find(s => s.bundleId === b.id) ? 'border-[#FEACCF] bg-[#FEACCF]/5' : 'border-transparent bg-slate-50 hover:border-slate-200'}`}
                onClick={() => toggleSelection(b.id)}
              >
                <div>
                  <h3 className="text-lg font-black text-[#024930]">{lang === 'de' ? b.name_de : b.name_en}</h3>
                  <p className="text-sm text-slate-500 font-medium">{b.items.length} items</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setEditingBundle(b); }} className="p-2 text-slate-400 hover:text-[#024930]"><Edit2 size={18} /></button>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selections.find(s => s.bundleId === b.id) ? 'bg-[#FEACCF] border-[#FEACCF]' : 'border-slate-300'}`}>
                    {selections.find(s => s.bundleId === b.id) && <Plus size={14} className="text-[#024930]" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-3xl p-8 shadow-sm border flex flex-col h-[calc(100vh-160px)]">
          <h2 className="text-sm font-black text-[#024930] uppercase mb-6">Print List</h2>
          <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
            {selections.map(s => {
              const b = bundles.find(x => x.id === s.bundleId);
              return b && (
                <div key={s.bundleId} className="bg-slate-50 rounded-xl p-4 border flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#024930] truncate">{lang === 'de' ? b.name_de : b.name_en}</p>
                    <input 
                      type="number" 
                      value={s.quantity} 
                      onChange={e => updateQuantity(s.bundleId, parseInt(e.target.value))}
                      className="w-16 bg-white border rounded px-2 py-1 mt-1 text-xs font-bold"
                    />
                  </div>
                  <button onClick={() => toggleSelection(s.bundleId)} className="text-slate-300 hover:text-rose-500"><X size={18} /></button>
                </div>
              );
            })}
          </div>
          <div className="space-y-3 pt-6 border-t">
            <button 
              disabled={selections.length === 0 || isGenerating}
              onClick={() => generatePDF(false)}
              className="w-full bg-slate-100 text-[#024930] py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-200"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Eye size={18} />} PREVIEW
            </button>
            <button 
              disabled={selections.length === 0 || isGenerating}
              onClick={() => generatePDF(true)}
              className="w-full bg-[#FEACCF] text-[#024930] py-4 rounded-xl font-black flex items-center justify-center gap-2"
            >
              <Printer size={18} /> PRINT ALL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
