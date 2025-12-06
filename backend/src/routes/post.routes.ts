import { Router } from "express";
import { body } from "express-validator";
import { postController } from "../controllers";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", postController.getPosts);

router.get("/slug/:slug", postController.getPostBySlug);

router.get("/:id", postController.getPostById);

router.post(
  "/",
  requireAuth,
  requireRole("admin", "editor"),
  validate([
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("status")
      .optional()
      .isIn(["draft", "published"])
      .withMessage("Invalid status"),
  ]),
  postController.createPost
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "editor"),
  validate([
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("content")
      .optional()
      .notEmpty()
      .withMessage("Content cannot be empty"),
    body("category")
      .optional()
      .notEmpty()
      .withMessage("Category cannot be empty"),
    body("status")
      .optional()
      .isIn(["draft", "published"])
      .withMessage("Invalid status"),
  ]),
  postController.updatePost
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "editor"),
  postController.deletePost
);

export default router;
