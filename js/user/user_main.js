/**
* Function will retrieve the root URL for domain it's running on.
*
* @returns {string} : the currently root hostname
*/

var DHISFolder = getDHISInstallFolder();


/**
 * Function will check if the user currently trying to access app
 * has the right privilege level (admin or if groups can be created: customizer)
 *
 * If user is admin, then handler function is called
 */




//This method is used for opening up the QUIZ - window and the WORKING-window into two separate halves of the window
var mainWindow, quizWindow;
var mainWindow, quizWindow;

function openWin() {
  var DHISFolder = getDHISInstallFolder();
  if(DHISFolder == ''){
    mainWindow = window.open("/"+ DHISFolder + "/", "mainNavigationWindow", "width=250, height=250, location=yes, scrollbars=yes");
  }
  mainWindow = window.open("/"+ DHISFolder + "/", "mainNavigationWindow", "width=250, height=250, location=yes, scrollbars=yes");
  quizWindow = window.open("takecourse.html", "quizPanel", "width=250, height=250, location=yes, scrollbars=yes");
  if (!quizWindow || quizWindow.closed
    || typeof quizWindow.closed == 'undefined') {
    // First Checking Condition Works For IE & Firefox
    // Second Checking Condition Works For Chrome
    alert("Popup Blocker is enabled! Please add this site to your exception list.");
  } else {
    quizWindow.resizeTo(400, screen.height);
    mainWindow.resizeTo(screen.width - 400, screen.height);
    quizWindow.moveTo(screen.width - 400, 100);
    mainWindow.moveTo(0, 100);
    mainWindow.focus();
    quizWindow.focus();
  }

}

function getUserLevel(handler) {
  getMyUserName(function(user){

    var username = user.userCredentials.code;
    // Get URL from where to fetch quiz's json
     
    var url = getHostRoot() + '/'+ DHISFolder +'/api/systemSettings/VJFS_'+username+'_level';

    // Get quiz's as json object and on success use handler function
    $.ajax({
      url: url,
      localCache : false,
      cacheTTL : 0.1,
      isCacheValid : function(){  
        return true;
      },
      
      dataType: 'json'
    }).success(function(level) {
      handler(level.level);
    }).error(function(level) {
      handler(1);
    });

  });
}


