import Sequelize from 'sequelize'

require('dotenv').config()

export default function init() {
  const { POSTGRES_DBNAME, POSTGRES_USER, POSTGRES_PASS } = process.env
  const sequelize = new Sequelize(
    POSTGRES_DBNAME,
    POSTGRES_USER,
    POSTGRES_PASS,
    { host: 'postgres', dialect: 'postgres' }
  )

  const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
  })

  sequelize
    .sync()
    .then(function() {
      return User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
      })
    })
    .then(jane => {
      console.log(
        jane.get({
          plain: true
        })
      )
    })
}
