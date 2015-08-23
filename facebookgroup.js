var Promise = require('es6-promise').Promise;
var request = require('request');
var fb = require('fb');

function assertAllGroupMembersAreTesters(targetObject) {
	getAppRoleMembers(targetObject).then(function (appRoleMembers) {
		console.log(appRoleMembers);
		var fbGroupUri = '/' + targetObject.setupRow.facebookgroup; 	
		getGroupMembers(targetObject, fbGroupUri).then(function (groupMembers) {
			console.log(groupMembers);		 
			groupMembers.forEach(function (groupMember) {
				if (!appRoleMembers[groupMember]) {
					console.log('Adding' + groupMember);
					addAppTester(targetObject, groupMember);				
				}
			});
		});
	});
}

function addAppTester(targetObject, user) {
	fb.setAccessToken(targetObject.account.facebook.accessToken);
			
	fb.api(targetObject.account.facebook.appId + '/roles', 'post', { user: user, role: 'testers'}, function (what) {
		console.log('Result');
		console.log(what);
	});
}

function getAppRoleMembers(targetObject) {	
	return new Promise(function (resolve) {
		var appRoleMembers = {};
				
		fb.setAccessToken(targetObject.account.facebook.appAccessToken);
				
		fb.api(targetObject.account.facebook.appId + '/roles', 'get', function (res) {
			res.data.forEach(function (appRoleMember) {
				appRoleMembers[appRoleMember.user] = true;
			});
			resolve(appRoleMembers);
			//console.log(res);
		});
	});
}

function getGroupMembers(targetObject, group) {		
	return new Promise(function (resolve) {
		var groupMembers = [];
		
		var getNextGroupMembers = function (nextMembers) {
			request(nextMembers, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
				  processResponse(JSON.parse(body));			     
			  }
			  else {
				  console.log(error);
				  console.log(response);
			  }
			});			
		};
		
		var processResponse = function (res) {
			if (res.data.length === 0) {
				resolve(groupMembers);
				return;
			}
			res.data.forEach(function(member) {
				groupMembers.push(member.id);
			});			
			getNextGroupMembers(res.paging.next);						
		};
				
		fb.setAccessToken(targetObject.account.facebook.accessToken);
				
		fb.api(group + '/members', 'get', processResponse);
	});
}

module.exports = {
    assertGroupMembersAreTesters: assertAllGroupMembersAreTesters    
};