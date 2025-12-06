import { Router } from "express";
import { body } from "express-validator";
import { userController } from "../controllers";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), userController.getUsers);

router.get("/me", requireAuth, userController.getMe);

// Profile routes - MUST come before /:id to avoid conflicts
router.get("/profile/me", requireAuth, userController.getProfile);

router.put(
  "/profile/me",
  requireAuth,
  validate([
    body("username")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty"),
    body("avatarUrl").optional().isString(),
  ]),
  userController.updateProfile
);

router.put(
  "/profile/password",
  requireAuth,
  validate([
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ]),
  userController.changePassword
);

router.get("/:id", requireAuth, userController.getUserById);

router.put(
  "/:id",
  requireAuth,
  validate([
    body("username")
      .optional()
      .notEmpty()
      .withMessage("Username cannot be empty"),
    body("avatarUrl")
      .optional()
      .isURL()
      .withMessage("Avatar URL must be valid"),
    body("role")
      .optional()
      .isIn(["admin", "editor", "user"])
      .withMessage("Invalid role"),
  ]),
  userController.updateUser
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  userController.deleteUser
);

export default router;
