import Airtable from 'airtable'

class AirTableAPI {
  constructor(config) {
    this.base = new Airtable({
      apiKey: config.apiKey
    }).base(config.base)
    this.config = config
  }

  getAllRecords(tableName) {
    return new Promise((resolve, reject) => {
      let records = [];
      this.base(tableName)
        .select()
        .eachPage(
          (partialRecords, fetchNextPage) => {
            records = [...records, ...partialRecords];
            fetchNextPage();
          },
          err => {
            if (err) {
              reject(err);
            }
            resolve(records);
          }
        )
    })
  }

  addRecord(tableName, newRecord) {
    return new Promise((resolve, reject) => {
      base(tableName).create(newRecord, (err, record) => {
        if (err) {
          reject(err);
        }
        resolve(record);
      });
    });
  }

  editRecord(tableName, updatedRecord, recordId) {
    return new Promise((resolve, reject) => {
      base(tableName).update(recordId, updatedRecord, (err, record) => {
        if (err) {
          reject(err);
        }
        resolve(record);
      });
    });
  }

  deleteRecord(tableName, recordId) {
    return new Promise((resolve, reject) => {
      base(tableName).destroy(recordId, (err, record) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

}

export default AirTableAPI