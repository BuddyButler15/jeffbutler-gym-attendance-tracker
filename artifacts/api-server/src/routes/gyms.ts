import { Router, type IRouter } from "express";
import { db, gymsTable, checkinsTable } from "@workspace/db";
import {
  ListGymsResponse,
  GetSessionStatusParams,
  GetSessionStatusResponse,
  CheckInGymParams,
  CheckInGymBody,
  CheckInGymResponse,
  CheckOutGymParams,
  CheckOutGymBody,
  CheckOutGymResponse,
} from "@workspace/api-zod";
import { eq, isNull, and, sql, count } from "drizzle-orm";

const router: IRouter = Router();

const THREE_HOURS_AGO = () => new Date(Date.now() - 3 * 60 * 60 * 1000);

function getBusynessLevel(currentCount: number, capacity: number): string {
  const pct = (currentCount / capacity) * 100;
  if (pct < 30) return "quiet";
  if (pct < 55) return "moderate";
  if (pct < 78) return "busy";
  return "very_busy";
}

// GET /gyms — list all gyms with current active check-in count
router.get("/gyms", async (req, res): Promise<void> => {
  req.log.info("Fetching gyms with check-in counts");

  const gyms = await db.select().from(gymsTable).orderBy(gymsTable.id);

  const activeCounts = await db
    .select({
      gymId: checkinsTable.gymId,
      count: count(checkinsTable.id),
    })
    .from(checkinsTable)
    .where(
      and(
        isNull(checkinsTable.checkedOutAt),
        sql`${checkinsTable.checkedInAt} > ${THREE_HOURS_AGO()}`,
      ),
    )
    .groupBy(checkinsTable.gymId);

  const countMap = Object.fromEntries(activeCounts.map((r) => [r.gymId, Number(r.count)]));

  const result = gyms.map((gym) => {
    const currentCount = countMap[gym.id] ?? 0;
    return {
      id: gym.id,
      name: gym.name,
      capacity: gym.capacity,
      currentCount,
      busynessLevel: getBusynessLevel(currentCount, gym.capacity),
    };
  });

  res.json(ListGymsResponse.parse(result));
});

// GET /gyms/session/:sessionId — which gym is this session currently checked into?
// Must be registered BEFORE /gyms/:id routes to prevent 'session' matching as an id
router.get("/gyms/session/:sessionId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const parsed = GetSessionStatusParams.safeParse({ sessionId: raw });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [active] = await db
    .select()
    .from(checkinsTable)
    .where(
      and(
        eq(checkinsTable.sessionId, parsed.data.sessionId),
        isNull(checkinsTable.checkedOutAt),
        sql`${checkinsTable.checkedInAt} > ${THREE_HOURS_AGO()}`,
      ),
    )
    .limit(1);

  res.json(GetSessionStatusResponse.parse({
    sessionId: parsed.data.sessionId,
    checkedInGymId: active?.gymId ?? null,
  }));
});

// POST /gyms/:id/checkin
router.post("/gyms/:id/checkin", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CheckInGymParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = CheckInGymBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const { sessionId } = body.data;
  const gymId = params.data.id;

  // Check if already checked in somewhere active
  const [existing] = await db
    .select()
    .from(checkinsTable)
    .where(
      and(
        eq(checkinsTable.sessionId, sessionId),
        isNull(checkinsTable.checkedOutAt),
        sql`${checkinsTable.checkedInAt} > ${THREE_HOURS_AGO()}`,
      ),
    )
    .limit(1);

  if (existing) {
    if (existing.gymId === gymId) {
      // Already checked into this gym — idempotent OK
      res.json(CheckInGymResponse.parse({ success: true, gymId, sessionId }));
      return;
    }
    res.status(409).json({ error: "Already checked in at another gym. Check out first." });
    return;
  }

  // Verify gym exists
  const [gym] = await db.select().from(gymsTable).where(eq(gymsTable.id, gymId));
  if (!gym) {
    res.status(404).json({ error: "Gym not found" });
    return;
  }

  await db.insert(checkinsTable).values({ gymId, sessionId });
  req.log.info({ gymId, sessionId }, "Checked in");

  res.json(CheckInGymResponse.parse({ success: true, gymId, sessionId }));
});

// POST /gyms/:id/checkout
router.post("/gyms/:id/checkout", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CheckOutGymParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = CheckOutGymBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const { sessionId } = body.data;
  const gymId = params.data.id;

  const [active] = await db
    .select()
    .from(checkinsTable)
    .where(
      and(
        eq(checkinsTable.sessionId, sessionId),
        eq(checkinsTable.gymId, gymId),
        isNull(checkinsTable.checkedOutAt),
        sql`${checkinsTable.checkedInAt} > ${THREE_HOURS_AGO()}`,
      ),
    )
    .limit(1);

  if (!active) {
    res.status(404).json({ error: "Not currently checked in here." });
    return;
  }

  await db
    .update(checkinsTable)
    .set({ checkedOutAt: new Date() })
    .where(eq(checkinsTable.id, active.id));

  req.log.info({ gymId, sessionId }, "Checked out");
  res.json(CheckOutGymResponse.parse({ success: true, gymId: null, sessionId }));
});

export default router;
