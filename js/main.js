/**
* Function will retrieve the root URL for domain it's running on.
*
* @returns {string} : the currently root hostname
*/
function getHostRoot() {
	return location.protocol + '//' + location.hostname + ':' + location.port;
}

/**
* Function will return the subfolder name for the DHIS installation on the server
* which is varies from DHIS installation to installation.
* ie, this function will return "dhis" in this url: http://localhost:8080/dhis/api/apps/takecourse/index.html
*/
function getDHISInstallFolder(){
  var pathArray = window.location.pathname.split( '/' );
  //console.log(pathArray[1]);
  var pathName = pathArray[1];
  //console.log(pathName);
  if(pathName == 'apps'){
    pathName = '';
  }
  return pathName;
}

/**
 * Adding an isEmpty prototype for String
 */
String.prototype.isEmpty = function() {
	return (this.length === 0 || !this.trim());
};

/**
 * Function will return an unique ID
 */
function getUniqueID() {
	var time = new Date().getTime();
	while (time == new Date().getTime());
	return new Date().getTime();
}


/**
* Function will take an URL and a key parameter to search for,
* then for the given key return its value.
*/
function getURLParameter(url, parameter_key)
{
	var url_query_string = url.search.substring(1);
	var url_variables = url_query_string.split('&');

	for (var i = 0; i < url_variables.length; i++)
	{
		var pair = url_variables[i].split('=');
		if (pair[0] == parameter_key)
		{
			return pair[1];
		}
	}
}

/**
* Function will retrieve the root URL for where the APP resides.
*
* @returns {string} : the currently root url for the app
*/
function getApiRoot() {
	return getHostRoot()+'/'+getDHISInstallFolder();
}
function getAppRoot() {
	return getHostRoot()+'/'+getDHISInstallFolder() +'/api/apps/smart-learn/';
}

/**
 * Function will check if the user currently trying to access app
 * has the right privilege level (admin or if groups can be created: customizer)
 *
 * If user is admin, then handler function is called
 */
function isCustomizer(handler) {
	// Create URL to fetch user data from (was not possible to use "fields" and "filters" here?)
	// If so then last part of URL would be: /api/me.json?fields=userCredentials[userAuthorityGroups]
	var url = getHostRoot() + '/'+getDHISInstallFolder()+'/api/me';

	// Get information as json object
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(user) {

		var isSuperUser = false;

		if(user.hasOwnProperty('userCredentials')) {
			// Someone logged in,
			// Need to check if user is "Superuser"
			var authority_groups = user['userCredentials']['userAuthorityGroups'];

			for(key in authority_groups) {
				if(authority_groups[key]['name'] === 'Superuser') {
					// This is a super user!
					isSuperUser = true;
					break;
				}
			}
		}
		if(isSuperUser) {
			// Here we have a super user, call handler function
			handler(true);
		} else {
                    //edited
			handler(true);
		}
	});
}
function navBarElements(){
	isCourseAttendant(function(isCourseAttendant) {
		if(!isCourseAttendant){
			document.getElementById("showcourse").style.display = "none";
			console.log();
		}
	});
	isCourseMentor(function(isCourseMentor) {
		if(!isCourseMentor){
			document.getElementById("showmentor").style.display = "none";
		}
	});
	isCustomizer(function(isCustomizer) {
		if(!isCustomizer) {
			document.getElementById("showadmin").style.display = "none";
			document.getElementById("showstat").style.display = "none";
		}
	});
}

function isCourseAttendant(handler){
	var meurl = getHostRoot() + '/'+getDHISInstallFolder() +'/api/me';
	var courseurl = getHostRoot() + '/'+getDHISInstallFolder() +'/api/systemSettings/VJFS_courses';
	$.ajax({
		url: meurl,
		dataType: 'json'
	}).success(function(userinfo) {
		$.ajax({
			url: courseurl,
			dataType: 'json'
		}).success(function(courses) {
			var isAttendant = false;
			var userid = userinfo['id'];
			//console.log(userid);
			for(key in courses['courses']){
				for(keys in courses['courses'][key]['courseAttendants']){
					if(courses['courses'][key]['courseAttendants'][keys].attendantID === userid){
						isAttendant = true;
						break;
					}
				}
			}
			if(isAttendant){
				handler(true);
			} else {
				handler(false);
			}
		});

	});
}
function isCourseMentor(handler){
        var isMentor = false;
	var meurl = getHostRoot() + '/'+getDHISInstallFolder() +'/api/me';
	var courseurl = getHostRoot() + '/'+getDHISInstallFolder() +'/api/systemSettings/VJFS_courses';
	$.ajax({
		url: meurl,
		dataType: 'json'
	}).success(function(userinfo) {
		$.ajax({
			url: courseurl,
			dataType: 'json'
		}).success(function(courses) {
			
			var userid = userinfo['id'];		
			for(key in courses['courses']){
				for(keys in courses['courses'][key]['courseMentors']){
					if(courses['courses'][key]['courseMentors'][keys].mentorID === userid){
						isMentor = true;
						break;
					}
				}
			}
                       
			if(isMentor){
				handler(true);
			} else {
				handler(false);
			}
                      
		});

	});
        
}

/**
 * Function will setup an instance of the "bloodhound" suggstioner and return it.
 *
 * @param div_id is the id of the div to add on bloodhound
 * @param name is the name used for this instance
 * @param data is the array of objects to use for suggestion
 * @param display_key_function is a function that will return what to display from an object from the data array
 * @param suggestion_function is a function that will return what to display in suggestion box from an object from the data array
 */
function setupBloodHound(div_id, name, data, display_key_function, suggestion_function) {
	var bh = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: data
	});

	// kicks off the loading/processing of `local` and `prefetch`
	bh.initialize();

	$('#' + div_id + ' .typeahead').typeahead(
		{
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: name,
			displayKey: display_key_function,
			// `ttAdapter` wraps the suggestion engine in an adapter that
			// is compatible with the typeahead jQuery plugin
			source: bh.ttAdapter(),
			templates :

			{
				suggestion: suggestion_function
			}
		});

	return bh;
}
function locateDhisHomePage(){
     var url=getHostRoot() + '/'+getDHISInstallFolder();
        window.location.href =url;
}
function locateHomePage(){
        var url=getHostRoot() + '/'+getDHISInstallFolder()+'/api/apps/smart-learn/index.html';
        window.location.href =url;
}
//function locateTakeCoursePage(){
//        var url=getHostRoot() + '/'+getDHISInstallFolder()+'/api/apps/smart-learn/user/index.html';
//        window.location.href =url;
//}
function locateMentorHomePage(){
        var url=getHostRoot() + '/'+getDHISInstallFolder()+'/api/apps/smart-learn/pages/mentor/mentor.html';
        window.location.href =url;
}
function locateStatisticsHomePage(){
        var url=getHostRoot() + '/'+getDHISInstallFolder()+'/api/apps/smart-learn/pages/statistics/statistics.html';
        window.location.href =url;
}
function locateAdminHomePage(){
        var url=getHostRoot() + '/'+getDHISInstallFolder()+'/api/apps/smart-learn/admin/index.html';
        window.location.href =url;
}




