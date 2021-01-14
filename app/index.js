const log = require("loglevel")
const MQTT = require("async-mqtt")
const RikaStove = require('./RikaStove')
const loadConf = require('./loadConf')

log.setDefaultLevel(log.levels[process.env.LOG_LEVEL?.toUpperCase()] ?? log.levels.INFO)

const main = async () => {


  log.info('building conf ...')
  const conf = loadConf()
  log.info('conf ok')

  const stove = new RikaStove(conf.stove)

  log.info(`connecting to mqtt ${conf.mqtt.brokerUrl} ...`)
  const mqtt = await MQTT.connectAsync(conf.mqtt.brokerUrl, conf.mqtt.options, true)
  log.info('connected')

  await fetchStoveStatus({conf, stove, mqtt})
}

main()
  .catch(err => {
    log.error(err)
    process.exitCode = 1
  })

const fetchStoveStatus = async (args) => {
  const {conf, stove, mqtt} = args
  let status
  try {
    status = await stove.getStatus()
    log.trace(status)
  } catch (e) {
    log.warn('fail to get status')
    log.warn(e)
  }
  try {
    await mqtt.publish(conf.mqtt.topicOut, JSON.stringify(status))
    log.trace(`message published to ${conf.mqtt.topicOut}`)
  } catch (e) {
    log.warn('fail to publish to mqtt')
    log.warn(e)
  }
  setTimeout(fetchStoveStatus, conf.refreshRate, args)
}
