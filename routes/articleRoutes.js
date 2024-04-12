// articleRoutes.js
import express from "express";
import * as articleController from "../controllers/articleController.js";
const router = express.Router();

router.get("/", articleController.getLatestArticles);

router.get("/admin", articleController.getAdminPage);

router.get("/admin/addArticle", articleController.renderAddArticleForm);
router.post("/admin/addArticle", articleController.addArticle);

router.get("/admin/:id/edit", articleController.getEditArticleForm);

router.post("/admin/:id/update", articleController.updateArticle);

router.get("/admin/delete/:id", articleController.deleteArticle);

export default router;
