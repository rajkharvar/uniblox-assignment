// Req: In x seconds y requests

import { store } from "../store";

import { Router, Request, Response, NextFunction } from "express";

export function rateLimiter(req: Request, res: Response, next: NextFunction) : void{
  try {
    // check if allowed
    const userId = "user-1"
    if (store.isAllowed(userId)) {
      next()
    } else {
      res.status(400).send("Rate limited")
    }
  } catch(err) {
    next(err)
  }
}