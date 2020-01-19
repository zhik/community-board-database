import Airtable from 'airtable'

class AirTableAPI {
  constructor(config) {
    this.base = new Airtable({ apiKey: config.apiKey }).base(config.base)
    this.config = config
  }
}

export default AirTableAPI
