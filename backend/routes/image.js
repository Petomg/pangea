const express = require('express');
let router = express.Router();
let imgModel = require('../models/Image');
let multer = require('multer');
let fs = require('fs');
let path = require('path');


//CONFIGURACION GUARDADO DE IMAGENES
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

let upload = multer({ storage: storage });




router.get('/', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.send(items);
        }
    });
});


router.post('/', upload.single('image'), (req, res, next) => {
    console.log(req.body);
    let obj = {
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.body.fileName)),
            contentType: req.body.contentType
        }
    }

    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {

            //item.save();
            res.redirect('/');
        }
    });
});

module.exports = router;