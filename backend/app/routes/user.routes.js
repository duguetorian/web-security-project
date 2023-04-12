module.exports = app => {
    const user = require("../controllers/user.controller.js");

    var router = require("express").Router();

    // Authenticate the user
    router.post("/authenticate", user.authenticate);

    // Create a user
    router.post("/create", user.create);

    app.use('/api/user', router);
}
