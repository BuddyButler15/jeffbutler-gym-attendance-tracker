import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gymsRouter from "./gyms";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gymsRouter);

export default router;
