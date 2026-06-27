"use client";
 
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Award, Send, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function Contact() {
  const [formData, setFormData] = useState({
    // Connu par
    connuPar: '', connuAutre: '',
    // Enfant
    enfantNom: '', enfantPrenom: '', enfantDateNaissance: '', enfantSexe: '', enfantTelephones: '', enfantAdresse: '',
    // Parent
    parentNom: '', parentPrenom: '', parentWhatsapp: '', parentTelephones: '', parentNIF: '', parentCourriel: '', parentAdresse: '',
    // Urgence
    urgenceNom: '', urgencePrenom: '', urgenceWhatsapp: '', urgenceTelephones: '', urgenceLien: '', urgenceCourriel: '', urgenceAdresse: '',
    // Additionnelles
    ecoleClassique: '', niveauClasse: '', ecoleClub: '', position: '', duree: '', ageDebut: '',
    // Uniformes
    tailleMaillot: '', tailleShort: '', taillePoitrine: '', tailleEpaule: '', tailleLongueur: '', tailleHauteur: '', tailleHanche: '', taille: '', pointure: '', uniformeDesire: '', uniformeTrouve: '',
    // Plan
    planAdhesion: '',
    // Medical
    allergies: '', asthme: '', medicaments: '', medecinNom: '', preoccupation: '', medecinTel: '', medecinWhatsapp: '', causeAllergie: '',
    autorisationUrgence: '',
    // Consentement
    consentementLuApprouve: false,
    consentementTarifs: false,
    consentementCertificat: false,
    autoriseRecuperer: '',
    nifRecuperer: '',
    rentrerSeul: false,
    signatureParent: '',
    dateSignature: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enregistrement dans Supabase
    const { error } = await supabase.from('inscriptions').insert({
      enfant_nom: formData.enfantNom,
      enfant_prenom: formData.enfantPrenom,
      enfant_dob: formData.enfantDateNaissance,
      parent_nom: formData.parentNom,
      parent_prenom: formData.parentPrenom,
      parent_tel: formData.parentTelephones,
      parent_email: formData.parentCourriel,
      form_data: formData
    });

    if (error) {
      console.error("Erreur lors de l'enregistrement de l'inscription:", error);
      alert("Une erreur est survenue lors de l'enregistrement de votre inscription en base de données. Veuillez réessayer.");
      return;
    }
    
    const body = `NOUVELLE INSCRIPTION - CONDOR ECOLE DE FOOTBALL

=== COMMENT VOUS NOUS AVEZ CONNU ? ===
${formData.connuPar} ${formData.connuAutre ? `(${formData.connuAutre})` : ''}

=== 1. ENFANT ===
Nom: ${formData.enfantNom} | Prénom: ${formData.enfantPrenom}
Date de naissance: ${formData.enfantDateNaissance} | Sexe: ${formData.enfantSexe}
Téléphones: ${formData.enfantTelephones}
Adresse: ${formData.enfantAdresse}

=== 2. PARENT / PERSONNE RESPONSABLE ===
Nom: ${formData.parentNom} | Prénom: ${formData.parentPrenom}
WhatsApp: ${formData.parentWhatsapp} | Téléphones: ${formData.parentTelephones}
NIF/NINU: ${formData.parentNIF}
Courriel: ${formData.parentCourriel}
Adresse: ${formData.parentAdresse}

=== 3. CONTACT EN CAS D'URGENCE ===
Nom: ${formData.urgenceNom} | Prénom: ${formData.urgencePrenom}
Lien de parenté: ${formData.urgenceLien}
WhatsApp: ${formData.urgenceWhatsapp} | Téléphones: ${formData.urgenceTelephones}
Courriel: ${formData.urgenceCourriel}
Adresse: ${formData.urgenceAdresse}

=== 4. INFORMATIONS ADDITIONNELLES & RAPPORT ===
École classique: ${formData.ecoleClassique} | Niveau/Classe: ${formData.niveauClasse}
École/Club: ${formData.ecoleClub} | Position occupée: ${formData.position}
Durée: ${formData.duree} | Âge début pratique: ${formData.ageDebut}

=== 5. DIMENSION DES UNIFORMES ===
Maillot: ${formData.tailleMaillot} | Short: ${formData.tailleShort}
Poitrine: ${formData.taillePoitrine} | Épaule: ${formData.tailleEpaule} | Longueur: ${formData.tailleLongueur}
Hauteur: ${formData.tailleHauteur} | Hanche: ${formData.tailleHanche} | Taille: ${formData.taille}
Pointure: ${formData.pointure}
# Uniforme: Désiré: ${formData.uniformeDesire} / Trouvé: ${formData.uniformeTrouve}

=== 6. PLAN D'ADHÉSION CHOISI ===
Plan: ${formData.planAdhesion}

=== 7. RENSEIGNEMENTS MEDICAUX ===
Allergies: ${formData.allergies}
Asthme: ${formData.asthme} | Médicaments: ${formData.medicaments}
Médecin: ${formData.medecinNom} | Préoccupation: ${formData.preoccupation}
Tel: ${formData.medecinTel} | WA: ${formData.medecinWhatsapp}
Cause allergie / conduite: ${formData.causeAllergie}
En cas d'urgence/accident : ${formData.autorisationUrgence}

=== 8. CONSENTEMENT PARENTAL ===
Lu et approuvé conditions : ${formData.consentementLuApprouve ? 'OUI' : 'NON'}
Pris connaissance tarifs : ${formData.consentementTarifs ? 'OUI' : 'NON'}
Fournira certificat (1 mois) : ${formData.consentementCertificat ? 'OUI' : 'NON'}
Autorisé à récupérer l'enfant : ${formData.autoriseRecuperer} (NIF: ${formData.nifRecuperer})
Enfant rentre seul : ${formData.rentrerSeul ? 'OUI' : 'NON'}

SIGNATURE (Tapée) : ${formData.signatureParent}
DATE : ${formData.dateSignature}
`;

    // Sauvegarder dans la base de données Supabase
    supabase.from('inscriptions').insert({
      enfant_nom: formData.enfantNom,
      enfant_prenom: formData.enfantPrenom,
      enfant_dob: formData.enfantDateNaissance,
      parent_nom: formData.parentNom,
      parent_prenom: formData.parentPrenom,
      parent_tel: formData.parentTelephones,
      parent_email: formData.parentCourriel,
      form_data: formData
    }).then(({ error }) => {
      if (error) {
        console.error("Erreur lors de la sauvegarde dans Supabase :", error);
      }
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        connuPar: '', connuAutre: '',
        enfantNom: '', enfantPrenom: '', enfantDateNaissance: '', enfantSexe: '', enfantTelephones: '', enfantAdresse: '',
        parentNom: '', parentPrenom: '', parentWhatsapp: '', parentTelephones: '', parentNIF: '', parentCourriel: '', parentAdresse: '',
        urgenceNom: '', urgencePrenom: '', urgenceWhatsapp: '', urgenceTelephones: '', urgenceLien: '', urgenceCourriel: '', urgenceAdresse: '',
        ecoleClassique: '', niveauClasse: '', ecoleClub: '', position: '', duree: '', ageDebut: '',
        tailleMaillot: '', tailleShort: '', taillePoitrine: '', tailleEpaule: '', tailleLongueur: '', tailleHauteur: '', tailleHanche: '', taille: '', pointure: '', uniformeDesire: '', uniformeTrouve: '',
        planAdhesion: '',
        allergies: '', asthme: '', medicaments: '', medecinNom: '', preoccupation: '', medecinTel: '', medecinWhatsapp: '', causeAllergie: '',
        autorisationUrgence: '',
        consentementLuApprouve: false,
        consentementTarifs: false,
        consentementCertificat: false,
        autoriseRecuperer: '',
        nifRecuperer: '',
        rentrerSeul: false,
        signatureParent: '',
        dateSignature: '',
      });
    }, 5000);
  };

  const sectionTitleStyle = {
    backgroundColor: 'var(--clr-primary)',
    color: 'white',
    padding: '12px 18px',
    borderRadius: '8px',
    fontSize: '1.3rem',
    fontFamily: 'var(--font-heading)',
    marginTop: '3rem',
    marginBottom: '1.5rem',
    textTransform: 'uppercase' as const,
    boxShadow: '0 4px 15px rgba(202, 2, 79, 0.3)'
  };

  const labelStyle = { display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '8px', color: '#aaa' };
  const inputStyle = { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none', marginBottom: '1rem', transition: 'border 0.3s' };
  const checkboxRowStyle = { display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' };
  const checkboxInputStyle = { width: '20px', height: '20px', accentColor: 'var(--clr-primary)', flexShrink: 0, marginTop: '3px' };

  return (
    <div style={{ flex: 1, marginTop: '80px', minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #111 0%, #1a020b 100%)', color: 'white', overflowX: 'hidden' }}>
      
      {/* Header Section */}
      <section className="section-padding" style={{ textAlign: 'center', padding: '80px 0 40px' }}>
        <div className="container">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <span style={{ color: 'var(--clr-primary)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Rejoignez Condor</span>
            <h1 className="hero-title" style={{ color: 'white', fontSize: '3.5rem', marginTop: '10px' }}>Formulaire d'Inscription Complet</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '800px', margin: '15px auto 0', lineHeight: 1.6 }}>
              Veuillez remplir ce formulaire complet pour l'inscription de votre enfant. Toutes les informations sont requises pour valider l'inscription.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
          >
            
            {submitted ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                style={{ background: 'rgba(202, 2, 79, 0.1)', border: '2px dashed var(--clr-primary)', padding: '4rem', borderRadius: '12px', textAlign: 'center' }}
              >
                <Award size={72} color="var(--clr-primary)" style={{ margin: '0 auto 1.5rem', animation: 'bounce 2s infinite' }} />
                <h3 style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'var(--clr-primary)' }}>Inscription Enregistrée !</h3>
                <p style={{ color: '#ccc', fontSize: '1.2rem' }}>Votre dossier a été transmis avec succès. Notre équipe administrative traitera votre demande dans les plus brefs délais.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* CONDITIONS IMPORTANTES */}
                <div style={{ background: 'rgba(202, 2, 79, 0.1)', borderLeft: '4px solid var(--clr-primary)', padding: '20px', borderRadius: '4px', marginBottom: '30px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--clr-primary)', marginBottom: '15px' }}><AlertTriangle size={20} /> CONDITIONS D'INSCRIPTION</h4>
                  <ul style={{ paddingLeft: '20px', color: '#ddd', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>1. L'enfant doit avoir 4 ans ou 16 au 31 août pour être éligible de s'inscrire.</li>
                    <li>2. Une forme doit être remplie pour chaque enfant individuellement.</li>
                    <li>3. Chaque information doit être cochée lorsque requis.</li>
                    <li>4. L'inscription est considérée complète une fois que le formulaire d'inscription a été soumis avec le 1er paiement acquitté intégralement.</li>
                    <li>5. Toute inscription devra être réglée dans sa totalité avant la première séance de la rentrée. À défaut, l'inscription sera considérée comme annulée.</li>
                    <li>6. Une fois l'inscription effectuée. Les uniformes seront commandés.</li>
                  </ul>
                </div>
                
                {/* COMMENT VOUS NOUS AVEZ CONNU */}
                <h3 style={sectionTitleStyle}>COMMENT VOUS NOUS AVEZ CONNU ?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Moyen</label>
                    <select name="connuPar" required value={formData.connuPar} onChange={handleChange} style={inputStyle}>
                      <option value="" style={{background: '#111'}}>Sélectionner</option>
                      <option value="Bouche à l'oreille" style={{background: '#111'}}>Bouche à l'oreille (non du contact)</option>
                      <option value="Internet: Facebook" style={{background: '#111'}}>Internet: Facebook</option>
                      <option value="Internet: Instagram" style={{background: '#111'}}>Internet: Instagram</option>
                      <option value="Site Web" style={{background: '#111'}}>Site Web</option>
                      <option value="Autre" style={{background: '#111'}}>Autre (préciser)</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Autre (précisez)</label><input type="text" name="connuAutre" value={formData.connuAutre} onChange={handleChange} style={inputStyle} disabled={formData.connuPar !== 'Autre'} /></div>
                </div>

                {/* 1. ENFANT */}
                <h3 style={sectionTitleStyle}>ENFANT</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={labelStyle}>Nom</label><input type="text" name="enfantNom" required value={formData.enfantNom} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Prénom</label><input type="text" name="enfantPrenom" required value={formData.enfantPrenom} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Date de naissance</label><input type="date" name="enfantDateNaissance" required value={formData.enfantDateNaissance} onChange={handleChange} style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>Sexe</label>
                    <select name="enfantSexe" required value={formData.enfantSexe} onChange={handleChange} style={inputStyle}>
                      <option value="" style={{background: '#111'}}>Sélectionner</option>
                      <option value="M" style={{background: '#111'}}>Masculin</option>
                      <option value="F" style={{background: '#111'}}>Féminin</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Téléphones</label><input type="text" name="enfantTelephones" value={formData.enfantTelephones} onChange={handleChange} style={inputStyle} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Adresse</label><input type="text" name="enfantAdresse" required value={formData.enfantAdresse} onChange={handleChange} style={inputStyle} /></div>
                </div>

                {/* 2. PARENT */}
                <h3 style={sectionTitleStyle}>PARENT / PERSONNE RESPONSABLE</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={labelStyle}>Nom</label><input type="text" name="parentNom" required value={formData.parentNom} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Prénom</label><input type="text" name="parentPrenom" required value={formData.parentPrenom} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>WhatsApp</label><input type="text" name="parentWhatsapp" required value={formData.parentWhatsapp} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Téléphones</label><input type="text" name="parentTelephones" required value={formData.parentTelephones} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>NIF / NINU</label><input type="text" name="parentNIF" value={formData.parentNIF} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Courriel</label><input type="email" name="parentCourriel" required value={formData.parentCourriel} onChange={handleChange} style={inputStyle} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Adresse</label><input type="text" name="parentAdresse" required value={formData.parentAdresse} onChange={handleChange} style={inputStyle} /></div>
                </div>

                {/* 3. URGENCE */}
                <h3 style={sectionTitleStyle}>CONTACT EN CAS D'URGENCE</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={labelStyle}>Nom</label><input type="text" name="urgenceNom" required value={formData.urgenceNom} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Prénom</label><input type="text" name="urgencePrenom" required value={formData.urgencePrenom} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Lien de parenté</label><input type="text" name="urgenceLien" required value={formData.urgenceLien} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>WhatsApp</label><input type="text" name="urgenceWhatsapp" value={formData.urgenceWhatsapp} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Téléphones</label><input type="text" name="urgenceTelephones" required value={formData.urgenceTelephones} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Courriel</label><input type="email" name="urgenceCourriel" value={formData.urgenceCourriel} onChange={handleChange} style={inputStyle} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Adresse</label><input type="text" name="urgenceAdresse" value={formData.urgenceAdresse} onChange={handleChange} style={inputStyle} /></div>
                </div>

                {/* 4. ADDITIONNELLES */}
                <h3 style={sectionTitleStyle}>INFORMATIONS ADDITIONNELLES & RAPPORT FOOTBALLISTIQUE</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={labelStyle}>École classique</label><input type="text" name="ecoleClassique" value={formData.ecoleClassique} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Niveau / Classe</label><input type="text" name="niveauClasse" value={formData.niveauClasse} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>École / Club</label><input type="text" name="ecoleClub" value={formData.ecoleClub} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Position occupée</label><input type="text" name="position" value={formData.position} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Durée</label><input type="text" name="duree" value={formData.duree} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Âge de début de pratique</label><input type="text" name="ageDebut" value={formData.ageDebut} onChange={handleChange} style={inputStyle} /></div>
                </div>

                {/* 5. UNIFORMES */}
                <h3 style={sectionTitleStyle}>DIMENSION DES UNIFORMES</h3>
                <p style={{ color: 'var(--clr-primary)', marginBottom: '15px', fontStyle: 'italic', fontSize: '0.9rem' }}>N.B.: Attention: Une fois la taille choisie, nous ne pourrons pas vous fournir une autre uniforme.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                  <div><label style={labelStyle}>Maillot</label><input type="text" name="tailleMaillot" value={formData.tailleMaillot} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Short</label><input type="text" name="tailleShort" value={formData.tailleShort} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Poitrine</label><input type="text" name="taillePoitrine" value={formData.taillePoitrine} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Épaule</label><input type="text" name="tailleEpaule" value={formData.tailleEpaule} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Longueur</label><input type="text" name="tailleLongueur" value={formData.tailleLongueur} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Hauteur</label><input type="text" name="tailleHauteur" value={formData.tailleHauteur} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Hanche</label><input type="text" name="tailleHanche" value={formData.tailleHanche} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Taille</label><input type="text" name="taille" value={formData.taille} onChange={handleChange} style={inputStyle} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '10px' }}>
                  <div><label style={labelStyle}>Pointure (chaussettes)</label><input type="text" name="pointure" value={formData.pointure} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}># Uniforme Désiré</label><input type="text" name="uniformeDesire" value={formData.uniformeDesire} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}># Uniforme Trouvé</label><input type="text" name="uniformeTrouve" value={formData.uniformeTrouve} onChange={handleChange} style={inputStyle} /></div>
                </div>

                {/* 6. PLAN D'ADHESION */}
                <h3 style={sectionTitleStyle}>PLAN D'ADHÉSION CHOISI</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <select name="planAdhesion" required value={formData.planAdhesion} onChange={handleChange} style={{...inputStyle, padding: '16px'}}>
                    <option value="" style={{background: '#111'}}>-- Sélectionner un plan --</option>
                    <option value="Standard: Paiement mensuel" style={{background: '#111'}}>Standard: Paiement mensuel</option>
                    <option value="V1: Paiement intégral de la session (10 mois + inscription)" style={{background: '#111'}}>V1: Paiement intégral de la session (10 mois + inscription)</option>
                    <option value="V2: Paiement de la moitié de la session (5 mois + inscription)" style={{background: '#111'}}>V2: Paiement de la moitié de la session (5 mois + inscription)</option>
                    <option value="V3: Paiement trimestriel de la session (3 mois + inscription)" style={{background: '#111'}}>V3: Paiement trimestriel de la session (3 mois + inscription)</option>
                    <option value="Boursier: Montant annuel réduit de 50 %" style={{background: '#111'}}>Boursier: Montant annuel réduit de 50 %</option>
                    <option value="Parrainage: Prise en charge à 100% par sponsor" style={{background: '#111'}}>Parrainage: Prise en charge à 100% par sponsor</option>
                  </select>
                </div>
                
                {/* CONDITIONS FINANCIERES */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem', color: '#ccc', lineHeight: '1.5' }}>
                  <p><strong>CONDITIONS DE PAIEMENT :</strong></p>
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                    <li>Les frais d’admission incluent l’inscription annuelle, 2 uniformes, 1 ballon et une couverture d’assurance accident/blessure /perte de membre.</li>
                    <li>Les frais de voyage et uniformes exclusifs lors des compétitions internationales ne sont pas inclus.</li>
                    <li>Le tarif comprend les activités sportives, le matériel sportif, l'encadrement ainsi que les équipements standards.</li>
                  </ul>
                  <p><strong>Modalités :</strong> Paiements par chèque ou virement bancaire à l'ordre de "CONDOR ECOLE DE FOOTBALL", ou cash au bureau sise au # 1, Delmas 77.</p>
                  <p><strong>Pénalité :</strong> Tout retard de paiement de la mensualité entrainera une pénalité de 10% par semaine de retard.</p>
                  <p><strong>Absence/Départ :</strong> Aucun montant déjà versé ne sera remboursé. Toute période entamée est due dans son intégralité.</p>
                  <p><strong>DROIT A L'IMAGE :</strong> Toute inscription autorise l’école à prendre et à utiliser des images et vidéos de mon enfant à des fins pédagogiques, publicitaires ou informatives.</p>
                </div>

                {/* 7. MEDICAL */}
                <h3 style={sectionTitleStyle}>RENSEIGNEMENTS MEDICAUX</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Allergies alimentaires</label><input type="text" name="allergies" value={formData.allergies} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Asthme</label><input type="text" name="asthme" value={formData.asthme} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Médicaments</label><input type="text" name="medicaments" value={formData.medicaments} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Nom du médecin de l'enfant</label><input type="text" name="medecinNom" value={formData.medecinNom} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Préoccupation médicale</label><input type="text" name="preoccupation" value={formData.preoccupation} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Téléphone du médecin</label><input type="text" name="medecinTel" value={formData.medecinTel} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>WhatsApp du médecin</label><input type="text" name="medecinWhatsapp" value={formData.medecinWhatsapp} onChange={handleChange} style={inputStyle} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Précisez la cause de l'allergie et la conduite à tenir (signaler l'automédication éventuelle)</label><textarea name="causeAllergie" value={formData.causeAllergie} onChange={handleChange} style={{...inputStyle, minHeight: '80px'}} /></div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', marginTop: '10px' }}>
                  <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>En cas d'urgence, d'accident, ou tout autre cas grave :</p>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="autorisationUrgence" value="J'autorise l'école à" required onChange={handleChange} style={checkboxInputStyle} />
                      J'autorise l'école à
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="autorisationUrgence" value="Je n'autorise pas l'école à" required onChange={handleChange} style={checkboxInputStyle} />
                      Je n'autorise pas l'école à
                    </label>
                  </div>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Prendre toutes mesures pour la prise en charge de mon enfant selon l'avis du médecin traitant.</li>
                    <li>Conduire mon enfant dans un véhicule personnel en cas de besoin médical.</li>
                    <li>Donner en mon lieu et à ma place, toute autorisation pour tout acte opérateur ou d'anesthésie qui serait décidé par le corps médical.</li>
                  </ul>
                </div>

                {/* 8. CONSENTEMENT PARENTAL */}
                <h3 style={sectionTitleStyle}>CONSENTEMENT PARENTAL</h3>
                <p style={{ marginBottom: '20px', fontSize: '0.95rem', color: '#eee' }}>Je soussigné(e), affirme être le parent / tuteur ou gardien de l'enfant dont le nom figure ci-dessus. En son nom, je consens par la présente à ce qui précède, et adhère mon enfant à participer à toutes les activités organisées par l'école.</p>
                
                <label style={checkboxRowStyle}>
                  <input type="checkbox" name="consentementLuApprouve" checked={formData.consentementLuApprouve} onChange={handleCheckboxChange} required style={checkboxInputStyle} />
                  <span>Je reconnais avoir lu et approuvé toutes les conditions stipulées dans ce document (paiement, doit d'image, suivi médical).</span>
                </label>
                
                <label style={checkboxRowStyle}>
                  <input type="checkbox" name="consentementTarifs" checked={formData.consentementTarifs} onChange={handleCheckboxChange} required style={checkboxInputStyle} />
                  <span>Je déclare avoir pris connaissance des tarifs de l'école et m'engage à verser la somme convenue.</span>
                </label>

                <label style={checkboxRowStyle}>
                  <input type="checkbox" name="consentementCertificat" checked={formData.consentementCertificat} onChange={handleCheckboxChange} required style={checkboxInputStyle} />
                  <span>Je m'engage à fournir un certificat médical datant d'au moins 1 mois le jour de la rentrée.</span>
                </label>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', marginTop: '20px', marginBottom: '20px' }}>
                  <p style={{ marginBottom: '15px' }}>À la fin de chaque entraînement, à defaut de venir personnellement chercher mon enfant, j'autorise :</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                    <span>M. ou Mme.</span>
                    <input type="text" name="autoriseRecuperer" value={formData.autoriseRecuperer} onChange={handleChange} style={{...inputStyle, width: 'auto', flex: 1, marginBottom: 0}} placeholder="Nom de la personne" />
                    <span>Identifié(e) au numéro NIF / NINU :</span>
                    <input type="text" name="nifRecuperer" value={formData.nifRecuperer} onChange={handleChange} style={{...inputStyle, width: '200px', marginBottom: 0}} />
                    <span>à récupérer mon enfant.</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" name="rentrerSeul" checked={formData.rentrerSeul} onChange={handleCheckboxChange} style={checkboxInputStyle} />
                    <span>Mon enfant mineur à rentrer chez lui/elle par ses propres moyens.</span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '30px' }}>
                  <div>
                    <label style={labelStyle}>LU ET APPROUVÉ PAR (Signature - Tapez votre nom complet)</label>
                    <input type="text" name="signatureParent" required value={formData.signatureParent} onChange={handleChange} style={inputStyle} placeholder="Signature Parent / Tuteur légal" />
                  </div>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" name="dateSignature" required value={formData.dateSignature} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '2rem', fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}
                >
                  Envoyer l'inscription complète <Send size={24} />
                </button>

              </form>
            )}

          </motion.div>
        </div>
      </section>

    </div>
  );
}
