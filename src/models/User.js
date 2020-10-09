const { Model } = require('objection')
const Knex = require('knex')

const { development } = require('../../knexfile')

const knex = Knex({
    client: 'mysql',
    useNullAsDefault: true,
    connection: development.connection
});

Model.knex(knex)

class User extends Model {
    static get tableName() {
        return 'users'
    }
}

module.exports = { User }
