"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  CheckCircle, 
  ArrowLeft, 
  Phone, 
  User, 
  MapPin, 
  Tag, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { 
  fetchProducts, 
  ShopProduct, 
  submitShopOrder, 
  ShopOrder,
  fetchSiteContent,
  SiteContent,
  DEFAULT_SITE_CONTENT
} from '@/lib/dataService';

function OrderFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedId = searchParams.get('id') || '';
  const requestedSize = searchParams.get('size') || '';

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [flocageName, setFlocageName] = useState('');
  const [flocageNumber, setFlocageNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<ShopOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchSiteContent()
    ]).then(([prods, content]) => {
      if (prods && prods.length > 0) {
        setProducts(prods);
        // Find requested product or default to first available
        const found = prods.find(p => p.id === requestedId) || prods.find(p => p.is_available !== false) || prods[0];
        if (found) {
          setSelectedProduct(found);
          const defaultSz = requestedSize && found.sizes?.includes(requestedSize)
            ? requestedSize
            : (found.sizes && found.sizes.length > 0 ? found.sizes[0] : 'M');
          setSelectedSize(defaultSz);
        }
      }
      if (content) setSiteContent(content);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [requestedId, requestedSize]);

  // When switching product
  const handleProductChange = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
      if (prod.sizes && prod.sizes.length > 0 && !prod.sizes.includes(selectedSize)) {
        setSelectedSize(prod.sizes[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMsg('Veuillez renseigner un numéro de téléphone valide pour que le club puisse vous contacter.');
      return;
    }
    if (!selectedProduct) {
      setErrorMsg('Veuillez sélectionner un équipement.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitShopOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        product_id: selectedProduct.id,
        product_title: selectedProduct.title,
        product_img: selectedProduct.img,
        size: selectedSize,
        quantity: Number(quantity) || 1,
        flocage_name: flocageName.trim().toUpperCase(),
        flocage_number: flocageNumber.trim(),
        delivery_address: deliveryAddress.trim(),
        notes: notes.trim(),
        status: 'En attente'
      });

      if (res.success && res.data) {
        setSubmittedOrder(res.data);
      } else {
        setErrorMsg("Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: '#f8fafc' }}>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Chargement du formulaire de commande...</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, marginTop: '80px', background: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Header Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b2e 100%)', color: 'white', padding: '3.5rem 0 2.5rem', borderBottom: '3px solid var(--clr-primary)' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <Link 
            href="/shop" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: '#cbd5e1', 
              textDecoration: 'none', 
              fontSize: '0.9rem', 
              fontWeight: '700',
              marginBottom: '1.2rem',
              transition: 'color 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Retour à la Boutique
          </Link>

          <span style={{ display: 'inline-block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--clr-primary)', fontWeight: '800', marginBottom: '6px' }}>
            Boutique Officielle Condor FC
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', margin: '0 0 10px', lineHeight: 1.15 }}>
            Bon de Commande d'Équipement
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
            Remplissez ce formulaire en toute simplicité. <strong style={{ color: '#ffffff' }}>Aucun paiement immédiat requis</strong> : l'administration du club vous contacte directement par téléphone pour confirmer votre commande.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '1100px', marginTop: '2.5rem' }}>
        
        {/* Success Confirmation View */}
        {submittedOrder ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: '#ffffff', 
              borderRadius: '20px', 
              padding: '3rem 2rem', 
              textAlign: 'center',
              boxShadow: '0 10px 35px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              maxWidth: '720px',
              margin: '0 auto'
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 6px 20px rgba(22, 163, 74, 0.2)' }}>
              <CheckCircle size={46} />
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>
              ✓ Commande Enregistrée
            </span>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: '#0f172a', margin: '0 0 12px' }}>
              Merci {submittedOrder.customer_name} !
            </h2>

            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 auto 2rem', maxWidth: '580px' }}>
              Votre commande pour l'équipement <strong>{submittedOrder.product_title}</strong> a bien été transmise à notre secrétariat. Nous allons vous contacter par téléphone au <strong style={{ color: 'var(--clr-primary)' }}>{submittedOrder.customer_phone}</strong> très prochainement.
            </p>

            {/* Recap Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', textAlign: 'left', marginBottom: '2.5rem' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Récapitulatif de votre commande :
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.92rem' }}>
                <div><span style={{ color: '#64748b' }}>Article :</span> <strong>{submittedOrder.product_title}</strong></div>
                <div><span style={{ color: '#64748b' }}>Taille choisie :</span> <strong>{submittedOrder.size}</strong></div>
                <div><span style={{ color: '#64748b' }}>Quantité :</span> <strong>{submittedOrder.quantity}</strong></div>
                <div><span style={{ color: '#64748b' }}>Téléphone :</span> <strong>{submittedOrder.customer_phone}</strong></div>
                {submittedOrder.flocage_name && (
                  <div><span style={{ color: '#64748b' }}>Nom floqué :</span> <strong>{submittedOrder.flocage_name}</strong></div>
                )}
                {submittedOrder.flocage_number && (
                  <div><span style={{ color: '#64748b' }}>Numéro floqué :</span> <strong>#{submittedOrder.flocage_number}</strong></div>
                )}
                {submittedOrder.delivery_address && (
                  <div><span style={{ color: '#64748b' }}>Zone / Adresse :</span> <strong>{submittedOrder.delivery_address}</strong></div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  router.push('/shop');
                }}
                className="btn btn-primary"
                style={{ padding: '12px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem' }}
              >
                Retourner à la boutique
              </button>

              <Link
                href="/"
                className="btn btn-outline"
                style={{ padding: '12px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', color: '#0f172a', borderColor: '#cbd5e1' }}
              >
                Page d'accueil
              </Link>
            </div>
          </motion.div>
        ) : (

          /* The Form Layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left Column: Product Summary */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.8rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--clr-primary)', display: 'block', marginBottom: '8px' }}>
                Équipement Sélectionné
              </span>

              {/* Selector to change equipment */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Changer d'équipement :
                </label>
                <select
                  value={selectedProduct?.id || ''}
                  onChange={(e) => handleProductChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    color: '#0f172a'
                  }}
                >
                  {products.filter(p => p.is_available !== false).map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* Product Preview Card */}
              {selectedProduct && (
                <div>
                  <div style={{ height: '220px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', marginBottom: '1.2rem' }}>
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.title}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#0f172a', margin: '0 0 6px' }}>
                    {selectedProduct.title}
                  </h3>

                  {selectedProduct.subtitle && (
                    <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0 0 12px', lineHeight: 1.4 }}>
                      {selectedProduct.subtitle}
                    </p>
                  )}

                  {selectedProduct.highlights && selectedProduct.highlights.length > 0 && (
                    <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', marginBottom: '1.4rem' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Inclus dans cet équipement :
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        {selectedProduct.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Club Reassurance */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#15803d', fontWeight: '700' }}>
                      <ShieldCheck size={16} /> Produit officiel Condor Edu-Sport Académie
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#475569' }}>
                      <Clock size={16} color="var(--clr-primary)" /> Confirmation et préparation sous 24-48h
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#475569' }}>
                      <MapPin size={16} color="var(--clr-primary)" /> Retrait au secrétariat ou livraison locale
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Form */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: '#0f172a', margin: '0 0 6px' }}>
                Vos Informations de Commande
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.8rem' }}>
                Remplissez les informations ci-dessous pour que le secrétariat prépare votre tenue et vous contacte.
              </p>

              {errorMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                {/* 1. Coordonnées */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean-Baptiste Alexandre"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    Numéro de téléphone (Appel / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +509 4877 7143 ou 4877-7143"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    Ce numéro sera utilisé par le secrétariat pour vous appeler et valider la commande.
                  </span>
                </div>

                {/* 2. Taille et Quantité */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                      Taille de l'équipement *
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: '700'
                      }}
                    >
                      {(selectedProduct?.sizes && selectedProduct.sizes.length > 0 
                        ? selectedProduct.sizes 
                        : ['Enfant (8-12 ans)', 'S', 'M', 'L', 'XL', 'XXL']).map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                      Quantité (Nombre d'exemplaires)
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: '700'
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>{n} {n > 1 ? 'exemplaires' : 'exemplaire'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Flocage Personnalisé (Optionnel) */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Sparkles size={16} color="var(--clr-primary)" />
                    <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>
                      Flocage Personnalisé au Dos (Optionnel)
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#64748b' }}>
                    Personnalisez le maillot avec votre nom et numéro officiel préféré si vous le souhaitez.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                        Nom souhaité au dos
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: ALEXANDRE"
                        value={flocageName}
                        onChange={(e) => setFlocageName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                        Numéro souhaité (#)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 10, 7, 24..."
                        value={flocageNumber}
                        onChange={(e) => setFlocageNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Ville / Adresse de Livraison ou Retrait */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    Commune / Zone de livraison ou de retrait (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Delmas 77, Pétion-Ville, Tabarre, ou Retrait au club..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                {/* 5. Précisions / Remarques */}
                <div style={{ marginBottom: '1.8rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    Remarques ou questions pour le club (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Précisez un détail particulier ou votre préférence d'horaire d'appel..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Banner aucun paiement */}
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: '700' }}>
                    Aucune carte bancaire requise. Cette commande est transmise directement au secrétariat qui vous appellera au numéro indiqué.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '1.05rem',
                    fontWeight: '800',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 20px rgba(202, 2, 79, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {submitting ? 'Enregistrement de la commande...' : 'Valider et envoyer ma commande'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ShopOrderPage() {
  return (
    <Suspense fallback={
      <div style={{ flex: 1, marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p>Chargement...</p>
      </div>
    }>
      <OrderFormContent />
    </Suspense>
  );
}
