export type BusynessLevel = "quiet" | "moderate" | "busy" | "very_busy";

export interface OccupancyResult {
  count: number;
  capacityPercent: number;
  busynessLevel: BusynessLevel;
}

/**
 * Base load factors by hour of day (0–23) for weekdays.
 * Reflects typical University of Iowa gym patterns:
 *   - Low overnight (0–5am)
 *   - Building through morning (6–10am)
 *   - Lunch peak (~12–1pm)
 *   - Major after-class/evening peak (4–8pm)
 */
const WEEKDAY_FACTORS: number[] = [
  0.02, 0.02, 0.02, 0.02, 0.02, 0.03, // 0–5am
  0.08, 0.15, 0.28, 0.38, 0.45, 0.55, // 6–11am
  0.62, 0.52, 0.44, 0.50, 0.66, 0.82, // 12–5pm
  0.84, 0.78, 0.60, 0.42, 0.25, 0.10, // 6–11pm
];

/**
 * Weekends are noticeably quieter overall and shift slightly later.
 */
const WEEKEND_FACTORS: number[] = [
  0.02, 0.02, 0.02, 0.02, 0.02, 0.02, // 0–5am
  0.04, 0.07, 0.16, 0.30, 0.46, 0.54, // 6–11am
  0.56, 0.52, 0.46, 0.42, 0.38, 0.34, // 12–5pm
  0.30, 0.26, 0.20, 0.13, 0.07, 0.03, // 6–11pm
];

function getBaseFactor(hour: number, dayOfWeek: number): number {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  return isWeekend ? WEEKEND_FACTORS[hour] : WEEKDAY_FACTORS[hour];
}

function getBusynessLevel(capacityPercent: number): BusynessLevel {
  if (capacityPercent < 30) return "quiet";
  if (capacityPercent < 55) return "moderate";
  if (capacityPercent < 78) return "busy";
  return "very_busy";
}

/**
 * Compute a realistic simulated occupancy count for a gym right now.
 * Adds small random variance (±8%) so numbers feel live.
 */
export function simulateCurrentOccupancy(capacity: number): OccupancyResult {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();

  const baseFactor = getBaseFactor(hour, dayOfWeek);
  const variance = (Math.random() - 0.5) * 0.16; // ±8%
  const factor = Math.max(0.01, Math.min(1, baseFactor + variance));

  const count = Math.round(capacity * factor);
  const capacityPercent = Math.round((count / capacity) * 100);

  return {
    count,
    capacityPercent,
    busynessLevel: getBusynessLevel(capacityPercent),
  };
}

/**
 * Return simulated average occupancy for all 7 days × 24 hours for a given gym.
 * This powers the trend heatmap / chart on the frontend.
 */
export function simulateTrendsForGym(
  gymId: number,
  capacity: number,
): Array<{
  gymId: number;
  hour: number;
  dayOfWeek: number;
  avgCount: number;
  capacityPercent: number;
}> {
  const trends = [];
  for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
    for (let hour = 0; hour <= 23; hour++) {
      const factor = getBaseFactor(hour, dayOfWeek);
      const avgCount = Math.round(capacity * factor);
      const capacityPercent = Math.round((avgCount / capacity) * 100);
      trends.push({ gymId, hour, dayOfWeek, avgCount, capacityPercent });
    }
  }
  return trends;
}
