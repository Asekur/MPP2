//создание роутов
const { Router } = require('express')
const router = Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User')

const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

//префикс /auth/reg
router.post(
    '/reg',
    [
        //валидация
        check('login', "Minimal length - 3").isLength({ min: 3 }),
        check('password', 'Minimal length - 6').isLength({ min: 6 })
    ],
    async (request, response) => {
        try {
            console.log("Body: ", request.body)

            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data'
                })
            }

            const { login, password } = request.body
            const preUser = await User.findOne({ login })

            //существует ли пользователь с таким логином
            if (preUser) {
                return response.status(400).json({ message: 'User is already exists' })
            }

            //шифрование пароля
            const hashPassword = await bcrypt.hash(password, 12)
            const newUser = new User({ login, password: hashPassword })

            await newUser.save()
            response.status(201).json({ message: 'User is created' })

        } catch (err) {
            //ошибка сервера
            response.status(500).json({ message: 'Something do wrong. Try again later' })
        }
    })

//префикс /auth/login
router.post(
    '/login',
    [
        //валидация
        check('login', "Enter login").exists(),
        check('password', 'Enter password').exists()
    ],
    async (request, response) => {
        try {
            //ошибки ввода данных
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data'
                })
            }

            const { login, password } = request.body
            const newUser = await User.findOne({ login })

            //существует ли пользователь с таким логином
            if (!newUser) {
                return response.status(400).json({ message: 'User not found' })
            }
            //проверка совпадения пароля из базы и введенного
            const isMatch = await bcrypt.compare(password, newUser.password)
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' })
            }
            //создание jwt токена
            const token = jwt.sign(
                //данные, которые зашифрованы в этом токене
                { userId: newUser.id },
                //секретный ключ
                config.get('jwtKey'),
                //через сколько токен закончит существование
                { expiresIn: '1h' }
            )
            response.status(200).json({ token, userId: newUser.id })

        } catch (err) {
            //ошибка сервера
            response.status(500).json({ message: 'Something do wrong. Try again later' })
        }
    })

module.exports = router