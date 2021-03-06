var DHISFolder = getDHISInstallFolder();

function getImages(handler) {
    // Get URL from where to fetch quiz's json
    var url = getImageResourceURL();

    // Get quiz's as json object and on success use handler function
    $.ajax({
        url: url,
        localCache: false,
        cacheTTL: 0.1,
        isCacheValid: function () {
            return true;
        },
        dataType: 'json'
    }).success(function (images) {
        handler(images);
    }).error(function (error) {
        handler(null);
    });
}
function getImageResourceURL() {
    var quiz_id = getURLParameter(window.location, 'quiz_id');

    var url = getHostRoot() + '/' + DHISFolder + '/api/systemSettings/VJFS_Images_' + quiz_id;
    //console.log(url);
    return url;
} 
 
 
 function displayQuizInformation() {

                var url = window.location;

                var quiz_id = getURLParameter(url, 'quiz_id');

                getQuiz(quiz_id, function (quiz) {
                    getImages(function (images) {
                        if (quiz != null) {
                            var l = '<h2>' + quiz['quizTitle'] + '</h2>'
                            $('#quiz_info').append(l);

                            if (quiz['quizDescription']) {

                                if (images != null) {
                                    //console.log("images: " + images);
                                    var ape = JSON.parse(quiz['quizDescription']);
                                    var counter = 0;
                                    if (images["images"].length > 0) {
                                        var tempDesc = ape;
                                        var counter = 0;
                                        for (var j = 0; j < images["images"].length; j++) {
                                            tempDesc = tempDesc.replace('imageplaceholder', images["images"][j].imageContent);
                                        }
                                        $('#quiz_description').append(tempDesc);

                                        var description = document.getElementById("quiz_description");
                                        var images = description.getElementsByTagName("img");
                                        for (var i = 0; i < images.length; i++) {
                                            //$('#summernoteContent').append('<br>' + imagesFound[i] + '</br>'+ '<p>Click on image to enlarge</p>');
                                            if (images[i].width > window.innerWidth) {
                                                images[i].style["width"] = window.innerWidth * 0.95 + 'px';
                                                images[i].setAttribute("resized", true);
                                            }
                                            images[i].setAttribute("clicked", true);

                                            (function () {
                                                "use strict";
                                                images[i].addEventListener("click", function () {
                                                    if (this.resized = 'true') {
                                                        var newImage = this.cloneNode(true);
                                                        newImage.style.width = newImage.width + 'px';
                                                        var windowWidth = newImage.width + 10;
                                                        var windowHeight = newImage.height + 10;
                                                        //var newWin = open('url','windowName', 'width=' + windowWidth + ', height=' + windowHeight);
                                                        //newWin.document.write(newImage.outerHTML);
                                                        showFullImage(this);
                                                    }
                                                });
                                            }(i));
                                        }

                                    } else {
                                        var desc = JSON.parse(quiz['quizDescription']);
                                        var test = '<div class="panel-body" >' + desc + '</div>'
                                        $('#quiz_description').append(test);
                                    }
                                } else {

                                }

                            }
                            displayQuestions(quiz);

                        }
                    });

                });
            }

            function showFullImage(Image) {
                sUrl = decodeURIComponent(Image.src);
                var newWindow = window.open(sUrl, '_blank', 'width=' + screen.width + ', height=' + screen.height);
                if (window.focus) {
                    newWindow.focus();
                }
            }
            function displayQuestions(quiz) {


                getQuestions(function (questions) {
                    if (questions != null) {

                        var quiz_questions = $.grep(questions['questions'], function (e) {
                            return e.quizID == quiz['quizID'];
                        });


                        for (key in quiz_questions) {


                            var tmp = '<div class="panel panel-default" id=' + quiz_questions[key].questionID + '>';
                            tmp += '<div class="panel-heading">';
                            tmp += '<h3 class="panel-title">' + quiz_questions[key].questionTitle;
                            tmp += '<div id="incorrect" class="label label-danger hide">Incorrect</div>';
                            tmp += '<div id="correct" class="label label-success hide">Correct</div>';
                            tmp += '</h3>';
                            tmp += '<h3 class="panel-title">' + quiz_questions[key].questionQuestion + '</h3>';
                            tmp += '</div>';
                            tmp += '<div class="panel-body">';
                            tmp += '<div class="row">'
                            tmp += '<div class="col-xs-3"></div>';
                            tmp += '<div class="col-xs-6">';

                            tmp += '<form role="form" id="alternatives_"' + quiz_questions[key].questionID + '>';


                            if (quiz_questions[key].questionType == "text") {

                                tmp += '<textarea id="questionAnswer" style="width:100%; resize:vertical;" rows="6"></textarea>';

                            } else {
                                var num_alternatives = quiz_questions[key]['questionAlternatives'].length;
                                var p = '';
                                var counter = 0;
                                for (var i = 0; i < num_alternatives; i++) {
                                    tmp += '<div class="alternative">'
                                    tmp += '<div class="radio form-inline" >';
                                    tmp += '<input type="radio" id="alternativeYN" name="action">';
                                    tmp += '<p> ' + quiz_questions[key]['questionAlternatives'][i]['alternativeValue'] + '  </p> '
                                    tmp += '</div>';
                                    tmp += '</div>';

                                    //Embed the alternativefeedbacks into the webpage. Hidden until revealed in the sendToServer method. 
                                    if (quiz_questions[key]['questionAlternatives'][i]['alternativeFeedback'] != null) {
                                        if (quiz_questions[key]['questionAlternatives'][i]['alternativeChecked'] == true) {
                                            p += '<div id="feedback_' + quiz_questions[key].questionID + '_' + counter + '"class="hidden" style="color: green">' + quiz_questions[key]['questionAlternatives'][i]['alternativeFeedback'] + '</div>';
                                        } else {
                                            p += '<div id="feedback_' + quiz_questions[key].questionID + '_' + counter + '"class="hidden" style="color: red">' + quiz_questions[key]['questionAlternatives'][i]['alternativeFeedback'] + '</div>';
                                        }
                                    }
                                    counter++;
                                }
                            }

                            tmp += '</form>'
                            tmp += '</div>'
                            tmp += '</div>'
                            tmp += '</div>'
                            tmp += '</div>'

                            $('#question_list').append(tmp);
                            $('#question_list').append(p);
                        }
                    }
                });
            }

            function getUserQuestions(student_username, handler) {
                
                var urlStudent = getHostRoot() + '/' + DHISFolder + '/api/systemSettings/VJFS_' + student_username + '_questions';
                var uq = [];

                // Get quizs as json object and on success use handler function
                var a = $.ajax({
                    url: urlStudent,
                    dataType: 'json',
                    localCache: false,
                    cacheTTL: 0.1,
                    isCacheValid: function () {
                        return true;
                    }
                    
                }).success(function (questions) {
                    for (key in questions['questions']) {
                        if (questions['questions'][key].quizID == quiz_id) {
                            uq.push(questions['questions'][key]);
                        }
                    }
                }).error(function (error) {
                    
                    return;
                });
            }

            function getQuestions(handler) {

                // Get URL from where to fetch quiz's json
               
                var url = getHostRoot() + '/' + DHISFolder + '/api/systemSettings/VJFS_questions';

                // Get question's as json object and on success use handler function
                $.ajax({
                    url: url,
                    //cache: true,
                    dataType: 'json',
                    localCache: false,
                    cacheTTL: 0.1,
                    isCacheValid: function () {
                        return true;
                    }

                }).success(function (questions) {
                    handler(questions);
                    $('#checkButton').html('Check');
                }).error(function (error) {
                    handler(null);
                });
            }

            function getQuestion(question_id, handler) {

                getQuestions(function (questions) {

                    // Retrieve question based on question_id
                    var question = $.grep(questions['questions'], function (e) {
                        return e.questionID == question_id;
                    });

                    // Result is an array, but should only be one element so using [0]
                    if (question[0] == null) {
                        handler(null);
                        return;
                    }
                    // Get question from questions and call handler function on it
                    handler(question[0]);
                });
            }

            function mobileCheck() {
                var check = false;
                //Script from http://detectmobilebrowsers.com/ - Unlicensed open source
                (function (a, b) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                        check = true
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            }


//Send hva brukeren har svart til server..
            function sendToServer(checkOrSubmit) {
                // 1 is check, 2 is submit
                if (checkOrSubmit == 1) {
                    $('#checkButton').html('Checking...');
                } else if (checkOrSubmit == 2) {
                    $('#submitButton').html('Submitting...');
                }


                var url = window.location;

                var quiz_id = getURLParameter(url, 'quiz_id');
                var course_id = getURLParameter(url, 'course_id');


                $(document).ready(function () {


                    getQuiz(quiz_id, function (quiz) {

                        if (quiz != null) {

                            getQuestions(function (questions) {
                                if (questions != null) {
                                    var quiz_questions = $.grep(questions['questions'], function (e) {
                                        return e.quizID == quiz['quizID'];
                                    });
                                    // true = multiple, false = text
                                    var how_to_correct = true;

                                    $.each(quiz_questions, function (index) {
                                        if (quiz_questions[index]['questionType'] == 'text') {
                                            how_to_correct = false;
                                            return;
                                        }
                                    });
                                    // Here we correct as a multiple choice quiz, ie answer will be provided right away.
                                    if (how_to_correct) {

                                        //Displaying/hiding feedbacks according to the ticks. 
                                        for (var j = 0; j < questions['questions'].length; j++) {
                                            if (document.getElementById(questions['questions'][j]['questionID']) != null) {
                                                var checkContainer = document.getElementById(questions['questions'][j]['questionID']);
                                                //console.log(checkContainer);
                                                var checks = checkContainer.getElementsByTagName('input');
                                                for (var k = 0; k < checks.length; k++) {
                                                    $("#feedback_" + questions['questions'][j]['questionID'] + '_' + k).addClass("hidden");
                                                    var input = checks[k]
                                                    if (input.checked == true) {
                                                        $("#feedback_" + questions['questions'][j]['questionID'] + '_' + k).removeClass("hidden");
                                                    }
                                                }
                                            }
                                        }

                                        var checksLeft = $('#checksLeft').val();
                                        for (key in quiz_questions) {


                                            var question = quiz_questions[key];
                                            var questionIds = [];
                                            var question_alternatives = [];
                                            $('#' + question['questionID']).find('.alternative').each(function (index) {
                                                var alternative_checked = $(this).find('#alternativeYN').is(':checked');
                                                question_alternatives.push({"alternativeChecked": alternative_checked});
                                            });

                                            var correct = true;
                                            // Compare chosen alternatives with the right ones
                                            for (var i = 0; i < question_alternatives.length; i++) {
                                                if (question_alternatives[i]['alternativeChecked'] != question['questionAlternatives'][i]['alternativeChecked']) {
                                                    // Here we have different answers, let user know and store as failed
                                                    $('#quizWrong').remove();
                                                    if (checkOrSubmit == 1) {
                                                        checksLeft = handleChecks(checksLeft);

                                                        //$('#question_list').append('<p id="quizWrong" style="color: blue;"> Feedback on question: ' + question['questionTitle'] +', '+ question['questionAlternatives'][i]['alternativeFeedback']  + '</p>');	
                                                        $('#question_list').append('<p id="quizWrong" style="color: red;">One or more answers are incorrect. You have ' + checksLeft + ' check(s) left.</p>');
                                                        //Scroll down to where to buttons are. In case elements are not visible from current window location.
                                                        window.scrollTo(0, document.body.scrollHeight);
                                                        $('#quizWrong').focus();
                                                        return false;
                                                    } else if (checkOrSubmit == 2) {
                                                        //$('#quizContainer').append('<p id="quizWrong" style="color: red;">One or more answers are incorrect.</p>');
                                                        if (questionIds.indexOf(question['questionID']) == -1) {
                                                            questionIds.push(question['questionID']);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (checkOrSubmit == 1) {
                                            $('#quizWrong').remove();
                                            handleChecks(0);
                                            $('#question_list').append('<p id="quizWrong" style="color: green;">All answers are correct. Feel free to submit!</p>');
                                            //Scroll down to where to buttons are. In case elements are not visible from current window location.
                                            window.scrollTo(0, document.body.scrollHeight);
                                            $('#quizWrong').focus();
                                            return false;
                                        }

                                        // if there are wrong answers, show feedback and do not save
                                        if (questionIds.length > 0) {
                                            showFeedback(questionIds);
                                            return false;
                                        }

                                        // Here ALL questions where correct
                                        $('#quizWrong').remove();

                                        // Save quiz as passed an move on in life :D
                                        //Check if allready saved
                                        getUserQuizes(function (quizes) {

                                            var isUpdated = false;

                                            if (quizes != null) {
                                                console.log(quizes)
                                                for (var i = 0; i < quizes['quizes'].length; i++) {

                                                    if (quizes['quizes'][i].quizID === quiz_id) {
                                                        isUpdated = true;
                                                        break;
                                                    }

                                                }
                                            }

                                            if (!isUpdated) {
                                                saveUserQuiz(quiz_id);
                                            } else {
                                                var r = window.confirm("Quiz already approved, did not send for submission!")
                                                //Scroll down to where to buttons are. In case elements are not visible from current window location.
                                                window.scrollTo(0, document.body.scrollHeight);
                                                if (r == true) {
                                                    showFeedback([]);
                                                    //window.location.href = getAppRoot();
                                                } else {

                                                }
                                            }
                                        });


                                    } else {
                                        // Here we send all answer in such way that a mentor must correct it.

                                        var answers = [];
                                        var test = 123

                                        for (key in quiz_questions) {

                                            var question = {
                                                "questionID": quiz_questions[key]['questionID']
                                            };
                                            test = quiz_id;
                                            question['quizID'] = quiz_id;
                                            question['courseID'] = course_id;
                                            question['corrected'] = "false";


                                            if (quiz_questions[key].questionType == "text") {
                                                // Here we have a text question

                                                question['questionAnswer'] = $('#' + quiz_questions[key]['questionID']).find('#questionAnswer').val();

                                            } else {
                                                // Here we have a mulitple choice question

                                                var question_alternatives = [];

                                                $('#' + question['questionID']).find('.alternative').each(function (index) {
                                                    var alternative_checked = $(this).find('#alternativeYN').is(':checked');
                                                    question_alternatives.push({
                                                        "alternativeChecked": alternative_checked
                                                    });
                                                });

                                                question['questionAlternatives'] = question_alternatives;
                                            }

                                            //saveUserAnswers(question);
                                            answers.push(question);

                                            // Go to main page

                                        }


                                        //Check if allready saved
                                        getUserQuizes(function (quizes) {
                                            console.log(quizes);


                                            var isUpdated = false;
                                            for (var i = 0; i < quizes['quizes'].length; i++) {

                                                if (quizes['quizes'][i].quizID === quiz_id) {
                                                    isUpdated = true;
                                                    break;
                                                }

                                            }

                                            if (!isUpdated) {
                                                saveUserAnswers(answers);
                                            } else {
                                                var r = window.confirm("Quiz already approved, did not send to mentor for correction")
                                                //Scroll down to where to buttons are. In case elements are not visible from current window location.
                                                window.scrollTo(0, document.body.scrollHeight);
                                                if (r == true) {
                                                    window.location.href = getAppRoot();
                                                } else {

                                                }
                                            }
                                        });

                                    }
                                }
                            });
                        }
                    });

                });

            }

            function handleChecks(checksLeft) {
                var checksLeft = checksLeft - 1;
                if (checksLeft < 0) {
                    checksLeft = 0;
                }
                $('#checksLeft').val(checksLeft);
                if (checksLeft == 0) {
                    $('#checkButton').prop('disabled', true);
                }
                return checksLeft;
            }

            function backToMainPage() {
                
                window.location.href = getHostRoot() + '/' + DHISFolder + '/api/apps/smart%20learn/pages/user/takecourse.html';
            }


            function showFeedback(questionIds) {
                console.log(questionIds);
                console.log(questionIds.length);
                $.each(questionIds, function (index, value) {
                    console.log(value);
                    $('#' + value).find('div#incorrect').removeClass('hide');
                    // CHANGE START
                    $('#feedback_' + value).removeClass('hide');
                    // CHANGE END
                });
                $('#submitButton, #checkButton').addClass('hide');
                $('#backButton').removeClass('hide');
                $('#submitButton').html('Submit');

                if (questionIds.length == 0 && $('#nextQuizId').val() != 0) {
                    // no wrong answers and more quizes available, show Next button
                    $('#nextButton').removeClass('hide');
                }
            }

            function nextModule() {
                var url = window.location;
                var courseId = getURLParameter(url, 'course_id');
                var nextQuizId = $('#nextQuizId').val();

                window.location.href = 'questions.html?quiz_id=' + nextQuizId + '&course_id=' + courseId;
            }
