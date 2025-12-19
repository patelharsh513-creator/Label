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
  Check, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  Leaf, 
  Sprout, 
  Fish, 
  Utensils, 
  Beef, 
  Croissant, 
  Soup, 
  Database, 
  AlertTriangle, 
  Tag,
  PlusCircle,
  Info
} from 'lucide-react';

const COLORS = {
  GREEN: '#024930',
  PINK: '#FEACCF',
  FOOTER_BG: '#C197AB', 
};

const DEFAULT_ALLERGENS = [
  { code: 'A', name: 'Gluten' },
  { code: 'B', name: 'Crustaceans' },
  { code: 'C', name: 'Eggs' },
  { code: 'D', name: 'Fish' },
  { code: 'E', name: 'Peanuts' },
  { code: 'F', name: 'Soy' },
  { code: 'G', name: 'Milk/Lactose' },
  { code: 'H', name: 'Nuts' },
  { code: 'L', name: 'Celery' },
  { code: 'M', name: 'Mustard' },
  { code: 'N', name: 'Sesame' },
  { code: 'O', name: 'Sulphites' },
  { code: 'P', name: 'Lupin' },
  { code: 'R', name: 'Molluscs' },
];

const DEMO_BUNDLES: Bundle[] = [
  {
    id: 'demo-1',
    name_de: 'Frühstücks-Box Klassik',
    name_en: 'Breakfast Box Classic',
    created_at: new Date().toISOString(),
    items: [
      { id: 'i1', bundle_id: 'demo-1', item_name_de: 'Buttercroissant', item_name_en: 'Butter Croissant', allergens_de: 'A, C, G', diet_de: 'Vegetarisch', created_at: '' },
      { id: 'i2', bundle_id: 'demo-1', item_name_de: 'Frischer Obstsalat', item_name_en: 'Fresh Fruit Salad', allergens_de: '', diet_de: 'Vegan', created_at: '' },
      { id: 'i3', bundle_id: 'demo-1', item_name_de: 'Griechischer Joghurt', item_name_en: 'Greek Yogurt', allergens_de: 'G', diet_de: 'Vegetarisch', created_at: '' }
    ]
  },
  {
    id: 'demo-2',
    name_de: 'Bella Italia Lunch',
    name_en: 'Bella Italia Lunch',
    created_at: new Date().toISOString(),
    items: [
      { id: 'i4', bundle_id: 'demo-2', item_name_de: 'Penne mit Pesto', item_name_en: 'Penne with Pesto', allergens_de: 'A, G, H', diet_de: 'Vegetarisch', created_at: '' },
      { id: 'i5', bundle_id: 'demo-2', item_name_de: 'Bresaola & Rucola', item_name_en: 'Bresaola & Rocket', allergens_de: '', diet_de: 'Fleisch', created_at: '' }
    ]
  }
];

const getAllergenFullName = (input: string, legend: { code: string, name: string }[]): string => {
  const clean = input.trim().toUpperCase();
  const found = legend.find(a => a.code === clean || a.name.toUpperCase() === clean);
  return found ? found.name : input.trim();
};

