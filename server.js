const express = require("express");
const path = require("path");
const pjson = require("./package.json");
const port = ("port", process.env.PORT || 8088);
const app = express();

// Serve static files
const serveStatic = require("serve-static");

// Extract files from form data
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Google cloud library for Vision API
const vision = require("@google-cloud/vision");

// Google cloud client
const client = new vision.ImageAnnotatorClient({
  keyFilename: "keyfile.json"
});

// Image Properties
app.post("/color", upload.single("file"), function(req, res, next) {
  
    client
    .imageProperties(req.file.path)
    .then(results => {
      // send result data
      res.send(results);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.use(serveStatic(path.join(__dirname, "public")));
const server = app.listen(port);
console.log(`😁  ${pjson.name} running → PORT ${server.address().port}`);
