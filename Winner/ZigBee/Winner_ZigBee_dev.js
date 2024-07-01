const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const modernExtend = require('zigbee-herdsman-converters/lib/modernExtend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const exp = require('constants');
const { Numeric } = require('zigbee-herdsman-converters/lib/exposes');
const { Binary } = require('zigbee-herdsman-converters/lib/exposes');

const convLocal = {
    gidrolockWinnerSensor: {
        from: (v) => {
            return {
                signal:                 (v & 0x00_00_00_FF),
                battery:                (v & 0x00_00_FF_00),

                isOnline:               (Boolean)(v & 0b00000000_00000010_00000000_00000000),
                leakDetected:           (Boolean)(v & 0b00000000_00000100_00000000_00000000),
                ignoreLeaks:            (Boolean)(v & 0b00000000_00001000_00000000_00000000),
                securityMode:           (Boolean)(v & 0b00000000_00010000_00000000_00000000),
                statusBatterySignal:    (Boolean)(v & 0b00000000_00100000_00000000_00000000)
            }
        },
        to: (v) => {
            let result = '0000000000' + Number(v.statusBatterySignal) + Number(v.securityMode) + Number(v.ignoreLeaks) + Number(v.leakDetected) + Number(v.isOnline) + Number(v.battery).toString(2).padStart(8, '0') + Number(v.signal).toString(2).padStart(8, '0');
            return result;
        }
    }
}

const tzDatapoints = {
    ...tuya.tz.datapoints,
    key: ['switch', 'percent_control', 'fault', 'weather_delay', 'countdown', 'smart_weather', 'minihum_set', 'alarm', 'battery', 'cleaning', 'journal', 'channel_2',
        'sensor_1', 'sensor_1.signal',     'sensor_name_1', 
        'sensor_2',     'sensor_name_2', 
        'sensor_3',     'sensor_name_3', 
        'sensor_4',     'sensor_name_4', 
        'sensor_5',     'sensor_name_5', 
        'sensor_6',     'sensor_name_6', 
        'sensor_7',     'sensor_name_7', 
        'sensor_8',     'sensor_name_8', 
        'sensor_9',     'sensor_name_9', 
        'sensor_10',    'sensor_name_10', 
        'sensor_11',    'sensor_name_11', 
        'sensor_12',    'sensor_name_12', 
        'sensor_13',    'sensor_name_13', 
        'sensor_14',    'sensor_name_14', 
        'sensor_15',    'sensor_name_15', 
        'sensor_16',    'sensor_name_16',
        'sensor_17',    'sensor_name_17', 
        'sensor_18',    'sensor_name_18', 
        'sensor_19',    'sensor_name_19', 
        'sensor_20',    'sensor_name_20', 
        'sensor_21',    'sensor_name_21', 
        'sensor_22',    'sensor_name_22', 
        'sensor_23',    'sensor_name_23', 
        'sensor_24',    'sensor_name_24', 
        'sensor_25',    'sensor_name_25', 
        'sensor_26',    'sensor_name_26', 
        'sensor_27',    'sensor_name_27', 
        'sensor_28',    'sensor_name_28', 
        'sensor_29',    'sensor_name_29', 
        'sensor_30',    'sensor_name_30', 
        'sensor_31',    'sensor_name_31', 
        'sensor_32',    'sensor_name_32' 
    ]
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
        exposes.presets.binary('switch', ea.STATE_SET, true, false ).withLabel('Valve status'),
        exposes.presets.binary('cleaning', ea.STATE_SET, true, false).withLabel('Cleaning Mode:'),
        exposes.presets.binary('alarm', ea.STATE_SET, true, false).withDescription('Can not turn the alarm on. Use External vendor sensor for that.'),
        exposes.presets.enum('battery', ea.STATE, ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', 'Plugged In']),

        exposes.presets.binary('channel_2', 0b010, true, false).withLabel("External vendor sensor").withDescription("A DP for an extra wired sensor. Triggers alarm on true."),

        //#region Sensors fields
        exposes.presets.text('sensor_name_1', ea.STATE_SET),
        exposes.presets.composite('sensor_1', 'sensor_1', ea.ALL).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_2', ea.ALL),
        exposes.presets.composite('sensor_2', 'sensor_2', ea.ALL).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_3', ea.ALL),
        exposes.presets.composite('sensor_3', 'sensor_3', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_4', ea.ALL),
        exposes.presets.composite('sensor_4', 'sensor_4', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_5', ea.ALL),
        exposes.presets.composite('sensor_5', 'sensor_5', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_6', ea.ALL),
        exposes.presets.composite('sensor_6', 'sensor_6', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_7', ea.ALL),
        exposes.presets.composite('sensor_7', 'sensor_7', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_8', ea.ALL),
        exposes.presets.composite('sensor_8', 'sensor_8', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_9', ea.ALL),
        exposes.presets.composite('sensor_9', 'sensor_9', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_10', ea.ALL),
        exposes.presets.composite('sensor_10', 'sensor_10', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),
        
        exposes.presets.text('sensor_name_11', ea.ALL),
        exposes.presets.composite('sensor_11', 'sensor_11', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_12', ea.ALL),
        exposes.presets.composite('sensor_12', 'sensor_12', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_13', ea.ALL),
        exposes.presets.composite('sensor_13', 'sensor_13', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_14', ea.ALL),
        exposes.presets.composite('sensor_14', 'sensor_14', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_15', ea.ALL),
        exposes.presets.composite('sensor_15', 'sensor_15', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_16', ea.ALL),
        exposes.presets.composite('sensor_16', 'sensor_16', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_17', ea.ALL),
        exposes.presets.composite('sensor_17', 'sensor_17', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_18', ea.ALL),
        exposes.presets.composite('sensor_18', 'sensor_18', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_19', ea.ALL),
        exposes.presets.composite('sensor_19', 'sensor_19', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_20', ea.ALL),
        exposes.presets.composite('sensor_20', 'sensor_20', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_21', ea.ALL),
        exposes.presets.composite('sensor_21', 'sensor_21', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_22', ea.ALL),
        exposes.presets.composite('sensor_22', 'sensor_22', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_23', ea.ALL),
        exposes.presets.composite('sensor_23', 'sensor_23', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_24', ea.ALL),
        exposes.presets.composite('sensor_24', 'sensor_24', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_25', ea.ALL),
        exposes.presets.composite('sensor_25', 'sensor_25', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_26', ea.ALL),
        exposes.presets.composite('sensor_26', 'sensor_26', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_27', ea.ALL),
        exposes.presets.composite('sensor_27', 'sensor_27', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_28', ea.ALL),
        exposes.presets.composite('sensor_28', 'sensor_28', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_29', ea.ALL),
        exposes.presets.composite('sensor_29', 'sensor_29', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_30', ea.ALL),
        exposes.presets.composite('sensor_30', 'sensor_30', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_31', ea.ALL),
        exposes.presets.composite('sensor_31', 'sensor_31', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_32', ea.ALL),
        exposes.presets.composite('sensor_32', 'sensor_32', ea.ALL).withFeature(new Numeric('signal', ea.STATE_GET)).withFeature(new Numeric('battery', ea.STATE_GET)).withFeature(new Binary('isOnline', ea.GET, true, false)).withFeature(new Binary('leakDetected', ea.GET, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.GET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),
        //#endregion
    ],
    meta: {
        tuyaDatapoints: [
            [1, 'switch', tuya.valueConverter.raw],
            //[2, 'percent_control', tuya.valueConverter.raw], //don't even know what this is
            [4, 'fault', tuya.valueConverter.raw],
            [10, 'weather_delay', tuya.valueConverter.raw],
            [11, 'countdown', tuya.valueConverter.raw],
            [13, 'smart_weather', tuya.valueConverter.raw],
            [21, 'minihum_set', tuya.valueConverter.raw],
            [101, 'alarm', tuya.valueConverter.raw],
            [102, 
                'battery', 
                tuya.valueConverterBasic.lookup({
                    10: tuya.enum(0), 
                    20: tuya.enum(1), 
                    30: tuya.enum(2), 
                    40: tuya.enum(3), 
                    50: tuya.enum(4), 
                    60: tuya.enum(5), 
                    70: tuya.enum(6), 
                    80: tuya.enum(7), 
                    90: tuya.enum(8), 
                    100: tuya.enum(9), 
                    'Plugged in': tuya.enum(10)})],

            
            /* 
            *   Device_CMD: Used by Smart Life app for Winner 
            *   to issue commands. 
            *   TODO: list all hexcodes for commands
            *  
            */
            //[103, 'device_cmd', tuya.valueConverter.raw],

            [104, 'cleaning', tuya.valueConverter.raw],

            /*  Journal DP: the device will post a string in this DP in format "x; sensor name" where x is a special character: 
            *   A - regular leak event
            *   L - sensor battery charge low
            *   T - sensor signal lost
            *   B - device(!) battery charge low
            * 
            *   These values are displayed VERY BRIEFLY 
            *   to utilize Tuya's DP log in the Smart Life app for Winner. 
            *   Unless you have a log of your own to track the values,
            *   this field is practically useless.
            */
            //[105, 'journal', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})] 
            
            [106, 'channel_2', tuya.valueConverter.raw], 

            //#region Sensors DPs
            [107, 'sensor_1', convLocal.gidrolockWinnerSensor],
            [108, 'sensor_name_1', tuya.valueConverter.raw],
            
            [109, 'sensor_2', convLocal.gidrolockWinnerSensor],
            [110, 'sensor_name_2', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [111, 'sensor_3', convLocal.gidrolockWinnerSensor],
            [112, 'sensor_name_3', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],

            [113, 'sensor_4', convLocal.gidrolockWinnerSensor],
            [114, 'sensor_name_4', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],

            [115, 'sensor_5', convLocal.gidrolockWinnerSensor],
            [116, 'sensor_name_5', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [117, 'sensor_6', convLocal.gidrolockWinnerSensor],
            [118, 'sensor_name_6', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [119, 'sensor_7', convLocal.gidrolockWinnerSensor],
            [120, 'sensor_name_7', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [121, 'sensor_8', convLocal.gidrolockWinnerSensor],
            [122, 'sensor_name_8', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [123, 'sensor_9', convLocal.gidrolockWinnerSensor],
            [124, 'sensor_name_9', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [125, 'sensor_10', convLocal.gidrolockWinnerSensor],
            [126, 'sensor_name_10', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [127, 'sensor_11', convLocal.gidrolockWinnerSensor],
            [128, 'sensor_name_11', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [129, 'sensor_12', convLocal.gidrolockWinnerSensor],
            [130, 'sensor_name_12', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [131, 'sensor_13', convLocal.gidrolockWinnerSensor],
            [132, 'sensor_name_13', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [133, 'sensor_14', convLocal.gidrolockWinnerSensor],
            [134, 'sensor_name_14', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [135, 'sensor_15', convLocal.gidrolockWinnerSensor],
            [136, 'sensor_name_15', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [137, 'sensor_16', convLocal.gidrolockWinnerSensor],
            [138, 'sensor_name_16', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [139, 'sensor_17', convLocal.gidrolockWinnerSensor],
            [140, 'sensor_name_17', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [141, 'sensor_18', convLocal.gidrolockWinnerSensor],
            [142, 'sensor_name_18', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [143, 'sensor_19', convLocal.gidrolockWinnerSensor],
            [144, 'sensor_name_19', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [145, 'sensor_20', convLocal.gidrolockWinnerSensor],
            [146, 'sensor_name_20', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [147, 'sensor_21', convLocal.gidrolockWinnerSensor],
            [148, 'sensor_name_21', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [149, 'sensor_22', convLocal.gidrolockWinnerSensor],
            [150, 'sensor_name_22', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [151, 'sensor_23', convLocal.gidrolockWinnerSensor],
            [152, 'sensor_name_23', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [153, 'sensor_24', convLocal.gidrolockWinnerSensor],
            [154, 'sensor_name_24', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [155, 'sensor_25', convLocal.gidrolockWinnerSensor],
            [156, 'sensor_name_25', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [157, 'sensor_26', convLocal.gidrolockWinnerSensor],
            [158, 'sensor_name_26', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [159, 'sensor_27', convLocal.gidrolockWinnerSensor],
            [160, 'sensor_name_27', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [161, 'sensor_28', convLocal.gidrolockWinnerSensor],
            [162, 'sensor_name_28', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [163, 'sensor_29', convLocal.gidrolockWinnerSensor],
            [164, 'sensor_name_29', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [165, 'sensor_30', convLocal.gidrolockWinnerSensor],
            [166, 'sensor_name_30', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [167, 'sensor_31', convLocal.gidrolockWinnerSensor],
            [168, 'sensor_name_31', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
            
            [169, 'sensor_32', convLocal.gidrolockWinnerSensor],
            [170, 'sensor_name_32', tuya.valueConverterBasic.lookup({'single': 0, 'double': 1, 'hold': 2})],
           //#endregion
        ],
    },
    extend: [   
       tuya.modernExtend.tuyaMagicPacket(),
    ],
};

module.exports = definition;