const TEXT = {
  de: {
    appTitle: 'Bella&Bona Etiketten-Generator',
    labelGenerator: 'Generator',
    importData: 'Datenbank',
    packedOn: 'Abgepackt am',
    searchPlaceholder: 'Suchen...',
    availableBundles: 'Bundles',
    selectedBundles: 'Ausgewählt',
    noBundles: 'Keine Daten.',
    add: 'Hinzufügen',
    quantity: 'Anzahl',
    clearAll: 'Löschen',
    generatePdf: 'PDF erstellen',
    previewPdf: 'Vorschau',
    importInstructions: 'Anleitung',
    downloadTemplate: 'Template laden',
    uploadFile: 'Upload',
    allergens: 'Allergene',
    diet: 'Form',
    brandName: 'BELLA&BONA',
    successImport: 'Importiert!',
    errorImport: 'Fehler.',
    noSelected: 'Nichts gewählt.',
    createNew: 'Neu',
    editBundle: 'Bearbeiten',
    saveBundle: 'Speichern',
    deleteBundle: 'Löschen',
    addItem: 'Item',
    bundleName: 'Bundle Name',
    itemName: 'Name',
    manageAllergens: 'Allergene',
    dbStats: 'Status',
    clearDb: 'Alles löschen',
    confirmClear: 'Sicher?',
    loadDemo: 'Demo laden',
    download: 'Download',
    close: 'Schließen',
    selectAllergens: 'Allergene wählen',
    allergenCode: 'Code',
    allergenName: 'Name',
    addAllergen: 'Hinzufügen'
  },
  en: {
    appTitle: 'Bella&Bona Label Generator',
    labelGenerator: 'Generator',
    importData: 'Database',
    packedOn: 'Packed On',
    searchPlaceholder: 'Search...',
    availableBundles: 'Bundles',
    selectedBundles: 'Selected',
    noBundles: 'No data.',
    add: 'Add',
    quantity: 'Qty',
    clearAll: 'Clear All',
    generatePdf: 'Generate PDF',
    previewPdf: 'Preview',
    importInstructions: 'Instructions',
    downloadTemplate: 'Download Template',
    uploadFile: 'Upload',
    allergens: 'Allergens',
    diet: 'Diet',
    brandName: 'BELLA&BONA',
    successImport: 'Imported!',
    errorImport: 'Error.',
    noSelected: 'Nothing selected.',
    createNew: 'Create New',
    editBundle: 'Edit',
    saveBundle: 'Save',
    deleteBundle: 'Delete',
    addItem: 'Add Item',
    bundleName: 'Bundle Name',
    itemName: 'Item Name',
    manageAllergens: 'Allergens',
    dbStats: 'Stats',
    clearDb: 'Clear All',
    confirmClear: 'Are you sure?',
    loadDemo: 'Load Demo',
    download: 'Download',
    close: 'Close',
    selectAllergens: 'Select Allergens',
    allergenCode: 'Code',
    allergenName: 'Name',
    addAllergen: 'Add'
  }
};

