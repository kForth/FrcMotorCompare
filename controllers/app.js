var app = angular.module('app', ['ngAnimate', 'ui.bootstrap', 'ngStorage', 'chart.js', 'ui.sortable', 'ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
    $routeProvider
        .when("/m/:motor", {
            templateUrl: 'motor.html',
            controller: 'MotorController'
        })
        .when("/compare", {
            templateUrl: 'compare.html',
            controller: 'CompareController'
        })
        .when("/", {
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .otherwise({
            redirectTo: '/'
        });

    // $routeProvider.html5Mode(true);
});

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s === 0) {
        r = g = b = l;
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

app.service('MotorDataService', function($http){
    var service = {};

    service.getMotorPowerCurve = function(key){
        var motor = MOTORS[key];
        return $http.get(motor.motor_curve_url)
            .then(function(response){
                var data = {};
                var lines = response.data.split("\n");
                var headers = lines[0].split(",");
                headers.forEach(function(header){
                    data[header] = [];
                });
                lines.splice(1).forEach(function(line){
                    line = line.split(",");
                    for(var i = 0; i < line.length; i++){
                        data[headers[i]].push(line[i]);
                    }
                });
                console.log(data);
                return data;
            },
            function(response){
                console.log(response);
                return {};
            })
    };

    return service;
});

app.controller('ApplicationController', function ($scope, MotorDataService) {
    $scope.motors = MOTORS;
    $scope.specs = SPECS;

});

app.controller('HomeController', function($scope){

});

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

    var line_colours = {};
    for (var i = 0; i < CHART_SPECS.length; i++) {
        var hue = (i / CHART_SPECS.length);
        var saturation = 0.5;
        var luminance = 0.5;
        var rgb = hslToRgb(hue, saturation, luminance);
        line_colours[CHART_SPECS[i].key] = "rgb(" + rgb.join(', ') + ")";
    }

    $scope.loadLines = function () {
        $scope.series = [];
        $scope.data = [];
        $scope.labels = [];
        $scope.datasetOverride = [];
        CHART_SPECS.forEach(function(spec, i){
            if($scope.elements_to_show[spec.key] && i > 0){
                $scope.series.push(spec.title);
                $scope.labels.push(spec.title);
                $scope.data.push(motor_curve_data[spec.key]);
                $scope.datasetOverride.push({
                    yAxisID: spec.axis,
                    pointRadius: 0.01,
                    fill: false
                    // borderColor: line_colours[spec.key]
                });
            }
        });
    };

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    $scope.elements_to_show = {};
    CHART_SPECS.forEach(function(e){ $scope.elements_to_show[e.key] = true });
    $scope.series = [];
    $scope.data = [];
    $scope.datasetOverride = {};
    $scope.options = {
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
                    min: 0,
                    max: 350
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

});

app.controller('CompareController', function ($scope, $localStorage, $sessionStorage, $location) {
    $scope.model_types = MODEL_TYPES;
    $scope.motors = MOTORS;

    $scope.scale_factors = $sessionStorage.scale_factors || DATA_SCALE_FACTORS;
    $scope.visible_models = $sessionStorage.visible_models || {};
    $scope.visible_elements = $sessionStorage.visible_elements || {};

    $scope.$watch('models', function () {
        $sessionStorage.models = $scope.models;
    });
    $scope.$watch('models_expanded', function () {
        $sessionStorage.models_expanded = $scope.models_expanded;
    });
    $scope.$watch('visible_models', function () {
        $sessionStorage.visible_models = $scope.visible_models;
    });
    $scope.$watch('visible_elements', function () {
        $sessionStorage.visible_elements = $scope.visible_elements;
    });
    $scope.$watch('scale_factors', function () {
        $sessionStorage.scale_factors = $scope.scale_factors;
    });

    $scope.$watch(
        function () {
            return angular.toJson($sessionStorage);
        },
        function () {
            $scope.models = $sessionStorage.models;
            $scope.models_expanded = $sessionStorage.models_expanded;
            $scope.visible_models = $sessionStorage.visible_models;
            $scope.visible_elements = $sessionStorage.visible_elements;
            $scope.scale_factors = $sessionStorage.scale_factors;
        });

    $scope.loadLines = function () {
        $scope.data = [];
        $scope.datasetOverride = [];

        $scope.line_colours = [];
        for (var i = 0; i < $scope.models.length; i++) {
            var hue = (i / $scope.models.length);
            var saturation = 0.5;
            var luminance = 0.5;
            var rgb = hslToRgb(hue, saturation, luminance);
            $scope.line_colours.push("rgb(" + rgb.join(', ') + ")");
        }

        $scope.line_types = [[20, 5], [100000, 1], [10, 2]];
        for (var i = $scope.line_types.length; i < $scope.elements_can_plot.length; i++) {
            $scope.line_types.push($scope.line_types[$scope.line_types.length - 1].concat([2, 3]));
        }

        $scope.models.forEach(function (model) {
            if ($scope.visible_models[model.id]) {
                $scope.elements_can_plot.forEach(function (key, i) {
                    if ($scope.visible_elements[key]) {
                        var data = [];
                        simulator_data[model.id][key].forEach(function (pnt) {
                            pnt = angular.copy(pnt);
                            pnt.y = pnt.y / $scope.scale_factors[key];
                            data.push(pnt);
                        });
                        $scope.data.push(data);
                        $scope.datasetOverride.push({
                            pointRadius: 0,
                            fill: false,
                            borderColor: $scope.line_colours[$scope.models.indexOf(model)],
                            borderDash: $scope.line_types[$scope.elements_can_plot.indexOf(key)]
                        });
                    }
                });
            }
        });
    };

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    var simulators = {};
    var simulator_data = {};
    $scope.elements_can_plot = Object.keys(DATA_HEADERS);
    $scope.element_titles = DATA_HEADERS;
    $scope.series = [];
    $scope.data = [];
    $scope.datasetOverride = [];
    $scope.options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: 'linear',
                ticks: {
                    min: 0,
                    stepSize: 0.01
                }
            }]
        }
    };

    $scope.runSim();
});