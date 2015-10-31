angular
    .module("socially")
    .controller("PartiesListCtrl", function ($scope, $meteor, $rootScope) {
        $scope.parties = $meteor.collection(function () {
            return Parties.find({}, {
                sort: $scope.getReactively('sort')
            });
        });
        $scope.orderProperty = '1';
        $scope.page = 1;
        $scope.perPage = 3;
        $scope.sort = {name: 1};
        
        $scope.$meteorSubscribe('users');

        $meteor.autorun($scope, function () {
            $meteor.subscribe('parties', {
                limit: parseInt($scope.getReactively('perPage')),
                skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
                sort: $scope.getReactively('sort')
            }, $scope.getReactively('search')).then(function () {
                $scope.partiesCount = $meteor.object(Counts, 'numberOfParties', false);
            });
        });

        $scope.$watch('orderProperty', function () {
            if ($scope.orderProperty)
                $scope.sort = {name: parseInt($scope.orderProperty)};
        });

        $scope.getUserById = function (userId) {
            return Meteor.users.findOne(userId);
        };

        $scope.creator = function (party) {
            if (!party)
                return;
            var owner = $scope.getUserById(party.owner);
            if (!owner)
                return 'nobody';

            if ($rootScope.currentUser)
                if ($rootScope.currentUser._id)
                    if (owner._id === $rootScope.currentUser._id)
                        return 'me';

            return owner;
        };

        $scope.remove = function (party) {
            $scope.parties.splice($scope.parties.indexOf(party), 1);
        };

        $scope.removeAll = function () {
            $scope.parties.remove();
        };

        $scope.pageChanged = function (newPage) {
            $scope.page = newPage;
        };
    });