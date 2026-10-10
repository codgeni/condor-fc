const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = 'c:/Users/derek/Downloads/condor-fc-';
const targetDir = 'c:/Users/derek/Downloads/condor-fc-/condor-fc-main/public/staff';
const originalsDir = path.join(targetDir, 'originals');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(originalsDir)) fs.mkdirSync(originalsDir, { recursive: true });

const files = [
  { file: 'Benson Pierre - Planificateur de Match & Tournoi.jpg.jpeg', slug: 'benson-pierre', name: 'Benson Pierre', role: 'Planificateur de Match & Tournoi' },
  { file: 'Christina Similien - Assistante Administrative.jpg.jpeg', slug: 'christina-similien', name: 'Christina Similien', role: 'Assistante Administrative' },
  { file: 'Cindy Vernet - Formatrice Adjointe.jpg.jpeg', slug: 'cindy-vernet', name: 'Cindy Vernet', role: 'Formatrice Adjointe' },
  { file: 'Diego Charles - Formateur.jpg.jpeg', slug: 'diego-charles', name: 'Diego Charles', role: 'Formateur' },
  { file: 'Erncon Justin - Outilleur.jpg.jpeg', slug: 'erncon-justin', name: 'Erncon Justin', role: 'Outilleur' },
  { file: 'Guerline Guerrier - Formatrice Adjointe.jpg.jpeg', slug: 'guerline-guerrier', name: 'Guerline Guerrier', role: 'Formatrice Adjointe' },
  { file: 'Handalson Dejean - Formateur.jpg.jpeg', slug: 'handalson-dejean', name: 'Handalson Dejean', role: 'Formateur' },
  { file: 'Jacklin Pierre - Formateur Adjoint.jpg.jpeg', slug: 'jacklin-pierre', name: 'Jacklin Pierre', role: 'Formateur Adjoint' },
  { file: 'Jameson Cassamajor - Assistant Logistique.jpg.jpeg', slug: 'jameson-cassamajor', name: 'Jameson Cassamajor', role: 'Assistant Logistique' },
  { file: 'Jean Claude Pierrot - Conseiller Technique.jpg.jpeg', slug: 'jean-claude-pierrot', name: 'Jean Claude Pierrot', role: 'Conseiller Technique' },
  { file: 'Jean Marc Junior Ferdinand - Conseiller Technique.jpg.jpeg', slug: 'jean-marc-junior-ferdinand', name: 'Jean Marc Junior Ferdinand', role: 'Conseiller Technique' },
  { file: 'Jetson Devallon - Outillero.jpg.jpeg', slug: 'jetson-devallon', name: 'Jetson Devallon', role: 'Outilleur' },
  { file: 'Joy Mickenley Cadet - Formateur.jpg.jpeg', slug: 'joy-mickenley-cadet', name: 'Joy Mickenley Cadet', role: 'Formateur' },
  { file: 'Kimberline Chery - Massotherapeute.jpg.jpeg', slug: 'kimberline-chery', name: 'Kimberline Chery', role: 'Massothérapeute' },
  { file: 'Mayico Franck - Formateur Adjoint.jpg.jpeg', slug: 'mayico-franck', name: 'Mayico Franck', role: 'Formateur Adjoint' },
  { file: 'Patrick Pierre Louis - Formateur.jpg.jpeg', slug: 'patrick-pierre-louis', name: 'Patrick Pierre Louis', role: 'Formateur' },
  { file: 'Ronald Claude - Formateur.jpg.jpeg', slug: 'ronald-claude', name: 'Ronald Claude', role: 'Formateur' },
  { file: 'Valdyrsen Deris - Responsable Journal.jpg.jpeg', slug: 'valdyrsen-deris', name: 'Valdyrsen Deris', role: 'Responsable Journal' },
  { file: 'Wesnide Victor - Receptioniste.jpg.jpeg', slug: 'wesnide-victor', name: 'Wesnide Victor', role: 'Réceptionniste' }
];

async function processImages() {
  for (const item of files) {
    const srcPath = path.join(srcDir, item.file);
    const destJpg = path.join(targetDir, item.slug + '.jpg');
    const origDest = path.join(originalsDir, item.file);

    // Copy original
    if (!fs.existsSync(origDest)) {
      fs.copyFileSync(srcPath, origDest);
    }

    // Optimize to 1000x1000 square JPEG quality 90
    await sharp(srcPath)
      .resize(1000, 1000, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(destJpg);

    const stat = fs.statSync(destJpg);
    console.log('Processed: ' + item.slug + '.jpg (' + (stat.size / 1024).toFixed(1) + ' KB) for ' + item.name);
  }
  console.log('All 19 images processed successfully!');
}

processImages().catch(err => {
  console.error(err);
  process.exit(1);
});
