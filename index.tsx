import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
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
  ChevronRight,
  Printer,
  Package,
  Calendar,
  Settings,
  Globe
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

const DB_KEY = 'bb_label_db_v4';
const ALLERGEN_KEY = 'bb_allergen_db_v4';

const DietSymbol = ({ type, size = 20 }: { type: string, size?: number }) => {
  const t = type.toLowerCase();
  if (t.includes('vegan')) return <Leaf size={size} strokeWidth={2.5} className="text-emerald-600" />;
  if (t.includes('vege')) return <Sprout size={size} strokeWidth={2.5} className="text-emerald-500" />;
  if (t.includes('fish') || t.includes('fisch')) return <Fish size={size} strokeWidth={2.5} className="text-blue-500" />;
  if (t.includes('fleisch') || t.includes('meat') || t.includes('omni')) return <Beef size={size} strokeWidth={2.5} className="text-rose-700" />;
  return <Utensils size={size} strokeWidth={2.5} className="text-slate-400" />;
};

const LabelPreview = ({ bundle, date, lang, allergens }: { bundle: Bundle, date: string, lang: 'de' | 'en', allergens: any[] }) => {
  const itemCount = bundle.items.length;
  
  const layout = useMemo(() => {
    if (itemCount <= 3) return { titleSize: 'text-3xl', itemSize: 'text-xl', allergenSize: 'text-[10px]', spacing: 'gap-8', iconSize: 28 };
    if (itemCount <= 5) return { titleSize: 'text-2xl', itemSize: 'text-lg', allergenSize: 'text-[9px]', spacing: 'gap-4', iconSize: 22 };
    return { titleSize: 'text-xl', itemSize: 'text-base', allergenSize: 'text-[8px]', spacing: 'gap-3', iconSize: 18 };
  }, [itemCount]);

  const displayBundleName = lang === 'de' ? bundle.name_de : bundle.name_en;

  return (
    <div 
      className="flex flex-col relative bg-white overflow-hidden shadow-sm" 
      style={{ width: '105mm', height: '148.5mm', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="bg-brand-green text-white p-8 flex flex-col justify-center items-center text-center min-h-[120px]">
        <h1 className={`font-extrabold uppercase tracking-tight leading-tight ${layout.titleSize}`}>
          {displayBundleName}
        </h1>
      </div>
      
      {/* Divider */}
      <div className="h-2 bg-brand-pink w-full"></div>

      {/* Content */}
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
                      <span key={i} className={`bg-[#FEACCF] text-[#024930] px-1.5 py-0.5 rounded font-bold uppercase ${layout.allergenSize}`}>
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

      {/* Footer */}
      <div className="px-10 py-6 flex justify-between items-end" style={{ backgroundColor: COLORS.MUTED_PINK }}>
        <div>
          <p className="text-[9px] font-bold uppercase text-slate-800 opacity-70">
            {lang === 'de' ? 'Abgepackt am' : 'Packed On'}
          </p>
          <p className="text-sm font-extrabold text-brand-green">
            {new Date(date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-brand-green leading-none">
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
    <div className="fixed inset-0 bg-brand-green/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-brand-green uppercase tracking-tight">
              {bundle ? 'Edit Bundle' : 'New Bundle'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Configure label items and dietary details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Bundle Name (DE)</label>
              <input 
                className="w-full bg-slate-100 rounded-2xl p-4 border-2 border-transparent focus:border-brand-pink outline-none font-bold transition-all"
                value={data.name_de} onChange={e => setData({...data, name_de: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Bundle Name (EN)</label>
              <input 
                className="w-full bg-slate-100 rounded-2xl p-4 border-2 border-transparent focus:border-brand-pink outline-none font-bold transition-all"
                value={data.name_en} onChange={e => setData({...data, name_en: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Package size={18} /> Label Items</h3>
              <button onClick={addItem} className="bg-brand-green text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-opacity-90 transition-all">
                <Plus size={14} /> ADD ITEM
              </button>
            </div>
            
            <div className="space-y-3">
              {data.items.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group hover:border-brand-pink/30 transition-all">
                  <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-rose-500 p-2 rounded-full shadow-sm border border-slate-100 transition-colors">
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <input 
                        placeholder="Item Name (DE)" 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                        value={item.item_name_de} onChange={e => updateItem(item.id, 'item_name_de', e.target.value)}
                      />
                    </div>
                    <div className="col-span-4">
                      <input 
                        placeholder="Item Name (EN)" 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                        value={item.item_name_en} onChange={e => updateItem(item.id, 'item_name_en', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        placeholder="Allergens" 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                        value={item.allergens_de} onChange={e => updateItem(item.id, 'allergens_de', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <select 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                        value={item.diet_de} onChange={e => updateItem(item.id, 'diet_de', e.target.value)}
                      >
                        <option value="Vegetarisch">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Fleisch">Meat</option>
                        <option value="Fisch">Fish</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {data.items.length === 0 && <p className="text-center py-10 text-slate-400 text-sm italic">No items added yet...</p>}
            </div>
          </div>
        </div>

        <div className="p-8 border-t bg-slate-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
          <button onClick={() => onSave(data)} className="bg-brand-pink text-brand-green px-10 py-3 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all">
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
    else setBundles([
      {
        id: 'demo-1',
        name_de: 'Business Frühstück',
        name_en: 'Business Breakfast',
        created_at: new Date().toISOString(),
        items: [
          { id: '1', item_name_de: 'Buttercroissant', item_name_en: 'Butter Croissant', allergens_de: 'A, C, G', diet_de: 'Vegetarisch' },
          { id: '2', item_name_de: 'Frischer Obstsalat', item_name_en: 'Fresh Fruit Salad', allergens_de: '', diet_de: 'Vegan' },
          { id: '3', item_name_de: 'Griechischer Joghurt', item_name_en: 'Greek Yogurt', allergens_de: 'G', diet_de: 'Vegetarisch' }
        ]
      }
    ]);
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
      root.render(<LabelPreview bundle={printQueue[i]} date={packedOn} lang={lang} allergens={DEFAULT_ALLERGENS} />);
      
      await new Promise(r => setTimeout(r, 700)); // Delay for font/image render
      
      const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const x = (i % 2) * 105;
      const y = (Math.floor(i / 2) % 2) * 148.5;
      
      if (i > 0 && i % 4 === 0) doc.addPage();
      doc.addImage(imgData, 'PNG', x, y, 105, 148.5);
      
      container.removeChild(wrapper);
    }

    if (download) {
      doc.save(`BellaBona_Labels_${packedOn}.pdf`);
    } else {
      const blob = doc.output('blob');
      setPreviewUrl(URL.createObjectURL(blob));
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
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
        <div className="fixed inset-0 bg-brand-green/95 backdrop-blur-xl z-[200] flex items-center justify-center p-8">
          <div className="bg-white rounded-[2.5rem] w-full max-w-6xl h-full flex flex-col overflow-hidden shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-black text-brand-green uppercase">PDF Preview</h2>
              <div className="flex gap-4">
                <button onClick={() => generatePDF(true)} className="bg-brand-pink text-brand-green px-8 py-3 rounded-2xl font-black flex items-center gap-2">
                  <Download size={20} /> DOWNLOAD PDF
                </button>
                <button onClick={() => setPreviewUrl(null)} className="p-2 text-slate-400"><X size={32} /></button>
              </div>
            </div>
            <iframe src={previewUrl} className="flex-1 w-full border-0" />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-brand-green text-white px-10 py-6 flex justify-between items-center sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-brand-pink p-2.5 rounded-2xl">
            <FileText className="text-brand-green" size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">BELLA<span className="text-brand-pink">&</span>BONA <span className="text-sm font-bold opacity-50 ml-2 tracking-widest uppercase">Labels</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-1 rounded-2xl flex">
            <button onClick={() => setLang('de')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${lang === 'de' ? 'bg-brand-pink text-brand-green' : 'text-white/60 hover:text-white'}`}>DE</button>
            <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${lang === 'en' ? 'bg-brand-pink text-brand-green' : 'text-white/60 hover:text-white'}`}>EN</button>
          </div>
          <button onClick={() => setEditingBundle('new')} className="bg-brand-pink text-brand-green px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
            <PlusCircle size={18} /> NEW BUNDLE
          </button>
        </div>
      </nav>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full grid grid-cols-12 gap-10">
        {/* Sidebar Selection */}
        <div className="col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  placeholder="Search breakfast, lunch, bowls..." 
                  className="w-full bg-slate-50 border-0 rounded-[1.25rem] pl-14 pr-6 py-4 font-bold outline-none focus:ring-2 ring-brand-pink/30 transition-all"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-slate-50 px-5 rounded-[1.25rem] border border-slate-100">
                <Calendar size={18} className="text-slate-400 mr-3" />
                <input 
                  type="date" 
                  value={packedOn} 
                  onChange={e => setPackedOn(e.target.value)}
                  className="bg-transparent border-0 font-bold outline-none text-brand-green"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Available Bundles</h2>
              {filtered.map(b => (
                <div 
                  key={b.id} 
                  className={`group bg-slate-50 border-2 rounded-3xl p-6 flex justify-between items-center transition-all cursor-pointer ${selections.find(s => s.bundleId === b.id) ? 'border-brand-pink bg-brand-pink/5' : 'border-transparent hover:border-slate-200'}`}
                  onClick={() => toggleSelection(b.id)}
                >
                  <div className="flex items-center gap-5">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <Package className="text-brand-green" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-brand-green">{lang === 'de' ? b.name_de : b.name_en}</h3>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                        {b.items.length} items configured • <span className="text-brand-muted-pink">{b.items.map(i => i.diet_de).join(', ')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingBundle(b); }} 
                      className="p-3 bg-white text-slate-400 hover:text-brand-green rounded-xl border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selections.find(s => s.bundleId === b.id) ? 'bg-brand-pink border-brand-pink' : 'border-slate-300'}`}>
                      {selections.find(s => s.bundleId === b.id) && <Plus size={18} className="text-brand-green" />}
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <Database size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold">No bundles found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="col-span-4">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 sticky top-32 flex flex-col h-[calc(100vh-160px)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black text-brand-green uppercase tracking-widest">Active Print List</h2>
              <span className="bg-brand-green text-white text-[10px] font-black px-2 py-1 rounded-md">{selections.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6">
              {selections.map(s => {
                const b = bundles.find(x => x.id === s.bundleId);
                return b && (
                  <div key={s.bundleId} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-brand-green truncate">{lang === 'de' ? b.name_de : b.name_en}</p>
                      <div className="flex items-center mt-2 gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Qty:</span>
                        <input 
                          type="number" 
                          value={s.quantity} 
                          onChange={e => updateQuantity(s.bundleId, parseInt(e.target.value))}
                          className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-brand-green"
                        />
                      </div>
                    </div>
                    <button onClick={() => toggleSelection(s.bundleId)} className="p-2 text-slate-300 hover:text-rose-500">
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
              {selections.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-slate-300 uppercase leading-relaxed">Select bundles from the left<br/>to generate labels</p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-6 border-t">
              <button 
                disabled={selections.length === 0 || isGenerating}
                onClick={() => generatePDF(false)}
                className="w-full bg-slate-100 text-brand-green py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Eye size={18} />} 
                PREVIEW LABELS
              </button>
              <button 
                disabled={selections.length === 0 || isGenerating}
                onClick={() => generatePDF(true)}
                className="w-full bg-brand-pink text-brand-green py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <Printer size={18} /> PRINT ALL
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
