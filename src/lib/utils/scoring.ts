// Points tables from rules document
const RACE_POINTS = {
  1: 1, 2: 2, 3: 4, 4: 6, 5: 8, 
  6: 10, 7: 12, 8: 15, 9: 18, 10: 25,
  11: 18, 12: 15, 13: 12, 14: 10, 15: 8,
  16: 6, 17: 4, 18: 2, 19: 1, 20: 1
};

const SPRINT_POINTS = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  6: 6, 7: 7, 8: 8, 9: 7, 10: 6,
  11: 5, 12: 4, 13: 3, 14: 2, 15: 1
};

const DNF_BONUS = 10;

export function calculateRacePoints(prediction, results) {
  let points = 0;
  
  // Get finishing position for P10 prediction
  const finishingPosition = Object.entries(results.positions)
    .find(([pos, driver]) => driver === prediction.p10)?.[0];
  
  // Only award position points if driver finished (not NC)
  if (finishingPosition && finishingPosition !== 'NC') {
    points += RACE_POINTS[parseInt(finishingPosition)] || 0;
  }

  // Check DNF prediction
  if (prediction.dnf && results.dnfs.length > 0) {
    // Get first DNF lap and its drivers
    const firstDNFRecord = results.dnfs[0];
    // Award points if prediction matches any driver in first DNF group
    if (firstDNFRecord.drivers.includes(prediction.dnf)) {
      points += DNF_BONUS;
    }
  }

  return points;
}

export function calculateSprintPoints(prediction, results) {
  if (!prediction.sprintP8 || !results.sprint) return 0;
  
  // Find driver's position in sprint race
  const sprintPosition = Object.entries(results.sprint.positions)
    .find(([pos, driver]) => driver === prediction.sprintP8)?.[0];
    
  // Only award points if driver finished (not NC)
  if (sprintPosition && sprintPosition !== 'NC') {
    return SPRINT_POINTS[parseInt(sprintPosition)] || 0;
  }
  
  return 0;
}

export function calculateTotalPoints(prediction, results) {
  const racePoints = calculateRacePoints(prediction, results.race);
  const sprintPoints = results.sprint ? calculateSprintPoints(prediction, results) : 0;
  
  return {
    racePoints,
    sprintPoints,
    total: racePoints + sprintPoints
  };
}

// Calculate standings for all users across all completed races
export function calculateStandings(predictions, results) {
  const standings = {};
  
  // Initialize standings for all users
  Object.values(predictions).forEach(racePredictions => {
    Object.keys(racePredictions).forEach(userId => {
      if (!standings[userId]) {
        standings[userId] = {
          totalPoints: 0,
          races: {}
        };
      }
    });
  });
  
  // Calculate points for each race
  Object.entries(predictions).forEach(([raceId, racePredictions]) => {
    const raceResults = results[raceId];
    if (!raceResults) return; // Skip if no results yet
    
    Object.entries(racePredictions).forEach(([userId, userPredictions]) => {
      const points = calculateTotalPoints(userPredictions, raceResults);
      
      standings[userId].races[raceId] = points;
      standings[userId].totalPoints += points.total;
    });
  });
  
  // Sort by total points descending
  return Object.entries(standings)
    .sort(([, a], [, b]) => b.totalPoints - a.totalPoints)
    .map(([userId, data]) => ({
      userId,
      ...data
    }));
}

// Helper to validate if a race is locked for predictions
export function isRaceLocked(race) {
  const raceDate = new Date(race.date);
  const now = new Date();
  return now >= raceDate;
}
