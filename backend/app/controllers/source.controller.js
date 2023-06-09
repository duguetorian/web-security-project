const db = require("../models");
const token = require('../helpers/token');
const Source = db.sources;
const Article = db.articles;
const User = db.user;
const ObjectId = db.mongoose.Types.ObjectId;

const { spawn } = require("child_process");

async function runPythonScript(link, lastUpdatedAt = null, etag = null) {
  return new Promise((resolve, reject) => {

    let arguments = ['workers/workerRSS.py', '-l', link];
    if (lastUpdatedAt) {
      arguments.push("-d");
      arguments.push(lastUpdatedAt);
    }
    if (etag) {
      arguments.push("-e");
      arguments.push(etag);
    }
    const child = spawn('python3', arguments);

    let dataBuffer = '';
    child.stdout.on('data', (data) => {
      dataBuffer += data;
    });

    child.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script workers/workerRSS.py exited with code ${code} for request to ${link}`);
        resolve({ error: 2 });
      } else {
        try {
          let result = JSON.parse(dataBuffer);
          if (!lastUpdatedAt && !etag) { // It is a new source.
            result["source"]["link"] = link;
          }
          resolve(result);
        } catch (err) {
          console.error(`Failed to parse JSON from Python script: ${err}`);
          resolve({ error: 3 });
        }
      }
    });
  });
}

async function checkDocumentExists(model, query) {
  try {
    const result = await model.findOne(query);
    if (result) {
      return { status: 0, source: result }; // document exists
    } else {
      return { status: 1 }; // document does not exist
    }
  } catch (error) {
    return { status: 2 }; // error occurred, document does not exist
  }
}

async function refreshSource(sourceId) {
  const source = await Source.findById(sourceId); // TODO: add error if no source found.
  if (source && source.status != "gone") {
    const result = await runPythonScript(link = source.link, modified = source.updatedAt.toISOString(), etag = source.etag);
    if (result["error"] == 0) {

      let updatedSource = { updatedAt: result["source"]["updatedAt"] }

      if (result["status"] == 301) { // Move permanently
        updatedSource["link"] = result["source"]["link"];
      }
      if (result["status"] == 410) { // Source not available anymore
        updatedSource["status"] = "gone";
      }
      // Update source
      Source.findByIdAndUpdate(sourceId, updatedSource, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            console.error(`Cannot update Source with id=${sourceId}. Maybe Source was not found!`);
            return { success: 404, title: source.title, id: source.id };
          } else {
            console.log(`Source ${sourceId} successfully updated.`);
          }
        })
        .catch(err => {
          console.error(`Error updating Source with id=${sourceId}`);
          return { success: 500, title: source.title, id: source.id }
        });

      if (result["articles"].length == 0) {
        return { success: 200, title: source.title, id: source.id };
      }

      if (200 <= result["status"] < 400) { // Success to retrieve data from source
        const articles = result.articles.map(articleData => {
          return Article.findOneAndUpdate(
            { feedId: articleData["feedId"] },
            articleData,
            { new: true, upsert: true }
          )
            .then(article => {
              if (!article) { // article not found in database
                let newArticle = new Article(articleData);
                newArticle.sourceId = sourceId;
                return newArticle.save();
              }
              articleData.createdAt = article.createdAt;
              return article;
            }).catch(err => {
              console.error("Error updating or saving article", err);
            });
        });
        Promise.all(articles)
          .then(savedArticles => {
            console.log("Articles saved to the database:", savedArticles);
            return { success: 200, title: source.title, id: source.id };
          })
          .catch(err => {
            console.error("Error saving articles to the database.");
            return { success: 500, title: source.title, id: source.id }
          });
        return { success: 200, title: source.title, id: source.id };
      }
      else {
        console.error(`Status ${result["status"]} receveived from source ${sourceId}. Cannot update source.`);
        return { success: 500, title: source.title, id: source.id }
      }
    }
    else {
      console.error(`Error ${result["error"]} raised while updating source ${sourceId}.`);
      return { success: 500, title: source.title, id: source.id }
    }
  }
  else {
    console.error(`Cannot update Source with id=${sourceId}. Source was not found.`);
    return { success: 404 }
  }
}

// Create and Save a new Source
exports.create = async (req, res) => {
  if (!token.verifyToken(req)) {
    res.status(401).send({ message: 'error' })
    return;
  }

  const link = req.body.link;
  if (!link) {
    console.error("Error in the payload, no link given to connect a new source.")
    return res.status(500).send({
      message: error.message || "Error in the payload, no link given to connect a new source."
    });
  }

  const sourceExists = await checkDocumentExists(Source, { link: link });

  if (sourceExists.status === 2) {
    return res.status(500).send({
      message: error.message || "An error occurred while checking the source."
    });
  }
  if (sourceExists.status === 0) {
    let user = await User.findOne({ username: req.headers.username });
    user.sources.addToSet(sourceExists.source._id);
    await user.save();
    return res.send(sourceExists.source);
  }

  // The source does not exist in the database
  let result = await runPythonScript(link);

  // Handle process completion
  if (result["error"] === 0) {

    if (result["status"] == 410) {
      result.source["status"] = "gone";
    }
    const source = new Source(result.source);

    // Save Source in the database
    source
      .save(source)
      .then(async savedSource => {
        console.log("Source saved to the database:", savedSource);
        // Save the source to the user
        const user = await User.findOne({ username: req.headers.username });
        user.sources.addToSet(savedSource._id);
        await user.save();
        // Save articles in the database
        const articles = result.articles.map(articleData => {
          const article = new Article(articleData);
          article.sourceId = savedSource._id;
          return article.save();
        });
        Promise.all(articles)
          .then(savedArticles => {
            console.log("Articles saved to the database:", savedArticles);
            res.send(result);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Error saving articles to the database."
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the source."
        });
      });
  } else {
    res.status(500).send({
      message: "Failed to create source"
    });
  }
};

// Retrieve all Source from the database that belong to the user.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Source.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });

};

// Find a single Source with an id
exports.findOne = async (req, res) => {

  if (token.verifyToken(req)) {
    const sourceIdToFind = new ObjectId(req.params.id);
    const username = req.headers.username;

    await User.findOne({ username })
    .then(user => {
      if (!user) {
        console.log( `User ${user.username} not found` );
        return res.status(404).send( { message: "User not found"} );
      }
      Source.findById(sourceIdToFind)
      .then(source => {
        if (!source) {
          console.log( `Source with id ${sourceIdToFind} not found` );
          return res.status(404).send({ message: "Source not found" });
        }
        if (user.sources.indexOf(sourceIdToFind) !== -1) {
          return res.send(source);
        }
        console.log( `User ${username} tried to access source with id ${sourceIdToFind} that he is not following` );
        return res.status(404).send( {message: "User is not following the source"} );
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving source with id=" + sourceIdToFind });
      });
    })
    .catch(err => {
      console.error(err);
      res
        .status(500)
        .send({ message: `Error retrieving user ${username}` });
    });
    return;
  }
  console.log(`User with username '${req.headers.username}' tried to access source ${req.params.id} but wasn't authenticated.`);
  return res.status(401).send( {message: "User not allowed"} );
};

// Update a Source by the id in the request
exports.update = (req, res) => {

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params?.id;
  if (!id) {
    res.status(404).send({
      message: "Source id not specified."
    });
  }

  Source.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Source with id=${id}. Maybe Source was not found!`
        });
      } else res.send({ message: "Source was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Source with id=" + id
      });
    });
};

// Delete a Source with the specified id in the request
exports.delete = (req, res) => {

  const id = req.params?.id;
  if (!id) {
    res.status(404).send({
      message: "Source id not specified."
    });
  }

  Source.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Source with id=${id}. Maybe Source was not found!`
        });
      } else {
        res.send({
          message: "Source was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Source with id=" + id
      });
    });
};

// Refresh the source and try to have a new request
exports.refresh = async (req, res) => {

  const sourceIds = req.body.sourceIds;

  if (!sourceIds || !Array.isArray(sourceIds)) {
    console.error("Error in 'sourceIds' field.");
    return res.status(404).send({
      message: "Error in 'sourceIds' field."
    });
  }
  const response = [];

  for (let i = 0; i < sourceIds.length; i++) {
    let refreshedSourceOutput = await refreshSource(sourceIds[i]);
    console.debug(refreshedSourceOutput);
    if (refreshedSourceOutput.success != 404) {
      response.push(refreshedSourceOutput);
    }
  }
  return res.send({ result: response });
}
