"use client";

import { useState } from 'react';
import { 
  ShoppingBag, Plus, Edit2, Trash2, Check, X, 
  RotateCcw, Search, Upload, Tag, DollarSign, Layers,
  CheckCircle, AlertCircle, Eye, Shirt
} from 'lucide-react';
import { ShopProduct, saveProduct, deleteProduct, resetProductsToDefault, DEFAULT_PRODUCTS } from '@/lib/dataService';
import { validateUploadFile, sanitizeInput } from '@/lib/security';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface ShopManagerProps {
  products: ShopProduct[];
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

// Visual catalog templates available in the project
const CATALOG_TEMPLATES = [
  { label: 'Polo Domicile Rouge', img: '/shop/kit_officiel_polo_condor.png' },
  { label: 'Extérieur Blanc', img: '/shop/kit_officiel_exterieur_blanc.png' },
  { label: 'Third Alvéoles', img: '/shop/kit_third_alveoles_lave.png' },
  { label: 'Match Pro Marbré', img: '/shop/maillot_match_pro_marbre.png' },
  { label: 'Short & Chaussettes', img: '/shop/short_chaussettes_pro_marbre.png' },
  { label: 'Polo Manches Badges', img: '/shop/kit_officiel_polo_sleeves.png' },
  { label: 'Entraînement Rouge #10', img: '/shop/kit_entrainement_pro_rouge_10.png' },
  { label: 'Débardeur Rouge #08', img: '/shop/kit_entrainement_debardeur_rouge.png' },
  { label: 'Débardeur Noir Fitness', img: '/shop/debardeur_entrainement_noir_fitness.png' },
  { label: 'Débardeur Blanc Académie', img: '/shop/debardeur_entrainement_blanc.png' }
];

const STANDARD_SIZES = [
  'Enfant (6-10 ans)',
  'Enfant (8-12 ans)',
  'Enfant (11-14 ans)',
  'Taille Junior',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'Taille Unique Adulte'
];

export default function ShopManager({ products, onRefresh, showToast }: ShopManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'match' | 'training' | 'accessories'>('all');
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState('');

  // Open Create Form
  const handleOpenCreate = () => {
    setIsCreating(true);
    setHighlightsInput('');
    setEditingProduct({
      id: `item-${Date.now()}`,
      title: '',
      category: 'match',
      category_label: 'Tenue Officielle Domicile',
      subtitle: '',
      price: 65,
      formatted_price: '65.00 $',
      tag: 'NOUVEAU',
      tag_bg: 'var(--clr-primary)',
      img: '/shop/kit_officiel_polo_condor.png',
      badge_text: '',
      description: '',
      highlights: [],
      sizes: ['S', 'M', 'L', 'XL']
    });
  };

  // Open Edit Form
  const handleOpenEdit = (product: ShopProduct) => {
    setIsCreating(false);
    setHighlightsInput(Array.isArray(product.highlights) ? product.highlights.join('\n') : '');
    setEditingProduct({
      ...product,
      category_label: product.category_label || (product.category === 'match' ? 'Tenue Officielle Match' : product.category === 'training' ? 'Entraînement' : 'Accessoires'),
      tag_bg: product.tag_bg || 'var(--clr-primary)',
      sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']
    });
  };

  // Handle Image Upload with Security Validation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const validation = validateUploadFile(file);
    if (!validation.valid) {
      alert(validation.error || 'Fichier image invalide.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingProduct({ ...editingProduct, img: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle size in array
  const handleToggleSize = (size: string) => {
    if (!editingProduct) return;
    const currentSizes = editingProduct.sizes || [];
    const updated = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    setEditingProduct({ ...editingProduct, sizes: updated });
  };

  // Save Product
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.id.trim()) {
      showToast('Veuillez renseigner un identifiant unique / référence.');
      return;
    }
    if (!editingProduct.title.trim()) {
      showToast('Veuillez renseigner un titre pour le produit.');
      return;
    }
    if (!editingProduct.price || editingProduct.price <= 0) {
      showToast('Veuillez spécifier un prix valide en USD.');
      return;
    }

    setSaving(true);
    try {
      const parsedHighlights = highlightsInput
        .split('\n')
        .map(h => sanitizeInput(h.trim()))
        .filter(h => h.length > 0);

      const payload: ShopProduct = {
        ...editingProduct,
        id: editingProduct.id.trim().toLowerCase().replace(/\s+/g, '-'),
        title: sanitizeInput(editingProduct.title),
        subtitle: sanitizeInput(editingProduct.subtitle || ''),
        category_label: sanitizeInput(editingProduct.category_label || ''),
        tag: sanitizeInput(editingProduct.tag || ''),
        badge_text: sanitizeInput(editingProduct.badge_text || ''),
        description: sanitizeInput(editingProduct.description || ''),
        formatted_price: `${editingProduct.price}.00 $`,
        highlights: parsedHighlights
      };

      const res = await saveProduct(payload);
      if (res.success) {
        showToast(`Article "${payload.title}" ${isCreating ? 'créé' : 'enregistré'} avec succès !`);
        setEditingProduct(null);
        setIsCreating(false);
        onRefresh();
      } else {
        showToast(res.error || "Erreur lors de l'enregistrement de l'article.");
      }
    } catch (err) {
      showToast("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Product
  const handleDelete = (id: string, title: string) => {
    askConfirm({
      title: "SUPPRIMER L'ARTICLE",
      message: `Êtes-vous sûr de vouloir supprimer définitivement l'article "${title}" de la boutique ?`,
      confirmLabel: "OUI, SUPPRIMER",
      onConfirm: async () => {
        try {
          const res = await deleteProduct(id);
          if (res.success) {
            showToast(`Article "${title}" supprimé de la boutique.`);
            onRefresh();
          } else {
            showToast("Erreur lors de la suppression de l'article.");
          }
        } catch (err) {
          showToast("Erreur lors de la suppression.");
        }
      }
    });
  };

  // Restore Default Catalog
  const handleRestoreDefaults = () => {
    askConfirm({
      title: "RESTAURER LE CATALOGUE",
      message: "Restaurer les 10 articles officiels du catalogue Condor FC ?\nTous les articles initiaux seront rechargés.",
      confirmLabel: "OUI, RESTAURER",
      onConfirm: () => {
        resetProductsToDefault();
        showToast("Catalogue officiel restauré avec succès ! (10 articles)");
        onRefresh();
      }
    });
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || 
      p.title.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(term)) ||
      (p.tag && p.tag.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(202, 2, 79, 0.08)', borderRadius: '20px', color: 'var(--clr-primary)', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <ShoppingBag size={14} /> Boutique & Équipements Officiels
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', margin: 0, color: 'var(--clr-black)' }}>
            Gestion de la Boutique
          </h2>
          <p style={{ color: 'var(--clr-gray)', margin: '6px 0 0', fontSize: '0.96rem' }}>
            Contrôlez l'ensemble des maillots officiels, packs de match, tenues d'entraînement et accessoires disponibles à la vente.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRestoreDefaults}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', borderColor: '#cbd5e1', background: '#ffffff', padding: '11px 18px', borderRadius: '10px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}
            title="Restaurer les 10 maillots et tenues du catalogue officiel Condor"
          >
            <RotateCcw size={16} /> Restaurer Catalogue Officiel
          </button>

          <button
            onClick={handleOpenCreate}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(202, 2, 79, 0.25)' }}
          >
            <Plus size={18} /> Ajouter un Article
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.4rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, référence, tag..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Tous (${products.length})` },
            { id: 'match', label: `Match (${products.filter(p => p.category === 'match').length})` },
            { id: 'training', label: `Entraînement (${products.filter(p => p.category === 'training').length})` },
            { id: 'accessories', label: `Accessoires (${products.filter(p => p.category === 'accessories').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: selectedCategory === tab.id ? 'var(--clr-primary)' : '#f1f5f9',
                color: selectedCategory === tab.id ? '#ffffff' : '#475569',
                fontWeight: selectedCategory === tab.id ? '700' : '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Edit / Create Modal Form */}
      {editingProduct && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid rgba(202, 2, 79, 0.25)', padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 10px 35px rgba(202, 2, 79, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(202, 2, 79, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-primary)' }}>
                {isCreating ? <Plus size={20} /> : <Edit2 size={18} />}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#0f172a' }}>
                {isCreating ? 'Créer un nouvel article de boutique' : `Modifier l'article : ${editingProduct.title}`}
              </h3>
            </div>
            <button
              onClick={() => setEditingProduct(null)}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
              {/* Product Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Titre du Produit *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Kit Officiel Match Polo 26/27"
                  value={editingProduct.title}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                />
              </div>

              {/* Unique ID / Ref */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Identifiant / Référence Unique *
                </label>
                <input
                  type="text"
                  placeholder="Ex: kit-polo-domicile"
                  value={editingProduct.id}
                  onChange={e => setEditingProduct({ ...editingProduct, id: e.target.value })}
                  disabled={!isCreating}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: isCreating ? '#f8fafc' : '#f1f5f9', fontSize: '0.95rem', color: isCreating ? '#000' : '#64748b' }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Catégorie Boutique *
                </label>
                <select
                  value={editingProduct.category}
                  onChange={e => {
                    const cat = e.target.value as any;
                    const defaultLabels: Record<string, string> = {
                      match: 'Tenue Officielle Match',
                      training: 'Entraînement Pro',
                      accessories: 'Accessoires Officiels'
                    };
                    setEditingProduct({ 
                      ...editingProduct, 
                      category: cat,
                      category_label: defaultLabels[cat] || 'Boutique Condor'
                    });
                  }}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                >
                  <option value="match">Match / Tenue Officielle</option>
                  <option value="training">Entraînement Académie</option>
                  <option value="accessories">Accessoires & Compléments</option>
                </select>
              </div>

              {/* Price USD */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Prix ($ USD) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
              {/* Subtitle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Sous-titre descriptif
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pack Complet 3 Pièces : Polo, Short & Chaussettes"
                  value={editingProduct.subtitle || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                />
              </div>

              {/* Category Label */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Libellé affiché de catégorie
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tenue Officielle Domicile"
                  value={editingProduct.category_label || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, category_label: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                />
              </div>

              {/* Tag / Badge Text */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Badge / Tag visuel
                </label>
                <input
                  type="text"
                  placeholder="Ex: DOMICILE, TOP VENTE, THIRD PRO, NOUVEAU"
                  value={editingProduct.tag || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                />
              </div>

              {/* Special Badge Text */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Badge spécial (ruban supérieur)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pack Complet 3 Pièces, Édition Limitée"
                  value={editingProduct.badge_text || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, badge_text: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {/* Product Image Selection & Quick Templates */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.4rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
                Photo du Produit
              </label>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '6px' }}>
                  <img src={editingProduct.img || '/shop/kit_officiel_polo_condor.png'} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="shop-product-img-upload"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="shop-product-img-upload"
                      className="btn btn-outline"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#0f172a', borderColor: '#cbd5e1', background: '#ffffff' }}
                    >
                      <Upload size={15} /> Téléverser une image personnalisée
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Ou collez l'URL directe de l'image (/shop/...)"
                    value={editingProduct.img}
                    onChange={e => setEditingProduct({ ...editingProduct, img: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Quick Template Picker */}
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                  Ou choisissez un visuel officiel de la collection Condor :
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {CATALOG_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.img}
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, img: tpl.img })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: editingProduct.img === tpl.img ? '2px solid var(--clr-primary)' : '1px solid #cbd5e1',
                        background: editingProduct.img === tpl.img ? 'rgba(202, 2, 79, 0.06)' : '#ffffff',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: editingProduct.img === tpl.img ? 'var(--clr-primary)' : '#334155'
                      }}
                    >
                      <img src={tpl.img} alt={tpl.label} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                      <span>{tpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Description détaillée du produit
              </label>
              <textarea
                rows={3}
                placeholder="Description complète, caractéristiques des tissus, finitions..."
                value={editingProduct.description || ''}
                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', resize: 'vertical' }}
              />
            </div>

            {/* Highlights (Points forts) */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Points forts / Caractéristiques clés (1 par ligne)
              </label>
              <textarea
                rows={3}
                placeholder={"Ex:\nPack complet 3 pièces : Maillot + Short + Chaussettes\nÉcusson brodé Condor Edu-Sport Académie & drapeau Haïti\nMaille respirante anti-humidité"}
                value={highlightsInput}
                onChange={e => setHighlightsInput(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'monospace' }}
              />
            </div>

            {/* Sizes Selection */}
            <div style={{ marginBottom: '1.8rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                Tailles disponibles pour cet article
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {STANDARD_SIZES.map(sz => {
                  const isSelected = (editingProduct.sizes || []).includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleToggleSize(sz)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: isSelected ? '1px solid var(--clr-primary)' : '1px solid #cbd5e1',
                        background: isSelected ? 'var(--clr-primary)' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#334155',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sz} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="btn btn-outline"
                style={{ color: '#475569', borderColor: '#cbd5e1', background: '#ffffff', padding: '11px 22px', borderRadius: '10px', fontWeight: '600' }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 26px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 4px 15px rgba(202, 2, 79, 0.25)' }}
              >
                <Check size={18} /> {saving ? 'Enregistrement...' : "Enregistrer l'article"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(202, 2, 79, 0.08)', color: 'var(--clr-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
            <ShoppingBag size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 8px' }}>
            Aucun article trouvé dans la boutique
          </h3>
          <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto 1.8rem', fontSize: '0.95rem' }}>
            {searchTerm 
              ? `Aucun article ne correspond au filtre "${searchTerm}". Essayez une autre recherche.` 
              : "Le catalogue de la boutique ne contient actuellement aucun produit configuré."}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleRestoreDefaults}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontWeight: '700' }}
            >
              <RotateCcw size={18} /> Charger le Catalogue Officiel (10 Articles)
            </button>
            <button
              onClick={handleOpenCreate}
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', color: '#0f172a', borderColor: '#cbd5e1' }}
            >
              <Plus size={18} /> Créer un Article
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.8rem' }}>
          {filteredProducts.map(prod => (
            <div
              key={prod.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}
            >
              {/* Product Visual Container */}
              <div style={{ background: '#f8fafc', padding: '1.5rem', textAlign: 'center', position: 'relative', borderBottom: '1px solid #f1f5f9', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {prod.tag && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: prod.tag_bg || 'var(--clr-primary)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {prod.tag}
                  </span>
                )}

                {prod.badge_text && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}
                  >
                    {prod.badge_text}
                  </span>
                )}

                <img
                  src={prod.img}
                  alt={prod.title}
                  style={{
                    maxHeight: '180px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </div>

              {/* Product Body */}
              <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--clr-primary)', marginBottom: '4px' }}>
                  {prod.category_label || (prod.category === 'match' ? 'Match Officiel' : prod.category === 'training' ? 'Entraînement' : 'Accessoires')}
                </div>

                <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.3 }}>
                  {prod.title}
                </h4>

                {prod.subtitle && (
                  <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
                    {prod.subtitle}
                  </p>
                )}

                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--clr-primary)', margin: 'auto 0 12px' }}>
                  {prod.formatted_price || `${prod.price}.00 $`}
                </div>

                {/* Sizes Chips Preview */}
                {prod.sizes && prod.sizes.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {prod.sizes.slice(0, 5).map(sz => (
                      <span
                        key={sz}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          padding: '2px 7px',
                          borderRadius: '4px'
                        }}
                      >
                        {sz}
                      </span>
                    ))}
                    {prod.sizes.length > 5 && (
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '2px 4px' }}>
                        +{prod.sizes.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <button
                    onClick={() => handleOpenEdit(prod)}
                    className="btn btn-outline"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      borderColor: '#cbd5e1',
                      background: '#ffffff',
                      borderRadius: '8px'
                    }}
                  >
                    <Edit2 size={14} /> Modifier
                  </button>

                  <button
                    onClick={() => handleDelete(prod.id, prod.title)}
                    className="btn btn-outline"
                    title="Supprimer cet article"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      background: '#fff5f5',
                      borderRadius: '8px'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
