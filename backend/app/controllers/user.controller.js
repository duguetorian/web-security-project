const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const token = require('../helpers/token');
const User = db.user;
const JWT_SECRET = process.env.JWT;

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
        console.log('ERROR: ', error);
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
    const { username, password: plainTextPassword } = req.body;

    const password = await bcrypt.hash(plainTextPassword, 10);
    const sources = []
    try {
        const response = await User.create({
            username,
            password,
            sources
        })
        res.send({ message: 'ok' })
    } catch (error) {
        console.log(JSON.stringify(error));
        if (error.code === 11000) {
            return res.send({ message: 'error', error: 'User already exists' })
        }
        res.send({ message: 'error' })
        throw error
    }
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
