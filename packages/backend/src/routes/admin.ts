import { Router, Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";

const router = Router();

router.post(
  "/generate-discount",
  (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = adminService.generateDiscount();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/stats", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = adminService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
