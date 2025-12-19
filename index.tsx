import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Search, 
  Printer, 
  FileText, 
  Calendar,
  X,
  Edit2,
  Save,
  Info,
  PlusCircle,
  Leaf,
  Sprout,
  Fish,
  Utensils,
  Beef,
  Croissant,
  Soup,
  Database,
  AlertTriangle,
  Tag
} from 'lucide-react';

/**
 * BRAND CONSTANTS
 */
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

const getAllergenFullName = (input: string, legend: { code: string, name: string }[]): string => {
  const clean = input.trim().toUpperCase();
  const found = legend.find(a => a.code === clean);
  return found ? found.name : input.trim();
};

const TEXT = {
  de: {
    appTitle: 'Bella&Bona Etiketten-Generator',
    labelGenerator: 'Etiketten-Generator',
    importData: 'Datenbank & Import',
    packedOn: 'Abgepackt am',
    searchPlaceholder: 'Nach Bundles suchen...',
    availableBundles: 'Verfügbare Bundles',
    selectedBundles: 'Ausgewählte Bundles',
    noBundles: 'Keine Bundles gefunden.',
    add: 'Hinzufügen',
    quantity: 'Anzahl',
    clearAll: 'Alle löschen',
    generatePdf: 'PDF generieren',
    importInstructions: 'Format-Anweisungen',
    importRequired: 'Erforderlich',
    importOptional: 'Optional',
    downloadTemplate: 'Excel-Template herunterladen',
    uploadFile: 'Excel/CSV hochladen',
    allergens: 'Allergene',
    diet: 'Ernährungsform',
    brandName: 'BELLA&BONA',
    successImport: 'Daten erfolgreich importiert und in der Datenbank gespeichert!',
    errorImport: 'Fehler beim Importieren der Datei.',
    noSelected: 'Noch keine Bundles für den Druck ausgewählt.',
    createNew: 'Neues Bundle erstellen',
    editBundle: 'Bundle bearbeiten',
    saveBundle: 'Speichern',
    deleteBundle: 'Löschen',
    addItem: 'Item hinzufügen',
    bundleName: 'Bundle Name',
    itemName: 'Item Name',
    allergenLegend: 'Allergen-Legende',
    dbStats: 'Gespeicherte Daten',
    clearDb: 'Datenbank löschen',
    confirmClear: 'Sind Sie sicher? Alle gespeicherten Bundles werden gelöscht.',
    manageAllergens: 'Allergene Verwalten',
    allergenCode: 'Code (z.B. X)',
    allergenName: 'Name (z.B. Hafer)',
    addAllergen: 'Allergen hinzufügen'
  },
  en: {
    appTitle: 'Bella&Bona Label Generator',
    labelGenerator: 'Label Generator',
    importData: 'Database & Import',
    packedOn: 'Packed On',
    searchPlaceholder: 'Search bundles...',
    availableBundles: 'Available Bundles',
    selectedBundles: 'Selected Bundles',
    noBundles: 'No bundles found.',
    add: 'Add',
    quantity: 'Qty',
    clearAll: 'Clear All',
    generatePdf: 'Generate PDF',
    importInstructions: 'Format Instructions',
    importRequired: 'Required',
    importOptional: 'Optional',
    downloadTemplate: 'Download Excel Template',
    uploadFile: 'Upload Excel/CSV',
    allergens: 'Allergens',
    diet: 'Diet Type',
    brandName: 'BELLA&BONA',
    successImport: 'Data imported and saved to database successfully!',
    errorImport: 'Error importing file.',
    noSelected: 'No bundles selected for printing yet.',
    createNew: 'Create New Bundle',
    editBundle: 'Edit Bundle',
    saveBundle: 'Save Bundle',
    deleteBundle: 'Delete',
    addItem: 'Add Item',
    bundleName: 'Bundle Name',
    itemName: 'Item Name',
    allergenLegend: 'Allergen Legend',
    dbStats: 'Saved Database',
    clearDb: 'Clear Database',
    confirmClear: 'Are you sure? All saved bundles will be permanently removed.',
    manageAllergens: 'Manage Allergens',
    allergenCode: 'Code (e.g. X)',
    allergenName: 'Name (e.g. Oats)',
    addAllergen: 'Add Allergen'
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

const DB_KEY = 'bb_label_db';
const ALLERGEN_KEY = 'bb_allergen_db';

const getInitialData = (): Bundle[] => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);
  return [];
};

