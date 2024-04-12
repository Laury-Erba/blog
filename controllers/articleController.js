import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8889,
  password: "root",
  database: "blog",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

// afficher les 3 derniers articles
export async function getLatestArticles(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM article ORDER BY created_at DESC LIMIT 3"
    );
    res.render("index", { articles: rows });
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    res.status(500).send("Erreur lors de la récupération des articles");
  }
}

// afficher la page d'administration :
export async function getAdminPage(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM article");
    res.render("admin", { articles: rows });
  } catch (err) {
    console.error("Erreur lors de la récupération des articles :", err);
    res.status(500).send("Erreur lors de la récupération des articles");
  }
}

// afficher la page du formulaire d'ajout :
export async function renderAddArticleForm(req, res) {
  res.render("addArticle", { article: {} });
}

// Ajouter un nouvel article
export async function addArticle(req, res) {
  const { title, content, picture, alt, category } = req.body;

  try {
    await pool.execute(
      "INSERT INTO article (title, content, picture, alt, category) VALUES (?, ?, ?, ?, ?)",
      [title, content, picture, alt, category]
    );
    res.redirect("/admin");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'article :", error);
    res.status(500).send("Erreur lors de l'ajout de l'article");
  }
}

// Afficher le formulaire de modification d'article
export async function getEditArticleForm(req, res) {
  const articleId = req.params.id;
  try {
    const [rows] = await pool.execute("SELECT * FROM article WHERE id = ?", [
      articleId,
    ]);
    if (rows.length === 0) {
      return res.status(404).send("Article not found");
    }
    res.render("editArticle", { article: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// modification de l'article
export async function updateArticle(req, res) {
  const articleId = req.params.id;
  const { title, content, picture, alt, category } = req.body; // extrait les données de ma requete

  console.log("title:", title);
  console.log("content:", content);
  console.log("picture:", picture);
  console.log("alt:", alt);
  console.log("category:", category);

  if (!(title || content || picture || alt || category)) {
    return res
      .status(400)
      .json({ error: "Au moins un champ doit être rempli" });
  }

  try {
    await pool.execute(
      "UPDATE article SET title = ?, content = ?, picture = ?, alt = ?, category = ? WHERE id = ?",
      [title, content, picture, alt, category, articleId]
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Supprimer un article
export async function deleteArticle(req, res) {
  const articleId = req.params.id;
  try {
    await pool.execute("DELETE FROM article WHERE id = ?", [articleId]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
