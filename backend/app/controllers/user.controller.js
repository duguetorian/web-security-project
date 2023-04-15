const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const token = require('../helpers/token');
const User = db.user;
const Sources = db.sources;
const JWT_SECRET = process.env.JWT;
const ObjectId = db.mongoose.Types.ObjectId;

const verifyUserLogin = async (username, password) => {
    try {
        const user = await User.findOne({ username }).lean()
        if (!user) {
            return { status: 'error', error: 'user not found' }
        }
        if (await bcrypt.compare(password, user.password)) {
            // creating a JWT token
            const jwtoken = jwt.sign({ id: user._id, username: user.username, type: 'user' }, JWT_SECRET, { expiresIn: '2h' })
            return { status: 'ok', jwtoken, username: user.username }
        }
        return { status: 'error', error: 'invalid password' }
    } catch (error) {
        return { status: 'error', error: 'timed out' }
    }
}

// Authenticate a user with username and password
exports.authenticate = async (req, res) => {
    const { username, password } = req.body;

    const response = await verifyUserLogin(username, password);

    if (response.status === 'ok') {
        res.send({ username: response.username, token: response.jwtoken, message: 'ok' });
    }
    else {
        res.send({ message: "Wrong username or wrong password" });
    }
};

exports.create = async (req, res) => {
    if (!("username" in req.body &&  "password" in req.body)) {
        console.error( "Error in request to create user, no username or password given" );
        return res.status(401).send({ message: "error", error: "No username or password found in request." });
    }
    const { username, password: plainTextPassword } = req.body;

    const password = await bcrypt.hash(plainTextPassword, 10);
    const sources = []
    try {
        const response = await User.create({
            username,
            password,
            sources
        })
        res.send({ message: "ok" })
    } catch (error) {
        if (error.code === 11000) {
            return res.send({ message: "error", error: "User already exists" })
        }
        res.send({ message: 'error' })
        throw error
    }
}

exports.getSources = async (req, res) => {
    if (token.verifyToken(req)) {
        const username = req.headers.username;
        const user = await User.findOne({ username }).lean()
        if (!user) {
            res.send({ message: "error" });
            return;
        }
        const sources = Sources.find({ "_id": { $in: user.sources } }).then(data => {
            res.send(data)
        })
        return;
    }
    return res.status(401).send({message: "Cannot access sources"});
}

exports.unsubscribe = async (req, res) => {

    if (token.verifyToken(req)) {
        const sourceToRemove = req.body.sourceId;
        if (!sourceToRemove) {
            console.error("No 'sourceId' field found in request");
            return res.status(404).send({
              message: "No 'sourceId' field found."
            });
        }
        const username = req.headers.username;
        const sourceIdToRemove = new ObjectId(sourceToRemove);
        User.updateOne({ username: username }, { $pull: { sources: sourceIdToRemove } })
        .then (user => {
            if (user) {
                console.log(`User '${username}' sources updated`);
            }
            else {
                console.error("No user found");
            }
        })
        .catch((error) => {
            console.log(`Error updating user sources: ${error}`);
            return res.status(500).send({ message: `Error while updating ${username} sources.` });
        });
        return res.send({ message: `Sources for user ${username} updated.` });
    }
    return res.status(401).send( {message: "Cannot access sources"} );
}


exports.test = (req, res) => {
    User.find().then(data => {
        res.send(data);
    })
}

exports.token = (req, res) => {
    if (token.verifyToken(req)) {
        res.send('GOOD TOKEN\n')
    }
    else {
        res.send('BAD TOKEN\n')
    }
}
