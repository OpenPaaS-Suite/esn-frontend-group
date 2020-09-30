'use strict';

require('../app.constants.js');

angular.module('esn.group.libs')
  .factory('groupAttendeeProvider', groupAttendeeProvider);

function groupAttendeeProvider(GROUP_OBJECT_TYPE) {
  return {
    objectType: GROUP_OBJECT_TYPE,
    template: require('./group-attendee-template.pug')
  };
}
