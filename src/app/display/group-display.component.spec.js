'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The groupDisplay component', function() {
  var $rootScope, $compile, $q, $modal, $state;
  var groupApiClient, GROUP_EVENTS;
  var group;

  beforeEach(function() {
    angular.mock.module('linagora.esn.group');

    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', function(scope) {
        scope.elements = scope.elements || [];
      });
      $provide.value('$modal', sinon.spy());
      $provide.constant('ELEMENTS_PER_REQUEST', null);
      $provide.value('translateFilter', text => text);
    });
  });

  beforeEach(angular.mock.inject(function(
    _$rootScope_,
    _$compile_,
    _$q_,
    _$modal_,
    _$state_,
    _groupApiClient_,
    _GROUP_EVENTS_
  ) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $q = _$q_;
    $modal = _$modal_;
    $state = _$state_;
    groupApiClient = _groupApiClient_;
    GROUP_EVENTS = _GROUP_EVENTS_;
  }));

  beforeEach(function() {
    group = {
      id: 'groupId',
      name: 'Group name',
      email: 'group@email.com'
    };

    groupApiClient.get = function() {
      return $q.when({ data: group });
    };
  });

  function initComponent() {
    var scope = $rootScope.$new();
    var element = $compile('<group-display />')(scope);

    scope.$digest();

    return element;
  }

  it('should display basic information of group', function() {
    var elementHtml = initComponent().html();

    expect(elementHtml).to.contain(group.name);
    expect(elementHtml).to.contain(group.email);
  });

  it('should display member list', function() {
    var element = initComponent();

    expect(element.find('group-member-list')).to.have.length(1);
  });

  it('should update information of group on update event', function() {
    var element = initComponent();
    var updatedGroup = {
      id: group.id,
      name: 'Another group name',
      email: 'another.group@email.com'
    };

    $rootScope.$broadcast(GROUP_EVENTS.GROUP_UPDATED, updatedGroup);
    $rootScope.$digest();

    expect(element.html()).to.contain(updatedGroup.name);
    expect(element.html()).to.contain(updatedGroup.email);
  });

  it('should update the number of members on members removed event', function() {
    var members = [{
      member: {
        objectType: 'user',
        id: 1
      }
    }, {
      member: {
        objectType: 'email',
        id: 'my@email.com'
      }
    }];

    group.members = members;

    var element = initComponent();

    expect(element.find('.members h2').html()).to.contain('(0/2)');

    $rootScope.$broadcast(GROUP_EVENTS.GROUP_MEMBERS_REMOVED, [members[0].member]);
    $rootScope.$digest();

    expect(element.find('.members h2').html()).to.contain('(0/1)');
  });

  it('should open add members dialog when add button is clicked', function() {
    var element = initComponent();

    element.find('[ng-click="$ctrl.onAddMembersBtnClick()"]').click();

    expect($modal).to.have.been.calledWith(sinon.match({
      template: require('../update/members/group-add-members.pug'),
      controller: 'GroupAddMembersController'
    }));
  });

  it('should update the number of members on members added event', function() {
    var members = [{
      member: {
        objectType: 'user',
        id: 1
      }
    }];

    group.members = members;

    var element = initComponent();

    expect(element.find('.members h2').html()).to.contain('(0/1)');

    $rootScope.$broadcast(GROUP_EVENTS.GROUP_MEMBERS_ADDED, [{
      objectType: 'email',
      id: 'my@email.com',
      member: 'my@email.com'
    }]);

    $rootScope.$digest();

    expect(element.find('.members h2').html()).to.contain('(1/2)');
  });

  it('should change state to group list when group is successfully deleted', function() {
    $state.go = sinon.spy();

    initComponent();

    $rootScope.$broadcast(GROUP_EVENTS.GROUP_DELETED, 'deleted');
    $rootScope.$digest();

    expect($state.go).has.been.calledWith('^');
  });
});
