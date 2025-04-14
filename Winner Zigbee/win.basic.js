const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const modernExtend = require('zigbee-herdsman-converters/lib/modernExtend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');

const tzDatapoints = {
    ...tuya.tz.datapoints,
    key: ['switch', 'fault', 'alarm', 'battery', 'cleaning']
}
const definition = {
    fingerprint: [
        {
            modelID: 'TS0601',
            manufacturerName: '_TZE200_yltivvzb',
        },
    ],
    model: 'Gidrolock Winner',
    vendor: 'Gidrolock',
    description: 'Gidrolock smart water valve',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tzDatapoints],
    onEvent: tuya.onEventSetTime,
    exposes: [
        exposes.presets.enum('fault', ea.STATE, ['low_battery', 'fault', 'lack_water', 'sensor_fault', 'motor_fault', 'low_temp']).withCategory('diagnostic'),
        exposes.presets.binary('switch', ea.STATE_SET, true, false ).withLabel('Valve status:'),
        exposes.presets.binary('cleaning', ea.STATE_SET, true, false).withLabel('Cleaning Mode:'),
        exposes.presets.binary('alarm', ea.STATE_SET, true, false),
        exposes.presets.enum('battery', ea.STATE, ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '101']),
    ],
    meta: {
        tuyaDatapoints: [
            [1, 'switch', tuya.valueConverter.raw],
            [4, 'fault', tuya.valueConverter.raw],
            [101, 'alarm', tuya.valueConverter.raw],
            [102, 'battery', tuya.valueConverterBasic.lookup({'10': tuya.enum(0), '20': tuya.enum(1), '30': tuya.enum(2), '40': tuya.enum(3), '50': tuya.enum(4), '60': tuya.enum(5), '70': tuya.enum(6), '80': tuya.enum(7), '90': tuya.enum(8), '100': tuya.enum(9), '101': tuya.enum(10)})],
            [104, 'cleaning', tuya.valueConverter.raw]
        ],
    },
    extend: [   
       tuya.modernExtend.tuyaMagicPacket(),        
    ],
};

module.exports = definition;

