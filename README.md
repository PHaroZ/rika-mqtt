# rika-mqtt

A gateway which regularly connects to [Rika Firenet](https://www.rika-firenet.com/) to retrieve a stove status and publish it on MQTT.

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/PHaroz/rika-mqtt/Build)
![Docker Pulls](https://img.shields.io/docker/pulls/pharoz/rika-mqtt)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/pharoz/rika-mqtt/latest)

## Info

Published message looks like :

```json
{
  "state": "idle", // inactive/idle/heating
  "active": true,
  "heatingPower": 75, // 0 to 100, 0 when state!=='heating'
  "targetTemperature": 19,
  "currentTemperature": 20.2,
  "totalConsumedPellet": 1016,
  "pelletConsumptionBeforeService": 450,
  "revision": 1610953312
}
```

Configuration should be done via environment variables :

| name | default | description |
| ---- | ------- | ----------- |
| LOG_LEVEL | `info` | a logging level among `trace`/`debug`/`info`/`warn`/`error` |
| REFRESH_RATE | `60` | delay, in seconds, between 2 refresh |
| RIKA_USERNAME |  | username/email to login to firenet |
| RIKA_PASSWORD |  | password relative to `RIKA_USERNAME` |
| RIKA_STOVE_ID |  | ID of the stove to manage in firenet. can be found in the url like `https://www.rika-firenet.com/web/stove/<RIKA_STOVE_ID>` |
| MQTT_BROKER_URL | `tcp://mqtt:1883` | broker URL of the target MQTT server |
| MQTT_USERNAME |  | username for authentification on MQTT server, if any |
| MQTT_PASSWORD |  | password relative to `MQTT_USERNAME` |
| MQTT_CLIENT_ID | `rika-mqtt` | an MQTT client id |
| MQTT_TOPIC_OUT | `rika/out` | in which MQTT topic stove status should be written |
