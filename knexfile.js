// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'users',
      user: 'root',
      password: 'matheus1234'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
  }
};