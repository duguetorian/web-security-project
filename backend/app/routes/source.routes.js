module.exports = app => {
    const sources = require("../controllers/source.controller.js");
  
    var router = require("express").Router();
  
    // TEST
    router.get("/add", sources.create);

    // TODO: Create a new Source
    router.post("/", sources.create);

    // TODO: Get all Sources
    router.get("/", sources.findAll);

    // TODO: Update a single Source with id
    router.post("/:id", sources.update);

    // TODO: Delete a Source with id
    router.delete("/:id", sources.delete);

    // TODO: Get a single Source with id
    router.get("/:id", sources.findOne);

    app.use('/api/source', router);
}