const getInitialAllergens = (): { code: string, name: string }[] => {
  const saved = localStorage.getItem(ALLERGEN_KEY);
  if (saved) return JSON.parse(saved);
  return DEFAULT_ALLERGENS;
};

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

const LabelPreview = ({ bundle, date, t, lang, allergens }: { bundle: Bundle, date: string, t: typeof TEXT.de, lang: 'de' | 'en', allergens: { code: string, name: string }[] }) => {
  const dateLocale = lang === 'de' ? 'de-DE' : 'en-GB';
  const itemCount = bundle.items.length;

  const config = useMemo(() => {
    if (itemCount <= 3) return { title: 28, item: 20, allergen: 10, dietIcon: 26, dietText: 12, spacing: 'py-10 gap-10', divider: true, headerMin: 100 };
    if (itemCount <= 5) return { title: 24, item: 16, allergen: 9, dietIcon: 22, dietText: 11, spacing: 'py-6 gap-6', divider: true, headerMin: 90 };
    if (itemCount <= 7) return { title: 22, item: 13, allergen: 8.5, dietIcon: 18, dietText: 10, spacing: 'py-4 gap-4', divider: true, headerMin: 80 };
    if (itemCount <= 10) return { title: 20, item: 11, allergen: 7.5, dietIcon: 16, dietText: 9, spacing: 'py-3 gap-2.5', divider: false, headerMin: 70 };
    return { title: 18, item: 10, allergen: 7, dietIcon: 14, dietText: 8, spacing: 'py-2 gap-1.5', divider: false, headerMin: 65 };
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
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}
    >
      <WatermarkPattern />
      <div className="brand-green text-white relative z-10 shadow-md flex flex-col justify-center px-6" style={{ minHeight: `${config.headerMin}px` }}>
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
              {idx > 0 && config.divider && (
                <div className="w-full flex items-center gap-2 opacity-10 mb-2">
                  <div className="flex-1 border-t border-brand-green"></div>
                  <div className="w-1 h-1 rounded-full brand-pink"></div>
                  <div className="flex-1 border-t border-brand-green"></div>
                </div>
              )}
              
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
                           className="brand-pink text-[#024930] px-1.5 py-0.5 rounded-sm font-extrabold shadow-sm whitespace-nowrap uppercase tracking-wider leading-none" 
                           style={{ fontSize: `${config.allergen}px` }}
                         >
                          {getAllergenFullName(a, allergens)}
                         </span>
                      ))}
                    </div>
                  )}
                </div>

                {item.diet_de && (
                  <div className="shrink-0 flex flex-col items-center pt-0.5 min-w-[55px]">
                    <div className="p-1 bg-white rounded-full shadow-sm border border-slate-50 mb-0.5">
                      <DietSymbol type={item.diet_de} size={config.dietIcon} />
                    </div>
                    <span 
                      className="uppercase font-black tracking-widest text-[#024930] bg-pink-100/60 px-1.5 py-0.5 rounded shadow-sm text-center w-full leading-none" 
                      style={{ fontSize: `${config.dietText}px` }}
                    >
                      {item.diet_de}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-10 py-4 border-t border-slate-100 flex justify-between items-center relative z-10" style={{ backgroundColor: COLORS.FOOTER_BG }}>
        <div className="flex flex-col">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-700 mb-0.5">{t.packedOn}</p>
          <p className="text-sm font-black text-brand-green leading-none">
            {new Date(date).toLocaleDateString(dateLocale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black tracking-tighter text-brand-green leading-none uppercase">
            {t.brandName.split('&')[0]}<span className="text-brand-pink">&</span>{t.brandName.split('&')[1]}
          </p>
        </div>
      </div>
    </div>
  );
};

const BundleEditor = ({ bundle, onSave, onCancel, t }: { 
  bundle?: Bundle, 
  onSave: (bundle: Bundle) => void, 
  onCancel: () => void,
  t: typeof TEXT.en 
}) => {
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

  const removeItem = (id: string) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const updateItem = (id: string, field: keyof BundleItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-black text-brand-pink uppercase tracking-tight">{bundle ? t.editBundle : t.createNew}</h2>
          <button onClick={onCancel} className="text-slate-500 hover:text-white transition p-2"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.bundleName} (DE)</label>
              <input type="text" value={formData.name_de} onChange={e => setFormData({...formData, name_de: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.bundleName} (EN)</label>
              <input type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"/>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">{t.addItem}s</h3>
              <button onClick={addItem} className="flex items-center gap-2 text-xs font-bold brand-pink text-brand-green px-3 py-1.5 rounded-lg transition"><Plus size={14} /> {t.addItem}</button>
            </div>
            <div className="space-y-4">
              {formData.items.map((item) => (
                <div key={item.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl relative group">
                  <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={14} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.itemName} (DE)</label>
                      <input type="text" value={item.item_name_de} onChange={e => updateItem(item.id, 'item_name_de', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.itemName} (EN)</label>
                      <input type="text" value={item.item_name_en} onChange={e => updateItem(item.id, 'item_name_en', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.allergens}</label>
                      <input type="text" value={item.allergens_de} onChange={e => updateItem(item.id, 'allergens_de', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.diet}</label>
                      <input type="text" value={item.diet_de} onChange={e => updateItem(item.id, 'diet_de', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-4">
          <button onClick={onCancel} className="px-6 py-3 text-slate-400 font-bold">Cancel</button>
          <button onClick={() => onSave(formData)} className="brand-pink text-brand-green px-8 py-3 rounded-xl font-black shadow-lg">Save Bundle</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [bundles, setBundles] = useState<Bundle[]>(getInitialData);
  const [allergens, setAllergens] = useState<{ code: string, name: string }[]>(getInitialAllergens);
  const [page, setPage] = useState<'generator' | 'import'>('generator');
  const [lang, setLang] = useState<'de' | 'en'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [packedOn, setPackedOn] = useState(new Date().toISOString().split('T')[0]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null | 'new'>(null);

  // Allergen form state
  const [newAllergenCode, setNewAllergenCode] = useState('');
  const [newAllergenName, setNewAllergenName] = useState('');

  const t = TEXT[lang];

  useEffect(() => { localStorage.setItem(DB_KEY, JSON.stringify(bundles)); }, [bundles]);
  useEffect(() => { localStorage.setItem(ALLERGEN_KEY, JSON.stringify(allergens)); }, [allergens]);

  const filteredBundles = useMemo(() => {
    return bundles.filter(b => b.name_de.toLowerCase().includes(searchTerm.toLowerCase()) || b.name_en.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [bundles, searchTerm]);

  const addBundle = (id: string, qty: number = 1) => {
    setSelections(prev => {
      const exists = prev.find(s => s.bundleId === id);
      if (exists) return prev;
      return [...prev, { bundleId: id, quantity: qty }];
    });
  };

  const removeSelection = (id: string) => setSelections(prev => prev.filter(s => s.bundleId !== id));
  const updateQuantity = (id: string, qty: number) => setSelections(prev => prev.map(s => s.bundleId === id ? { ...s, quantity: Math.max(1, qty) } : s));
  const clearSelections = () => setSelections([]);

  const saveBundle = (updatedBundle: Bundle) => {
    setBundles(prev => {
      const exists = prev.find(b => b.id === updatedBundle.id);
      if (exists) return prev.map(b => b.id === updatedBundle.id ? updatedBundle : b);
      return [updatedBundle, ...prev];
    });
    setEditingBundle(null);
  };

  const deleteBundle = (id: string) => {
    setBundles(prev => prev.filter(b => b.id !== id));
    setSelections(prev => prev.filter(s => s.bundleId !== id));
  };

  const clearDatabase = () => {
    if (window.confirm(t.confirmClear)) {
      setBundles([]);
      setSelections([]);
      localStorage.removeItem(DB_KEY);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      try {
        const XLSX = (window as any).XLSX;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length === 0) return;

        const bundleMap = new Map<string, Bundle>();
        const selectionMap = new Map<string, {qty: number, date: string}>();

        jsonData.forEach(row => {
          const normalizedRow: any = {};
          Object.keys(row).forEach(k => normalizedRow[k.toLowerCase().trim()] = row[k]);

          const bundleNameDe = normalizedRow.bundle_name_de;
          if (!bundleNameDe) return;

          let bundle = bundleMap.get(bundleNameDe) || bundles.find(b => b.name_de === bundleNameDe);
          
          if (!bundle) {
            bundle = {
              id: Math.random().toString(36).substr(2, 9),
              name_de: bundleNameDe,
              name_en: normalizedRow.bundle_name_en || bundleNameDe,
              created_at: new Date().toISOString(),
              items: []
            };
            bundleMap.set(bundleNameDe, bundle);
          } else {
            if (!bundleMap.has(bundleNameDe)) {
               bundle = { ...bundle, items: [] }; 
               bundleMap.set(bundleNameDe, bundle);
            }
          }

          const qty = parseInt(normalizedRow.quantity);
          if (!isNaN(qty) && qty > 0) {
            selectionMap.set(bundle.id, { qty: qty, date: normalizedRow.packed_on || "" });
          }

          bundle.items.push({
            id: Math.random().toString(36).substr(2, 9),
            bundle_id: bundle.id,
            item_name_de: normalizedRow.item_name_de || "",
            item_name_en: normalizedRow.item_name_en || "",
            allergens_de: String(normalizedRow.allergens_de || ""),
            diet_de: normalizedRow.diet_de || "",
            created_at: new Date().toISOString()
          });
        });

        const newBundlesList = Array.from(bundleMap.values());
        
        setBundles(prev => {
          const updated = [...prev];
          newBundlesList.forEach(nb => {
            const idx = updated.findIndex(b => b.name_de === nb.name_de);
            if (idx > -1) updated[idx] = nb;
            else updated.unshift(nb);
          });
          return updated;
        });

        selectionMap.forEach((val, bId) => {
          addBundle(bId, val.qty);
          if (val.date && typeof val.date === 'string' && val.date.includes('.')) {
            const parts = val.date.split('.');
            if (parts.length === 3) {
              const [d, m, y] = parts;
              setPackedOn(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
            }
          }
        });

        alert(t.successImport);
        setPage('generator');
      } catch (err) {
        console.error(err);
        alert(t.errorImport);
      }
    };
    reader.readAsBinaryString(file);
  };

  const generatePDF = async () => {
    if (selections.length === 0) return;
    setIsGenerating(true);
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const flatLabels: Bundle[] = [];
    selections.forEach(sel => {
      const bundle = bundles.find(b => b.id === sel.bundleId);
      if (bundle) for (let i = 0; i < sel.quantity; i++) flatLabels.push(bundle);
    });
    const renderContainer = document.createElement('div');
    renderContainer.id = 'pdf-render-container';
    document.body.appendChild(renderContainer);

    for (let i = 0; i < flatLabels.length; i++) {
      const bundle = flatLabels[i];
      const labelEl = document.createElement('div');
      renderContainer.appendChild(labelEl);
      const root = createRoot(labelEl);
      root.render(<LabelPreview bundle={bundle} date={packedOn} t={t} lang={lang} allergens={allergens} />);
      await new Promise(resolve => setTimeout(resolve, 850));
      const canvas = await html2canvas(labelEl, { scale: 2.5, useCORS: true, width: 396.85, height: 561.26, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const x = (i % 2) * 105;
      const y = (Math.floor(i / 2) % 2) * 148.5;
      if (i > 0 && i % 4 === 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', x, y, 105, 148.5);
      renderContainer.removeChild(labelEl);
    }
    document.body.removeChild(renderContainer);
    pdf.save(`labels-${packedOn.split('-').reverse().join('-')}.pdf`);
    setIsGenerating(false);
  };

  const downloadTemplate = () => {
    const XLSX = (window as any).XLSX;
    const data = [
      ["bundle_name_de", "bundle_name_en", "item_name_de", "item_name_en", "allergens_de", "diet_de", "quantity", "packed_on"],
      ["Morning Variety Box", "Morning Variety Box", "Mini Butter Croissant", "Mini Butter Croissant", "Gluten, Egg, Lactose", "Vegetarisch", 1, "19.12.2025"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Labels");
    XLSX.writeFile(wb, "bb_import_template.xlsx");
  };

  const handleAddAllergen = () => {
    if (!newAllergenCode || !newAllergenName) return;
    const exists = allergens.find(a => a.code.toUpperCase() === newAllergenCode.toUpperCase());
    if (exists) {
      setAllergens(allergens.map(a => a.code.toUpperCase() === newAllergenCode.toUpperCase() ? { ...a, name: newAllergenName } : a));
    } else {
      setAllergens([...allergens, { code: newAllergenCode.toUpperCase(), name: newAllergenName }]);
    }
    setNewAllergenCode('');
    setNewAllergenName('');
  };

  const removeAllergen = (code: string) => {
    setAllergens(allergens.filter(a => a.code !== code));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {editingBundle && <BundleEditor bundle={editingBundle === 'new' ? undefined : editingBundle} onSave={saveBundle} onCancel={() => setEditingBundle(null)} t={t} />}
      <nav className="brand-green text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="brand-pink text-brand-green p-2 rounded-lg shadow-inner"><FileText size={24} /></div>
          <h1 className="text-xl font-black tracking-tight uppercase">{t.appTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage('generator')} className={`px-4 py-2 rounded-full font-medium transition ${page === 'generator' ? 'brand-pink text-brand-green scale-105' : 'hover:bg-green-800'}`}>{t.labelGenerator}</button>
          <button onClick={() => setPage('import')} className={`px-4 py-2 rounded-full font-medium transition ${page === 'import' ? 'brand-pink text-brand-green scale-105' : 'hover:bg-green-800'}`}>{t.importData}</button>
          <div className="ml-4 flex items-center bg-green-900 rounded-full p-1">
             <button onClick={() => setLang('de')} className={`px-2 py-1 text-xs rounded-full transition ${lang === 'de' ? 'bg-white text-black font-bold' : 'text-white'}`}>DE</button>
             <button onClick={() => setLang('en')} className={`px-2 py-1 text-xs rounded-full transition ${lang === 'en' ? 'bg-white text-black font-bold' : 'text-white'}`}>EN</button>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {page === 'generator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.packedOn}</label>
                      <input type="date" value={packedOn} onChange={(e) => setPackedOn(e.target.value)} className="w-full pl-4 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"/>
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.searchPlaceholder}</label>
                      <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-4 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"/>
                    </div>
                    <button onClick={() => setEditingBundle('new')} className="bg-brand-green text-white p-3 rounded-xl hover:brightness-110 shadow-lg"><PlusCircle size={24} /></button>
                  </div>
                </div>
                <div className="divide-y divide-slate-800 h-[600px] overflow-y-auto">
                  {filteredBundles.map(bundle => (
                    <div key={bundle.id} className="p-4 hover:bg-slate-800/50 transition flex items-center justify-between group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-brand-pink text-lg">{lang === 'de' ? bundle.name_de : bundle.name_en}</h3>
                          <Edit2 size={16} className="text-slate-500 cursor-pointer opacity-0 group-hover:opacity-100" onClick={() => setEditingBundle(bundle)}/>
                        </div>
                        <p className="text-sm text-slate-400 italic">{lang === 'de' ? bundle.name_en : bundle.name_de}</p>
                      </div>
                      <button onClick={() => addBundle(bundle.id)} className="brand-pink text-brand-green px-4 py-2 rounded-xl font-bold">{t.add}</button>
                    </div>
                  ))}
                  {filteredBundles.length === 0 && <div className="p-12 text-center text-slate-500 font-medium italic">{t.noBundles}</div>}
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col h-full max-h-[760px]">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h2 className="font-bold text-slate-100 uppercase text-sm">{t.selectedBundles}</h2></div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selections.map(sel => {
                    const bundle = bundles.find(b => b.id === sel.bundleId);
                    if (!bundle) return null;
                    return (
                      <div key={sel.bundleId} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-bold text-sm truncate">{lang === 'de' ? bundle.name_de : bundle.name_en}</p>
                          <input type="number" value={sel.quantity} onChange={(e) => updateQuantity(sel.bundleId, parseInt(e.target.value) || 1)} className="w-16 bg-slate-700 border border-slate-600 rounded mt-2 text-center text-sm"/>
                        </div>
                        <X size={20} className="text-slate-500 cursor-pointer" onClick={() => removeSelection(sel.bundleId)}/>
                      </div>
                    );
                  })}
                  {selections.length === 0 && <div className="p-8 text-center text-slate-600 text-sm italic">{t.noSelected}</div>}
                </div>
                <div className="p-6 border-t border-slate-800">
                  <button disabled={selections.length === 0 || isGenerating} onClick={generatePDF} className="w-full brand-green text-white py-4 rounded-2xl font-black text-lg disabled:opacity-30">{isGenerating ? 'Generating...' : t.generatePdf}</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Import Section */}
                <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
                  <h2 className="text-3xl font-black text-brand-pink uppercase mb-8">{t.importData}</h2>
                  <div className="space-y-6">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                      <h3 className="font-bold mb-4 text-slate-100 flex items-center gap-2"><Info size={18} className="text-brand-pink" /> {t.importInstructions}</h3>
                      <div className="text-xs text-slate-400 space-y-2 font-mono bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                        <p>Mandatory columns in Excel/CSV:</p>
                        <p className="text-brand-pink break-all">bundle_name_de, bundle_name_en, item_name_de, item_name_en, allergens_de, diet_de, quantity, packed_on</p>
                      </div>
                      <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button onClick={downloadTemplate} className="flex-1 border border-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition flex items-center justify-center gap-2"><Download size={16} /> {t.downloadTemplate}</button>
                        <label className="flex-1 brand-pink text-brand-green py-3 rounded-xl font-black text-center cursor-pointer hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg"><Upload size={18} /> {t.uploadFile} <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} className="hidden"/></label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allergen Management Section */}
                <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
                   <h3 className="font-bold mb-6 text-slate-100 uppercase text-sm tracking-widest flex items-center gap-2"><Tag size={18} className="text-brand-pink" /> {t.manageAllergens}</h3>
                   
                   <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 mb-8">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                       <div>
                         <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.allergenCode}</label>
                         <input 
                           type="text" 
                           placeholder="X" 
                           value={newAllergenCode} 
                           onChange={e => setNewAllergenCode(e.target.value)} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-pink transition"
                         />
                       </div>
                       <div>
                         <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.allergenName}</label>
                         <input 
                           type="text" 
                           placeholder="Oats" 
                           value={newAllergenName} 
                           onChange={e => setNewAllergenName(e.target.value)} 
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-pink transition"
                         />
                       </div>
                     </div>
                     <button 
                       onClick={handleAddAllergen} 
                       className="w-full py-2.5 rounded-xl brand-pink text-brand-green font-black uppercase text-xs shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition"
                     >
                       <Plus size={14} /> {t.addAllergen}
                     </button>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allergens.map(item => (
                      <div key={item.code} className="group flex gap-2 items-center bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 hover:border-slate-600 transition relative">
                        <span className="brand-pink text-brand-green font-black px-1.5 py-0.5 rounded min-w-[24px] text-center text-[10px]">{item.code}</span>
                        <span className="text-slate-400 font-medium text-[10px] truncate pr-4">{item.name}</span>
                        <button 
                          onClick={() => removeAllergen(item.code)} 
                          className="absolute right-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Database Stats */}
                <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                  <h3 className="font-bold mb-6 text-slate-100 uppercase text-xs tracking-widest flex items-center gap-2"><Database size={16} className="text-brand-pink" /> {t.dbStats}</h3>
                  <div className="bg-slate-800/30 p-6 rounded-2xl text-center space-y-2 border border-slate-800">
                    <p className="text-4xl font-black text-brand-pink">{bundles.length}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{t.availableBundles}</p>
                  </div>
                  <button onClick={clearDatabase} className="w-full mt-8 border border-red-900/30 text-red-500 py-3 rounded-xl font-bold text-xs hover:bg-red-900/10 transition flex items-center justify-center gap-2"><Trash2 size={14} /> {t.clearDb}</button>
                </div>

                {/* Pro Tip */}
                <div className="bg-brand-green/20 p-8 rounded-3xl border border-brand-green/30">
                  <div className="flex items-center gap-3 text-brand-pink mb-4">
                    <AlertTriangle size={24} />
                    <p className="font-black uppercase text-sm">Pro Tip</p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "The bundle system automatically saves your data. Every time you import new data, it is added to the list on the left for easy access."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
