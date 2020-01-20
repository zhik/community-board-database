import Sequelize from 'sequelize'
import AirTableAPI from './airtable'
import RequestModel from './models/request'
import OrganizationModel from './models/organization'
import ContactModel from './models/contact'
import UpdateModel from './models/update'
import geocode from '../utils/geocode'

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
      {
        host: 'postgres',
        dialect: 'postgres'
      }
    )

    this.Organization = OrganizationModel(this.sequelize, Sequelize)
    this.Contact = ContactModel(this.sequelize, Sequelize)
    this.Update = UpdateModel(this.sequelize, Sequelize)
    this.Request = RequestModel(this.sequelize, Sequelize, {
      Organization: this.Organization,
      Contact: this.Contact,
      Update: this.Update
    })

    //init airtable
    this.airtable = new AirTableAPI({
      apiKey: AIRTABLE_API_KEY,
      base: AIRTABLE_BASE_KEY
    })

    //first sync
    this.sequelize
      .sync({
        force: true
      })
      .then(() => {
        console.log(`Database & tables created!`)

        this.sync()
      })
  }

  updateTableJSON(airtableTable, model) {
    this.airtable
      .getAllRecords(airtableTable)
      .then(records => {
        return records.map(({ fields, id }) => ({
          id,
          json: JSON.stringify(fields)
        }))
      })
      .then(records =>
        model.bulkCreate(records, {
          updateOnDuplicate: ['json']
        })
      )
  }

  updateTableRequest(model) {
    this.airtable
      .getAllRecords('Requests')
      .then(records => {
        return records.map(({ fields, id }) => ({
          id,
          organizations:
            'Primary Agency' in fields ? fields['Primary Agency'] : [],
          contacts: 'Requester Name' in fields ? fields['Requester Name'] : [],
          updates: 'Updates' in fields ? fields['Updates'] : [],
          address: fields['Issue Full Address'],
          json: JSON.stringify(fields)
        }))
      })
      .then(records =>
        model.bulkCreate(records, {
          updateOnDuplicate: [
            'organizations',
            'contacts',
            'updates',
            'address',
            'json'
          ]
        })
      )
      .then(async records => {
        //compare to see which values locations need to be updated
        const geocodedRecords = await Promise.all(
          records
            .filter(record => {
              return (
                record.dataValues.address !== record.dataValues.last_address
              )
            })
            .map(async record => {
              const geocodedRecord = record.dataValues

              geocodedRecord.last_address = geocodedRecord.address
              geocodedRecord.location = await geocode(geocodedRecord.address)
              return geocodedRecord
            })
        )
        return model.bulkCreate(geocodedRecords, {
          updateOnDuplicate: ['last_address', 'location']
        })
      })
  }

  addRequest(model, newRecord) {
    return new Promise((resolve, reject) => {
      this.airtable.base('Requests').create(newRecord, (err, record) => {
        if (err) {
          reject(err)
        }
        resolve(record)
      })
    }).then(async ({ fields, id }) =>
      model.create({
        id,
        organizations:
          'Primary Agency' in fields ? fields['Primary Agency'] : [],
        contacts: 'Requester Name' in fields ? fields['Requester Name'] : [],
        updates: 'Updates' in fields ? fields['Updates'] : [],
        address: fields['Issue Full Address'],
        last_address: fields['Issue Full Address'],
        location: await geocode(fields['Issue Full Address']),
        json: JSON.stringify(fields)
      })
    )
  }

  editRequest(model, editRecord, recordId) {
    return new Promise((resolve, reject) => {
      this.airtable
        .base('Requests')
        .update(recordId, editRecord, (err, record) => {
          if (err) {
            reject(err)
          }
          resolve(record)
        })
    })
      .then(async ({ fields, id }) =>
        model.update(
          {
            organizations:
              'Primary Agency' in fields ? fields['Primary Agency'] : [],
            contacts:
              'Requester Name' in fields ? fields['Requester Name'] : [],
            updates: 'Updates' in fields ? fields['Updates'] : [],
            address: fields['Issue Full Address'],
            json: JSON.stringify(fields)
          },
          {
            where: {
              id
            }
          }
        )
      )
      .then(async () => {
        const record = await model.findByPk(recordId)
        if (record.dataValues.address !== record.dataValues.last_address) {
          record.last_address = record.dataValues.address
          record.location = await geocode(record.dataValues.address)
          await record.save()
        }
        return record
      })
  }

  deleteRequest(model, recordId) {
    return new Promise((resolve, reject) => {
      this.airtable.base('Requests').destroy(recordId, (err, record) => {
        if (err) {
          reject(err)
        }
        resolve(record)
      })
    }).then(async () => {
      const record = await model.findByPk(recordId)
      await record.destroy()
      return recordId
    })
  }

  addRecordJSON(tableName, model, newRecord) {
    return new Promise((resolve, reject) => {
      this.airtable.base(tableName).create(newRecord, (err, record) => {
        if (err) {
          reject(err)
        }
        resolve(record)
      })
    }).then(({ fields, id }) =>
      model.create({
        id,
        json: JSON.stringify(fields)
      })
    )
  }

  editRecordJSON(tableName, model, newRecord, recordId) {
    return new Promise((resolve, reject) => {
      this.airtable
        .base(tableName)
        .update(recordId, newRecord, (err, record) => {
          if (err) {
            reject(err)
          }
          resolve(record)
        })
    })
      .then(({ fields, id }) =>
        model.update(
          {
            json: JSON.stringify(fields)
          },
          {
            where: {
              id
            }
          }
        )
      )
      .then(() => model.findByPk(recordId))
  }

  deleteRecordJSON(tableName, model, recordId) {
    return new Promise((resolve, reject) => {
      this.airtable.base(tableName).destroy(recordId, (err, record) => {
        if (err) {
          reject(err)
        }
        resolve(record)
      })
    }).then(async () => {
      const record = await model.findByPk(recordId)
      await record.destroy()
      return recordId
    })
  }

  sync() {
    this.updateTableJSON('Updates', this.Update)
    this.updateTableJSON('Contacts', this.Contact)
    this.updateTableJSON('Organization', this.Organization)
    this.updateTableRequest(this.Request)
  }
}

export default Database
