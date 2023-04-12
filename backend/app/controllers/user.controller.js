const db = require("../models");
const User = db.User;

// Authenticate a user with username and password
exports.authenticate = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username })
        .then(data => {
            if (!data)
                res.status(401).send({ message: "Wrong username or wrong password" });
            if (data.password != password)
                res.status(401).send({ message: "Wrong username or wrong password" });
            else res.send({ username: data.username, token: data.token })
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with username=", username });
        });
}
