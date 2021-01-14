const loadConf = () => {
  return {
    refreshRate: readConf('REFRESH_RATE', 60) * 1000,
    stove: {
      username: readConf('RIKA_USERNAME'),
      password: readConf('RIKA_PASSWORD'),
      stoveId: readConf('RIKA_STOVE_ID'),
    },
    mqtt: {
      brokerUrl: readConf('MQTT_BROKER_URL', "tcp://mqtt:1883"),
      topicOut: readConf('MQTT_TOPIC_OUT', "rika/out"),
      options: {
        username: readConf('MQTT_USERNAME', ''),
        password: readConf('MQTT_PASSWORD', ''),
        clientId: readConf('MQTT_CLIENT_ID', 'rika-mqtt'),
      }
    }
  }
}

module.exports = loadConf

const readConf = (id, defaultValue) => {
  const envVal = process.env[id]
  if (envVal !== undefined) {
    return envVal
  }
  if (defaultValue !== undefined) {
    return defaultValue
  }
  throw new Error(`env variable ${id} is not defined although it is mandatory`)
}

