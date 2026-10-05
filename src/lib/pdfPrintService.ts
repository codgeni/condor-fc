/**
 * Service d'export PDF & Impression officielle - Condor École de Football
 * Génère une fiche d'inscription officielle A4 certifiée,
 * prête pour le téléchargement PDF et la signature manuscrite du parent.
 */

export function printInscriptionDossier(inscription: any) {
  if (!inscription) return;

  const fd = inscription.form_data || {};
  const enfantNom = (fd.enfantNom || inscription.enfant_nom || '').toUpperCase();
  const enfantPrenom = fd.enfantPrenom || inscription.enfant_prenom || '';
  const enfantDob = fd.enfantDateNaissance || inscription.enfant_dob || 'N/A';
  const parentNom = (fd.parentNom || inscription.parent_nom || '').toUpperCase();
  const parentPrenom = fd.parentPrenom || inscription.parent_prenom || '';
  const dateSoumission = inscription.created_at 
    ? new Date(inscription.created_at).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'medium' })
    : fd.dateSoumission || 'Enregistrée sur le portail officiel';

  // Calcul d'âge et catégorie
  let ageStr = '';
  let catStr = 'Effectif';
  if (enfantDob && enfantDob !== 'N/A') {
    const d = new Date(enfantDob);
    if (!isNaN(d.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
      ageStr = `${age} ans`;
      if (age <= 7) catStr = 'U7';
      else if (age <= 9) catStr = 'U9';
      else if (age <= 11) catStr = 'U11';
      else if (age <= 13) catStr = 'U13';
      else if (age <= 15) catStr = 'U15';
      else if (age <= 17) catStr = 'U17';
      else catStr = 'U20+';
    }
  }

  const printWindow = window.open('', '_blank', 'width=850,height=1000');
  if (!printWindow) {
    alert("Veuillez autoriser les fenêtres pop-up dans votre navigateur pour exporter le dossier en PDF.");
    return;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Dossier_Inscription_${enfantNom}_${enfantPrenom}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.35;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #ca024f;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .header-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-logo img {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    .header-titles h1 {
      font-size: 15pt;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .header-titles p {
      font-size: 8.5pt;
      color: #ca024f;
      margin: 2px 0 0 0;
      font-weight: 700;
      text-transform: uppercase;
      letterSpacing: 1px;
    }
    .header-meta {
      text-align: right;
      font-size: 8.5pt;
      color: #475569;
    }
    .dossier-badge {
      display: inline-block;
      background: #ca024f;
      color: #ffffff;
      font-size: 8.5pt;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 4px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .section-title {
      background: #f1f5f9;
      border-left: 4px solid #ca024f;
      padding: 5px 10px;
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      margin: 10px 0 6px 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px 14px;
      margin-bottom: 8px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px 12px;
      margin-bottom: 8px;
    }
    .field {
      font-size: 9.5pt;
      border-bottom: 1px dotted #e2e8f0;
      padding-bottom: 3px;
    }
    .field strong {
      color: #334155;
      font-size: 8.5pt;
      text-transform: uppercase;
      display: inline-block;
      min-width: 130px;
    }
    .field span {
      color: #0f172a;
      font-weight: 600;
    }
    .tag-category {
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 700;
      font-size: 8.5pt;
    }
    /* ZONE OFFICIELLE DE SIGNATURE */
    .signature-card {
      border: 2px solid #0f172a;
      border-radius: 8px;
      padding: 12px 14px;
      margin-top: 14px;
      background: #fafafa;
    }
    .signature-card h3 {
      margin: 0 0 6px;
      font-size: 10.5pt;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      text-align: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }
    .signature-engagement {
      font-size: 8.5pt;
      color: #334155;
      line-height: 1.35;
      margin-bottom: 10px;
      text-align: justify;
    }
    .signature-boxes {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 14px;
      margin-top: 8px;
    }
    .sig-box {
      border: 1px solid #94a3b8;
      border-radius: 6px;
      background: #ffffff;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 125px;
    }
    .sig-label {
      font-size: 8.5pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .sig-blank-area {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 8pt;
      font-style: italic;
    }
    .sig-footer {
      border-top: 1px dotted #cbd5e1;
      padding-top: 4px;
      font-size: 8pt;
      color: #475569;
    }
    .action-bar {
      margin-bottom: 16px;
      text-align: center;
    }
    .btn-print {
      background: #ca024f;
      color: white;
      border: none;
      padding: 10px 24px;
      font-size: 11pt;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .action-bar {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="action-bar">
    <button class="btn-print" onclick="window.print()">📥 TÉLÉCHARGER EN PDF / IMPRIMER CE DOSSIER</button>
    <div style="font-size: 9pt; color: #64748b; margin-top: 6px;">
      Choisissez "Enregistrer au format PDF" dans la boîte de dialogue d'impression pour télécharger le fichier PDF.
    </div>
  </div>

  <div class="header">
    <div class="header-logo">
      <img src="/condor_logo_transparent.png" alt="Condor FC" onerror="this.style.display='none'" />
      <div class="header-titles">
        <h1>Condor École de Football</h1>
        <p>Académie Officielle • Delmas 77, Port-au-Prince, Haïti</p>
      </div>
    </div>
    <div class="header-meta">
      <span class="dossier-badge">Dossier Officiel N° #${inscription.id || '2026'}</span>
      <div><strong>Date de soumission :</strong> ${dateSoumission}</div>
      <div><strong>Tél :</strong> +509 37 99 99 99 • ecoledefootballcondor@gmail.com</div>
    </div>
  </div>

  <!-- SECTION 1 : ENFANT / JOUEUR -->
  <div class="section-title">1. Identification du Joueur / Enfant</div>
  <div class="grid">
    <div class="field"><strong>Nom de l'enfant :</strong> <span>${enfantNom}</span></div>
    <div class="field"><strong>Prénom de l'enfant :</strong> <span>${enfantPrenom}</span></div>
    <div class="field"><strong>Date de naissance :</strong> <span>${enfantDob} ${ageStr ? `(${ageStr})` : ''}</span></div>
    <div class="field"><strong>Catégorie assignée :</strong> <span class="tag-category">${catStr}</span></div>
    <div class="field"><strong>Sexe :</strong> <span>${fd.enfantSexe === 'M' ? 'Masculin' : fd.enfantSexe === 'F' ? 'Féminin' : (fd.enfantSexe || 'N/A')}</span></div>
    <div class="field"><strong>Téléphone enfant :</strong> <span>${fd.enfantTelephones || 'Non renseigné'}</span></div>
    <div class="field" style="grid-column: span 2;"><strong>Adresse de résidence :</strong> <span>${fd.enfantAdresse || 'N/A'}</span></div>
    <div class="field"><strong>Établissement scolaire :</strong> <span>${fd.ecoleClassique || 'N/A'} (Classe : ${fd.niveauClasse || 'N/A'})</span></div>
    <div class="field"><strong>Expérience football :</strong> <span>${fd.ecoleClub || 'Débutant'} (${fd.duree || 'N/A'}) - Poste : ${fd.position || 'Polyvalent'}</span></div>
  </div>

  <!-- SECTION 2 : RESPONSABLE LÉGAL -->
  <div class="section-title">2. Responsable Légal / Parent</div>
  <div class="grid">
    <div class="field"><strong>Nom du Parent / Tuteur :</strong> <span>${parentNom}</span></div>
    <div class="field"><strong>Prénom du Parent :</strong> <span>${parentPrenom}</span></div>
    <div class="field"><strong>Téléphone principal :</strong> <span>${fd.parentTelephones || inscription.parent_tel || 'N/A'}</span></div>
    <div class="field"><strong>Numéro WhatsApp :</strong> <span>${fd.parentWhatsapp || 'N/A'}</span></div>
    <div class="field"><strong>Numéro NIF / CIN :</strong> <span>${fd.parentNIF || 'N/A'}</span></div>
    <div class="field"><strong>Courriel (Email) :</strong> <span>${fd.parentCourriel || inscription.parent_email || 'N/A'}</span></div>
    <div class="field" style="grid-column: span 2;"><strong>Adresse du parent :</strong> <span>${fd.parentAdresse || 'Même que l\'enfant'}</span></div>
  </div>

  <!-- SECTION 3 : CONTACT D'URGENCE & SANTÉ -->
  <div class="section-title">3. Contact d'Urgence & Renseignements Médicaux</div>
  <div class="grid">
    <div class="field"><strong>Contact d'urgence :</strong> <span>${fd.urgenceNom || 'N/A'} ${fd.urgencePrenom || ''} (${fd.urgenceLien || 'Proche'})</span></div>
    <div class="field"><strong>Téléphone d'urgence :</strong> <span>${fd.urgenceTelephones || 'N/A'} (WhatsApp: ${fd.urgenceWhatsapp || 'N/A'})</span></div>
    <div class="field"><strong>Médecin traitant :</strong> <span>${fd.medecinNom || 'Non spécifié'} (Tél: ${fd.medecinTel || 'N/A'})</span></div>
    <div class="field"><strong>Asthme / Difficultés :</strong> <span>${fd.asthme || 'Non'}</span></div>
    <div class="field"><strong>Allergies connues :</strong> <span>${fd.allergies === 'Oui' ? `Oui (${fd.causeAllergie || 'N/A'})` : 'Aucune'}</span></div>
    <div class="field"><strong>Précautions médicales :</strong> <span>${fd.preoccupation || 'Néant'}</span></div>
  </div>

  <!-- SECTION 4 : ADHÉSION, ÉQUIPEMENT & SORTIE -->
  <div class="section-title">4. Formule d'Adhésion, Tailles & Autorisation de Sortie</div>
  <div class="grid-3">
    <div class="field"><strong>Plan souscrit :</strong> <span>${fd.planAdhesion || 'Standard'}</span></div>
    <div class="field"><strong>Maillot / Short :</strong> <span>${fd.tailleMaillot || 'N/A'} / ${fd.tailleShort || 'N/A'}</span></div>
    <div class="field"><strong>Pointure chaussures :</strong> <span>${fd.pointure || 'N/A'}</span></div>
  </div>
  <div class="grid">
    <div class="field"><strong>Personne autorisée à récupérer l'enfant :</strong> <span>${fd.autoriseRecuperer || 'Seulement les parents'} (NIF: ${fd.nifRecuperer || 'N/A'})</span></div>
    <div class="field"><strong>Autorisation de rentrer seul :</strong> <span>${fd.rentrerSeul ? 'OUI - Autorisé' : 'NON - Accompagnateur obligatoire'}</span></div>
  </div>

  <!-- SECTION 5 : CADRE OFFICIEL DE SIGNATURE PHYSIQUE MANUSCRITE -->
  <div class="signature-card">
    <h3>Engagement Officiel & Signature Manuscrite</h3>
    <div class="signature-engagement">
      Je soussigné(e), <strong>${parentNom} ${parentPrenom}</strong>, agissant en qualité de responsable légal de l'enfant <strong>${enfantNom} ${enfantPrenom}</strong>, certifie sur l'honneur l'exactitude des informations mentionnées ci-dessus. Je confirme mon adhésion aux statuts et au règlement intérieur de Condor École de Football, autorise les soins médicaux en cas d'urgence et m'engage à fournir un certificat médical d'aptitude sportive sous un délai d'un mois.
    </div>

    <div class="signature-boxes">
      <!-- ZONE BLANCHE DÉDIÉE POUR LA SIGNATURE DU PARENT -->
      <div class="sig-box">
        <div class="sig-label">
          Signature Manuscrite du Parent / Tuteur Légal
        </div>
        <div class="sig-blank-area">
          (Espace blanc réservé pour apposer la signature physique au stylo)
        </div>
        <div class="sig-footer">
          <div><strong>Nom complet :</strong> ${parentNom} ${parentPrenom}</div>
          <div style="margin-top: 3px;"><strong>Date :</strong> ____ / ____ / 202__ &nbsp;&nbsp;&nbsp;&nbsp; <strong>Lieu :</strong> _________________</div>
        </div>
      </div>

      <!-- ZONE BLANCHE DÉDIÉE POUR LE CACHET DU CLUB -->
      <div class="sig-box">
        <div class="sig-label">
          Pour la Direction de Condor École de Football
        </div>
        <div class="sig-blank-area">
          (Cachet officiel du Club & Signature autorisée)
        </div>
        <div class="sig-footer">
          <div><strong>Statut :</strong> Inscription Validée</div>
          <div style="margin-top: 3px;"><strong>Visa :</strong> _________________________</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Déclenche automatiquement l'impression / enregistrement PDF après le chargement des styles
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
