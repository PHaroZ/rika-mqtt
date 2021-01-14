'use strict'

const MQTT = require("async-mqtt")
const RikaStove = require('./RikaStove')
const loadConf = require('./loadConf')

const main = async () => {
  console.log('building conf ...')
  const conf = loadConf()
  console.log('conf ok')

  const stove = new RikaStove(conf.stove)

  console.log(`connecting to mqtt ${conf.mqtt.brokerUrl} ...`)
  const mqtt = await MQTT.connectAsync(conf.mqtt.brokerUrl, conf.mqtt.options, true)
  console.log('connected')

  await fetchStoveStatus({conf, stove, mqtt})
}

main()
  .catch(err => {
    console.error(err)
    process.exitCode = 1
  })

const fetchStoveStatus = async (args) => {
  const {conf, stove, mqtt} = args
  let status
  try {
    status = await stove.getStatus()
    console.log(status)
  } catch (e) {
    console.error('fail to get status')
    console.error(e)
  }
  try {
    await mqtt.publish(conf.mqtt.topicOut, JSON.stringify(status))
    console.log(`message published to ${conf.mqtt.topicOut}`)
  } catch (e) {
    console.error('fail to publish to mqtt')
    console.error(e)
  }
  setTimeout(fetchStoveStatus, conf.refreshRate, args)
}
