const { send, json } = require('micro')
const { hash } = require('bcrypt')

const { User } = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const { name } = req.query
            const query = User.query()

            name && query.where({ name })

            let users = await query

            users = await users.map(person => ({
                name: person.name,
                email: person.email,
                address: person.address,
                created_at: person.created_at
            }))

            return send(res, 200, { users })
        } catch (error) {
            send(res, 500, { error: 'Erro no servidor.' })
        }
    },

    async create(req, res) {
        try {
            let { name, email, password, address } = await json(req)

            password = await hash(password, 8)

            await User.query().insert({
                name,
                email,
                password,
                address
            })

            return send(res, 201, { success: 'Usuário cadastrado com sucesso!' })

        } catch (error) {
            console.log(error)
            send(res, 500, { error: 'Erro no servidor.' })
        }

    },

    async show(req, res) {
        try {
            const { id } = req.params

            let user = await User.query().findById(id)

            if (!user) return send(res, 204, { error: 'Usuário não encontrado' })

            user = {
                name: user.name,
                email: user.email,
                address: user.address,
                created_at: user.created_at,
                updated_at: user.updated_at
            }

            return send(res, 200, { user })

        } catch (error) {
            send(res, 500, { error: 'Erro no servidor.' })
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params
            let { name, email, address } = await json(req)

            let user = await User.query().findById(id)

            if (!user) return send(res, 204, { error: 'Usuário não encontrado' })

            if(foundUser) return send(res, 400, {error: 'O email está em uso por outro usuário '})

            await User.query().update({
                name,
                email,
                address
            }).where({ id })

            return send(res, 200, { success: 'Atualizado com sucesso!' })

        } catch (error) {
            send(res, 500, { error: 'Erro no servidor.' })
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params

            let user = await User.query().findById(id)
            if (!user) return send(res, 204, { error: 'Usuário não encontrado' })

            await User.query().delete().where({ id })

            return send(res, 200, { success: `Usuário ${user.name} deletado com sucesso.` })

        } catch (error) {
            send(res, 500, { error: 'Erro no servidor.' })
        }
    }
}