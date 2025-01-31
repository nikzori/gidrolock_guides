# ZigBee2MQTT: config files
Extension files for ZigBee2MQTT; only one of the files is required for device support.
Extract the file into the `/data` folder. Add the following lines to `configuration.yaml` file in the same folder:
```
external_converters:
  - win.basic.js
```

## win.basic.js
Basic support for Winner. Available fields:
- Valve position: open/closed
- Alarm status
    - Because of the device's firmware, you cannot turn the alarm on
- Cleaning mode status
- Battery charge level
- Error code

## win.dev.js
A version with the full list of the device DPs. See commented out areas inside the file for more info on commands.