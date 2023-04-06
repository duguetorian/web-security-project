module.exports = app => {
    const articles = require("../controllers/article.controller.js");
  
    var router = require("express").Router();

    // TODO: Get a single Source with id
    router.get("/:id", articles.findOne);

    // TODO: Update a single Source with id
    router.post("/:id", articles.update);

    // TODO: Delete a Source with id
    router.delete("/:id", articles.delete);

    app.use('/api/article', router);
}