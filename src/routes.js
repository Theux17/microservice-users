const { send } = require('micro')
const { router, get, post, put, del } = require('microrouter')

const users = require('./controllers/UserController')

const notfound = (req, res) => send(res, 404, {message: 'Rota não encontrada.'})

module.exports =  router(
    get('/users', users.index),
    post('/users', users.create),
    get('/users/show/:id', users.show),
    put('/users/:id', users.update),
    del('/users/:id', users.delete),
    get('/*', notfound)
)


