export const levels = [
  { level: 1, name: "Novice", xp: 0 },
  { level: 2, name: "Learner", xp: 150 },
  { level: 3, name: "Beginner", xp: 400 },
  { level: 4, name: "Word Seeker", xp: 800 },
  { level: 5, name: "Phrase Tamer", xp: 1300 },
  { level: 6, name: "Apprentice", xp: 2000 },
  { level: 7, name: "Converser", xp: 2900 },
  { level: 8, name: "Language Explorer", xp: 4000 },
  { level: 9, name: "Proficient", xp: 5300 },
  { level: 10, name: "Advanced", xp: 6800 },
  { level: 11, name: "Idiom Master", xp: 8500 },
  { level: 12, name: "Expert", xp: 10500 },
  { level: 13, name: "Mentor", xp: 13000 },
  { level: 14, name: "Polyglot", xp: 16000 },
  { level: 15, name: "Legendary Linguist", xp: 20000 },
];

export function getUserLevel(userXP: number) {
  let currentLevel = levels[0];

  for (let i = 0; i < levels.length; i++) {
    if (userXP >= levels[i].xp) {
      currentLevel = levels[i];
    } else {
      const nextLevel = levels[i];
      return {
        level: currentLevel.level,
        levelName: currentLevel.name,
        xpToNextLevel: nextLevel.xp - userXP,
        nextLevelXP: nextLevel.xp,
        totalXP: userXP,
      };
    }
  }
  return {
    level: currentLevel.level,
    levelName: currentLevel.name,
    xpToNextLevel: 0,
    nextLevelXP: null,
    totalXP: userXP,
  };
}
