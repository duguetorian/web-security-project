module.exports = app => {
    const articles = require("../controllers/article.controller.js");
  
    var router = require("express").Router();
    
    // Get articles from source
    router.get("/source/:id/:range/:offset", articles.findFromSource);

    // Get latest articles
    router.get("/latest/:range/:offset", articles.findLatestArticles);

    // Get a single Article with id
    router.get("/:id", articles.findOne);

    // Update a single Article with id
    router.post("/:id", articles.update);

    // Delete a Article with id
    router.delete("/:id", articles.delete);

    // Get all articles
    router.get("/", articles.findAllArticles);

    app.use('/api/article', router);
}
