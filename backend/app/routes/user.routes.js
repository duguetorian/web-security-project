module.exports = app => {
    const user = require("../controllers/user.controller.js");

    var router = require("express").Router();

    // Authenticate the user
    router.post("/authenticate", user.authenticate);

    // Create a user
    router.post("/create", user.create);

    // Get all sources linked to user
    router.get("/sources", user.getSources)

    // See users
    router.get("/", user.test);

    // Verify the token
    router.get("/token", user.token);

    app.use('/api/user', router);
}
