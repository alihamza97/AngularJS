'use strict';

describe('myApp.dashboard module', function() {

  beforeEach(module('myApp.dashboard'));

  describe('dashboard controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var dashboardCtrl = $controller('DashboardCtrl');
      expect(dashboardCtrl).toBeDefined();
    }));


  });
});


// angular.module('docsTimeDirective', [])
//     .controller('Controller', ['$scope', function($scope) {
//         $scope.format = 'M/d/yy h:mm:ss a';
//     }])
//     .directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {
//
//         function link(scope, element, attrs) {
//             var format,
//                 timeoutId;
//
//             function updateTime() {
//                 element.text(dateFilter(new Date(), format));
//             }
//
//             scope.$watch(attrs.myCurrentTime, function(value) {
//                 format = value;
//                 updateTime();
//             });
//
//             element.on('$destroy', function() {
//                 $interval.cancel(timeoutId);
//             });
//
//             // start the UI update process; save the timeoutId for canceling
//             timeoutId = $interval(function() {
//                 updateTime(); // update DOM
//             }, 1000);
//         }
//
//         return {
//             link: link
//         };
//     }]);