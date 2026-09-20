// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for CuboidQuest

export const BADGES = [
  { id: 'first_parcel',        icon: '📦', label: 'First Parcel Packed', description: 'Answered your very first cuboid question correctly!' },
  { id: 'conveyor_streak',     icon: '⚙️', label: 'Conveyor Streak',      description: 'Achieved a streak of 5 correct answers!' },
  { id: 'depot_dynamo',        icon: '⚡', label: 'Depot Dynamo',         description: 'Achieved a 10-question winning streak!' },
  { id: 'workshop_certified',  icon: '🔧', label: 'Workshop Certified',   description: 'Completed all 4 interactive simulation stations!' },
  { id: 'perfect_package',     icon: '⭐', label: 'Perfect Package',      description: 'Scored 3 stars in a Practice World!' },
  { id: 'crate_crusher',       icon: '👊', label: 'Crate Crusher',        description: 'Defeated a World Boss in battle!' },
  { id: 'loading_bay_legend',  icon: '🚚', label: 'Loading Bay Legend',   description: 'Answered over 20 questions in Practice!' },
  { id: 'master_box_depot',    icon: '🏆', label: 'Master of the Box Depot', description: 'Completed the full 5-phase CuboidQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_parcel');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('conveyor_streak');
  if (state.maxStreak >= 10) unlocked.push('depot_dynamo');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('workshop_certified');
  }

  // 3-star district check
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('perfect_package');
  }

  // Centurion (20+ questions)
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('loading_bay_legend');
  }

  // Boss slayer
  if (state.bossDefeated) {
    unlocked.push('crate_crusher');
  }

  // Full journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('master_box_depot');
  }

  return unlocked;
}
