import { Router, Request, Response, NextFunction } from "express";
import * as cartService from "../services/cart.service";

const router = Router();

router.get("/:userId", (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = cartService.getCart(req.params.userId as string);
    res.json({ cart });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:userId/items",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity } = req.body;
      const cart = cartService.addToCart(req.params.userId as string, productId, quantity);
      res.json({ cart });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:userId/items/:productId",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = cartService.removeFromCart(
        req.params.userId as string,
        req.params.productId as string
      );
      res.json({ cart });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
