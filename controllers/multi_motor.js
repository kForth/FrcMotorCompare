

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