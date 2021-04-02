const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))
app.use(express.static("."));
app.use('/auth', require('./routes/auth'))
app.use('/create', require('./routes/create'))

async function start() {
    try {
        await mongoose.connect(config.get('url'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (err) {
        console.log('Server error', err.message)
        process.exit(1)
    }
}

const PORT = config.get('port') || 8000
app.listen(PORT, () => console.log(`Server started on ${PORT}`))

start()