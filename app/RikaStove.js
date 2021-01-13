const util = require('util')
const request = require('request').defaults({jar: true})

class RikaStove {
  constructor(config) {
    this.config = config
  }

  log(...args) {
    // console.log(...args);
  }

  async login() {
    this.log("connecting to Firenet... ")
    try {
      const {body} = await util.promisify(request.post)({
        url: 'https://www.rika-firenet.com/web/login',
        form: {email: this.config.username, password: this.config.password}
      })
      if (body.indexOf("summary") < 0) {
        throw new Error(`authentication rejected: ${body}`)
      }
    } catch (error) {
      throw new Error(`fail to connect to Firenet: ${error}`)
    }
  }

  async getStatus() {
    this.log("retrieving stove status...")
    const {
      body,
      ...response
    } = await util.promisify(request.get)({url: `https://www.rika-firenet.com/api/client/${this.config.stoveId}/status`})
    if (response.statusCode === 200 && body.indexOf(this.config.stoveId) > -1) {
      this.log("status retrieved")
      const json = JSON.parse(body);

      return {
        active: !(json.controls.statusMainState === 0 && json.controls.statusSubState === 1),
        targetTemperature: Number(json.controls.targetTemperature),
        currentTemperature: Number(json.sensors.inputRoomTemperature),
        state: this.computeState(json),
        revision: json.controls.revision,
      }
    } else if (response.statusCode === 401) {
      this.log("login required")
      await this.login()
      return await this.getStatus()
    } else if (response.statusCode === 500) {
      throw new Error(`fail to retrieve status: ${body}`)
    }
  }

  computeState(json) {
    if (json.sensors.statusMainState === 0 && json.sensors.statusSubState === 1) {
      return 'inactive'
    } else if (json.sensors.statusMainState <= 5 && json.sensors.statusMainState >= 2) {
      return 'heating'
    } else {
      return 'idle'
    }
  }
}

module.exports = RikaStove
