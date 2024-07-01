# ZigBee2MQTT: config files
Extension files for ZigBee2MQTT; only one of the files is required for device support.
Extract the file into the `/data` folder. Add the following lines to `configuration.yaml` file in the same folder:
```
external_converters:
  - Winner_ZigBee_Basic.js
```

## Winner_ZigBee_Basic.js
Basic support for Winner. Available fields:
- Valve position: open/closed
- Alarm status
    - Because of the device's firmware, you cannot turn the alarm on
- Cleaning mode status
- Battery charge level
- Error code

## Winner_ZigBee_dev.js
**Works the same way as Basic version.**

A version with the full list of the device DPs. Additional DPs will not work with Z2MQTT because of their non-standard implementation: you would need to write additional code for Z2MQTT libraries to properly parse the incoming data.

E.g: any `sensor_*` DP is a 4 byte integer:
```
0xAA_BB_CC_DD where:
[AA]    - command bit flags
[BB]    - status bit flags
[CC]    - signal strength
[DD]    - battery charge
```
This will not be parsed accordingly right out of the box.
