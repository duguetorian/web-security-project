module.exports = app => {
    const articles = require("../controllers/article.controller.js");
  
    var router = require("express").Router();

    

    // Get a single Article with id
    router.get("/:id", articles.findOne);

    // Update a single Article with id
    router.post("/:id", articles.update);

    // Delete a Article with id
    router.delete("/:id", articles.delete);

    // Get articles from source
    router.get("/source/:id", articles.findFromSource);

    app.use('/api/article', router);
}
