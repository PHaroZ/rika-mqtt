const util = require('util')
const log = require("loglevel")
const request = require('request').defaults({jar: true})

class RikaStove {
  constructor(conf) {
    this.conf = conf
  }

  async login() {
    log.debug(`connecting as ${this.conf.username} ... `)
    try {
      const {body} = await util.promisify(request.post)({
        url: 'https://www.rika-firenet.com/web/login',
        form: {email: this.conf.username, password: this.conf.password}
      })
      if (body.indexOf("summary") < 0) {
        throw new Error(`authentication rejected: ${body}`)
      }
      log.debug('connected')
    } catch (error) {
      throw new Error(`fail to connect: ${error}`)
    }
  }

  async getStatus() {
    log.trace("retrieving stove status...")
    const {
      body,
      ...response
    } = await util.promisify(request.get)({url: `https://www.rika-firenet.com/api/client/${this.conf.stoveId}/status`})
    if (response.statusCode === 200 && body.indexOf(this.conf.stoveId) > -1) {
      log.trace("status retrieved")
      const json = JSON.parse(body);

      return {
        active: !(json.sensors.statusMainState === 0 && json.sensors.statusSubState === 1),
        state: this.computeState(json),
        heatingPower: json.controls.heatingPower,
        targetTemperature: Number(json.controls.targetTemperature),
        currentTemperature: Number(json.sensors.inputRoomTemperature),
        totalConsumedPellet: json.sensors.parameterFeedRateTotal,
        pelletConsumptionBeforeSerice: json.sensors.parameterFeedRateService,
        revision: json.controls.revision
      }
    } else if (response.statusCode === 401) {
      log.trace("login required")
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
