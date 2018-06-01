var MOTOR_SPECS = [
	{
		title: "Free Speed (RPM)",
		key: "free_rpm"
	},
	{
		title: "Free Current (A)",
		key: "free_current"
	},
	{
		title: "Max Power (W)",
		key: "max_power"
	},
	{
		title: "Stall Torque (N*m)",
		key: "stall_torque"
	},
	{
		title: "Stall Current (A)",
		key: "stall_current"
	},
	{
		title: "Weight (lbs)",
		key: "weight"
	}
];

var PEAK_POWER_SPECS = [
	{
		title: "Time",
		csv_key: "Time",
		key: "time",
		axis: 'time'
	},
	{
		title: "Power Output (W)",
		csv_key: "Power Output (W)",
		key: "power",
		axis: 'current-power'
	},
	{
		title: "Current (A)",
		csv_key: "Current (A)",
		key: "current",
		axis: 'current-power'
	}
];

var LOCKED_ROTOR_SPECS = [
	{
		title: "2v",
		csv_key: "2v",
		key: "2v",
		axis: "torque"
	},
	{
		title: "4v",
		csv_key: "4v",
		key: "4v",
		axis: "torque"
	},
	{
		title: "6v",
		csv_key: "6v",
		key: "6v",
		axis: "torque"
	},
	{
		title: "8v",
		csv_key: "8v",
		key: "8v",
		axis: "torque"
	},
	{
		title: "10v",
		csv_key: "10v",
		key: "10v",
		axis: "torque"
	},
	{
		title: "12v",
		csv_key: "12v",
		key: "12v",
		axis: "torque"
	}
];

var MOTOR_CURVE_SPECS = [
	{
		title: "Speed (RPM)",
		csv_key: "Speed (RPM)",
		key: "speed",
		axis: 'rpm'
	},
	{
		title: "Current (A)",
		csv_key: "Current (A)",
		key: "current",
		axis: 'current-power'
	},
	{
		title: "Efficiency (%)",
		csv_key: "Efficiency (%)",
		key: "efficiency",
		axis: 'efficiency'
	},
	{
		title: "Output Power (W)",
		csv_key: "Output Power (W)",
		key: "output_power",
		axis: 'current-power'
	},
	// {
	// 	title: "Power Dissipation (W)",
	// 	csv_key: "Power Dissipation (W)",
	// 	key: "power_disipation"
	// 	axis: 'current-power'
	// },
	// {
	// 	title: "Supplied Power (W)",
	// 	csv_key: "Supplied Power (W)",
	// 	key: "supplied_power",
	// 	axis: 'current-power'
	// },
	{
		title: "Torque (N*m)",
		csv_key: "Torque (N�m)",
		alt_key: "Torque (N·m)",
		key: "torque",
		axis: 'torque'
	}
];

