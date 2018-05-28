var app = angular.module('app');

app.controller('CompareController', function ($scope, $location, MotorDataService) {    
    var motor_curve_data = {};
    var peak_power_data = {};
    var locked_rotor_data = {};

    $scope.gear_ratio = {};
    $scope.voltage_limit = {};
    $scope.num_motors = {};
    $scope.display = {};

    $scope.motor_curve_specs = MOTOR_CURVE_SPECS;
    $scope.motor_curve_display = {}
    MOTOR_CURVE_SPECS.forEach(function(spec){
        $scope.motor_curve_display[spec.key] = true;
    });
    $scope.peak_power_specs = PEAK_POWER_SPECS;
    $scope.peak_power_display = {}
    PEAK_POWER_SPECS.forEach(function(spec){
        $scope.peak_power_display[spec.key] = true;
    });
    $scope.locked_rotor_specs = LOCKED_ROTOR_SPECS;
    $scope.locked_rotor_display = {}
    LOCKED_ROTOR_SPECS.forEach(function(spec){
        $scope.locked_rotor_display[spec.key] = true;
    });

    $scope.motors.forEach(function(motor){
        $scope.gear_ratio[motor.key] = 1;
        $scope.voltage_limit[motor.key] = motor.stat_voltage;
        $scope.num_motors[motor.key] = 1;
        $scope.display[motor.key] = false;

        MotorDataService.getMotorPowerCurve(motor.key)
            .then(function(data){
                motor_curve_data[motor.key] = {}
                MOTOR_CURVE_SPECS.forEach(function(spec){
                    var vals = data[spec.csv_key];
                    if(vals === undefined){
                        vals = data[spec.alt_key];
                    }
                    if(vals !== undefined){
                        motor_curve_data[motor.key][spec.key] = vals.map(function(e, i){
                            return {
                                x: data[MOTOR_CURVE_SPECS[0].csv_key][i],
                                y: e
                            }
                        });
                    }
                });
                $scope.loadLines();
            });
        MotorDataService.getMotorPeakPower(motor.key)
            .then(function(data){
                peak_power_data[motor.key] = {}
                PEAK_POWER_SPECS.forEach(function(spec){
                    var vals = data[spec.csv_key];
                    if(vals === undefined){
                        vals = data[spec.alt_key];
                    }
                    if(vals !== undefined){
                        peak_power_data[motor.key][spec.key] = vals.map(function(e, i){
                            return {
                                x: data[PEAK_POWER_SPECS[0].csv_key][i],
                                y: e
                            }
                        });
                    }
                });
                $scope.loadLines();
            });
        MotorDataService.getMotorLockedRotor(motor.key)
            .then(function(data){
                locked_rotor_data[motor.key] = {}
                LOCKED_ROTOR_SPECS.forEach(function(spec){
                    var vals = data[spec.csv_key];
                    if(vals === undefined){
                        vals = data[spec.alt_key];
                    }
                    if(vals !== undefined){
                        locked_rotor_data[motor.key][spec.key] = vals;
                    }
                });
                $scope.loadLines();
            });
    });

    $scope.motor_curve_colours = {};
    genColors(MOTOR_CURVE_SPECS.length-1).forEach(function(c, i){
        $scope.motor_curve_colours[MOTOR_CURVE_SPECS[i+1].key] = c;
    });

    $scope.peak_power_colours = {};
    genColors(PEAK_POWER_SPECS.length-1).forEach(function(c, i){
        $scope.peak_power_colours[PEAK_POWER_SPECS[i+1].key] = c;
    });
    
    $scope.locked_rotor_colours = {};
    genColors(LOCKED_ROTOR_SPECS.length).forEach(function(c, i){
        $scope.locked_rotor_colours[LOCKED_ROTOR_SPECS[i].key] = c;
    });

    $scope.line_types = [[100000, 1], [20, 5], [2, 2], [10, 2]];
    for (var i = $scope.line_types.length; i < $scope.motors.length; i++) {
        $scope.line_types.push($scope.line_types[$scope.line_types.length - 1].concat([2, 3]));
    }

    $scope.loadLines = function () {
        $scope.motor_curve_series = [];
        $scope.motor_curve_data = [];
        $scope.motor_curve_labels = [];
        $scope.motor_curve_datasetOverride = [];

        $scope.peak_power_series = [];
        $scope.peak_power_data = [];
        $scope.peak_power_labels = [];
        $scope.peak_power_datasetOverride = [];

        $scope.locked_rotor_series = [];
        $scope.locked_rotor_data = [];
        $scope.locked_rotor_labels = [];
        $scope.locked_rotor_datasetOverride = [];

        $scope.motors.forEach(function(motor, j){
            MOTOR_CURVE_SPECS.forEach(function(spec, i){
                if(i > 0 && motor_curve_data[motor.key] !== undefined && $scope.display[motor.key] && $scope.motor_curve_display[spec.key]){
                    $scope.motor_curve_series.push(motor.name + " " + spec.title);
                    $scope.motor_curve_labels.push(motor.name + " " + spec.title);
                    var data = angular.copy(motor_curve_data[motor.key][spec.key]);
                    data.map(function(e){
                        e.x = e.x / $scope.gear_ratio[motor.key] * ($scope.voltage_limit[motor.key] / motor.stat_voltage);
                        if(spec.key == "speed"){
                            e.y = e.y / $scope.gear_ratio[motor.key] * ($scope.voltage_limit[motor.key] / motor.stat_voltage);
                        }
                        if(spec.key == "torque"){
                            e.y = e.y * $scope.gear_ratio[motor.key] * ($scope.voltage_limit[motor.key] / motor.stat_voltage) * $scope.num_motors[motor.key];
                        }
                        if(spec.key == "power" || spec.key == "current"){
                            e.y = e.y * ($scope.voltage_limit[motor.key] / motor.stat_voltage) * $scope.num_motors[motor.key];
                        }
                        return e;
                    });
                    $scope.motor_curve_data.push(data);
                    $scope.motor_curve_datasetOverride.push({
                        series: spec.title,
                        yAxisID: spec.axis,
                        pointRadius: 0.01,
                        fill: false,
                        fillColor: $scope.motor_curve_colours[spec.key],
                        borderColor: $scope.motor_curve_colours[spec.key],
                        borderDash: $scope.line_types[j],
                        backgroundColor: $scope.motor_curve_colours[spec.key],
                        pointHoverBackgroundColor: $scope.motor_curve_colours[spec.key],
                        pointHoverBorderColor: $scope.motor_curve_colours[spec.key],
                        pointHoverRadius: 5
                    });
                }
            });

            PEAK_POWER_SPECS.forEach(function(spec, i){
                if(i > 0 && peak_power_data[motor.key] !== undefined && $scope.display[motor.key] && $scope.peak_power_display[spec.key]){
                    $scope.peak_power_series.push(motor.name + " " + spec.title);
                    $scope.peak_power_labels.push(motor.name + " " + spec.title);
                    $scope.peak_power_data.push(angular.copy(peak_power_data[motor.key][spec.key]));
                    $scope.peak_power_datasetOverride.push({
                        yAxisID: spec.axis,
                        pointRadius: 0.01,
                        fill: false,
                        fillColor: $scope.peak_power_colours[spec.key],
                        borderColor: $scope.peak_power_colours[spec.key],
                        borderDash: $scope.line_types[j],
                        backgroundColor: $scope.peak_power_colours[spec.key],
                        pointHoverBackgroundColor: $scope.peak_power_colours[spec.key],
                        pointHoverBorderColor: $scope.peak_power_colours[spec.key],
                        pointHoverRadius: 5
                    });
                }
            });

            LOCKED_ROTOR_SPECS.forEach(function(spec, i){
                if(locked_rotor_data[motor.key] !== undefined && $scope.display[motor.key] && $scope.locked_rotor_display[spec.key]){
                    $scope.locked_rotor_series.push(motor.name + " " + spec.title);
                    $scope.locked_rotor_labels.push(motor.name + " " + spec.title);
                    var data = angular.copy(locked_rotor_data[motor.key][spec.key]);
                    data.map(function(e){
                        e.y *= $scope.gear_ratio[motor.key] * $scope.num_motors[motor.key];
                    });
                    $scope.locked_rotor_data.push(data);
                    $scope.locked_rotor_datasetOverride.push({
                        yAxisID: spec.axis,
                        pointRadius: 0.01,
                        fill: false,
                        fillColor: $scope.locked_rotor_colours[spec.key],
                        borderColor: $scope.locked_rotor_colours[spec.key],
                        borderDash: $scope.line_types[j],
                        backgroundColor: $scope.locked_rotor_colours[spec.key],
                        pointHoverBackgroundColor: $scope.locked_rotor_colours[spec.key],
                        pointHoverBorderColor: $scope.locked_rotor_colours[spec.key],
                        pointHoverRadius: 5
                    });
                }
            });
        });
    };

    $scope.motor_curve_options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                id: 'rpm',
                scaleLabel: {
                    labelString: 'Speed (RPM)',
                    display: true
                },
                position: 'left',
                type: 'linear',
                gridLines: {
                    display: false,
                },
                display: false,
                ticks: {
                    min: 0
                }
            },
            {
                id: 'current-power',
                scaleLabel: {
                    labelString: 'Current (A) / Power (W)',
                    display: true
                },
                position: 'left',
                type: 'linear',
                display: true,
                ticks: {
                    min: 0
                }
            },
            {
                id: 'efficiency',
                scaleLabel: {
                    labelString: 'Efficiency (%)',
                    display: true
                },
                position: 'left',
                type: 'linear',
                display: true,
                gridLines: {
                    display: false,
                },
                ticks: {
                    min: 0,
                    max: 100
                }
            },
            {
                id: 'torque',
                position: 'right',
                scaleLabel: {
                    labelString: 'Torque (N*m)',
                    display: true
                },
                type: 'linear',
                gridLines: {
                    display: false,
                },
                display: true,
                ticks: {
                    min: 0
                }
            }],
            xAxes: [{
                type: 'linear',
                scaleLabel: {
                    labelString: 'Speed (RPM)',
                    display: true
                },
                ticks: {
                    min: 0
                }
            }]
        }
    };

    $scope.peak_power_options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                id: 'time',
                scaleLabel: {
                    labelString: 'Time (s)',
                    display: true
                },
                position: 'left',
                type: 'linear',
                display: false,
                ticks: {
                    min: 0
                },
                gridLines: {
                    display: false,
                },
            },{
                id: 'current-power',
                scaleLabel: {
                    labelString: 'Power (W)',
                    display: true
                },
                position: 'left',
                type: 'linear',
                display: true,
                ticks: {
                    min: 0
                }
            }],
            xAxes: [{
                type: 'linear',
                scaleLabel: {
                    labelString: 'Time (s)',
                    display: true
                },
                ticks: {
                    min: 0
                }
            }]
        }
    };

    $scope.locked_rotor_options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                id: 'torque',
                scaleLabel: {
                    labelString: 'Torque (N*m)',
                    display: true
                },
                position: 'left',
                type: 'linear',
                display: true,
                ticks: {
                    min: 0
                }
            }],
            xAxes: [{
                type: 'linear',
                scaleLabel: {
                    labelString: 'Time (s)',
                    display: true
                },
                ticks: {
                    min: 0
                }
            }]
        }
    };

});