var app = angular.module("app", []);
app.controller("myController", ['$scope','myService', '$q', '$timeout', function($scope, myService, $q, $timeout) {

    $scope.data = [];

    var batchRender = function(hash, collection, size) {
        var promise = $q.resolve();

        function chunkCollection(collection, size) {
            var chunks = [];
            for (var i = 0; i < collection.length; i += size) {
                chunks.push(collection.slice(i, i + size));
            }
            return chunks;
        }

        function scheduleRender(chunk){
            Array.prototype.push.apply($scope.data, chunk);
            return $timeout(function(){}, 0);
        }

        var chunked = chunkCollection(collection, size);
        var nextBatch;
        chunked.forEach(function(chunk, index) {
            nextBatch = scheduleRender.bind(null, chunk);
            promise = promise.then(nextBatch);
        });

        promise.then(function() {
            console.log('Rendered.');
        });

    };

    $scope.renderBatch = function(){
        batchRender("data", myService.getData(), 25);
    };

    $scope.renderAll = function(){
        $scope.data = myService.getData();
    }

}]);