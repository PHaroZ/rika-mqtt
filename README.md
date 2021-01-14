# rika-mqtt

A gateway which regularly connects to [Rika Firenet](https://www.rika-firenet.com/) to retrieve a stove status and publish it on MQTT.

Configuration should be done via environment variables :

| name | default | description |
| ---- | ------- | ----------- |
| REFRESH_RATE | `60` | delay, in seconds, between 2 refresh |
| RIKA_USERNAME |  | username/email to login to firenet |
| RIKA_PASSWORD |  | password relative to `RIKA_USERNAME` |
| RIKA_STOVE_ID |  | ID of the stove to manage in firenet. can be found in the url like `https://www.rika-firenet.com/web/stove/<RIKA_STOVE_ID>` |
| MQTT_BROKER_URL | `tcp://mqtt:1883` | broker URL of the target MQTT server |
| MQTT_USERNAME |  | username for authentification on MQTT server, if any |
| MQTT_PASSWORD |  | password relative to `MQTT_USERNAME` |
| MQTT_CLIENT_ID | `rika-mqtt` | an MQTT client id |
| MQTT_TOPIC_OUT | `rika/out` | in which MQTT topic stove status should be written |
