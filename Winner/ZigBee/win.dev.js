const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');
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
                statusBatterySignal:    (Boolean)(v & 0b00000000_00100000_00000000_00000000)    // `true` in case of low battery charge 
                                                                                                //  or sensor not responding in 20+ hours
            }
        },
        to: (v) => {
            return 0x03_00_00_00; 
        }
    },
    waterMeter: {
        from: (v) => { return v & 0b00000111_11111111_11111111_11111111; },
        to: (v) => { return Number.parseInt(v); }
    }
}

const tzDatapoints = {
    ...tuya.tz.datapoints,
    key: [
        'switch', 'percent_control', 'fault', 'weather_delay', 'countdown', 
        'smart_weather', 'minihum_set', 'alarm', 'battery', 'cleaning', 
        'journal', 'channel_2', 'device_cmd',
        'sensor_1',     'sensor_name_1', 
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

const fzDatapoints = {
    ...tuya.fz.datapoints,
    key: [
        'switch', 'percent_control', 'fault', 'weather_delay', 'countdown', 
        'smart_weather', 'minihum_set', 'alarm', 'battery', 'cleaning', 
        'journal', 'channel_2', 'device_cmd',
        'sensor_1',     'sensor_name_1', 
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
    fromZigbee: [fzDatapoints],
    toZigbee: [tzDatapoints],
    onEvent: tuya.onEventSetTime,
    exposes: [
        exposes.presets.enum('fault', ea.STATE, ['low_battery', 'fault', 'lack_water', 'sensor_fault', 'motor_fault', 'low_temp']).withCategory('diagnostic').withDescription("Tuya build-in fault codes."),
        exposes.presets.binary('switch', ea.STATE_SET, true, false ).withLabel('Valve status'),
        exposes.presets.binary('cleaning', ea.STATE_SET, true, false).withLabel('Cleaning Mode status'),
        exposes.presets.binary('alarm', ea.STATE_SET, true, false).withDescription('Can turn the alarm off, but not on. Use External vendor sensor for that.'),
        exposes.presets.enum('battery', ea.STATE, ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', 'Plugged In']),

        exposes.presets.binary('channel_2', ea.STATE_SET, true, false).withLabel("External vendor sensor").withDescription("A DP to trigger alarm via Smart Life scenes. Triggers alarm on true, but does not turn the alarm off."),

        //exposes.presets.enum('weather_delay', ea.STATE_SET, ['1', '10']).withLabel("Multiplier 1").withDescription("Water meter multiplier"),
        exposes.presets.numeric('countdown', ea.SET).withLabel("Water Meter 1"),

        //exposes.presets.enum('smart_weather', ea.STATE_SET, ['1', '10']).withLabel("Multiplier 2").withDescription("Water meter multiplier"),
        exposes.presets.numeric('minihum_set', ea.STATE_SET).withLabel("Water Meter 2"),

        exposes.presets.numeric('device_cmd', ea.STATE).withLabel("Device CMD").withDescription("Used to issue commands to the device."),

        //#region Sensor Fields

        exposes.presets.text('sensor_name_01', ea.STATE_SET),
        exposes.presets.composite('sensor_01', 'sensor_1', ea.STATE).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_02', ea.STATE_SET),
        exposes.presets.composite('sensor_02', 'sensor_2',  ea.STATE).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Binary('securityMode', ea.SET, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_03', ea.STATE_SET),
        exposes.presets.composite('sensor_03', 'sensor_3', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_04', ea.STATE_SET),
        exposes.presets.composite('sensor_04', 'sensor_4', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_05', ea.STATE_SET),
        exposes.presets.composite('sensor_05', 'sensor_5', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_06', ea.STATE_SET),
        exposes.presets.composite('sensor_06', 'sensor_6', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_07', ea.STATE_SET),
        exposes.presets.composite('sensor_07', 'sensor_7', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_08', ea.STATE_SET),
        exposes.presets.composite('sensor_08', 'sensor_8', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_09', ea.STATE_SET),
        exposes.presets.composite('sensor_09', 'sensor_9', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_10', ea.STATE_SET),
        exposes.presets.composite('sensor_10', 'sensor_10', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),
        
        exposes.presets.text('sensor_name_11', ea.STATE_SET),
        exposes.presets.composite('sensor_11', 'sensor_11', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_12', ea.STATE_SET),
        exposes.presets.composite('sensor_12', 'sensor_12', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_13', ea.STATE_SET),
        exposes.presets.composite('sensor_13', 'sensor_13', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_14', ea.STATE_SET),
        exposes.presets.composite('sensor_14', 'sensor_14', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_15', ea.STATE_SET),
        exposes.presets.composite('sensor_15', 'sensor_15', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_16', ea.STATE_SET),
        exposes.presets.composite('sensor_16', 'sensor_16', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_17', ea.STATE_SET),
        exposes.presets.composite('sensor_17', 'sensor_17', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_18', ea.STATE_SET),
        exposes.presets.composite('sensor_18', 'sensor_18', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_19', ea.STATE_SET),
        exposes.presets.composite('sensor_19', 'sensor_19', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_20', ea.STATE_SET),
        exposes.presets.composite('sensor_20', 'sensor_20', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_21', ea.STATE_SET),
        exposes.presets.composite('sensor_21', 'sensor_21', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_22', ea.STATE_SET),
        exposes.presets.composite('sensor_22', 'sensor_22', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_23', ea.STATE_SET),
        exposes.presets.composite('sensor_23', 'sensor_23', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_24', ea.STATE_SET),
        exposes.presets.composite('sensor_24', 'sensor_24', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_25', ea.STATE_SET),
        exposes.presets.composite('sensor_25', 'sensor_25', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_26', ea.STATE_SET),
        exposes.presets.composite('sensor_26', 'sensor_26', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_27', ea.STATE_SET),
        exposes.presets.composite('sensor_27', 'sensor_27', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_28', ea.STATE_SET),
        exposes.presets.composite('sensor_28', 'sensor_28', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_29', ea.STATE_SET),
        exposes.presets.composite('sensor_29', 'sensor_29', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_30', ea.STATE_SET),
        exposes.presets.composite('sensor_30', 'sensor_30', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_31', ea.STATE_SET),
        exposes.presets.composite('sensor_31', 'sensor_31', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),

        exposes.presets.text('sensor_name_32', ea.STATE_SET),
        exposes.presets.composite('sensor_32', 'sensor_32', ea.STATE).withFeature(new Binary('isOnline', ea.STATE, true, false)).withFeature(new Binary('leakDetected', ea.STATE, true, false)).withFeature(new Numeric('signal', ea.STATE)).withFeature(new Numeric('battery', ea.STATE)).withFeature(new Binary('securityMode', ea.STATE_SET, true, false)).withFeature(new Binary('statusBatterySignal', ea.STATE, true, false)).withFeature(new Binary('ignoreLeaks', ea.STATE_SET, true, false)),
        
    ],
    meta: {
        tuyaDatapoints: [
            [1, 'switch', tuya.valueConverter.raw],
            //[2, 'percent_control', tuya.valueConverter.raw], //don't even know what this is
            [4, 'fault', tuya.valueConverter.raw],
            [10, 'weather_delay', tuya.valueConverter.raw],
            [11, 'countdown', convLocal.waterMeter],
            [13, 'smart_weather', tuya.valueConverter.raw],
            [21, 'minihum_set', convLocal.waterMeter],
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
                    'Plugged in': tuya.enum(10)}
                )
            ],

            //#region Device CMD
            /**
             * 
             * Device_CMD: a numeric DP used to issue commands to Winner.
             * Useless as is, but you can try to use it to issue commands via MQTT 
             * 
             * 
             * 
             * Gidrolock Sensors Only; 
             * Last byte is used for the sensor number (1-32), e.g: 0x01_00_00_0F - replace sensor 15
             * 
             * 0x01_00_00_00 - добавление/замена датчика (замкнуть контакты WSR) | adding/replacing sensor (close the circuit on WSR)                   
             * 
             * WIP!!! 
             * 0x02_00_00_00 - удаление датчика | remove sensor
             * 0x03_00_00_00 - включить игнор аварии датчика | enable ignore alarm on specific sensor
             * 0x04_00_00_00 - отключить игнор аварии датчика | disable ignore alarm on specific sensor
             * 0x05_00_00_00 - включить режим повышенной безопасности для датчика | enable enhanced security mode on specific sensor
             * 0x06_00_00_00 - выключить режим повышенной безопасности для датчика | disable enhanced security mode on specific sensor
             * 
             * 0x12_00_00_01 - открыть кран при аварии | open the valve during an alarm
             */
            [103, 'device_cmd', tuya.valueConverter.raw],

            [104, 'cleaning', tuya.valueConverter.raw],

            /*  Journal DP: the device will post a string in this DP in format "sensor name; x" where x is a special character: 
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
            //[105, 'journal', tuya.valueConverter.raw] 
            
            [106, 'channel_2', tuya.valueConverter.raw], 

            //#region Sensors DPs
            [107, 'sensor_1', convLocal.gidrolockWinnerSensor],
            [108, 'sensor_name_1', tuya.valueConverter.raw],
            
            [109, 'sensor_2', convLocal.gidrolockWinnerSensor],
            [110, 'sensor_name_2', tuya.valueConverter.raw],
            
            [111, 'sensor_3', convLocal.gidrolockWinnerSensor],
            [112, 'sensor_name_3', tuya.valueConverter.raw],

            [113, 'sensor_4', convLocal.gidrolockWinnerSensor],
            [114, 'sensor_name_4', tuya.valueConverter.raw],

            [115, 'sensor_5', convLocal.gidrolockWinnerSensor],
            [116, 'sensor_name_5', tuya.valueConverter.raw],
            
            [117, 'sensor_6', convLocal.gidrolockWinnerSensor],
            [118, 'sensor_name_6', tuya.valueConverter.raw],
            
            [119, 'sensor_7', convLocal.gidrolockWinnerSensor],
            [120, 'sensor_name_7', tuya.valueConverter.raw],
            
            [121, 'sensor_8', convLocal.gidrolockWinnerSensor],
            [122, 'sensor_name_8', tuya.valueConverter.raw],
            
            [123, 'sensor_9', convLocal.gidrolockWinnerSensor],
            [124, 'sensor_name_9', tuya.valueConverter.raw],
            
            [125, 'sensor_10', convLocal.gidrolockWinnerSensor],
            [126, 'sensor_name_10', tuya.valueConverter.raw],
            
            [127, 'sensor_11', convLocal.gidrolockWinnerSensor],
            [128, 'sensor_name_11', tuya.valueConverter.raw],
            
            [129, 'sensor_12', convLocal.gidrolockWinnerSensor],
            [130, 'sensor_name_12', tuya.valueConverter.raw],
            
            [131, 'sensor_13', convLocal.gidrolockWinnerSensor],
            [132, 'sensor_name_13', tuya.valueConverter.raw],
            
            [133, 'sensor_14', convLocal.gidrolockWinnerSensor],
            [134, 'sensor_name_14', tuya.valueConverter.raw],
            
            [135, 'sensor_15', convLocal.gidrolockWinnerSensor],
            [136, 'sensor_name_15', tuya.valueConverter.raw],
            
            [137, 'sensor_16', convLocal.gidrolockWinnerSensor],
            [138, 'sensor_name_16', tuya.valueConverter.raw],
            
            [139, 'sensor_17', convLocal.gidrolockWinnerSensor],
            [140, 'sensor_name_17', tuya.valueConverter.raw],
            
            [141, 'sensor_18', convLocal.gidrolockWinnerSensor],
            [142, 'sensor_name_18', tuya.valueConverter.raw],
            
            [143, 'sensor_19', convLocal.gidrolockWinnerSensor],
            [144, 'sensor_name_19', tuya.valueConverter.raw],
            
            [145, 'sensor_20', convLocal.gidrolockWinnerSensor],
            [146, 'sensor_name_20', tuya.valueConverter.raw],
            
            [147, 'sensor_21', convLocal.gidrolockWinnerSensor],
            [148, 'sensor_name_21', tuya.valueConverter.raw],
            
            [149, 'sensor_22', convLocal.gidrolockWinnerSensor],
            [150, 'sensor_name_22', tuya.valueConverter.raw],
            
            [151, 'sensor_23', convLocal.gidrolockWinnerSensor],
            [152, 'sensor_name_23', tuya.valueConverter.raw],
            
            [153, 'sensor_24', convLocal.gidrolockWinnerSensor],
            [154, 'sensor_name_24', tuya.valueConverter.raw],
            
            [155, 'sensor_25', convLocal.gidrolockWinnerSensor],
            [156, 'sensor_name_25', tuya.valueConverter.raw],
            
            [157, 'sensor_26', convLocal.gidrolockWinnerSensor],
            [158, 'sensor_name_26', tuya.valueConverter.raw],
            
            [159, 'sensor_27', convLocal.gidrolockWinnerSensor],
            [160, 'sensor_name_27', tuya.valueConverter.raw],
            
            [161, 'sensor_28', convLocal.gidrolockWinnerSensor],
            [162, 'sensor_name_28', tuya.valueConverter.raw],
            
            [163, 'sensor_29', convLocal.gidrolockWinnerSensor],
            [164, 'sensor_name_29', tuya.valueConverter.raw],
            
            [165, 'sensor_30', convLocal.gidrolockWinnerSensor],
            [166, 'sensor_name_30', tuya.valueConverter.raw],
            
            [167, 'sensor_31', convLocal.gidrolockWinnerSensor],
            [168, 'sensor_name_31', tuya.valueConverter.raw],
            
            [169, 'sensor_32', convLocal.gidrolockWinnerSensor],
            [170, 'sensor_name_32', tuya.valueConverter.raw],
           //#endregion
        ],
    },
    extend: [   
       tuya.modernExtend.tuyaMagicPacket(),
    ],
};

module.exports = definition;
