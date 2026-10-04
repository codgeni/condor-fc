"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X, ShieldCheck, FileText, Trash2, Plus, Edit } from 'lucide-react';

export interface ConfirmItemDetails {
  type?: 'Ajout' | 'Modification' | 'Suppression' | string;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
}

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  itemDetails?: ConfirmItemDetails;
  onConfirm: () => void | Promise<void>;
  successMessage?: string;
}

interface ConfirmPosterContextType {
  showConfirmed: (message: string, title?: string) => void;
  askConfirm: (options: ConfirmDialogOptions) => void;
}

const ConfirmPosterContext = createContext<ConfirmPosterContextType>({
  showConfirmed: () => {},
  askConfirm: () => {}
});

export const useConfirmPoster = () => useContext(ConfirmPosterContext);

export function ConfirmPosterProvider({ children }: { children: React.ReactNode }) {
  // State for the "CONFIRMÉ" Success Poster
  const [successPoster, setSuccessPoster] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: 'CONFIRMÉ',
    message: ''
  });

  // State for the "Confirmation Request" Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    itemDetails?: ConfirmItemDetails;
    onConfirm?: () => void | Promise<void>;
    successMessage?: string;
  }>({
    isOpen: false,
    title: 'CONFIRMATION REQUISE',
    message: '',
    confirmLabel: 'OUI, CONFIRMER',
    cancelLabel: 'ANNULER'
  });

  const [progress, setProgress] = useState(100);

  // Close success poster
  const closeSuccessPoster = useCallback(() => {
    setSuccessPoster(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Show "CONFIRMÉ" poster
  const showConfirmed = useCallback((message: string, title: string = 'CONFIRMÉ') => {
    setSuccessPoster({
      isOpen: true,
      title: title || 'CONFIRMÉ',
      message
    });
    setProgress(100);
  }, []);

  // Ask confirmation dialog
  const askConfirm = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog({
      isOpen: true,
      title: options.title || 'CONFIRMATION REQUISE',
      message: options.message,
      confirmLabel: options.confirmLabel || 'OUI, CONFIRMER',
      cancelLabel: options.cancelLabel || 'ANNULER',
      itemDetails: options.itemDetails,
      onConfirm: options.onConfirm,
      successMessage: options.successMessage
    });
  }, []);

  // Auto-dismiss countdown for success poster (3.5 seconds)
  useEffect(() => {
    if (!successPoster.isOpen) return;

    const duration = 3500;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= step) {
          clearInterval(timer);
          closeSuccessPoster();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [successPoster.isOpen, closeSuccessPoster]);

  // Handle Confirm Click
  const handleDialogConfirm = async () => {
    const action = confirmDialog.onConfirm;
    const successMsg = confirmDialog.successMessage;
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));

    if (action) {
      try {
        await action();
        if (successMsg) {
          showConfirmed(successMsg);
        }
      } catch (err) {
        console.error("Erreur lors de l'action:", err);
      }
    }
  };

  // Close Confirm Dialog
  const handleDialogCancel = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (successPoster.isOpen) closeSuccessPoster();
        if (confirmDialog.isOpen) handleDialogCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [successPoster.isOpen, confirmDialog.isOpen, closeSuccessPoster]);

  return (
    <ConfirmPosterContext.Provider value={{ showConfirmed, askConfirm }}>
      {children}

      {/* ==========================================================
          1. AFFICHE DU SITE : "CONFIRMÉ" (Affiche Officielle Condor FC)
      ========================================================== */}
      <AnimatePresence>
        {successPoster.isOpen && (
          <div
            onClick={closeSuccessPoster}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.78)',
              backdropFilter: 'blur(8px)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(145deg, #161616 0%, #1a050f 100%)',
                border: '2px solid var(--clr-primary)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '520px',
                padding: '2.8rem 2.2rem 2.2rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 25px 70px rgba(202, 2, 79, 0.4), 0 0 40px rgba(0, 0, 0, 0.8)',
                cursor: 'default',
                color: '#ffffff'
              }}
            >
              {/* Top Accent Light Bar */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: 'linear-gradient(90deg, #ca024f, #ff1a6b, #ca024f)'
                }}
              />

              {/* Close Cross */}
              <button
                onClick={closeSuccessPoster}
                aria-label="Fermer"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(202, 2, 79, 0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              >
                <X size={18} />
              </button>

              {/* Club Crest Header */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.2rem' }}>
                <img
                  src="/condor_logo_transparent.png"
                  alt="Condor FC"
                  style={{
                    height: '58px',
                    width: 'auto',
                    filter: 'drop-shadow(0 4px 15px rgba(202, 2, 79, 0.5))',
                    marginBottom: '8px'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--clr-primary)',
                    background: 'rgba(202, 2, 79, 0.12)',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(202, 2, 79, 0.25)'
                  }}
                >
                  Condor FC • Notification Officielle
                </span>
              </div>

              {/* Glowing Red Shield / Check Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1, stiffness: 400, damping: 20 }}
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--clr-primary) 0%, #800132 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                  boxShadow: '0 0 35px rgba(202, 2, 79, 0.65), 0 0 10px rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.25)'
                }}
              >
                <Check size={42} color="#ffffff" strokeWidth={3.5} />
              </motion.div>

              {/* Title: CONFIRMÉ */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '3.2rem',
                  color: '#ffffff',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  margin: '0 0 6px',
                  lineHeight: 1,
                  textShadow: '0 4px 20px rgba(202, 2, 79, 0.6)'
                }}
              >
                {successPoster.title}
              </h2>

              {/* Sub-divider line */}
              <div
                style={{
                  width: '70px',
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, var(--clr-primary), transparent)',
                  borderRadius: '2px',
                  margin: '10px auto 16px'
                }}
              />

              {/* Message Description */}
              <p
                style={{
                  fontSize: '1.15rem',
                  color: '#e2e8f0',
                  lineHeight: 1.55,
                  maxWidth: '430px',
                  margin: '0 auto 1.8rem',
                  fontWeight: '500'
                }}
              >
                {successPoster.message}
              </p>

              {/* Action Button: OK, CONTINUER */}
              <button
                onClick={closeSuccessPoster}
                className="btn btn-primary"
                style={{
                  padding: '13px 40px',
                  fontSize: '1rem',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  borderRadius: '12px',
                  boxShadow: '0 6px 25px rgba(202, 2, 79, 0.5)',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Check size={18} /> Continuer
              </button>

              {/* Countdown Progress Bar at Bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--clr-primary)',
                    transition: 'width 0.05s linear'
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================================
          2. DEMANDE DE CONFIRMATION (Remplace window.confirm)
      ========================================================== */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div
            onClick={handleDialogCancel}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.78)',
              backdropFilter: 'blur(8px)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(145deg, #161616 0%, #1e0914 100%)',
                border: '2px solid rgba(202, 2, 79, 0.7)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '520px',
                padding: '2.5rem 2.2rem 2.2rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 45px rgba(202, 2, 79, 0.35)',
                cursor: 'default',
                color: '#ffffff'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.2rem' }}>
                <img
                  src="/condor_logo_transparent.png"
                  alt="Condor FC"
                  style={{
                    height: '52px',
                    width: 'auto',
                    marginBottom: '6px'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#ffc107',
                    background: 'rgba(255, 193, 7, 0.12)',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }}
                >
                  Condor FC • Validation Requise
                </span>
              </div>

              {/* Warning Icon */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'rgba(202, 2, 79, 0.15)',
                  border: '2px solid var(--clr-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                  boxShadow: '0 0 25px rgba(202, 2, 79, 0.4)'
                }}
              >
                <AlertCircle size={36} color="var(--clr-primary)" />
              </div>

              {/* Dialog Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.2rem',
                  color: '#ffffff',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  margin: '0 0 8px',
                  lineHeight: 1.1
                }}
              >
                {confirmDialog.title}
              </h3>

              {/* Prompt Message */}
              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#cbd5e1',
                  lineHeight: '1.55',
                  maxWidth: '440px',
                  margin: '0 auto 1.5rem',
                  whiteSpace: 'pre-line'
                }}
              >
                {confirmDialog.message}
              </p>

              {/* Carte Aperçu de l'élément concerné */}
              {confirmDialog.itemDetails && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    margin: '0 auto 1.8rem',
                    maxWidth: '440px',
                    textAlign: 'left',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.3)',
                    position: 'relative'
                  }}
                >
                  {/* Badge Type d'opération */}
                  {confirmDialog.itemDetails.type && (
                    <div style={{ marginBottom: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: confirmDialog.itemDetails.type === 'Suppression' 
                            ? 'rgba(239, 68, 68, 0.2)' 
                            : confirmDialog.itemDetails.type === 'Ajout' 
                            ? 'rgba(34, 197, 94, 0.2)' 
                            : 'rgba(245, 158, 11, 0.2)',
                          color: confirmDialog.itemDetails.type === 'Suppression' 
                            ? '#f87171' 
                            : confirmDialog.itemDetails.type === 'Ajout' 
                            ? '#4ade80' 
                            : '#fbbf24',
                          border: `1px solid ${confirmDialog.itemDetails.type === 'Suppression' ? 'rgba(239, 68, 68, 0.4)' : confirmDialog.itemDetails.type === 'Ajout' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                        }}
                      >
                        {confirmDialog.itemDetails.type === 'Suppression' && <><Trash2 size={12} /> SUPPRESSION DÉFINITIVE</>}
                        {confirmDialog.itemDetails.type === 'Ajout' && <><Plus size={12} /> NOUVEL AJOUT</>}
                        {confirmDialog.itemDetails.type === 'Modification' && <><Edit size={12} /> MODIFICATION ENREGISTRÉE</>}
                        {!['Suppression', 'Ajout', 'Modification'].includes(confirmDialog.itemDetails.type) && `● ${confirmDialog.itemDetails.type}`}
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Thumbnail Image si existante */}
                    {confirmDialog.itemDetails.image ? (
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#0a0a0c',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={confirmDialog.itemDetails.image}
                          alt={confirmDialog.itemDetails.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8'
                        }}
                      >
                        <FileText size={24} />
                      </div>
                    )}

                    {/* Titre et détails */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '1.02rem',
                          fontWeight: '800',
                          color: '#ffffff',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.3
                        }}
                        title={confirmDialog.itemDetails.title}
                      >
                        {confirmDialog.itemDetails.title}
                      </div>
                      {confirmDialog.itemDetails.subtitle && (
                        <div
                          style={{
                            fontSize: '0.84rem',
                            color: '#cbd5e1',
                            marginTop: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {confirmDialog.itemDetails.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Tag badge latéral si existant */}
                    {confirmDialog.itemDetails.badge && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          background: 'rgba(255, 255, 255, 0.12)',
                          color: '#e2e8f0',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          flexShrink: 0,
                          border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        {confirmDialog.itemDetails.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDialogCancel}
                  className="btn btn-outline"
                  style={{
                    padding: '12px 26px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    borderRadius: '10px',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer'
                  }}
                >
                  {confirmDialog.cancelLabel}
                </button>

                <button
                  type="button"
                  onClick={handleDialogConfirm}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 32px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    borderRadius: '10px',
                    background: confirmDialog.itemDetails?.type === 'Suppression' ? '#dc2626' : confirmDialog.itemDetails?.type === 'Ajout' ? '#16a34a' : 'var(--clr-primary)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: confirmDialog.itemDetails?.type === 'Suppression' ? '0 6px 20px rgba(220, 38, 38, 0.45)' : '0 6px 20px rgba(202, 2, 79, 0.4)'
                  }}
                >
                  {confirmDialog.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmPosterContext.Provider>
  );
}
