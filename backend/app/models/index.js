const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.sources = require("./source.model.js")(mongoose);
db.articles = require("./article.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);

module.exports = db;