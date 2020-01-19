import Sequelize from 'sequelize'
import AirTableAPI from './airtable'

require('dotenv').config()
const {
  POSTGRES_DBNAME,
  POSTGRES_USER,
  POSTGRES_PASS,
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_KEY
} = process.env

class Database {
  constructor() {
    //init database
    this.sequelize = new Sequelize(
      POSTGRES_DBNAME,
      POSTGRES_USER,
      POSTGRES_PASS,
      { host: 'postgres', dialect: 'postgres' }
    )
    this.User = this.sequelize.define('user', {
      username: Sequelize.STRING,
      birthday: Sequelize.DATE
    })

    //init airtable
    this.airtable_api = new AirTableAPI({
      apiKey: AIRTABLE_API_KEY,
      base: AIRTABLE_BASE_KEY
    })
  }

  test() {
    this.sequelize.sync().then(() => {
      this.User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
      })
    })
  }
}

export default Database
