const db = require("../models");
const token = require('../helpers/token');
const Article = db.articles;
const User = db.user;

// Find a single Article with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Article.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Article with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Article with id=" + id });
    });
};

// Update a Article by the id in the request
exports.update = (req, res) => {

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Article with id=${id}. Maybe Article was not found!`
        });
      } else res.send({ message: "Article was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Article with id=" + id
      });
    });
};

// Delete an Article with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Article.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
        });
      } else {
        res.send({
          message: "Article was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Article with id=" + id
      });
    });
};

// Find the Articles related to a source
exports.findFromSource = async (req, res) => {
  if (!token.verifyToken(req)) {
    res.status(401).send()
    return;
  }

  const id = req.params.id;
  const range = req.params.range;
  const offset = req.params.offset;

  const count = await Article.countDocuments({ sourceId: id }).then(response => response);

  await Article.find({ sourceId: id })
    .sort({ publishedAt: -1 })
    .skip(offset)
    .limit(range)
    .then(data => {
      res.send({ data, count });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

exports.findLatestArticles = async (req, res) => {
  if (!token.verifyToken(req)) {
    res.status(401).send()
    return;
  }

  const username = req.headers.username;
  const sourceIds = await User.findOne({ username }).then(data => {
    return data.sources;
  });

  const range = req.params.range;
  const offset = req.params.offset;

  const count = await Article.countDocuments({ sourceId: { $in: sourceIds } }).lean();

  await Article.find({ sourceId: { $in: sourceIds } })
    .sort({ publishedAt: -1 })
    .skip(offset)
    .limit(range)
    .then(data => res.send({ data, count }))
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the articles."
      });
    })
}

exports.findAllArticles = async (req, res) => {
  Article.find().then(data => res.send(data))
}
