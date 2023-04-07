const db = require("../models");
const Source = db.sources;

const {spawn} = require("child_process");

async function runPythonScript() {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', ['workers/workerRSS.py']);

    let dataBuffer = '';
    child.stdout.on('data', (data) => {
      dataBuffer += data;
    });

    child.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script workers/workerRSS.py exited with code ${code}`);
        //reject(`Python script exited with code ${code}`);
        resolve({error:1});
      } else {
        try {
          const result = JSON.parse(dataBuffer);
          result["error"] = 0;
          resolve(result);
        } catch (err) {
          //reject(`Failed to parse JSON from Python script: ${err}`);
          console.error(`Failed to parse JSON from Python script: ${err}`);
          resolve({error:2});
        }
      }
    });
  });
}

// Create and Save a new Source
exports.create = async (req, res) => {

  // TODO  : Validate request

  const result = await runPythonScript();
    
  // Handle process completion
  if (result["error"] === 0) {
    // Send the result back to the client
    const source = new Source({
      title: result['data']['title'],
      description: result['data']['descriptions'],
      url : result['data']['url'],
      etag: result['data']['etag'],
      createdAt : result['data']['updatedAt']
    });
    console.debug("data sent");

    // Save Source in the database
    source
    .save(source)
    .then(data => {
      res.send(data);
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
