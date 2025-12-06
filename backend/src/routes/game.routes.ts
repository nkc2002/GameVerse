import { Router } from "express";
import { body } from "express-validator";
import { gameController } from "../controllers";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", gameController.getGames);

router.get("/:id", gameController.getGameById);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validate([
    body("name").notEmpty().withMessage("Game name is required"),
    body("genres").optional().isArray().withMessage("Genres must be an array"),
    body("platforms")
      .optional()
      .isArray()
      .withMessage("Platforms must be an array"),
    body("releaseDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid release date"),
  ]),
  gameController.createGame
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate([
    body("name").optional().notEmpty().withMessage("Game name cannot be empty"),
    body("genres").optional().isArray().withMessage("Genres must be an array"),
    body("platforms")
      .optional()
      .isArray()
      .withMessage("Platforms must be an array"),
    body("releaseDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid release date"),
  ]),
  gameController.updateGame
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  gameController.deleteGame
);

export default router;
