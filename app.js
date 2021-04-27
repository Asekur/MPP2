const express = require('express')
const socket = require('socket.io')
const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')

const app = express()

app.use(express.json({ extended: true }))
app.use(express.static("."));
app.use('/create', require('./routes/create'))

const PORT = config.get('port') || 8000

async function start() {
    try {
        await mongoose.connect(config.get('url'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        const server = app.listen(PORT, () => console.log(`Server started on ${PORT}`))
        const socketio = socket(server)
        
        socketio.on('connection', (socket) => {
            console.log('User\'s id ' + socket.id)

            socket.on('reg', async(data) => {
                const { login, password } = data
                const preUser = await User.findOne({ login })

                //существует ли пользователь с таким логином
                if (preUser) {
                    socket.emit('resultauth', { token: null, userId: null, message: 'User is already exists'} )
                    return
                }

                //шифрование пароля
                const hashPassword = await bcrypt.hash(password, 12)
                const newUser = new User({ login, password: hashPassword })

                await newUser.save()
                socket.emit('resultauth', { token: null, userId: null, message: 'User is created' })
            })

            socket.on('login', async(data) =>{
                const { login, password } = data
                const newUser = await User.findOne({ login })

                //существует ли пользователь с таким логином
                if (!newUser) {
                    socket.emit('resultauth', {token: null, userId: null, message: 'User not found'})
                    return
                }

                //проверка совпадения пароля из базы и введенного
                const isMatch = await bcrypt.compare(password, newUser.password)
                if (!isMatch) {
                    socket.emit('resultauth', {token: null, userId: null, message: 'Incorrect password'})
                    return
                }
            
                const userId = newUser.id
                //создание jwt токена
                const token = jwt.sign(
                    //данные, которые зашифрованы в этом токене
                    { userId },
                    //секретный ключ
                    config.get('jwtKey'),
                    //через сколько токен закончит существование
                    { expiresIn: '1h' }
                )
                socket.emit('resultauth', {token, userId, message: null})
            })

            socket.on('disconnect', () => {
                console.log('User\'s disconnected')
            })
        })

    } catch (err) {
        console.log('Server error', err.message)
        process.exit(1)
    }
}

start()