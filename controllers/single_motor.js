var app = angular.module('app');

app.controller('MotorController', function($scope, $location, MotorDataService){
    var key = $location.path().split("/").slice(-1)[0];
    $scope.motor = MOTORS[key];

    var motor_curve_data = {};      
    MotorDataService.getMotorPowerCurve(key)
        .then(function(data){
            motor_curve_data = {};
            $scope.labels = [];
            $scope.series = [];
            $scope.data = [];
            CHART_SPECS.forEach(function(spec){
                motor_curve_data[spec.key] = data[spec.csv_key].map(function(e, i){
                    return {
                        x: data[CHART_SPECS[0].csv_key][i],
                        y: e
                    }
                });
                $scope.loadLines();
            });
        });

    $scope.line_colours = {};
    for (var i = 1; i < CHART_SPECS.length; i++) {
        var hue = i / (CHART_SPECS.length-1);
        var saturation = 0.5;
        var luminance = 0.5;
        var rgb = hslToRgb(hue, saturation, luminance);
        $scope.line_colours[CHART_SPECS[i].key] = "rgb(" + rgb.join(', ') + ")";
    }

    $scope.loadLines = function () {
        $scope.motor_curve_series = [];
        $scope.motor_curve_data = [];
        $scope.motor_curve_labels = [];
        $scope.motor_curve_datasetOverride = [];
        CHART_SPECS.forEach(function(spec, i){
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

    var peak_power_line_colours = {};
    for (var i = 1; i < PEAK_POWER_SPECS.length; i++) {
        var hue = i / (PEAK_POWER_SPECS.length-1);
        var saturation = 0.5;
        var luminance = 0.5;
        var rgb = hslToRgb(hue, saturation, luminance);
        peak_power_line_colours[PEAK_POWER_SPECS[i].key] = "rgb(" + rgb.join(', ') + ")";
    }

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

});