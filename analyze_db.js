const fs = require('fs');

const content = fs.readFileSync('./src/lib/playersDB.ts', 'utf8');

// Parse keys
const regex = /"(\d+)":\s*\{([\s\S]*?)\n\s*\}/g;
let match;
const players = [];
while ((match = regex.exec(content)) !== null) {
  const id = match[1];
  const block = match[2];
  const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
  const dobMatch = block.match(/dob:\s*["']([^"']+)["']/);
  const bioMatch = block.match(/bio:\s*["']([^"']+)["']/);
  players.push({
    id,
    name: nameMatch ? nameMatch[1] : null,
    dob: dobMatch ? dobMatch[1] : null,
    bio: bioMatch ? bioMatch[1] : null
  });
}

console.log(`Total players found: ${players.length}`);
players.forEach(p => {
  console.log(`ID: ${p.id} | Name: ${p.name} | DOB: ${p.dob}`);
  if (p.bio) {
    const ageMatches = p.bio.match(/\b\d+\s*ans\b|\bné\s+le[^\,\.]+/gi);
    console.log(`   Bio preview: ${p.bio.substring(0, 80)}...`);
    if (ageMatches) {
      console.log(`   Matches in bio: ${JSON.stringify(ageMatches)}`);
    }
  }
});
