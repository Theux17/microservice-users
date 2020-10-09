const { send, json } = require('micro')
const { hash, compare } = require('bcrypt')

const { User } = require('../models/User')
const SchemaUser = require('../SchemaUser')

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
            let { name, email, password, repeat_password, address } = await json(req)

            const users = await User.query()
            const foundUser = await users.find(user => {
                if (user.email == email) return user
            })

            if (foundUser) return send(res, 400, { error: 'The email is being used by another user' })

            const schema = SchemaUser.userSchema
            const { error } = schema.validate({
                name: name,
                email: email,
                password: password,
                repeat_password: repeat_password,
                address: address
            })

            if (error) {
                const message = error.message

                return send(res, 400, { message })
            }

            password = await hash(password, 8)
            await User.query().insert({
                name,
                email,
                password,
                address
            })

            return send(res, 201, { success: 'User successfully registered' })

        } catch (error) {
            send(res, 500, { error: 'Server error' })
        }

    },

    async show(req, res) {
        try {
            const { id } = req.params

            let user = await User.query().findById(id)

            if (!user) return send(res, 204, { error: 'User not found' })

            user = {
                name: user.name,
                email: user.email,
                address: user.address,
                created_at: user.created_at,
                updated_at: user.updated_at
            }

            return send(res, 200, { user })

        } catch (error) {
            send(res, 500, { error: 'Server error' })
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params
            let { name, email, address, password } = await json(req)

            let user = await User.query().findById(id)
            if (!user) return send(res, 204, { error: 'User not found' })

            const schema = SchemaUser.userSchema
            const { error } = schema.validate({
                name: name,
                email: email,
                password: password,
                address: address
            })

            if (error) {
                const message = error.message

                return send(res, 400, { message })
            }

            const users = await User.query()
            const foundUser = await users.find(user => {
                if (user.id != id && user.email == email) return user
            })

            if (foundUser) return send(res, 400, { error: 'The email is being used by another user' })

            const passed = await compare(password, user.password)
            if (!passed) return send(res, 400, { error: 'Incorrect password' })

            await User.query().update({
                name,
                email,
                address
            }).where({ id })

            return send(res, 200, { success: 'Successfully updated' })

        } catch (error) {
            send(res, 500, { error: 'Server error' })
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params
            const { password, email } = await json(req)
            
            let user = await User.query().findById(id)
            if (!user) return send(res, 204, { error: 'Usuário não encontrado' })

            if (email != user.email) return send(res, 400, { error: 'Incorrect email' })

            const passed = await compare(password, user.password)
            if (!passed) return send(res, 400, { error: 'Incorrect password' })

            await User.query().delete().where({ id })

            return send(res, 200, { success: `User ${user.name} successfully deleted.` })

        } catch (error) {
            send(res, 500, { error: 'Server error' })
        }
    }
}