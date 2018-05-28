var SPECS = [
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
		key: "[power]",
		axis: 'current-power'
	},
	{
		title: "Current (A)",
		csv_key: "Current (A)",
		key: "current",
		axis: 'current-power'
	}
]

var CHART_SPECS = [
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
        img: "http://content.vexrobotics.com/motors/Thumbnails/217-3371-motors.png"
    },
    "bag": {
    	key: "bag",
        name: "BAG Motor",
        stat_voltage: 12,
	    free_rpm: 18730,
	    stall_torque: 0.71,
	    stall_current: 134,
	    free_current: 0.7,
	    max_power: 347,
	    weight: 0.71,
        motor_curve_url: "motor_data/bag-motor-curve-data-20151207.csv",
        peak_power_url: "motor_data/bag-peak-power-data-20151207.csv",
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
        img: "http://content.vexrobotics.com/motors/Thumbnails/217-4347-motors.png"
    },
    "am_9015": {
    	key: "am_9015",
        name: "AndyMark 9015",
        stat_voltage: 12,
	    free_rpm: 14270,
	    stall_torque: 0.36,
	    stall_current: 71,
	    free_current: 3.7,
	    max_power: 134,
	    weight: 0.5,
        motor_curve_url: "motor_data/775pro-motor-curve-data-20151207.csv",
        peak_power_url: "motor_data/775pro-peak-power-data-20151207.csv",
        img: "http://content.vexrobotics.com/motors/Thumbnails/AM-9015-motors.png"
    },
    "am_neverest": {
    	key: "am_neverest",
        name: "AndyMark NeveRest",
        stat_voltage: 12,
	    free_rpm: 5480,
	    stall_torque: 0.17,
	    stall_current: 10,
	    free_current: 0.4,
	    max_power: 25,
	    weight: 0.55,
        motor_curve_url: "motor_data/775pro-motor-curve-data-20151208.csv",
        peak_power_url: "motor_data/775pro-peak-power-data-20151210.csv",
        img: "https://content.vexrobotics.com/motors/images/AM-NeveRest.png"
    },
    "am_rs775_125": {
    	key: "am_rs775_125",
        name: "AndyMark RS775-125",
        stat_voltage: 12,
	    free_rpm: 5800,
	    stall_torque: 0.28,
	    stall_current: 18,
	    free_current: 1.6,
	    max_power: 43,
	    weight: 0.78,
        motor_curve_url: "motor_data/775pro-motor-curve-data-20151208.csv",
        peak_power_url: "motor_data/775pro-peak-power-data-20151210.csv",
        img: "http://content.vexrobotics.com/motors/Thumbnails/AM-775-motors.png"
    },
    "bb_rs775_18v": {
    	key: "bb_rs775_18v",
        name: "BaneBots RS-775 18V",
        stat_voltage: 12,
	    free_rpm: 13050,
	    stall_torque: 0.72,
	    stall_current: 97,
	    free_current: 2.7,
	    max_power: 246,
	    weight: 0.69,
        motor_curve_url: "motor_data/775pro-motor-curve-data-20151208.csv",
        peak_power_url: "motor_data/775pro-peak-power-data-20151210.csv",
        img: "http://content.vexrobotics.com/motors/Thumbnails/BB-775-motors.png"
    },
    "bb_rs550": {
    	key: "bb_rs550",
        name: "BaneBots RS-550",
        stat_voltage: 12,
	    free_rpm: 19000,
	    stall_torque: .38,
	    stall_current: 84,
	    free_current: 0.4,
	    max_power: 190,
	    weight: 0.48,
        motor_curve_url: "motor_data/775pro-motor-curve-data-20151208.csv",
        peak_power_url: "motor_data/775pro-peak-power-data-20151210.csv",
        img: "http://content.vexrobotics.com/motors/Thumbnails/BB-550-motors.png"
    }
};