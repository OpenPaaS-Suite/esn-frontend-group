'use strict';

angular.module('linagora.esn.group')
  .run(addTemplateCache);

function addTemplateCache($templateCache) {
  $templateCache.put('/group/images/group-icon.svg', require('../images/group-icon.svg'));
  $templateCache.put('/group/app/delete/group-delete.html', require('./delete/group-delete.pug'));
  $templateCache.put('/views/modules/auto-complete/attendees.html', require('esn-frontend-common-libs/src/frontend/views/modules/auto-complete/attendees.pug'));
  $templateCache.put(
    '/group/app/member/list/selection-header/modal/remove-members.html',
    require('./member/list/selection-header/modal/remove-members.pug')
  );
  $templateCache.put(
    '/group/app/update/members/group-add-members.html',
    require('./update/members/group-add-members.pug')
  );
}