var MOTORS = {
    "cim": {
    	key: "cim",
        name: "CIM Motor",
        stat_voltage: 12,
	    free_rpm: 5330,
	    stall_torque: 2.41,
	    stall_current: 131,
	    free_current: 2.7,
	    max_power: 337,
	    weight: 2.8,
        motor_curve_url: "motor_data/cim-motor-curve-data-20151104.csv",
        peak_power_url: "motor_data/cim-peak-power-data-20151104.csv",
        locked_rotor_url: "motor_data/cim-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/vexpro-motors/cim-motor",
        img: "http://content.vexrobotics.com/motors/Thumbnails/217-2000-motors.png"
    },
    "mini-cim": {
    	key: "mini-cim",
        name: "Mini CIM",
        stat_voltage: 12,
	    free_rpm: 5840,
	    stall_torque: 1.41,
	    stall_current: 89,
	    free_current: 3,
	    max_power: 215,
	    weight: 2.16,
        motor_curve_url: "motor_data/mini-cim-motor-curve-data-20151207.csv",
        peak_power_url: "motor_data/mini-cim-peak-power-data-20151207.csv",
        locked_rotor_url: "motor_data/mini-cim-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/vexpro-motors/mini-cim-motor",
        img: "http://content.vexrobotics.com/motors/Thumbnails/217-3371-motors.png"
    },
    "bag": {
    	key: "bag",
        name: "BAG Motor",
        stat_voltage: 12,
	    free_rpm: 13180,
	    stall_torque: 0.43,
	    stall_current: 53,
	    free_current: 1.8,
	    max_power: 149,
	    weight: 0.71,
        motor_curve_url: "motor_data/bag-motor-curve-data-20151207.csv",
        peak_power_url: "motor_data/bag-peak-power-data-20151207.csv",
        locked_rotor_url: "motor_data/bag-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/vexpro-motors/bag-motor",
        img: "http://content.vexrobotics.com/motors/Thumbnails/217-3351-motors.png"
    },
    "775pro": {
    	key: "775pro",
        name: "775 Pro",
        stat_voltage: 12,
	    free_rpm: 18730,
	    stall_torque: 0.71,
	    stall_current: 134,
	    free_current: 0.7,
	    max_power: 347,
	    weight: 0.8,
        motor_curve_url: "motor_data/775pro-motor-curve-data-20151208.csv",
        peak_power_url: "motor_data/775pro-peak-power-data-20151210.csv",
        locked_rotor_url: "motor_data/775pro-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/vexpro-motors/775pro",
        img: "http://content.vexrobotics.com/motors/Thumbnails/217-4347-motors.png"
    },
    "am-9015": {
    	key: "am-9015",
        name: "AndyMark 9015",
        stat_voltage: 12,
	    free_rpm: 14270,
	    stall_torque: 0.36,
	    stall_current: 71,
	    free_current: 3.7,
	    max_power: 134,
	    weight: 0.5,
        motor_curve_url: "motor_data/am-9015-motor-curve-data-20151208.csv",
        peak_power_url: "motor_data/am-9015-peak-power-data-20151208.csv",
        locked_rotor_url: "motor_data/am-9015-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/vexpro-motors/am-9015",
        img: "http://content.vexrobotics.com/motors/Thumbnails/AM-9015-motors.png"
    },
    "am-neverest": {
    	key: "am-neverest",
        name: "AndyMark NeveRest",
        stat_voltage: 12,
	    free_rpm: 5480,
	    stall_torque: 0.17,
	    stall_current: 10,
	    free_current: 0.4,
	    max_power: 25,
	    weight: 0.55,
        motor_curve_url: "motor_data/NeveRest-motor-curve-data-20171016.csv",
        peak_power_url: "motor_data/NeveRest-peak-power-data-20171016.csv",
        locked_rotor_url: "motor_data/NeveRest-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/vexpro-motors/am-NeveRest",
        img: "http://content.vexrobotics.com/motors/images/AM-NeveRest.png"
    },
    "am-775": {
    	key: "am-775",
        name: "AndyMark RS775-125",
        stat_voltage: 12,
	    free_rpm: 5800,
	    stall_torque: 0.28,
	    stall_current: 18,
	    free_current: 1.6,
	    max_power: 43,
	    weight: 0.78,
        motor_curve_url: "motor_data/am-775-motor-curve-data-20151209.csv",
        peak_power_url: "motor_data/am-775-peak-power-data-20151210.csv",
        locked_rotor_url: "motor_data/am-775-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/vexpro-motors/am-775",
        img: "http://content.vexrobotics.com/motors/Thumbnails/AM-775-motors.png"
    },
    "bb-775": {
    	key: "bb-775",
        name: "BaneBots RS-775 18V",
        stat_voltage: 12,
	    free_rpm: 13050,
	    stall_torque: 0.72,
	    stall_current: 97,
	    free_current: 2.7,
	    max_power: 246,
	    weight: 0.69,
        motor_curve_url: "motor_data/bb-775-motor-curve-data-20151208.csv",
        peak_power_url: "motor_data/bb-775-peak-power-data-20151208.csv",
        locked_rotor_url: "motor_data/bb-775-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/other-motors/bb-775",
        img: "http://content.vexrobotics.com/motors/Thumbnails/BB-775-motors.png"
    },
    "bb-550": {
    	key: "bb-550",
        name: "BaneBots RS-550",
        stat_voltage: 12,
	    free_rpm: 19000,
	    stall_torque: .38,
	    stall_current: 84,
	    free_current: 0.4,
	    max_power: 190,
	    weight: 0.48,
        motor_curve_url: "motor_data/bb-550-motor-curve-data-20160125.csv",
        peak_power_url: "motor_data/bb-550-peak-power-data-20160125.csv",
        locked_rotor_url: "motor_data/bb-550-locked-rotor-data.json",
        vex_url: "http://motors.vex.com/other-motors/bb-550",
        img: "http://content.vexrobotics.com/motors/Thumbnails/BB-550-motors.png"
    }
};