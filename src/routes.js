const { send } = require('micro')
const { router, get, post, put, del } = require('microrouter')

const users = require('./controllers/users')

const notfound = (req, res) => send(res, 404, {message: 'Página não encontrada.'})

module.exports =  router(
    get('/users', users.index),
    post('/users', users.post),
    get('/users/show/:id', users.show),
    put('/users/:id', users.update),
    del('/users/:id', users.delete),
    get('/*', notfound)
)


