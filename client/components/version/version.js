'use strict';

angular.module('EmployeeApp.version', [
  'EmployeeApp.version.interpolate-filter',
  'EmployeeApp.version.version-directive'
])

.value('version', '0.1');
