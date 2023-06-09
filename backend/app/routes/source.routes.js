module.exports = app => {
    const sources = require("../controllers/source.controller.js");
  
    var router = require("express").Router();
    
    // TODO  : Validate request in all methods

    // Create a new Source
    router.post("/", sources.create);

    // Get all Sources
    router.get("/", sources.findAll);

    // Refresh the source and try to have a new request
    router.post("/refresh", sources.refresh);

    // Update a single Source with id 
    router.post("/:id", sources.update);

    // Delete a Source with id
    router.delete("/:id", sources.delete);

    // Get a single Source with id
    router.get("/:id", sources.findOne);

    app.use('/api/source', router);
}
