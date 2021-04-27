const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')

const app = express()

const {GraphQLList} = require('graphql')
const {GraphQLSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')
const {GraphQLString} = require('graphql')
const {GraphQLObjectType} = require('graphql')

app.use(express.json({ extended: true }))
app.use(express.static("."));
app.use('/create', require('./routes/create'))


//определение типа ответа от сервера на авторизацию
const AuthResultType = new GraphQLObjectType({
    name: "AuthResult",
    fields: () => ({
        token: {type: GraphQLString},
        userId: {type: GraphQLString},
        message: {type: GraphQLString},
    })
})

//получение данных с сервера
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        login: {
            type: AuthResultType,
            args: {
                login: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const login = args.login
                const password = args.password
                const newUser = await User.findOne({ login })

                //существует ли пользователь с таким логином
                if (!newUser) {
                    return {token: null, userId: null, message: 'User not found'}
                }

                //проверка совпадения пароля из базы и введенного
                const isMatch = await bcrypt.compare(password, newUser.password)
                if (!isMatch) {
                    return {token: null, userId: null, message: 'Incorrect password'}
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
                return {token, userId, message: null}
            }
        }
    }
})

//изменение данных на сервере
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        reg: {
            type: AuthResultType,
            args: {
                login: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const login = args.login
                const password = args.password
                const preUser = await User.findOne({ login })

                //существует ли пользователь с таким логином
                if (preUser) {
                    return { token: null, userId: null, message: 'User is already exists'}
                }

                //шифрование пароля
                const hashPassword = await bcrypt.hash(password, 12)
                const newUser = new User({ login, password: hashPassword })

                await newUser.save()
                return { token: null, userId: null, message: 'User is created' }
            }
        }
    }
})

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation })

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: false //тестить запросы
}))


const PORT = config.get('port') || 8000

async function start() {
    try {
        await mongoose.connect(config.get('url'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        app.listen(PORT, () => console.log(`Server started on ${PORT}`))

    } catch (err) {
        console.log('Server error', err.message)
        process.exit(1)
    }
}

start()