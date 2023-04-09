const db = require("../models");
const Source = db.sources;
const Article = db.articles;

const {spawn} = require("child_process");

async function runPythonScript(link) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', ['workers/workerRSS.py', '-l', link]);

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
        resolve({error:1});
      } else {
        try {
          const result = JSON.parse(dataBuffer);
          resolve(result);
        } catch (err) {
          console.error(`Failed to parse JSON from Python script: ${err}`);
          resolve({error:2});
        }
      }
    });
  });
}

async function checkDocumentExists(model, query) {
  try {
    const result = await model.findOne(query);
    if (result) {
      return 0; // document exists
    } else {
      return 1; // document does not exist
    }
  } catch (error) {
    return 2; // error occurred, document does not exist
  }
}

// Create and Save a new Source
exports.create = async (req, res) => {

  // TODO  : Validate request

  const link = req.body.link;

  const querySourceExist = { link: link };
  const sourceExists = await checkDocumentExists(Source, querySourceExist);

  if (sourceExists == 2){
    return res.status(500).send({
      message: error.message || "An error occurred while checking the source."
    });
  }
  if (sourceExists == 0){
    return res.status(409).send({
      message: "The source already exists."
    });
  }

  // The source does not exist in the database
  const result = await runPythonScript(link);
    
  // Handle process completion
  if (result["error"] === 0) {

    const source = new Source(result.source);

    // Save Source in the database
    source
    .save(source)
    .then(savedSource => {
      console.log("Source saved to the database:", savedSource);

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

// Retrieve all Source from the database.
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
exports.findOne = (req, res) => {
  const id = req.params.id;

  Source.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Source with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Source with id=" + id });
    });
  
};

// Update a Source by the id in the request
exports.update = (req, res) => {
  
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

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
  const id = req.params.id;
  
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
