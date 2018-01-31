const express = require('express');
const path = require('path');
const pjson = require('./package.json');
const port = ('port', process.env.PORT || 8088);
const app = express();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const serveStatic = require('serve-static');

const vision = require('@google-cloud/vision');


const client = new vision.ImageAnnotatorClient({
    keyFilename: 'keyfile.json'
});

// Image Properties
app.post('/color', upload.single('file'), function (req, res, next) {
    console.log(req.file)
    client.imageProperties(req.file.path)
        .then((results) => {
            // Extract Dominant Colors
            const properties = results[0].imagePropertiesAnnotation;
            const colors = properties.dominantColors.colors;
            res.send(colors);
        }).catch(err => {
            console.error('ERROR:', err);
            res.status(400).send('ERROR:', err);
        });
})

// Text Extraction
app.post('/text', upload.single('file'), function (req, res, next) {
    client.textDetection(req.file.path)
        .then((results) => {
            // Extract Dominant Colors
            const detections = results[0].textAnnotations;
            res.send(detections);
        }).catch(err => {
            console.error('ERROR:', err);
            res.status(400).send('ERROR:', err);
        });
})

// Label Extraction
app.post('/label', upload.single('file'), function (req, res, next) {
    client.labelDetection(req.file.path)
        .then((results) => {
            // Extract Dominant Colors
            const labels = results[0].labelAnnotations;
            res.send(labels);
        }).catch(err => {
            console.error('ERROR:', err);
            res.status(400).send('ERROR:', err);
        });
})


app.use(serveStatic(path.join(__dirname, 'public')))
const server = app.listen(port);
console.log(`😁  ${pjson.name} running → PORT ${server.address().port}`);