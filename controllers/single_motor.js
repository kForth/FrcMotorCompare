var app = angular.module('app');

app.controller('MotorController', function($scope, $location, MotorDataService){
    $scope.chart_specs = MOTOR_CURVE_SPECS;
    var key = $location.path().split("/").slice(-1)[0];
    $scope.motor = angular.copy(MOTORS[key]);

    var motor_curve_data = {};      
    MotorDataService.getMotorPowerCurve(key)
        .then(function(data){
            MOTOR_CURVE_SPECS.forEach(function(spec){
                var vals = data[spec.csv_key];      
                if(vals === undefined){
                    vals = data[spec.alt_key];
                }
                if(vals !== undefined){
                        motor_curve_data[spec.key] = vals.map(function(e, i){
                        return {
                            x: data[MOTOR_CURVE_SPECS[0].csv_key][i],
                            y: e
                        }
                    });
                }   
            });
            $scope.loadLines();
        });

    $scope.line_colours = {};
    genColors(MOTOR_CURVE_SPECS.length-1).forEach(function(c, i){
        $scope.line_colours[MOTOR_CURVE_SPECS[i+1].key] = c;
    });

    var peak_power_line_colours = {};
    genColors(PEAK_POWER_SPECS.length-1).forEach(function(c, i){
        peak_power_line_colours[PEAK_POWER_SPECS[i+1].key] = c;
    });
    
    var locked_rotor_line_colours = {};
    genColors(LOCKED_ROTOR_SPECS.length).forEach(function(c, i){
        locked_rotor_line_colours[LOCKED_ROTOR_SPECS[i].key] = c;
    });

    $scope.loadLines = function () {
        $scope.motor_curve_series = [];
        $scope.motor_curve_data = [];
        $scope.motor_curve_labels = [];
        $scope.motor_curve_datasetOverride = [];
        MOTOR_CURVE_SPECS.forEach(function(spec, i){
            if(i > 0){
                $scope.motor_curve_series.push(spec.title);
                $scope.motor_curve_labels.push(spec.title);
                $scope.motor_curve_data.push(motor_curve_data[spec.key]);
                $scope.motor_curve_datasetOverride.push({
                    yAxisID: spec.axis,
                    pointRadius: 0.01,
                    fill: false,
                    fillColor: $scope.line_colours[spec.key],
                    borderColor: $scope.line_colours[spec.key],
                    backgroundColor: $scope.line_colours[spec.key],
                    pointHoverBackgroundColor: $scope.line_colours[spec.key],
                    pointHoverBorderColor: $scope.line_colours[spec.key],
                    pointHoverRadius: 5
                });
            }
        });
    };

    MotorDataService.getMotorPeakPower(key)
        .then(function(data){
            $scope.peak_power_series = [];
            $scope.peak_power_labels = [];
            $scope.peak_power_data = [];
            $scope.peak_power_datasetOverride = [];
            PEAK_POWER_SPECS.forEach(function(spec, i){
                if(i > 0){
                    $scope.peak_power_series.push(spec.title);
                    $scope.peak_power_labels.push(spec.title);
                    $scope.peak_power_data.push(data[spec.csv_key].map(function(e, i){
                        return {
                            x: data['Time'][i],
                            y: e
                        }
                    }));
                    $scope.peak_power_datasetOverride.push({
                        yAxisID: spec.axis,
                        pointRadius: 0.01,
                        fill: false,
                        fillColor: peak_power_line_colours[spec.key],
                        borderColor: peak_power_line_colours[spec.key],
                        backgroundColor: peak_power_line_colours[spec.key],
                        pointHoverBackgroundColor: peak_power_line_colours[spec.key],
                        pointHoverBorderColor: peak_power_line_colours[spec.key],
                        pointHoverRadius: 5
                    });
                }
            })
        });



    var locked_rotor_data = {};      
    MotorDataService.getMotorLockedRotor(key)
        .then(function(data){
            locked_rotor_data = data;
            $scope.loadLockedRotorLines();
        });

    $scope.loadLockedRotorLines = function () {
        $scope.locked_rotor_series = [];
        $scope.locked_rotor_data = [];
        $scope.locked_rotor_labels = [];
        $scope.locked_rotor_datasetOverride = [];
        LOCKED_ROTOR_SPECS.forEach(function(spec){
            var test_current = parseInt(parseInt(spec.title.slice(0, -1)) / 12 * $scope.motor.stall_current);
            var title = spec.title + " / " + test_current + "A"
            $scope.locked_rotor_series.push(title);
            $scope.locked_rotor_labels.push(title);
            $scope.locked_rotor_data.push(locked_rotor_data[spec.key]);
            $scope.locked_rotor_datasetOverride.push({
                yAxisID: spec.axis,
                pointRadius: 0.01,
                fill: false,
                fillColor: locked_rotor_line_colours[spec.key],
                borderColor: locked_rotor_line_colours[spec.key],
                backgroundColor: locked_rotor_line_colours[spec.key],
                pointHoverBackgroundColor: locked_rotor_line_colours[spec.key],
                pointHoverBorderColor: locked_rotor_line_colours[spec.key],
                pointHoverRadius: 5
            });
        });
    };

    $scope.motor_curve_series = [];
    $scope.motor_curve_data = [];
    $scope.motor_curve_datasetOverride = {};
    $scope.motor_curve_options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true
        },
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
        legend: {
            display: true
        },
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
        legend: {
            display: true
        },
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