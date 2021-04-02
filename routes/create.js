//создание роутов
const { Router } = require('express')
const router = Router()
const Car = require('../models/Car')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//инициализация upload
const upload = multer({
    storage: storage,
    fileFilter: function (request, file, callback) {
        checkFileType(file, callback);
    }
}).single('photo');

// проверка тика документа
function checkFileType(file, callback) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return callback(null, true);
    } else {
        callback('Images Only!');
    }
}


router.post('/generate', async (request, result) => {
    upload(request, result, async (err) => {
        const { name, color, price } = request.body;
        const exist = await Car.findOne({ name })
        if (exist) {
            return result.status(200).json({ car: exist })
        }
        console.log(request.file)
        const car = new Car({
            photo: request.file.path,
            name,
            color,
            price
        });
        await car.save();
        result.status(201).json(car);
    })
})

router.get('/', async (request, result) => {
    try {
        const cars = await Car.find()
        result.status(200).json(cars)
    } catch (err) {
        //ошибка сервера
        response.status(500).json({ message: 'Something do wrong. Try again later' })
    }
})

router.delete('/', async (request, result) => {
    try {
        const { name } = request.body;
        const exist = await Car.findOneAndDelete({ name })
        if (exist) {
            result.status(200).json(name)
        }
    } catch (err) {
        //ошибка сервера
        response.status(500).json({ message: 'Something do wrong. Try again later' })
    }
})

module.exports = router