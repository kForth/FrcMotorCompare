var app = angular.module('app', ['ngAnimate', 'ui.bootstrap', 'ngStorage', 'chart.js', 'ui.sortable', 'ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
    $routeProvider
        .when("/compare", {
            templateUrl: 'compare.html',
            controller: 'CompareController'
        })
        .when("/:motor", {
            templateUrl: 'motor.html',
            controller: 'MotorController'
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

function genColors(n){
    var colors = [];
    for (var i = 0; i < n; i++) {
        var hue = i / (n);
        var saturation = 0.5;
        var luminance = 0.5;
        var rgb = hslToRgb(hue, saturation, luminance);
        colors.push("rgb(" + rgb.join(', ') + ")");
    }
    return colors;
}

app.service('MotorDataService', function($http){
    var service = {};

    service.getMotorPowerCurve = function(key){
        var motor = MOTORS[key];
        return $http.get(motor.motor_curve_url)
            .then(function(response){
                var data = {};
                var lines = response.data.trim().split("\n");
                var headers = lines[0].split(",").map(function(e){ return e.trim(); });
                headers.forEach(function(header){
                    data[header] = [];
                });
                lines.splice(1).forEach(function(line){
                    line = line.split(",");
                    for(var i = 0; i < line.length; i++){
                        data[headers[i]].push(line[i]);
                    }
                });
                return data;
            },
            function(response){
                return {};
            })
    };

    service.getMotorPeakPower = function(key){
        var motor = MOTORS[key];
        return $http.get(motor.peak_power_url)
            .then(function(response){
                var data = {};
                var lines = response.data.trim().split("\n");
                var headers = lines[0].split(",").map(function(e){ return e.trim(); });
                headers.forEach(function(header){
                    data[header] = [];
                });
                lines.splice(1).forEach(function(line){
                    line = line.split(",");
                    for(var i = 0; i < line.length; i++){
                        data[headers[i]].push(line[i]);
                    }
                });
                return data;
            },
            function(response){
                return {};
            })
    };

    service.getMotorLockedRotor = function(key){
        var motor = MOTORS[key];
        return $http.get(motor.locked_rotor_url)
            .then(function(resp){
                return resp.data;
            });
    };

    return service;
});

app.controller('ApplicationController', function ($scope, MotorDataService) {
    $scope.motors = Object.values(MOTORS);
    $scope.specs = MOTOR_SPECS;
});

app.controller('HomeController', function($scope){
});