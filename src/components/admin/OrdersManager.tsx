"use client";

import { useState } from 'react';
import { 
  ShoppingBag, 
  Phone, 
  MessageCircle, 
  Search, 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  User, 
  MapPin, 
  RefreshCw,
  Sparkles,
  PhoneCall,
  Check,
  X
} from 'lucide-react';
import { ShopOrder, updateShopOrderStatus, deleteShopOrder } from '@/lib/dataService';
import { useConfirmPoster } from '@/components/ui/ConfirmPosterModal';

interface OrdersManagerProps {
  orders: ShopOrder[];
  onRefresh: () => void;
  showToast: (msg: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  'En attente': {
    label: 'En attente d\'appel',
    bg: '#fffbeb',
    color: '#b45309',
    border: '#fde68a'
  },
  'Contacté': {
    label: 'Client Contacté',
    bg: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe'
  },
  'Confirmé': {
    label: 'Commande Confirmée',
    bg: '#f0fdf4',
    color: '#15803d',
    border: '#bbf7d0'
  },
  'Prêt / Livré': {
    label: 'Prêt / Livré',
    bg: '#ecfdf5',
    color: '#047857',
    border: '#a7f3d0'
  },
  'Annulé': {
    label: 'Annulé',
    bg: '#fef2f2',
    color: '#b91c1c',
    border: '#fecaca'
  }
};

export default function OrdersManager({ orders, onRefresh, showToast }: OrdersManagerProps) {
  const { askConfirm } = useConfirmPoster();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'En attente' | 'Contacté' | 'Confirmé' | 'Prêt / Livré' | 'Annulé'>('all');
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  // Status Change Handler
  const handleStatusChange = async (order: ShopOrder, newStatus: ShopOrder['status']) => {
    setUpdatingId(order.id);
    await updateShopOrderStatus(order.id, newStatus);
    showToast(`Commande de ${order.customer_name} mise à jour : "${newStatus}"`);
    setUpdatingId(null);
    onRefresh();
  };

  // Delete Handler
  const handleDeleteOrder = (order: ShopOrder) => {
    askConfirm({
      title: 'SUPPRIMER LA COMMANDE',
      message: `Voulez-vous vraiment supprimer la commande de ${order.customer_name} (${order.product_title}) ?`,
      confirmLabel: 'OUI, SUPPRIMER',
      itemDetails: {
        type: 'Suppression définitive',
        title: order.customer_name,
        subtitle: `${order.product_title} • Tél: ${order.customer_phone}`,
        badge: order.status
      },
      onConfirm: async () => {
        await deleteShopOrder(order.id);
        showToast(`Commande de ${order.customer_name} supprimée avec succès.`);
        onRefresh();
      }
    });
  };

  // Clean phone number for tel: or wa.me links
  const sanitizePhone = (phone: string) => {
    return phone.replace(/[^0-9+]/g, '');
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    if (!matchesStatus) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (order.customer_name || '').toLowerCase().includes(term) ||
      (order.customer_phone || '').toLowerCase().includes(term) ||
      (order.product_title || '').toLowerCase().includes(term) ||
      (order.flocage_name || '').toLowerCase().includes(term) ||
      (order.delivery_address || '').toLowerCase().includes(term)
    );
  });

  // Counters
  const countTotal = orders.length;
  const countPending = orders.filter(o => o.status === 'En attente').length;
  const countContacted = orders.filter(o => o.status === 'Contacté').length;
  const countConfirmed = orders.filter(o => o.status === 'Confirmé').length;
  const countDelivered = orders.filter(o => o.status === 'Prêt / Livré').length;

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(202, 2, 79, 0.1)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: 0, color: '#0f172a' }}>
                Commandes Boutique Reçues
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                Consultez les commandes d'équipements passées sans paiement, appelez directement les supporters et suivez l'avancement.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="btn btn-outline"
          style={{ padding: '9px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
            Total Commandes
          </span>
          <strong style={{ fontSize: '1.8rem', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
            {countTotal}
          </strong>
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
            À Contacter (En attente)
          </span>
          <strong style={{ fontSize: '1.8rem', color: '#b45309', fontFamily: 'var(--font-heading)' }}>
            {countPending}
          </strong>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
            Clients Contactés
          </span>
          <strong style={{ fontSize: '1.8rem', color: '#1d4ed8', fontFamily: 'var(--font-heading)' }}>
            {countContacted}
          </strong>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
            Confirmées / Livrées
          </span>
          <strong style={{ fontSize: '1.8rem', color: '#15803d', fontFamily: 'var(--font-heading)' }}>
            {countConfirmed + countDelivered}
          </strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.8rem' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, équipement ou flocage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px 11px 44px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.92rem'
            }}
          />
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { id: 'all', label: `Toutes (${countTotal})` },
            { id: 'En attente', label: `À Contacter (${countPending})` },
            { id: 'Contacté', label: `Contacté (${countContacted})` },
            { id: 'Confirmé', label: `Confirmé (${countConfirmed})` },
            { id: 'Prêt / Livré', label: `Prêt / Livré (${countDelivered})` },
            { id: 'Annulé', label: 'Annulées' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: statusFilter === tab.id ? 'var(--clr-primary)' : '#e2e8f0',
                background: statusFilter === tab.id ? 'rgba(202, 2, 79, 0.1)' : '#ffffff',
                color: statusFilter === tab.id ? 'var(--clr-primary)' : '#475569',
                fontWeight: statusFilter === tab.id ? '800' : '600',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <ShoppingBag size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#0f172a' }}>
            Aucune commande trouvée
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
            {searchTerm || statusFilter !== 'all' 
              ? "Aucun résultat ne correspond à vos critères de recherche." 
              : "Les commandes passées depuis la boutique s'afficheront ici en temps réel."}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOrders.map(order => {
            const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG['En attente'];
            const cleanPhone = sanitizePhone(order.customer_phone);

            return (
              <div 
                key={order.id}
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '14px', 
                  border: order.status === 'En attente' ? '2px solid #fde68a' : '1px solid #e2e8f0', 
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: order.status === 'En attente' ? '0 4px 15px rgba(245, 158, 11, 0.1)' : '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Top Row: Customer Info + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  
                  {/* Customer Block */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(202, 2, 79, 0.1)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                        <User size={16} />
                      </div>
                      <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>
                        {order.customer_name}
                      </strong>
                    </div>

                    {/* Phone Number in prominent styling with 1-click CALL and WHATSAPP */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                        📞 {order.customer_phone}
                      </span>

                      {/* Direct Call Button */}
                      <a
                        href={`tel:${cleanPhone}`}
                        title="Appeler directement ce numéro"
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <PhoneCall size={13} /> Appeler
                      </a>

                      {/* Direct WhatsApp Button */}
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Bonjour ${order.customer_name}, c'est l'administration du Condor FC au sujet de votre commande d'équipement : ${order.product_title} (Taille : ${order.size}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ouvrir la conversation WhatsApp avec ce client"
                        style={{
                          background: '#25D366',
                          color: '#ffffff',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Status Badge & Timestamp */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span 
                      style={{ 
                        background: statusStyle.bg, 
                        color: statusStyle.color, 
                        border: `1px solid ${statusStyle.border}`, 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '800',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.color }} />
                      {statusStyle.label}
                    </span>

                    {order.created_at && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Product & Details */}
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  
                  {/* Thumbnail */}
                  {order.product_img ? (
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0 }}>
                      <img src={order.product_img} alt={order.product_title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Tag size={24} color="#94a3b8" />
                    </div>
                  )}

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#0f172a', fontWeight: '800' }}>
                      {order.product_title}
                    </h4>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.82rem' }}>
                      <span style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', fontWeight: '700', color: '#1e293b' }}>
                        Taille : {order.size}
                      </span>
                      <span style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', fontWeight: '700', color: '#1e293b' }}>
                        Quantité : {order.quantity}
                      </span>

                      {/* Custom Flocage Badge */}
                      {(order.flocage_name || order.flocage_number) && (
                        <span style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} />
                          Flocage : {order.flocage_name || 'Sans Nom'} {order.flocage_number ? `#${order.flocage_number}` : ''}
                        </span>
                      )}

                      {/* Delivery Address */}
                      {order.delivery_address && (
                        <span style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="var(--clr-primary)" />
                          {order.delivery_address}
                        </span>
                      )}
                    </div>

                    {order.notes && (
                      <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                        Note client : « {order.notes} »
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Status Update Actions & Delete */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  
                  {/* Status buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748b', marginRight: '4px' }}>
                      Changer d'état :
                    </span>
                    {(['En attente', 'Contacté', 'Confirmé', 'Prêt / Livré', 'Annulé'] as const).map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(order, st)}
                        disabled={order.status === st || updatingId === order.id}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: order.status === st ? 'default' : 'pointer',
                          border: order.status === st ? '1px solid transparent' : '1px solid #cbd5e1',
                          background: order.status === st ? 'var(--clr-primary)' : '#f8fafc',
                          color: order.status === st ? '#ffffff' : '#475569',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteOrder(order)}
                    title="Supprimer cette commande"
                    style={{
                      background: 'transparent',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
