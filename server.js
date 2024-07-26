const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/photo-gallery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const photoSchema = new mongoose.Schema({
    filename: String,
    path: String
});

const Photo = mongoose.model('Photo', photoSchema);

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static('public'));

// Upload route
app.post('/upload', upload.array('photos', 12), async (req, res) => {
    try {
        const files = req.files;
        for (let file of files) {
            const photo = new Photo({
                filename: file.filename,
                path: '/uploads/' + file.filename
            });
            await photo.save();
        }
        res.status(200).send('Files uploaded successfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all photos route
app.get('/photos', async (req, res) => {
    try {
        const photos = await Photo.find();
        res.status(200).json(photos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});