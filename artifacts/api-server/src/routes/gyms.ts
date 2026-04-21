import { Router, type IRouter } from "express";
import { db, gymsTable } from "@workspace/db";
import {
  ListGymsResponse,
  GetGymTrendsParams,
  GetGymTrendsResponse,
} from "@workspace/api-zod";
import { simulateCurrentOccupancy, simulateTrendsForGym } from "../lib/occupancy-simulator";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/gyms", async (req, res): Promise<void> => {
  req.log.info("Fetching gyms with current occupancy");
  const gyms = await db.select().from(gymsTable).orderBy(gymsTable.id);

  const gymsWithOccupancy = gyms.map((gym) => {
    const occupancy = simulateCurrentOccupancy(gym.capacity);
    return {
      id: gym.id,
      name: gym.name,
      shortName: gym.shortName,
      location: gym.location,
      capacity: gym.capacity,
      description: gym.description,
      currentCount: occupancy.count,
      capacityPercent: occupancy.capacityPercent,
      busynessLevel: occupancy.busynessLevel,
    };
  });

  res.json(ListGymsResponse.parse(gymsWithOccupancy));
});

router.get("/gyms/:id/trends", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetGymTrendsParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [gym] = await db
    .select()
    .from(gymsTable)
    .where(eq(gymsTable.id, parsed.data.id));

  if (!gym) {
    res.status(404).json({ error: "Gym not found" });
    return;
  }

  req.log.info({ gymId: gym.id }, "Fetching gym trends");
  const trends = simulateTrendsForGym(gym.id, gym.capacity);
  res.json(GetGymTrendsResponse.parse(trends));
});

export default router;