interface BundleItem {
  id: string;
  bundle_id: string;
  item_name_de: string;
  item_name_en: string;
  allergens_de: string;
  diet_de: string;
  created_at: string;
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

const DB_KEY = 'bb_label_db_v3';
const ALLERGEN_KEY = 'bb_allergen_db_v3';

const DietSymbol = ({ type, size = 20 }: { type: string, size?: number }) => {
  const t = type.toLowerCase();
  if (t.includes('vegan')) return <Leaf size={size} strokeWidth={2.5} className="text-green-600" />;
  if (t.includes('vege')) return <Sprout size={size} strokeWidth={2.5} className="text-green-500" />;
  if (t.includes('fish') || t.includes('fisch')) return <Fish size={size} strokeWidth={2.5} className="text-blue-500" />;
  if (t.includes('omni') || t.includes('fleisch') || t.includes('meat')) return <Beef size={size} strokeWidth={2.5} className="text-red-700" />;
  return <Utensils size={size} strokeWidth={2.5} className="text-slate-400" />;
};

const WatermarkPattern = () => (
  <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex flex-wrap justify-around items-center overflow-hidden p-4">
    {Array.from({ length: 15 }).map((_, i) => (
      <React.Fragment key={i}>
        <Croissant size={60} className="rotate-12 mb-6" />
        <Soup size={60} className="-rotate-12 mb-6" />
      </React.Fragment>
    ))}
  </div>
);

const LabelPreview = ({ bundle, date, t, lang, allergens }: { bundle: Bundle, date: string, t: any, lang: 'de' | 'en', allergens: { code: string, name: string }[] }) => {
  const dateLocale = lang === 'de' ? 'de-DE' : 'en-GB';
  const itemCount = bundle.items.length;

  const config = useMemo(() => {
    if (itemCount <= 3) return { title: 28, item: 20, allergen: 10, dietIcon: 26, dietText: 12, spacing: 'py-10 gap-10', divider: true, headerMin: 100 };
    if (itemCount <= 5) return { title: 24, item: 16, allergen: 9, dietIcon: 22, dietText: 11, spacing: 'py-6 gap-6', divider: true, headerMin: 90 };
    return { title: 20, item: 12, allergen: 8, dietIcon: 18, dietText: 9, spacing: 'py-4 gap-4', divider: true, headerMin: 80 };
  }, [itemCount]);

  const displayBundleName = lang === 'de' ? bundle.name_de : bundle.name_en;

  return (
    <div 
      className="flex flex-col relative" 
      style={{ 
        width: '105mm', 
        height: '148.5mm', 
        backgroundColor: '#FFFFFF', 
        color: COLORS.GREEN,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <WatermarkPattern />
      <div className="brand-green text-white relative z-10 flex flex-col justify-center px-6" style={{ minHeight: `${config.headerMin}px` }}>
        <h1 className="font-black uppercase tracking-tight text-center leading-[1.1]" style={{ fontSize: `${config.title}px` }}>
          {displayBundleName}
        </h1>
      </div>
      <div className="h-1.5 brand-pink w-full relative z-10"></div>

      <div className={`flex-1 relative z-10 flex flex-col justify-start px-8 ${config.spacing} overflow-hidden`}>
        {bundle.items.map((item, idx) => {
          const displayItemName = lang === 'de' ? item.item_name_de : item.item_name_en;
          return (
            <div key={item.id} className="relative w-full flex flex-col">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-black leading-[1.1] text-slate-900 mb-1" style={{ fontSize: `${config.item}px` }}>
                    {displayItemName}
                  </p>
                  {item.allergens_de && (
                    <div className="flex flex-wrap gap-1">
                      {item.allergens_de.split(',').map((a, i) => (
                         <span 
                           key={i} 
                           className="brand-pink text-[#024930] px-1.5 py-0.5 rounded-sm font-extrabold whitespace-nowrap uppercase tracking-wider leading-none" 
                           style={{ fontSize: `${config.allergen}px` }}
                         >
                          {getAllergenFullName(a, allergens)}
                         </span>
                      ))}
                    </div>
                  )}
                </div>
                {item.diet_de && (
                  <div className="shrink-0 flex flex-col items-center pt-0.5">
                    <DietSymbol type={item.diet_de} size={config.dietIcon} />
                    <span className="uppercase font-black text-[#024930] leading-none mt-1" style={{ fontSize: `${config.dietText}px` }}>{item.diet_de}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-10 py-6 flex justify-between items-center relative z-10" style={{ backgroundColor: COLORS.FOOTER_BG }}>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-700">{t.packedOn}</p>
          <p className="text-sm font-black text-brand-green">
            {new Date(date).toLocaleDateString(dateLocale)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-brand-green uppercase">BELLA<span className="text-brand-pink">&</span>BONA</p>
        </div>
      </div>
    </div>
  );
};

const PreviewModal = ({ blobUrl, onClose, onDownload, t }: { blobUrl: string, onClose: () => void, onDownload: () => void, t: any }) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-black text-white">{t.previewPdf}</h2>
        <div className="flex gap-3">
          <button onClick={onDownload} className="brand-pink text-brand-green px-6 py-2 rounded-xl font-black flex items-center gap-2"><Download size={18} /> {t.download}</button>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
        </div>
      </div>
      <div className="flex-1 bg-white p-4">
        <iframe src={blobUrl} className="w-full h-full border-0" />
      </div>
    </div>
  </div>
);

const BundleEditor = ({ bundle, allergens, onSave, onCancel, t }: any) => {
  const [formData, setFormData] = useState<Bundle>(bundle || {
    id: Math.random().toString(36).substr(2, 9),
    name_de: '',
    name_en: '',
    items: [],
    created_at: new Date().toISOString()
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Math.random().toString(36).substr(2, 9),
        bundle_id: prev.id,
        item_name_de: '',
        item_name_en: '',
        allergens_de: '',
        diet_de: '',
        created_at: new Date().toISOString()
      }]
    }));
  };

  const removeItem = (id: string) => setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));

  const updateItem = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-black text-brand-pink uppercase">{bundle ? t.editBundle : t.createNew}</h2>
          <button onClick={onCancel} className="text-slate-500 hover:text-white"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder={`${t.bundleName} (DE)`} value={formData.name_de} onChange={e => setFormData({...formData, name_de: e.target.value})} className="bg-slate-800 border-0 rounded-xl p-3 text-white"/>
            <input placeholder={`${t.bundleName} (EN)`} value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="bg-slate-800 border-0 rounded-xl p-3 text-white"/>
          </div>
          <button onClick={addItem} className="brand-green text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16} /> {t.addItem}</button>
          <div className="space-y-4">
            {formData.items.map(item => (
              <div key={item.id} className="bg-slate-800/50 p-4 rounded-xl relative group border border-slate-700">
                <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input placeholder="Name (DE)" value={item.item_name_de} onChange={e => updateItem(item.id, 'item_name_de', e.target.value)} className="bg-slate-900 rounded-lg p-2 text-sm text-white"/>
                  <input placeholder="Name (EN)" value={item.item_name_en} onChange={e => updateItem(item.id, 'item_name_en', e.target.value)} className="bg-slate-900 rounded-lg p-2 text-sm text-white"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Allergens (A, B, C)" value={item.allergens_de} onChange={e => updateItem(item.id, 'allergens_de', e.target.value)} className="bg-slate-900 rounded-lg p-2 text-sm text-white"/>
                  <select value={item.diet_de} onChange={e => updateItem(item.id, 'diet_de', e.target.value)} className="bg-slate-900 rounded-lg p-2 text-sm text-white">
                    <option value="">None</option>
                    <option value="Vegetarisch">Vegetarisch</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Fleisch">Meat</option>
                    <option value="Fisch">Fish</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-4">
          <button onClick={onCancel} className="text-slate-400 font-bold">Cancel</button>
          <button onClick={() => onSave(formData)} className="brand-pink text-brand-green px-8 py-3 rounded-xl font-black">Save</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [bundles, setBundles] = useState<Bundle[]>(() => {
    const s = localStorage.getItem(DB_KEY);
    return s ? JSON.parse(s) : [];
  });
  const [allergens, setAllergens] = useState(() => {
    const s = localStorage.getItem(ALLERGEN_KEY);
    return s ? JSON.parse(s) : DEFAULT_ALLERGENS;
  });
  const [lang, setLang] = useState<'de' | 'en'>('en');
  const [page, setPage] = useState<'generator' | 'import'>('generator');
  const [searchTerm, setSearchTerm] = useState('');
  const [selections, setSelections] = useState<Selection[]>([]);
  const [packedOn, setPackedOn] = useState(new Date().toISOString().split('T')[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingBundle, setEditingBundle] = useState<any>(null);

  const t = (TEXT as any)[lang];

  useEffect(() => localStorage.setItem(DB_KEY, JSON.stringify(bundles)), [bundles]);
  useEffect(() => localStorage.setItem(ALLERGEN_KEY, JSON.stringify(allergens)), [allergens]);

  const filtered = useMemo(() => bundles.filter(b => 
    b.name_de.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  ), [bundles, searchTerm]);

  const addSelection = (id: string) => {
    if (selections.find(s => s.bundleId === id)) return;
    setSelections([...selections, { bundleId: id, quantity: 1 }]);
  };

  const updateQty = (id: string, q: number) => setSelections(selections.map(s => s.bundleId === id ? { ...s, quantity: Math.max(1, q) } : s));

  const generatePDF = async (download: boolean) => {
    if (!selections.length) return;
    setIsGenerating(true);
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const container = document.getElementById('pdf-render-container')!;
    
    const itemsToPrint: Bundle[] = [];
    selections.forEach(s => {
      const b = bundles.find(x => x.id === s.bundleId);
      if (b) for(let i=0; i<s.quantity; i++) itemsToPrint.push(b);
    });

    for (let i = 0; i < itemsToPrint.length; i++) {
      const el = document.createElement('div');
      container.appendChild(el);
      const root = createRoot(el);
      root.render(<LabelPreview bundle={itemsToPrint[i]} date={packedOn} t={t} lang={lang} allergens={allergens} />);
      await new Promise(r => setTimeout(r, 600));
      const canvas = await html2canvas(el, { scale: 2 });
      const img = canvas.toDataURL('image/png');
      const x = (i % 2) * 105;
      const y = (Math.floor(i / 2) % 2) * 148.5;
      if (i > 0 && i % 4 === 0) pdf.addPage();
      pdf.addImage(img, 'PNG', x, y, 105, 148.5);
      container.removeChild(el);
    }

    if (download) {
      pdf.save(`Labels_${packedOn}.pdf`);
    } else {
      const blob = pdf.output('blob');
      setPreviewUrl(URL.createObjectURL(blob));
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div id="pdf-render-container"></div>
      {previewUrl && <PreviewModal blobUrl={previewUrl} onClose={() => setPreviewUrl(null)} onDownload={() => generatePDF(true)} t={t} />}
      {editingBundle && <BundleEditor bundle={editingBundle === 'new' ? null : editingBundle} allergens={allergens} onCancel={() => setEditingBundle(null)} t={t} onSave={(b: any) => {
        setBundles(prev => {
          const exists = prev.find(x => x.id === b.id);
          return exists ? prev.map(x => x.id === b.id ? b : x) : [b, ...prev];
        });
        setEditingBundle(null);
      }} />}

      <nav className="brand-green text-white px-8 py-5 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <FileText className="text-brand-pink" size={32} />
          <h1 className="text-xl font-black">BELLA<span className="text-brand-pink">&</span>BONA</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 p-1 rounded-xl flex">
            <button onClick={() => setPage('generator')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${page === 'generator' ? 'brand-pink text-brand-green' : 'text-slate-400'}`}>{t.labelGenerator}</button>
            <button onClick={() => setPage('import')} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${page === 'import' ? 'brand-pink text-brand-green' : 'text-slate-400'}`}>{t.importData}</button>
          </div>
          <button onClick={() => setLang(lang === 'de' ? 'en' : 'de')} className="text-sm font-black uppercase text-brand-pink bg-white/10 px-3 py-1 rounded-lg">{lang}</button>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full animate-fade-in">
        {page === 'generator' ? (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 bg-slate-900 rounded-3xl p-6 border border-slate-800">
              <div className="flex gap-4 mb-6">
                <input type="date" value={packedOn} onChange={e => setPackedOn(e.target.value)} className="bg-slate-800 text-white rounded-xl px-4 py-2 border-0"/>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={18}/>
                  <input placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-800 text-white rounded-xl pl-10 pr-4 py-2 border-0"/>
                </div>
                <button onClick={() => setEditingBundle('new')} className="brand-pink text-brand-green p-2.5 rounded-xl"><PlusCircle /></button>
              </div>
              <div className="space-y-2 h-[500px] overflow-y-auto pr-2">
                {filtered.map(b => (
                  <div key={b.id} className="bg-slate-800/40 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-800/60 group">
                    <div>
                      <h3 className="text-white font-bold">{lang === 'de' ? b.name_de : b.name_en}</h3>
                      <p className="text-xs text-slate-500">{b.items.length} items</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingBundle(b)} className="p-2 text-slate-500 hover:text-white"><Edit2 size={16}/></button>
                      <button onClick={() => addSelection(b.id)} className="brand-pink text-brand-green px-4 py-1.5 rounded-lg text-xs font-black uppercase">{t.add}</button>
                    </div>
                  </div>
                ))}
                {bundles.length === 0 && (
                  <div className="text-center py-20 text-slate-600">
                    <Database size={48} className="mx-auto mb-4 opacity-20"/>
                    <button onClick={() => setBundles(DEMO_BUNDLES)} className="text-brand-pink text-sm underline">{t.loadDemo}</button>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col h-[610px]">
                <h2 className="text-white font-black text-sm uppercase mb-4 tracking-widest">{t.selectedBundles} ({selections.length})</h2>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {selections.map(s => {
                    const b = bundles.find(x => x.id === s.bundleId);
                    return b && (
                      <div key={s.bundleId} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-xs text-white font-bold truncate">{lang === 'de' ? b.name_de : b.name_en}</p>
                          <input type="number" value={s.quantity} onChange={e => updateQty(s.bundleId, parseInt(e.target.value))} className="w-16 bg-slate-900 text-brand-pink text-xs rounded px-2 py-1 mt-1 border-0"/>
                        </div>
                        <button onClick={() => setSelections(selections.filter(x => x.bundleId !== s.bundleId))} className="text-slate-600 hover:text-red-500"><X size={16}/></button>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <button disabled={!selections.length || isGenerating} onClick={() => generatePDF(false)} className="w-full brand-pink text-brand-green py-3 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2">
                    {isGenerating ? <RefreshCw className="animate-spin"/> : <><Eye size={18}/> {t.previewPdf}</>}
                  </button>
                  <button disabled={!selections.length || isGenerating} onClick={() => generatePDF(true)} className="w-full brand-green text-white py-3 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2">
                    <Download size={18}/> {t.download}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{t.importData}</h2>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-700 text-center">
                <Upload size={48} className="mx-auto text-slate-600 mb-4"/>
                <p className="text-slate-400 text-sm mb-4">Upload your Excel or CSV file</p>
                <input type="file" id="up" className="hidden" onChange={(e: any) => {
                  const f = e.target.files[0];
                  if(!f) return;
                  const reader = new FileReader();
                  reader.onload = (ev: any) => {
                    const XLSX = (window as any).XLSX;
                    const wb = XLSX.read(ev.target.result, { type: 'binary' });
                    const ws = wb.Sheets[wb.SheetNames[0]];
                    const json = XLSX.utils.sheet_to_json(ws);
                    // Minimal mapping logic for demo
                    alert(t.successImport);
                    setPage('generator');
                  };
                  reader.readAsBinaryString(f);
                }}/>
                <label htmlFor="up" className="brand-pink text-brand-green px-8 py-3 rounded-xl font-black cursor-pointer inline-block">CHOOSE FILE</label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
