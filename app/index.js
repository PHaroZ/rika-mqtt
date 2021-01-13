'use strict'

const RikaStove = require('./RikaStove')
const MQTT = require("async-mqtt");

const stove = new RikaStove({
  username: process.env.RIKA_USERNAME,
  password: process.env.RIKA_PASSWORD,
  stoveId: process.env.RIKA_STOVE_ID,
})
const refreshRate = (process.env.RIKA_REFRESH_RATE || 10) * 1000
const mqttBrokerUrl = process.env.MQTT_BROKER_URL || "tcp://mosquitto:1883"
const mqttTopicOut = process.env.MQTT_TOPIC_OUT || "rika/out"
const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: process.env.MQTT_CLIENT_ID || 'rika-mqtt',
}

const fetchStoveStatus = async (mqttClient) => {
  let status
  try {
    status = await stove.getStatus()
    console.log(status)
  } catch (e) {
    console.error('fail to get status')
    console.error(e)
  }
  try {
    await mqttClient.publish(mqttTopicOut, JSON.stringify(status))
    console.log(`message published to ${mqttTopicOut}`)
  } catch (e) {
    console.error('fail to publish to mqtt')
    console.error(e)
  }
  setTimeout(fetchStoveStatus, refreshRate, mqttClient)
}

const main = async () => {
  console.log(`connecting to mqtt ${mqttBrokerUrl}`)
  const mqttClient = await MQTT.connectAsync(mqttBrokerUrl, mqttOptions, true)
  console.log('connected')

  fetchStoveStatus(mqttClient)
}

main()


