import { Router, Request, Response, NextFunction } from "express";
import * as checkoutService from "../services/checkout.service";

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, discountCode } = req.body;
    const order = checkoutService.checkout(userId, discountCode);
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;
