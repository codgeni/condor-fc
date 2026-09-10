export const playersDB: Record<string, any> = {};

// Generator function to ensure consistency
function generatePlayers(count: number, startIndex: number, positions: string[], imgFilter: string) {
  for (let i = 0; i < count; i++) {
    const id = startIndex + i;
    playersDB[id.toString()] = {
      id: id.toString(),
      name: `Joueur ${id}`,
      pos: positions[i % positions.length],
      num: id,
      img: '/player_action_1_1780681882713.png',
      filter: imgFilter,
      dob: `15 Janvier 199${(id % 9) + 1}`,
      height: `1.${75 + (id % 15)}m`,
      weight: `${70 + (id % 15)}kg`,
      matches: 20 + (id % 20),
      goals: id % 10,
      assists: id % 8,
      stat2lbl: positions[i % positions.length] === 'Gardien de but' ? 'Arrêts' : (positions[i % positions.length] === 'Défenseur' ? 'Tacles' : 'Buts'),
      stat2val: positions[i % positions.length] === 'Gardien de but' ? 50 + (id % 20) : (positions[i % positions.length] === 'Défenseur' ? 40 + (id % 10) : id % 10),
      recentMatch: {
        opponent: 'City United',
        result: 'Victoire 2-1',
        rating: (7 + Math.random() * 2).toFixed(1),
        minutes: 90
      },
      honours1: id % 4,
      honours2: id % 2
    };
  }
}

// Generate 32 unique players with French positions
generatePlayers(4, 1, ['Gardien de but'], 'hue-rotate(90deg) saturate(1.5)');
generatePlayers(10, 5, ['Défenseur Central', 'Arrière Droit', 'Arrière Gauche'], 'grayscale(0.2)');
generatePlayers(10, 15, ['Milieu Défensif', 'Milieu Central', 'Milieu Offensif'], 'sepia(0.3)');
generatePlayers(8, 25, ['Ailier Droit', 'Ailier Gauche', 'Avant-Centre'], 'contrast(1.2) saturate(1.2)');
