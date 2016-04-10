var facebookperson = {};
var fbloginstatus = 0;

var onGeoSuccess = function(position) {
    console.log('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
           window.sessionStorage.setItem('lng',position.coords.longitude);
           window.sessionStorage.setItem('lat',position.coords.latitude);
};

// onError Callback receives a PositionError object
//
function onGeoError(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


function onDeviceReady() {
   
    devicestring = device.uuid;
    console.log(devicestring);
    console.log("on device start");
    if (localStorage['fbloginflag'] == 1) {
        facebookStatus();
    }


}

function facebookLogin() {
    var fbLoginSuccess = function (userData) {
        console.log("login facebook");
        facebookStatus();
        console.log("UserInfo: " + JSON.stringify(userData));
        window.localStorage.setItem('fbloginflag',1);
    }

    facebookConnectPlugin.login(["public_profile"],
        fbLoginSuccess,
        function (error) { //alert("" + error) 
        }
    );
}

function facebookStatus() {
    console.log("run facebook status");
    
    //alert("UserInfo: " + JSON.stringify(userData));
    facebookConnectPlugin.getLoginStatus(
        function (status) {
            fbloginstatus = 1;
            console.log("current status: " + JSON.stringify(status));
            //fconsole.log(status.authResponse.userID);
            if (status.status == 'connected') {
                var loginobj = "";
                $.ajax({
                    async: false,
                    type: "POST",
                    dataType: "html",
                    url: "http://www.clubaroy.com/mobile/json/facebook2json.php", //Relative or absolute path to response.php file
                    data: { "facebook.id" : status.authResponse.userID },
                    success: function(data) {
                    console.log(data)

                    loginobj = JSON.parse(data);
                    var length = Object.keys(loginobj.data).length;
                    if (length > 0 ) {
                    console.log(loginobj)
                    console.log('Successful login for: ' + readJSON(loginobj.data[0].username));
                    $('#facebookname').html(readJSON(loginobj.data[0].firstname));
                    if (readJSON(loginobj.data[0].avatar) ==  "" || readJSON(loginobj.data[0].avatar) == null ) {
                        $('#userpicture').attr('src','assets/img/tmp/ava4.jpg');
                    } else {
                        $('#userpicture').attr('src','http://www.clubaroy.com/home/uploads/users/'+readJSON(loginobj.data[0].avatar));
                    }
                    sessionStorage.setItem('userid', readJSON(loginobj.data[0].id));           

                    sessionStorage.setItem('loginstatus', 1);
                    $('#lifav').show();
                    $('#lireview').show();
                    $('#lilogin').hide();
                    
                    $('#limyrec').show();
                    $('#userrecipe').attr('href','recipes.html?uid='+sessionStorage.getItem('userid')+'&method=2');
                    checkfavor();
                    
                    myApp.closeModal();
                    // console.log(html);
                    }
                    }
                });
                $('#lilogout').show();
                var ucobj = "";
                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: "http://www.clubaroy.com/mobile/json/rcommentuser2json.php", //Relative or absolute path to response.php file
                    data: { "user_id" : sessionStorage.getItem('userid')},
                    success: function(data) {
                    //console.log(data)

                    ucobj = JSON.parse(data);
                    var length = Object.keys(ucobj.data).length;
                    // console.log(length)
                    $('#bareview').html(length);
                    // console.log(html);
                    
                    }
                });

                var rxobj = "";
                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: "http://www.clubaroy.com/mobile/json/recipe2json.php", //Relative or absolute path to response.php file
                    data: { "uid" : sessionStorage.getItem('userid')},
                    success: function(data) {
                    //console.log(data)

                    rxobj = JSON.parse(data);
                    var length = Object.keys(rxobj.data).length;
                    // console.log(length)
                    $('#bamyrec').html(length);
                    // console.log(html);
                    
                    }
                })

                facebookConnectPlugin.api( "me/?fields=id,name", ["public_profile"],
                    function (response) { $('#facebookname').html(response.name); },
                    function (response) { // alert(JSON.stringify(response)) 
                    }); 
                myApp.closeModal();
                
            } else {
                facebookLogin();
            }
            //var options = { method:"feed" };
            //facebookConnectPlugin.showDialog(options,
            //    function (result) {
             //       //alert("Posted. " + JSON.stringify(result));             },
            //function (e) {
            //    alert("Failed: " + e);
            //    });
            }
        );
        


}


// Initialize app
function naxvarBg() {
    var navbar = $(".navbar-clear"), box = null, cls = "active";
    return 0 === navbar.length ? !1 : (box = navbar.next().find($(".page-on-center").length > 0 ? ".page-on-center .page-content" : ".page .page-content"), 
    box.scrollTop() > 10 ? navbar.addClass(cls) : navbar.removeClass(cls), void box.scroll(function() {
        $(this).scrollTop() > 40 ? navbar.addClass(cls) : navbar.removeClass(cls);
    }));
}

function readJSON(inputstring) {
    return decodeURI(inputstring).replace(/\+/g,' ').replace(/\%26/g,'&').replace(/\%40/g,'/').replace(/\%3A/g,':').replace(/\%2F/g,'/').replace(/\%3F/g,'?').replace(/\%3B/g,';').replace(/\%2C/g,',').replace(/\%3D/g,'=')
}

function useFa(object,value) {
    if (value == "yes") {
        $('#'+object).attr('class','fa fa-check')
    } else {
        $('#'+object).attr('class','fa fa-times')
    }
}

// ----comment-------------------------------------------------------------------------------------------------------------------

function readFile(file, rid) {
    var reader = new FileReader();
    var filename = "";
    reader.fileName = file.name;
    reader.onload = function(readerEvt) {
    
    filename = readerEvt.target.fileName;
    };
    reader.onloadend = function (readerEvt) {
        console.log(readerEvt.target.fileName);
        processFile(reader.result, file.type, rid, readerEvt.target.fileName);
    }

    reader.onerror = function () {
        alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
}

function processFile(dataURL, fileType, rid, filename) {
    var maxWidth = 8000;
    var maxHeight = 8000;

    var image = new Image();
    image.src = dataURL;

    image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);

        if (!shouldResize) {
            sendFile(dataURL, rid, filename);
            return;
        }

        var newWidth;
        var newHeight;

        if (width > height) {
            newHeight = height * (maxWidth / width);
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }

        var canvas = document.createElement('canvas');

        canvas.width = newWidth;
        canvas.height = newHeight;

        var context = canvas.getContext('2d');

        context.drawImage(this, 0, 0, newWidth, newHeight);

        dataURL = canvas.toDataURL(fileType);

        sendFile(dataURL, rid, filename);
    };

    image.onerror = function () {
        alert('There was an error processing your file!');
    };
}

function isUploadSupported() {
    if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
    }
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
};

function sendFile(fileData, rid, filename) {
    var formData = new FormData();

    formData.append('imageData', fileData);
    //myApp.alert("$('#commentbox1').val()","");
    formData.append('comment', $('#commentbox1').val());
    formData.append('userid', sessionStorage.getItem('userid'));
    formData.append('rid', rid);
    formData.append('filename', filename);
    formData.append('rating', $('#commentrating').val())
    //console.log(formData)

    $.ajax({
        type: 'POST',
        url: 'http://www.clubaroy.com/mobile/json/addrcomment2json.php',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            if (data == 1) {
                // alert('Your file was successfully uploaded!');
                $('#rcommentdiv').html("");
                var rcobj = "";
        
                    $.ajax({
                        type: "POST",
                        dataType: "html",
                        url: "http://www.clubaroy.com/mobile/json/rcomment2json.php", //Relative or absolute path to response.php file
                        data: { "restaurant_id" : rid },
                        success: function(data) {
                        //console.log(data)

                        rcobj = JSON.parse(data);
                        var length = Object.keys(rcobj.data).length;
                        html="";
                        var avatar = "";
                        for (var i=0; i < length; i++) {
                        // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
                        html = '<li class="swipeout">';
                        html+= '<div class="swipeout-content">';
                        html+= '<div class="item-content">';
                        html+= '<div class="item-inner comments-list">';
                        html+= '<div class="image">';
                        html+= '<span class="ava">';
                        if (readJSON(rcobj.data[i].avatar) == "" || readJSON(rcobj.data[i].avatar) == null) {
                            avatar = "assets/img/tmp/ava1.jpg";
                        } else {
                            avatar = "http://www.clubaroy.com/home/uploads/users/"+readJSON(rcobj.data[i].avatar);
                        }
                        html+= '<img src="'+avatar+'" alt="">';
                        html+= '</span>';
                        html+= '</div>';
                        html+= '<div class="text">';
                        html+= '<div class="info">';
                        var nickname = "";
                        if (rcobj.data[i].facebook_id != "" || rcobj.data[i].facebook_id != null) {
                            nickname = readJSON(rcobj.data[i].firstname);
                        } else {
                            nickname = readJSON(rcobj.data[i].username);
                        }
                        html+= '<span class="nick">'+nickname+'</span>';
                        html+= '<span class="data">'+readJSON(rcobj.data[i].created)+'</span>';
                        html+= '</div>';
                        html+= '<div class="comment">';
                        html+= '<span id=crating></span>'
                                    var xxhtml = "";
                            for ( var j=0; j < rcobj.data[i].rating; j++ ) {
                                if (j < rcobj.data[i].rating) {
                                    xxhtml += "<i class='fa fa-star'></i>";
                                } else {
                                    xxhtml += "<i class='fa fa-star-o'></i>";
                                }
                            }
                            html+= xxhtml+"<br><br>";

                        html+= readJSON(rcobj.data[i].detail).replace(/uploads/g,'..\/home\/uploads');
                        html+= '</div>';
                        html+= '</div>';
                        html+= '</div>';
                        html+= '</div>';
                        html+= '</div>';
                        html+= '<div class="swipeout-actions-right">';
                        html+= '<a href="#" class="action-green js-up">';
                        html+= '<i class="fa fa-thumbs-o-up"></i>';
                        html+= '</a>';
                        html+= '<a href="#" class="action-red js-down">';
                        html+= '<i class="fa fa-thumbs-o-down"></i>';
                        html+= '</a>';
                        html+= '</div>';
                        html+= '</li>';
                        $('#rcommentdiv').append(html);
                        
                        }
                    }
                });
            } else {
                alert('There was an error uploading your file!');
            }
        },
        error: function (data) {
            alert('There was an error uploading your file!');
        }
    });


}

function sendcomment(rid) {
    var formData = new FormData();

    formData.append('imageData', "");
    //myApp.alert("$('#commentbox1').val()","");
    formData.append('comment', $('#commentbox1').val());
    formData.append('userid', sessionStorage.getItem('userid'));
    formData.append('rid', rid);
    formData.append('filename', "");
    formData.append('rating', $('#commentrating').val())
    //console.log(formData)

    $.ajax({
        type: 'POST',
        url: 'http://www.clubaroy.com/mobile/json/addrcomment2json.php',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            if (data == 1) {
                // alert('Your file was successfully uploaded!');
                $('#rcommentdiv').html("");
                var rcobj = "";
        
                    $.ajax({
                        type: "POST",
                        dataType: "html",
                        url: "http://www.clubaroy.com/mobile/json/rcomment2json.php", //Relative or absolute path to response.php file
                        data: { "restaurant_id" : rid },
                        success: function(data) {
                        //console.log(data)

                        rcobj = JSON.parse(data);
                        var length = Object.keys(rcobj.data).length;
                        html="";
                        var avatar = "";
                        for (var i=0; i < length; i++) {
                        // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
                        html = '<li class="swipeout">';
                        html+= '<div class="swipeout-content">';
                        html+= '<div class="item-content">';
                        html+= '<div class="item-inner comments-list">';
                        html+= '<div class="image">';
                        html+= '<span class="ava">';
                        if (readJSON(rcobj.data[i].avatar) == "" || readJSON(rcobj.data[i].avatar) == null) {
                            avatar = "assets/img/tmp/ava1.jpg";
                        } else {
                            avatar = "http://www.clubaroy.com/home/uploads/users/"+readJSON(rcobj.data[i].avatar);
                        }
                        html+= '<img src="'+avatar+'" alt="">';
                        html+= '</span>';
                        html+= '</div>';
                        html+= '<div class="text">';
                        html+= '<div class="info">';
                        var nickname = "";
                        if (rcobj.data[i].facebook_id != "" || rcobj.data[i].facebook_id != null) {
                            nickname = readJSON(rcobj.data[i].firstname);
                        } else {
                            nickname = readJSON(rcobj.data[i].username);
                        }
                        html+= '<span class="nick">'+nickname+'</span>';
                        html+= '<span class="data">'+readJSON(rcobj.data[i].created)+'</span>';
                        html+= '</div>';
                        html+= '<div class="comment">';
                        html+= '<span id=crating></span>'
                                    var xxhtml = "";
                            for ( var j=0; j < rcobj.data[i].rating; j++ ) {
                                if (j < rcobj.data[i].rating) {
                                    xxhtml += "<i class='fa fa-star'></i>";
                                } else {
                                    xxhtml += "<i class='fa fa-star-o'></i>";
                                }
                            }
                            html+= xxhtml+"<br><br>";

                        html+= readJSON(rcobj.data[i].detail).replace(/uploads/g,'..\/home\/uploads');
                        html+= '</div>';
                        html+= '</div>';
                        html+= '</div>';
                        html+= '</div>';
                        html+= '</div>';
                        html+= '<div class="swipeout-actions-right">';
                        html+= '<a href="#" class="action-green js-up">';
                        html+= '<i class="fa fa-thumbs-o-up"></i>';
                        html+= '</a>';
                        html+= '<a href="#" class="action-red js-down">';
                        html+= '<i class="fa fa-thumbs-o-down"></i>';
                        html+= '</a>';
                        html+= '</div>';
                        html+= '</li>';
                        $('#rcommentdiv').append(html);
                        
                        }
                    }
                });
            } else {
                //alert('There was an error uploading your file!');
            }
        },
        error: function (data) {
            //alert('There was an error uploading your file!');
        }
    });


}

// ---------end comment -----------------------------------------------------------------


// ----recipe-------------------------------------------------------------------------------------------------------------------

function freadFile(file) {
    var reader = new FileReader();
    var filename = "";
    reader.fileName = file.name;
    reader.onload = function(readerEvt) {
    
    filename = readerEvt.target.fileName;
    };
    reader.onloadend = function (readerEvt) {
        console.log(readerEvt.target.fileName);
        fprocessFile(reader.result, file.type, readerEvt.target.fileName);
    }

    reader.onerror = function () {
        alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
}

function fprocessFile(dataURL, fileType, filename) {
    var maxWidth = 8000;
    var maxHeight = 8000;

    var image = new Image();
    image.src = dataURL;

    image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);

        if (!shouldResize) {
            fsendFile(dataURL, filename);
            return;
        }

        var newWidth;
        var newHeight;

        if (width > height) {
            newHeight = height * (maxWidth / width);
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }

        var canvas = document.createElement('canvas');

        canvas.width = newWidth;
        canvas.height = newHeight;

        var context = canvas.getContext('2d');

        context.drawImage(this, 0, 0, newWidth, newHeight);

        dataURL = canvas.toDataURL(fileType);

        fsendFile(dataURL, filename);
    };

    image.onerror = function () {
        alert('There was an error processing your file!');
    };
}



function fsendFile(fileData, filename) {
    var formData = new FormData();

    formData.append('imageData', fileData);
    //myApp.alert("$('#commentbox1').val()","");
    formData.append('userid', sessionStorage.getItem('userid'));
    formData.append('filename', filename);
    formData.append('title', $('#recipebox1').val())
    formData.append('detail', $('#recipebox2').val())
    //console.log(formData)

    $.ajax({
        type: 'POST',
        url: 'http://www.clubaroy.com/mobile/json/addrecipe2json.php',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            if (data == 1) {
                mainView.router.loadPage('recipes.html');
            } else {
                alert('There was an error uploading your file!');
            }
        },
        error: function (data) {
            alert('There was an error uploading your file!');
        }
    });


}

function fsendcomment() {
    var formData = new FormData();

    // formData.append('imageData', fileData);
    //myApp.alert("$('#commentbox1').val()","");
    formData.append('userid', sessionStorage.getItem('userid'));
    //formData.append('filename', filename);
    formData.append('title', $('#recipebox1').val())
    formData.append('detail', $('#recipebox2').val())
    formData.append('filename', "");
    //console.log(formData)

    $.ajax({
        type: 'POST',
        url: 'http://www.clubaroy.com/mobile/json/addrecipe2json.php',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            if (data == 1) {
                mainView.router.loadPage('recipes.html');
            } else {
                //alert('There was an error uploading your file!');
            }
        },
        error: function (data) {
            //alert('There was an error uploading your file!');
        }
    });


}

// ---------end recipe -----------------------------------------------------------------


// ----member-------------------------------------------------------------------------------------------------------------------

function mreadFile(file) {
    var reader = new FileReader();
    var filename = "";
    reader.fileName = file.name;
    reader.onload = function(readerEvt) {
    
    filename = readerEvt.target.fileName;
    };
    reader.onloadend = function (readerEvt) {
        console.log(readerEvt.target.fileName);
        mprocessFile(reader.result, file.type, readerEvt.target.fileName);
    }

    reader.onerror = function () {
        //alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
}

function mprocessFile(dataURL, fileType, filename) {
    var maxWidth = 8000;
    var maxHeight = 8000;

    var image = new Image();
    image.src = dataURL;

    image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);

        if (!shouldResize) {
            msendFile(dataURL, filename);
            return;
        }

        var newWidth;
        var newHeight;

        if (width > height) {
            newHeight = height * (maxWidth / width);
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }

        var canvas = document.createElement('canvas');

        canvas.width = newWidth;
        canvas.height = newHeight;

        var context = canvas.getContext('2d');

        context.drawImage(this, 0, 0, newWidth, newHeight);

        dataURL = canvas.toDataURL(fileType);

        msendFile(dataURL, filename);
    };

    image.onerror = function () {
        //alert('There was an error processing your file!');
    };
}



function msendFile(fileData, filename) {
    var formData = new FormData();

    formData.append('imageData', fileData);
    //myApp.alert("$('#commentbox1').val()","");
    formData.append('userid', sessionStorage.getItem('userid'));
    formData.append('filename', filename);
    formData.append('title', $('#recipebox1').val())
    formData.append('detail', $('#recipebox2').val())
    //console.log(formData)

    $.ajax({
        type: 'POST',
        url: 'http://www.clubaroy.com/mobile/json/addrecipe2json.php',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            if (data == 1) {
                mainView.router.loadPage('recipes.html');
            } else {
                //alert('There was an error uploading your file!');
            }
        },
        error: function (data) {
            //alert('There was an error uploading your file!');
        }
    });


}

// ---------end member -----------------------------------------------------------------





function showLineChart(obj) {
    var data = {
        labels: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
        datasets: [ {
            label: "My dataset",
            fillColor: fillColor,
            strokeColor: strokeColor,
            pointColor: pointColor,
            pointStrokeColor: pointStrokeColor,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: [ 65, 59, 80, 81, 56, 55, 40 ]
        } ]
    }, chart = new Chart(obj).Line(data, {
        responsive: !0,
        pointDotRadius: 5,
        pointDotStrokeWidth: 2,
        datasetStrokeWidth: 2,
        scaleFontSize: 10,
        tooltipFontSize: 12,
        scaleLineColor: "rgba(0, 0, 0, 0.1)",
        scaleBeginAtZero: !0,
        scaleShowGridLines: !0,
        scaleShowHorizontalLines: !0,
        scaleShowVerticalLines: !1
    });
    return chart;
}

function showLineChartPage(obj) {
    var data = {
        labels: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
        datasets: [ {
            label: "My dataset",
            fillColor: fillColor,
            strokeColor: strokeColor,
            pointColor: pointColor,
            pointStrokeColor: pointStrokeColor,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: [ 65, 59, 80, 81, 56, 55, 40 ]
        }, {
            label: "My dataset 2",
            fillColor: fillColor2,
            strokeColor: strokeColor2,
            pointColor: pointColor2,
            pointStrokeColor: pointStrokeColor2,
            pointHighlightFill: pointHighlightFill2,
            pointHighlightStroke: pointHighlightStroke2,
            data: [ 32, 34, 67, 12, 37, 55, 20 ]
        } ]
    }, chart = new Chart(obj).Line(data, {
        responsive: !0,
        pointDotRadius: 5,
        pointDotStrokeWidth: 2,
        datasetStrokeWidth: 2,
        scaleFontSize: 10,
        tooltipFontSize: 12,
        scaleLineColor: "rgba(0, 0, 0, 0.1)",
        scaleBeginAtZero: !0,
        scaleShowGridLines: !0,
        scaleShowHorizontalLines: !0,
        scaleShowVerticalLines: !1
    });
    return chart;
}

function showBarChartPage(obj) {
    var data = {
        labels: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
        datasets: [ {
            label: "My dataset",
            fillColor: fillColor,
            strokeColor: strokeColor,
            pointColor: pointColor,
            pointStrokeColor: pointStrokeColor,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: [ 65, 59, 80, 81, 56, 55, 40 ]
        }, {
            label: "My dataset 2",
            fillColor: fillColor2,
            strokeColor: strokeColor2,
            pointColor: pointColor2,
            pointStrokeColor: pointStrokeColor2,
            pointHighlightFill: pointHighlightFill2,
            pointHighlightStroke: pointHighlightStroke2,
            data: [ 32, 34, 67, 12, 37, 55, 20 ]
        } ]
    }, chart = new Chart(obj).Bar(data, {
        responsive: !0,
        pointDotRadius: 6,
        pointDotStrokeWidth: 2,
        datasetStrokeWidth: 2,
        scaleFontSize: 10,
        tooltipFontSize: 12,
        scaleLineColor: "rgba(0, 0, 0, 0.1)",
        scaleBeginAtZero: !0,
        scaleShowGridLines: !0,
        scaleShowHorizontalLines: !0,
        scaleShowVerticalLines: !1
    });
    return chart;
}

function showPieChartPage(obj) {
    var data = [ {
        value: 300,
        color: pointColor,
        highlight: pointColorHighlight,
        label: "Text 1"
    }, {
        value: 50,
        color: pointColor2,
        highlight: pointColorHighlight2,
        label: "Text 2"
    }, {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Text 3"
    } ], chart = new Chart(obj).Pie(data, {
        responsive: !0,
        tooltipFontSize: 12
    });
    return chart;
}

function showDoughnutChartPage(obj) {
    var data = [ {
        value: 300,
        color: pointColor,
        highlight: pointColorHighlight,
        label: "Text 1"
    }, {
        value: 50,
        color: pointColor2,
        highlight: pointColorHighlight2,
        label: "Text 2"
    }, {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Text 3"
    } ], chart = new Chart(obj).Doughnut(data, {
        responsive: !0,
        tooltipFontSize: 12
    });
    return chart;
}

function showRadarChartPage(obj) {
    var data = {
        labels: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
        datasets: [ {
            label: "My dataset",
            fillColor: fillColor,
            strokeColor: strokeColor,
            pointColor: pointColor,
            pointStrokeColor: pointStrokeColor,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: [ 65, 59, 80, 81, 56, 55, 40 ]
        }, {
            label: "My dataset 2",
            fillColor: fillColor2,
            strokeColor: strokeColor2,
            pointColor: pointColor2,
            pointStrokeColor: pointStrokeColor2,
            pointHighlightFill: pointHighlightFill2,
            pointHighlightStroke: pointHighlightStroke2,
            data: [ 32, 34, 67, 12, 37, 55, 20 ]
        } ]
    }, chart = new Chart(obj).Radar(data, {
        responsive: !0,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        datasetStrokeWidth: 2,
        scaleFontSize: 10,
        tooltipFontSize: 12,
        scaleLineColor: "rgba(0, 0, 0, 0.1)",
        scaleBeginAtZero: !0,
        scaleShowGridLines: !0,
        scaleShowHorizontalLines: !0,
        scaleShowVerticalLines: !1
    });
    return chart;
}

function initialize(lat,lng,map) {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapCanvas, mapOptions);
        return map;
}

function removefav(userid,restid) {
    $.ajax({
        
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/remove2json.php", //Relative or absolute path to response.php file
            data: { "userid" : userid, "restaurant_id" : restid },
            success: function(data) {
            console.log(data)

            

             }
        });
    $('#favorplace'+userid+restid).hide();

}

function addfav(userid,restid) {

     var tmpobj=""
        $.ajax({
        
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/heart2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : restid , "userid" : window.sessionStorage.getItem('userid') },
            success: function(data) {
            //console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";
            if (length == 1) {
                //console.log("checked")
                //$('#heart'+restaurant_id).removeClass('link fa fa-heart-o').addClass('link fa fa-heart');
                removefav(userid,restid);
                $('#heart'+restid).removeClass('link fa fa-heart').addClass('link fa fa-heart-o');
                $('#lheart'+restid).removeClass('link fa fa-heart').addClass('link fa fa-heart-o');
            } else {
                $.ajax({
        
                    type: "POST",
                    dataType: "html",
                    url: "http://www.clubaroy.com/mobile/json/addfav2json.php", //Relative or absolute path to response.php file
                    data: { "userid" : userid, "restaurant_id" : restid },
                    success: function(data) {
                    // console.log(data)

                    

                     }
                });
                myApp.alert("Favorite have been added", "");
                $('#heart'+restid).removeClass('link fa fa-heart-o').addClass('link fa fa-heart');
                $('#lheart'+restid).removeClass('link fa fa-heart-o').addClass('link fa fa-heart');
            }
        }
            
        });
    
 

}

function checkfavor() {
    var favorobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/favor2json.php", //Relative or absolute path to response.php file
            data: { "id" : sessionStorage.getItem('userid')},
            success: function(data) {
            console.log(data)

            favorobj = JSON.parse(data);
            var length = Object.keys(favorobj.data).length;
            // console.log(length)
            html="";

            // console.log(html);
            $('#bafav').html(Object.keys(favorobj.data).length);
            }
        });
     
}

function ratingcheck(restaurant_id, x){ 
        //console.log("start check ratiing");
        var rating = 0;
        var tmpobj=""
        $.ajax({
        
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rating2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : restaurant_id },
            success: function(data) {
            //console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
                rating = tmpobj.data[i].total;    
            }

                if (rating == "" || rating == null) {
                    rating = 0;
                } 
                 
                    if (rating == 1 || rating == 2 || rating == 3 || rating == 4 || rating == 5  ) {
                        html='<i class="fa fa-star"></i>';
                    } else {
                        html='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 2 || rating == 3 || rating == 4 || rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 3 || rating == 4 || rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 4 || rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                    
                        //console.log("x :: "+x);
                        //console.log("rating :: "+rating);
                        $('#rating'+x).html(html);

        }
        });
        
        

}

function favcheck(restaurant_id, x){ 
        //console.log("start check fav");
        var rating = 0;
        var tmpobj=""
        $.ajax({
        
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/heart2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : restaurant_id , "userid" : window.sessionStorage.getItem('userid') },
            success: function(data) {
            //console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";
            if (length == 1) {
                console.log("checked")
                $('#heart'+restaurant_id).removeClass('link fa fa-heart-o').addClass('link fa fa-heart');
            }
        }
            
        });
        
        

}

function lfavcheck(restaurant_id, x){ 
        //console.log("start check fav");
        var rating = 0;
        var tmpobj=""
        $.ajax({
        
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/heart2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : restaurant_id , "userid" : window.sessionStorage.getItem('userid') },
            success: function(data) {
            //console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";
            if (length == 1) {
                console.log("checked")
                $('#lheart'+restaurant_id).removeClass('link fa fa-heart-o').addClass('link fa fa-heart');
            }
        }
            
        });
        
        

}


function lratingcheck(restaurant_id, x){ 
        //console.log("start check ratiing");
        var rating = 0;
        var tmpobj=""
        $.ajax({
        
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rating2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : restaurant_id },
            success: function(data) {
            //console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
                rating = tmpobj.data[i].total;    
            }

                if (rating == "" || rating == null) {
                    rating = 0;
                } 
                 
                    if (rating == 1 || rating == 2 || rating == 3 || rating == 4 || rating == 5  ) {
                        html='<i class="fa fa-star"></i>';
                    } else {
                        html='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 2 || rating == 3 || rating == 4 || rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 3 || rating == 4 || rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 4 || rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                     if (rating == 5  ) {
                        html+='<i class="fa fa-star"></i>';
                    } else {
                        html+='<i class="fa fa-star-o"></i>';
                    }
                    
                        //console.log("x :: "+x);
                        //console.log("rating :: "+rating);
                        $('#lrating'+x).html(html);

        }
        });
        
        

}

function showPolarChartPage(obj) {
    var data = [ {
        value: 300,
        color: pointColor,
        highlight: pointColorHighlight,
        label: "Text 1"
    }, {
        value: 50,
        color: pointColor2,
        highlight: pointColorHighlight2,
        label: "Text 2"
    }, {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Text 3"
    } ], chart = new Chart(obj).PolarArea(data, {
        responsive: !0,
        scaleFontSize: 10,
        tooltipFontSize: 12
    });
    return chart;
}




  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  


var myApp = new Framework7({
    swipeBackPage: !1,
    pushState: !0,
    swipePanel: "left",
    modalTitle: "Title"
}), $$ = Dom7;

                                



$$("body").on("click", ".js-add-to-fav", function() {
    myApp.alert("You love this post!", "");
});

var mainView = myApp.addView(".view-main", {
    dynamicNavbar: !0
});



$$('.popup-login').on('opened', function () {



// ----------------login part ---------------------
var buttonpress = 0;
$('#facebookLogin').on('click', function() {
    facebookStatus();
})        

$('#loginclubaroy').click(function() {
    // console.log($('#usernameclubaroy').val());
    if ($('#usernameclubaroy').val() == "" || $('#usernameclubaroy').val() == null || $('#usernameclubaroy').val() == undefined || $('#passwordclubaroy').val() == "" || $('#passwordclubaroy').val() == null || $('#passwordclubaroy').val() == undefined) {
    myApp.alert("Please input username or password","");
    return false;
    }
    var loginobj = "";
        $.ajax({
            async: false,
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/username2json.php", //Relative or absolute path to response.php file
            data: { "username" : $('#usernameclubaroy').val()},
            success: function(data) {
            //console.log(data)

            loginobj = JSON.parse(data);
            var length = Object.keys(loginobj.data).length;
             //console.log(loginobj)
           

            
            // console.log(html);
            
            }
        });

    if ($('#passwordclubaroy').val() == readJSON(loginobj.data[0].password)) {
        //console.log('Successful login for: ' + readJSON(loginobj.data[0].username));
        $('#facebookname').html(readJSON(loginobj.data[0].firstname));
        if (readJSON(loginobj.data[0].avatar) ==  "" || readJSON(loginobj.data[0].avatar) == null ) {
            $('#userpicture').attr('src','assets/img/tmp/ava4.jpg');
        } else {
            $('#userpicture').attr('src','http://www.clubaroy.com/home/uploads/users/'+readJSON(loginobj.data[0].avatar));
        }
        sessionStorage.setItem('userid', readJSON(loginobj.data[0].id));
        sessionStorage.setItem('loginstatus', 1);
        $('#lifav').show();
        $('#lilogin').hide();
        $('#lireview').show();
        $('#limyrec').show();
        $('#lilogout').show();
        $('#userrecipe').attr('href','recipes.html?uid='+sessionStorage.getItem('userid')+'&method=2');
        checkfavor();
        myApp.closeModal();
        var ucobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rcommentuser2json.php", //Relative or absolute path to response.php file
            data: { "user_id" : sessionStorage.getItem('userid')},
            success: function(data) {
            //console.log(data)

            ucobj = JSON.parse(data);
            var length = Object.keys(ucobj.data).length;
            // console.log(length)
            $('#bareview').html(length);
            // console.log(html);
            
            }
        });

        var rxobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/recipe2json.php", //Relative or absolute path to response.php file
            data: { "uid" : sessionStorage.getItem('userid')},
            success: function(data) {
            //console.log(data)

            rxobj = JSON.parse(data);
            var length = Object.keys(rxobj.data).length;
            // console.log(length)
            $('#bamyrec').html(length);
            // console.log(html);
            
            }
        });
        window.localStorage.setItem("userid", window.sessionStorage.getItem('userid'));
        window.localStorage.setItem("logintype", 'normal');
        window.localStorage.setItem("username", $('#usernameclubaroy').val());
        window.localStorage.setItem("userpw", $('#passwordclubaroy').val());
    } else {
    myApp.alert("Incorrect username or password","");
    return false;
        
    }


})
//-------------------------------------------------




});

$$(".popup-splash").on("opened", function() {
    myApp.swiper(".swiper-container", {
        speed: 400,
        pagination: ".swiper-pagination",
        paginationBulletRender: function(index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        }
    });
}), $$(document).on("pageAfterAnimation", function(e) {
    var page = e.detail.page;
    if ("restaurant" == page.name) {
        var mySwiper = new Swiper ('.swiper-container', {
            // Optional parameters
            
            loop: true,
            
            // If we need pagination
            
            
            // Navigation arrows
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            
            // And if we need scrollbar
            
          })
    }

    if ("" == page.name || "index" == page.name) {
        $('#imagemap1').hide();
        $('#imagemap2').show();
        $('map').imageMapResize();
        
        $('map[name=clubaroi1] area').click(function(){
            console.log('1');
             //alert($(this).attr('id'));
             if ($(this).attr('id') == "aroidara") {
             mainView.router.loadPage('vdo.html?video_type=1&jsonfile=video&offset=0');
             } else if ($(this).attr('id') == "aroiduni") {
             mainView.router.loadPage('university.html?jsonfile=universities');
             } else if ($(this).attr('id') == "aroiwanni") {
             mainView.router.loadPage('favorite.html?offset=0&rand=1');
             } else if ($(this).attr('id') == "aroisala") {
             mainView.router.loadPage('salary.html');
             } else if ($(this).attr('id') == "aroitravel") {
             mainView.router.loadPage('travel.html');
             } else if ($(this).attr('id') == "aroidstar") {
             mainView.router.loadPage('#');
             } else if ($(this).attr('id') == "aroidcat") {
             mainView.router.loadPage('category2.html');
             } else if ($(this).attr('id') == "aroidprov") {
             mainView.router.loadPage('province.html');
             } else if ($(this).attr('id') == "aroidsonjon") {
             mainView.router.loadPage('vdo.html?video_type=0&jsonfile=video&offset=0');
             } else if ($(this).attr('id') == "aroical") {
             mainView.router.loadPage('cal.html');
             }
        })
    }
    if ($(".page-on-center .chart-content").length > 0) {
        var ctx = document.querySelector(".page-on-center .chart-content").getContext("2d");
        showLineChart(ctx);
    }
    if ($(".page-on-center .line-chart-content").length > 0) {
        var ctx = document.querySelector(".page-on-center .line-chart-content").getContext("2d");
        showLineChartPage(ctx);
    }
    if ($(".page-on-center .bar-chart-content").length > 0) {
        var ctx = document.querySelector(".page-on-center .bar-chart-content").getContext("2d");
        showBarChartPage(ctx);
    }
    if ($(".page-on-center .pie-chart-content").length > 0) {
        var ctx = document.querySelector(".page-on-center .pie-chart-content").getContext("2d");
        showPieChartPage(ctx);
    }
    if ($(".page-on-center .doughnut-chart-content").length > 0) {
        var ctx = document.querySelector(".page-on-center .doughnut-chart-content").getContext("2d");
        showDoughnutChartPage(ctx);
    }
    if ($(".page-on-center .radar-chart-content").length > 0) {
        var ctx = document.querySelector(".page-on-center .radar-chart-content").getContext("2d");
        showRadarChartPage(ctx);
    }
    if ($(".page-on-center .polar-chart-content").length > 0) {
        var ctx = document.querySelector(".page-on-center .polar-chart-content").getContext("2d");
        showPolarChartPage(ctx);
    }
    naxvarBg();
}), $$(document).on("pageInit", function(e) {


    var page = e.detail.page;
	console.log(page.name)
    $(".zoom").swipebox(), $(".navbar").removeClass("navbar-clear"), ("index" === page.name || "menu" === page.name || "login" === page.name || "dashboard-1" === page.name || "panel" === page.name) && $(".navbar").addClass("navbar-clear"), 
    $(".twitter-content").length > 0 && $(".twitter-content").twittie({
        count: 10
    }), $(".tweet").length > 0 && $(".tweet").twittie({
        count: 1
    }), $(".flickr-content").length > 0 && $(".flickr-content").jflickrfeed({
        limit: 15,
        qstrings: {
            id: "44244432@N03"
        },
        itemTemplate: '<li><a href="{{image_m}}" class="flickr"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
    }, function(data) {
        $(".flickr-content li a").swipebox();
    }), $(".js-validate").length > 0 && $("body").on("click", ".js-form-submit", function() {
        var form = $(this).parents("form"), valid = form.valid();
        if ("contact" === page.name && valid) {
            var data = form.serializeObject();
            myApp.showPreloader(), $.post("/email.php", data).done(function(data) {
                myApp.hidePreloader();
                var response = JSON.parse(data);
                response.error ? myApp.alert(response.msg, "") : (myApp.alert(response.msg, ""), 
                form.find("input[type=text], input[type=email], textarea").val(""));
            });
        }
    });
    // Conversation flag
    var conversationStarted = !1, myMessages = myApp.messages(".messages", {
        autoLayout: !0
    }), myMessagebar = myApp.messagebar(".messagebar");
    // Handle message
    $$(".messagebar .link").on("click", function() {
        // Message text
        var messageText = myMessagebar.value().trim();
        // Exit if empy message
        if (0 !== messageText.length) {
            // Empty messagebar
            myMessagebar.clear();
            // Random message type
            var avatar, name, messageType = [ "sent", "received" ][Math.round(Math.random())];
            "received" === messageType && (avatar = "http://lorempixel.com/output/people-q-c-100-100-9.jpg", 
            name = "Kate"), // Add message
            myMessages.addMessage({
                // Message text
                text: messageText,
                // Random message type
                type: messageType,
                // Avatar and name:
                avatar: avatar,
                name: name,
                // Day
                day: conversationStarted ? !1 : "Today",
                time: conversationStarted ? !1 : new Date().getHours() + ":" + new Date().getMinutes()
            }), // Update conversation flag
            conversationStarted = !0;
        }
    });

    if ("" == page.name || "index" == page.name) {
        


        $('#searchall').keypress(function(e) {
            if(e.which == 13) {
                mainView.router.loadPage('favorite.html?offset=0&rand=2&xstring='+$('#searchall').val());
            }
        });

        var ucobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rcommentuser2json.php", //Relative or absolute path to response.php file
            data: { "user_id" : sessionStorage.getItem('userid')},
            success: function(data) {
            //console.log(data)

            ucobj = JSON.parse(data);
            var length = Object.keys(ucobj.data).length;
            // console.log(length)
            $('#bareview').html(length);
            // console.log(html);
            
            }
        });


        $('#registeruser1').on('click', function () {
            $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/adduser2json.php", //Relative or absolute path to response.php file
            data: { "name" : $('#name').val(), "lastname" : $('#lastname').val(), "email" : $('#email').val(), "gender" : $('#gender').val(), "userpassword" : $('#password').val() },
            success: function(data) {
            console.log(data)
            if (data == 1) {
              console.log("finish")
              myApp.closeModal();
              mainView.router.loadPage('index.html');
            } else {
                alert("This email have been used already");
            }

            // console.log(length)
            
            // console.log(html);
            
            }
        });
        })
    }

	if ("favorite" == page.name) { 

        $('#backfavorite').on('click', function() {
            mainView.router.back();
        });

        var postdata = {};
        if ( page.query.rand == 1 ) {
            postdata['offset'] = page.query.offset;
            postdata['rand'] = page.query.rand;
            $('#randheader').html('วันนี้กินอะไรดี');
        } else if (page.query.rand == 2) {
            postdata['offset'] = page.query.offset;
            postdata['rand'] = page.query.rand;
            postdata['xstring'] = page.query.xstring;
            $('#randheader').html('ผลการค้นหา');

        } else {
            postdata['offset'] = 0;
            $('#randheader').html('ร้านสุดโปรด');
        }
		console.log(postdata);
	    

var loading = false;
 
// Last loaded index
var lastIndex = $$('.list-block li').length;
 
// Max items to load
var maxItems = 1000;
 
// Append items per load
var itemsPerLoad = 10;
 
// Attach 'infinite' event handler
$$('.infinite-scroll').on('infinite', function () {
 
  // Exit, if loading in progress
  if (loading) return;
 
  // Set loading flag
  loading = true;
 
  // Emulate 1s loading
  setTimeout(function () {
    // Reset loading flag
    loading = false;
 
    if (lastIndex >= maxItems) {
      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
      myApp.detachInfiniteScroll($$('.infinite-scroll'));
      // Remove preloader
      $$('.infinite-scroll-preloader').remove();
      return;
    }


    postdata['offset'] = lastIndex;

		$.ajax({
			type: "POST",
			dataType: "html",
			url: "http://www.clubaroy.com/mobile/json/restaurantshow2json.php", //Relative or absolute path to response.php file
			data: postdata,
			success: function(data) {
			// console.log(data)

			tmpobj = JSON.parse(data);
			var length = Object.keys(tmpobj.data).length;
			// console.log(length)
			html="";

			for (var i=0; i < length; i++) {
                
                
                
			// console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
			// console.log('i: '+i)	
			//html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<li class="card">';
                    html+='<div class="card-header">';
                    html+='<div class="facebook-name">'+readJSON(tmpobj.data[i].title_th)+'</div>';
                    if ( sessionStorage.getItem('userid') == "" || sessionStorage.getItem('userid') == null ) {
                        html+='<div class="facebook-date"></div>';
                    } else {
                        html+='<div class="facebook-date"><a href="#" onclick="addfav('+sessionStorage.getItem('userid')+','+tmpobj.data[i].restaurant_id+')"><i id=heart'+tmpobj.data[i].restaurant_id+' class="link fa fa-heart-o"></i></a></div>';
                    
                    }
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
                    html+='<p><i class="fa fa-map-marker"></i>'+readJSON(tmpobj.data[i].address_th)+'|'+readJSON(tmpobj.data[i].rname_th)+'</p>';
                    html+='<img src="http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+'" width="100%">';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="card-footer">';
                    html+='<a href="#" class="link">';
                    html+='<input type=hidden name=restaurant-hidden id="resthid'+i+'" value="'+tmpobj.data[i].restaurant_id+'">';
                    html+='<span id="rating'+i+'" class="rating blog-rating">';
                    
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    html+='</span>';
                    html+='</a>';
                    html+='<a href="#" class="link"></a>';
                    html+='<a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'" class="link">View</a>';
                    html+='</div>';
                    html+='</li>';

                    $("#fav").append(html);
                    (function (i) {
                    favcheck(tmpobj.data[i].restaurant_id, i);
                    ratingcheck(tmpobj.data[i].restaurant_id, i);
                    }(i))

                    
                    
            }
			// console.log(html);
			
			}
		});
    // Update last loaded index
    lastIndex = $$('.list-block li').length;
  }, 1000);
});    
        

$.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/restaurantshow2json.php", //Relative or absolute path to response.php file
            data: postdata,
            success: function(data) {
            // console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
                
                
                
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            // console.log('i: '+i) 
            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<li class="card">';
                    html+='<div class="card-header">';
                    html+='<div class="facebook-name">'+readJSON(tmpobj.data[i].title_th)+'</div>';
                    if ( sessionStorage.getItem('userid') == "" || sessionStorage.getItem('userid') == null ) {
                        html+='<div class="facebook-date"></div>';
                    } else {
                        html+='<div class="facebook-date"><a href="#" onclick="addfav('+sessionStorage.getItem('userid')+','+tmpobj.data[i].restaurant_id+')"><i id=heart'+tmpobj.data[i].restaurant_id+' class="link fa fa-heart-o"></i></a></div>';
                    
                    }
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
                    html+='<p><i class="fa fa-map-marker"></i>'+readJSON(tmpobj.data[i].address_th)+'|'+readJSON(tmpobj.data[i].rname_th)+'</p>';
                    html+='<img src="http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+'" width="100%">';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="card-footer">';
                    html+='<a href="#" class="link">';
                    html+='<input type=hidden name=restaurant-hidden id="resthid'+i+'" value="'+tmpobj.data[i].restaurant_id+'">';
                    html+='<span id="rating'+i+'" class="rating blog-rating">';
                    
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    html+='</span>';
                    html+='</a>';
                    html+='<a href="#" class="link"></a>';
                    html+='<a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'" class="link">View</a>';
                    html+='</div>';
                    html+='</li>';

                    $("#fav").append(html);
                    (function (i) {
                        favcheck(tmpobj.data[i].restaurant_id, i);
                    ratingcheck(tmpobj.data[i].restaurant_id, i);
                    }(i))

                    
                    
            }
            // console.log(html);
            
            }
        });
	// end new code
		
	}
    if ("restaurant" == page.name) {
        //console.log("Checkpoint #2");
        $('#favback').on('click', function() {
            mainView.router.back();
        })


    if ( sessionStorage.getItem('userid') == "" || sessionStorage.getItem('userid') == null ) {
            $('#loginfirst').hide();
    } else {
            $('#loginfirst').show();                    
    }

        var rid = page.query.rid;
        var map = "";

        var tmpobj=""

        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/galleries-multiple2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : rid },
            success: function(data) {
            //console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";
          
            for (var i=0; i < length; i++) {
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
                
            html+='<div class="swiper-slide"><img src="http://www.clubaroy.com/home/uploads/galleries/'+tmpobj.data[i].image+'" width="100%"/></div>'
            }

            //console.log(html);
            $("#restaurantslide").html(html);
            }
        });
                  
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/restaurant-single2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : rid },
            success: function(data) {
            //console.log(data)

            tmpobj = JSON.parse(data);
            var length = Object.keys(tmpobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            $('#restaurantname').html(readJSON(tmpobj.data[i].title_th))
            $('#ads').html(readJSON(tmpobj.data[i].address_th))
            $('#res1').html(readJSON(tmpobj.data[i].title_th))
            $('#res2').html(readJSON(tmpobj.data[i].menu_th))
            $('#res3').html(readJSON("เปิด "+tmpobj.data[i].open_th)+" / ปิด "+readJSON(tmpobj.data[i].close_th))
            $('#res4').html(useFa("res4",readJSON(tmpobj.data[i].parking)));
            $('#res5').html(useFa("res5",readJSON(tmpobj.data[i].credit_card)));
            $('#res6').html(useFa("res6",readJSON(tmpobj.data[i].delivery)));
            $('#res7').html(useFa("res7",readJSON(tmpobj.data[i].discount)));
            $('#res8').html(readJSON(tmpobj.data[i].seat))    
            $('#res9').html(readJSON(tmpobj.data[i].average_price))
            $('#res10').html(readJSON(tmpobj.data[i].direction_th))

            google.maps.event.addDomListener(window, 'load', map = initialize(tmpobj.data[i].lat,tmpobj.data[i].lng)); 
            var myLatLng = new google.maps.LatLng(tmpobj.data[i].lat, tmpobj.data[i].lon,map);
            //console.log(tmpobj.data[i].lat)
            //console.log(tmpobj.data[i].lon)
            map.setCenter(myLatLng)
            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            var marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              icon: iconBase + 'schools_maps.png'
            });
            }

            }
        });
        //loading map
        var rcobj = "";
        console.log(rid);
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rcomment2json.php", //Relative or absolute path to response.php file
            data: { "restaurant_id" : rid },
            success: function(data) {
            //console.log(data)

            rcobj = JSON.parse(data);
            var length = Object.keys(rcobj.data).length;
            html="";
            var avatar = "";
            for (var i=0; i < length; i++) {
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            html = '<li class="swipeout">';
            html+= '<div class="swipeout-content">';
            html+= '<div class="item-content">';
            html+= '<div class="item-inner comments-list">';
            html+= '<div class="image">';
            html+= '<span class="ava">';
            if (readJSON(rcobj.data[i].avatar) == "" || readJSON(rcobj.data[i].avatar) == null) {
                            avatar = "assets/img/tmp/ava1.jpg";
                        } else {
                            avatar = "http://www.clubaroy.com/home/uploads/users/"+readJSON(rcobj.data[i].avatar);
                        }
            html+= '<img src="'+avatar+'" alt="">';
            html+= '</span>';
            html+= '</div>';
            html+= '<div class="text">';
            html+= '<div class="info">';
            var nickname = "";
            if (rcobj.data[i].facebook_id != "" || rcobj.data[i].facebook_id != null) {
                nickname = readJSON(rcobj.data[i].firstname);
            } else {
                nickname = readJSON(rcobj.data[i].username);
            }
            html+= '<span class="nick">'+nickname+'</span>';
            html+= '<span class="data">'+readJSON(rcobj.data[i].created)+'</span>';
            html+= '</div>';
            html+= '<div class="comment">';
            html+= '<span id=crating'+i+'></span>'
                        var xxhtml = "";
            for ( var j=0; j < rcobj.data[i].rating; j++ ) {
                if (j < rcobj.data[i].rating) {
                    xxhtml += "<i class='fa fa-star'></i>";
                } else {
                    xxhtml += "<i class='fa fa-star-o'></i>";
                }
            }
            html+= xxhtml+"<br><br>";

            html+= readJSON(rcobj.data[i].detail).replace(/uploads/g,'..\/home\/uploads');
            html+= '</div>';
            html+= '</div>';
            html+= '</div>';
            html+= '</div>';
            html+= '</div>';
            html+= '<div class="swipeout-actions-right">';
            html+= '<a href="#" class="action-green js-up">';
            html+= '<i class="fa fa-thumbs-o-up"></i>';
            html+= '</a>';
            html+= '<a href="#" class="action-red js-down">';
            html+= '<i class="fa fa-thumbs-o-down"></i>';
            html+= '</a>';
            html+= '</div>';
            html+= '</li>';
            $('#rcommentdiv').append(html);

            }
        }
    });
    $('#addcomment').on('click', function () {  
    console.log('click 0');
    var file = ""  
    if (window.File && window.FileReader && window.FormData) {
        var $inputField = $('#file');

        $inputField.on('change', function (e) {
            file = e.target.files[0];

        
            console.log('click 1');
            if (file) {
                if (/^image\//i.test(file.type)) {
                    readFile(file, page.query.rid);
                    console.log('click 2');
                } else {
                   alert('Not a valid image!');
                   console.log('click 3');
                    
                }
            } 
        })    
            
        
    } 
    console.log(file);
    if (file == "" || file == null) {

        sendcomment(page.query.rid);
        console.log('click 4');
    }
       
});
    //$('#r1').on('mouseleave', function() {
    //    $('#r1').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //});
    $('#r1').on('mouseenter touchstart', function() {
        $('#r1').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r2').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#r3').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#r4').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#r5').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#commentrating').val("1");
    });

    //$('#r2').on('mouseleave', function() {
    //    $('#r1').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r2').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //});
    $('#r2').on('mouseenter touchstart', function() {
        $('#r1').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r2').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r3').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#r4').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#r5').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#commentrating').val("2");
    });

    //$('#r3').on('mouseleave', function() {
    //    $('#r1').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r2').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r3').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //});
    $('#r3').on('mouseenter touchstart', function() {
        $('#r1').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r2').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r3').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r4').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#r5').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#commentrating').val("3");
    });

    //$('#r4').on('mouseleave', function() {
    //    $('#r1').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r2').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r3').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r4').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //});
    $('#r4').on('mouseenter touchstart', function() {
        $('#r1').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r2').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r3').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r4').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r5').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x')
        $('#commentrating').val("4");
    });

    //$('#r5').on('mouseleave', function() {
    //    $('#r1').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r2').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r3').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r4').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //    $('#r5').removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    //});
    $('#r5').on('mouseenter touchstart', function() {
        $('#r1').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r2').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r3').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r4').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#r5').removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x');
        $('#commentrating').val("5");
    });

    $('#r1').on('click', function() { 
        $('#commentrating').val("1");
    });

    $('#r2').on('click', function() { 
        $('#commentrating').val("2");
    });

    $('#r3').on('click', function() { 
        $('#commentrating').val("3");
    });

    $('#r4').on('click', function() { 
        $('#commentrating').val("4");
    });

    $('#r5').on('click', function() { 
        $('#commentrating').val("5");
    });
    }

if ("list" == page.name) {

        //console.log("Checkpoint #1");
        var myLoc = new google.maps.LatLng(sessionStorage['lat'], sessionStorage['lng']);

        var offset = 0;
        var rating = [];
    // new code 
        
        var tmpobj=""


        var loading = false;
         
        // Last loaded index
        var lastIndex = 10;
        //console.log('lastIndex: '+lastIndex)
         
        // Max items to load
        var maxItems = 1000;
         
        // Append items per load
        var itemsPerLoad = 10;

        // Attach 'infinite' event handler
       
         
          // Emulate 1s loading
          

            var postdata = {};

        
            $.ajax({
                type: "POST",
                dataType: "html",
                url: "http://www.clubaroy.com/mobile/json/"+page.query.file+".php", //Relative or absolute path to response.php file
                data: { "offset" : offset , "cat" : page.query.cat , "salary" : page.query.salary},
                success: function(data) {
                // console.log(data)

                tmpobj = JSON.parse(data);
                var length = Object.keys(tmpobj.data).length;
                if (length < 1) {
                    myApp.alert("no result(s) found" , "");
                    return 0;
                }
                // console.log(length)
                shtml="";

                for (var i=0; i < length; i++) {
                (function(i){
                    rating[i] = ratingcheck(tmpobj.data[i].restaurant_id);
                    var shopLoc = new google.maps.LatLng(tmpobj.data[i].lat, tmpobj.data[i].lon);
                    var distance = google.maps.geometry.spherical.computeDistanceBetween (myLoc, shopLoc);
                    
                    // console.log(rating[i]);
                // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
                    // console.log('i: '+i)
                    //console.log(tmpobj.data[i]);
                    if (page.query.distance == null || page.query.distance == "" || page.query.distance === 'undefined') {
                    // console.log("1"); 
                    // html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'
                    html='<li class="card">';
                    html+='<div class="card-header">';
                    html+='<div class="facebook-name">'+readJSON(tmpobj.data[i].title_th)+'</div>';
                    if ( sessionStorage.getItem('userid') == "" || sessionStorage.getItem('userid') == null ) {
                        html+='<div class="facebook-date"></div>';
                    } else {
                        html+='<div class="facebook-date"><a href="#" onclick="addfav('+sessionStorage.getItem('userid')+','+tmpobj.data[i].restaurant_id+')"><i id=lheart'+tmpobj.data[i].restaurant_id+' class="link fa fa-heart-o"></i></a></div>';
                    
                    }
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
                    html+='<p><i class="fa fa-map-marker"></i>'+readJSON(tmpobj.data[i].address_th)+'|'+readJSON(tmpobj.data[i].rname_th)+'</p>';
                    html+='<img src="http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+'" width="100%">';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="card-footer">';
                    html+='<a href="#" class="link">';
                    html+='<input type=hidden name=restaurant-hidden id="resthid'+i+'" value="'+tmpobj.data[i].restaurant_id+'">';
                    html+='<span id="lrating'+i+'" class="rating blog-rating">';
                    
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    html+='</span>';
                    html+='</a>';
                    html+='<a href="#" class="link"></a>';
                    html+='<a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'" class="link">View</a>';
                    html+='</div>';
                    html+='</li>';

                    $("#lfav").append(html);
                    (function (i) {
                        lfavcheck(tmpobj.data[i].restaurant_id, i);
                    lratingcheck(tmpobj.data[i].restaurant_id, i);
                    }(i))


                    } else { 
                    // console.log("2")
                    // console.log(distance);
                        if (distance <= page.query.cat) {
                            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'
                            html='<li class="card">';
                    html+='<div class="card-header">';
                    html+='<div class="facebook-name">'+readJSON(tmpobj.data[i].title_th)+'</div>';
                    if ( sessionStorage.getItem('userid') == "" || sessionStorage.getItem('userid') == null ) {
                        html+='<div class="facebook-date"></div>';
                    } else {
                        html+='<div class="facebook-date"><a href="#" onclick="addfav('+sessionStorage.getItem('userid')+','+tmpobj.data[i].restaurant_id+')"><i class="link fa fa-heart-o"></i></a></div>';
                    
                    }
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
                    html+='<p><i class="fa fa-map-marker"></i>'+readJSON(tmpobj.data[i].address_th)+'|'+readJSON(tmpobj.data[i].rname_th)+'</p>';
                    html+='<img src="http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+'" width="100%">';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="card-footer">';
                    html+='<a href="#" class="link">';
                    html+='<input type=hidden name=restaurant-hidden id="resthid'+i+'" value="'+tmpobj.data[i].restaurant_id+'">';
                    html+='<span id="lrating'+i+'" class="rating blog-rating">';
                    
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    html+='</span>';
                    html+='</a>';
                    html+='<a href="#" class="link"></a>';
                    html+='<a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'" class="link">View</a>';
                    html+='</div>';
                    html+='</li>';

                    $("#lfav").append(html);
                    (function (i) {
                        lfavcheck(tmpobj.data[i].restaurant_id, i);
                    lratingcheck(tmpobj.data[i].restaurant_id, i);
                    }(i))
                        }
                    }    
            
                    }(i))
                    
                    }
                    //console.log(shtml);
                    $('#lfav').append(shtml);    
                }
            });
            //console.log('loading: '+loading)
            // Append new items
            
         
            // Update last loaded index
            
            $('#listback').on('click', function () {
                mainView.router.back();
            })
    // end new code
        
    }

    if ("market" == page.name) {
        $('#backmarket').on('click', function() {
            mainView.router.back();
        });
        var marketobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/market2json.php", //Relative or absolute path to response.php file
            data: { offset : 0 },
            success: function(data) {
            // console.log(data)

            marketobj = JSON.parse(data);
            var length = Object.keys(marketobj.data).length;
            console.log(marketobj)
            var html1="";
            var html2="";
            var html3="";

            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
            if (marketobj.data[i].price_type_id == 1 ) {
                html1+='<li class="item-content">';
                html1+='<div class="item-inner">';
                html1+='<div class="item-title">'+readJSON(marketobj.data[i].name_th)+'</div>';
                html1+='<div class="item-after">'+marketobj.data[i].price+' <img src="assets/themes/clubaroy/img/bath.jpg" alt=""/> '+readJSON(marketobj.data[i].unit_th)+'</div>';
                html1+='</div>';
                html1+='</li>';
            } else if (marketobj.data[i].price_type_id == 2) {
                html2+='<li class="item-content">';
                html2+='<div class="item-inner">';
                html2+='<div class="item-title">'+readJSON(marketobj.data[i].name_th)+'</div>';
                html2+='<div class="item-after">'+marketobj.data[i].price+' <img src="assets/themes/clubaroy/img/bath.jpg" alt=""/> '+readJSON(marketobj.data[i].unit_th)+'</div>';
                html2+='</div>';
                html2+='</li>';
            } else {
                html3+='<li class="item-content">';
                html3+='<div class="item-inner">';
                html3+='<div class="item-title">'+readJSON(marketobj.data[i].name_th)+'</div>';
                html3+='<div class="item-after">'+marketobj.data[i].price+' <img src="assets/themes/clubaroy/img/bath.jpg" alt=""/> '+readJSON(marketobj.data[i].unit_th)+'</div>';
                html3+='</div>';
                html3+='</li>';
            }
            }(i))
            // console.log(html);

            }
            $("#market1").html(html1);
            $("#market2").html(html2);
            $("#market3").html(html3);
        }
        });
    }

    if ("promotion" == page.name) {
        $('#backpromotion').on('click', function() {
            mainView.router.back();
        });
        var promotionobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/coupon2json.php", //Relative or absolute path to response.php file
            data: { offset : 0 },
            success: function(data) {
            // console.log(data)

            promotionobj = JSON.parse(data);
            var length = Object.keys(promotionobj.data).length;
            console.log(promotionobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                
            if (i % 2 == 0 ) {
                html+='<div class="left" style="width:48%; margin-left:auto; margin-right:auto; margin-bottom:50px;">';
                html+='<a href="http://www.clubaroy.com/home/uploads/coupons/'+promotionobj.data[i].image_th+'" data-lightbox="lightbox'+i+'"><img class="example-image" src="http://www.clubaroy.com/home/uploads/coupons/'+promotionobj.data[i].image_th+'" alt=""/></a>';
                html+='</div>';
              
            } else  {
                html+='<div class="right" style="width:48%; margin-left:auto; margin-right:auto; margin-bottom:50px;">';
                html+='<a href="http://www.clubaroy.com/home/uploads/coupons/'+promotionobj.data[i].image_th+'" data-lightbox="lightbox'+i+'"><img class="example-image" src="http://www.clubaroy.com/home/uploads/coupons/'+promotionobj.data[i].image_th+'" alt=""/></a>';
                html+='</div>';
            } 
            }(i))
            // console.log(html);

            }
            $("#promotion").html(html);

        }
        });


    }

    if ("news" == page.name) {
        $('#backnews').on('click', function() {
            mainView.router.back();
        });
        var newsobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/news2json.php", //Relative or absolute path to response.php file
            data: { offset : 0 },
            success: function(data) {
            // console.log(data)

            newsobj = JSON.parse(data);
            var length = Object.keys(newsobj.data).length;
            console.log(newsobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                html+='<li>';
                html+='<a href="content.html?id='+readJSON(newsobj.data[i].id)+'&jsonfile=news" class="item-link item-content">';
                html+='<div class="item-media"><img src="http://www.clubaroy.com/home/uploads/contents/'+readJSON(newsobj.data[i].thumbnail_th)+'" width="80"></div>';
                html+='<div class="item-inner">';
                html+='<div class="item-title-row">';
                html+='<div class="item-text-row" style="color: #000000; font-size: 16px;">'+readJSON(newsobj.data[i].title_th)+'</div>';
                html+='<div class="item-after"></div>';
                html+='</div>';
                
                html+='<div class="item-text-row">'+readJSON(newsobj.data[i].updated)+'</div>';
                html+='<div class="item-text">'+readJSON(newsobj.data[i].intro_th)+'</div>';
                html+='</div>';
                html+='</li>';
            
            }(i))
            // console.log(html);

            }
            $("#news").html(html);

        }
        });
    }

    if ("technic" == page.name) {
        $('#backtechnic').on('click', function() {
            mainView.router.back();
        });
        var technicobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/technic2json.php", //Relative or absolute path to response.php file
            data: { offset : 0 },
            success: function(data) {
            // console.log(data)

            technicobj = JSON.parse(data);
            var length = Object.keys(technicobj.data).length;
            console.log(technicobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                html+='<li>';
                html+='<a href="content.html?id='+readJSON(technicobj.data[i].id)+'&jsonfile=technic" class="item-link item-content">';
                html+='<div class="item-media"><img src="http://www.clubaroy.com/home/uploads/contents/'+readJSON(technicobj.data[i].thumbnail_th)+'?id='+readJSON(technicobj.data[i].id)+'" width="80"></div>';
                html+='<div class="item-inner">';
                html+='<div class="item-title-row">';
                html+='<div class="item-text-row" style="color: #000000; font-size: 16px;">'+readJSON(technicobj.data[i].title_th)+'</div>';
                html+='<div class="item-after"></div>';
                html+='</div>';
                
                html+='<div class="item-text-row">'+readJSON(technicobj.data[i].updated)+'</div>';
                html+='<div class="item-text">'+readJSON(technicobj.data[i].intro_th)+'</div>';
                html+='</div>';
                html+='</li>';
            
            }(i))
            // console.log(html);

            }
            $("#technic").html(html);

        }
        });
    }

    if ("travel" == page.name) {
        $('#backtravel').on('click', function() {
            mainView.router.back();
        });
        var travelobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/travel2json.php", //Relative or absolute path to response.php file
            data: { offset : 0 },
            success: function(data) {
            // console.log(data)

            travelobj = JSON.parse(data);
            var length = Object.keys(travelobj.data).length;
            console.log(travelobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                html+='<li>';
                html+='<a href="content.html?id='+readJSON(travelobj.data[i].id)+'&jsonfile=travel" class="item-link item-content">';
                html+='<div class="item-media"><img src="http://www.clubaroy.com/home/uploads/contents/'+readJSON(travelobj.data[i].thumbnail_th)+'?id='+readJSON(travelobj.data[i].id)+'" width="80"></div>';
                html+='<div class="item-inner">';
                html+='<div class="item-title-row">';
                html+='<div class="item-text-row" style="color: #000000; font-size: 16px;">'+readJSON(travelobj.data[i].title_th)+'</div>';
                html+='<div class="item-after"></div>';
                html+='</div>';
                
                html+='<div class="item-text-row">'+readJSON(travelobj.data[i].updated)+'</div>';
                html+='<div class="item-text">'+readJSON(travelobj.data[i].intro_th)+'</div>';
                html+='</div>';
                html+='</li>';
            
            }(i))
            // console.log(html);

            }
            $("#travel").html(html);

        }
        });

        
    }

    if ("healthy" == page.name) {
        $('#backhealthy').on('click', function() {
            mainView.router.back();
        });
        var healthyobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/healthy2json.php", //Relative or absolute path to response.php file
            data: { offset : 0 },
            success: function(data) {
            // console.log(data)

            healthyobj = JSON.parse(data);
            var length = Object.keys(healthyobj.data).length;
            console.log(healthyobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                html+='<li>';
                html+='<a href="content.html?id='+readJSON(healthyobj.data[i].id)+'&jsonfile=healthy" class="item-link item-content">';
                html+='<div class="item-media"><img src="http://www.clubaroy.com/home/uploads/contents/'+readJSON(healthyobj.data[i].thumbnail_th)+'?id='+readJSON(healthyobj.data[i].id)+'" width="80"></div>';
                html+='<div class="item-inner">';
                html+='<div class="item-title-row">';
                html+='<div class="item-text-row" style="color: #000000; font-size: 16px;">'+readJSON(healthyobj.data[i].title_th)+'</div>';
                html+='<div class="item-after"></div>';
                html+='</div>';
                
                html+='<div class="item-text-row">'+readJSON(healthyobj.data[i].updated)+'</div>';
                html+='<div class="item-text">'+readJSON(healthyobj.data[i].intro_th)+'</div>';
                html+='</div>';
                html+='</li>';
            
            }(i))
            // console.log(html);

            }
            $("#healthy").html(html);

        }
        });
    }

    if ("content" == page.name) {
        console.log(page.query.jsonfile);
        if (page.query.jsonfile == 'news') {
            $('#pageheader').html('ข่าวสาร');
        } else if (page.query.jsonfile == 'technic') {
            $('#pageheader').html('เทคนิคก้นรคัว');
        } else if (page.query.jsonfile == 'travel') {
            $('#pageheader').html('Travel');
        } else {
            $('#pageheader').html('อาหารสุขภาพ');
        }

        var contentobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/"+page.query.jsonfile+"2json.php", //Relative or absolute path to response.php file
            data: { "id" : page.query.id },
            success: function(data) {
            // console.log(data)

            contentobj = JSON.parse(data);
            var length = Object.keys(contentobj.data).length;
            console.log(contentobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                html+='<img src="http://www.clubaroy.com/home/uploads/contents/'+readJSON(contentobj.data[i].thumbnail_th)+'" alt="" width="100%"/>';
                html+='<div class="content-block mt-5">';
                html+='<h1 class="mb-0">'+readJSON(contentobj.data[i].title_th)+'</h1>';
                html+='<small>วันที่ '+readJSON(contentobj.data[i].updated)+'</small>';
                html+='<p>'+readJSON(contentobj.data[i].detail_th).replace(/uploads/g,'..\/home\/uploads');+'</p>';
                html+='</div>';
                html+='<div class="item-after"></div>';
                html+='</div>';
            
            }(i))
            // console.log(html);

            }
            $("#content").html(html);

        }
        });

        $('#goback').on('click', function() {
            console.log("click back")
            mainView.router.back();
        })

    }

    if ("vdo" == page.name) {
        $('#backvdo').on('click', function() {
            mainView.router.back();
        });
        console.log(page.query.video_type);
        if (page.query.video_type == 0) {
            $('#vdoheader').html('อร่อยสัญจร');
        } else if (page.query.video_type == 1) {
            $('#vdoheader').html('อร่อยกับดารา');
        } else {
            $('#vdoheader').html('อร่อยสัญจร');
        }

        var videoobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/"+page.query.jsonfile+"2json.php", //Relative or absolute path to response.php file
            data: { "id" : page.query.id , "offset" : page.query.offset , "video_type" : page.query.video_type},
            success: function(data) {
            // console.log(data)

            videoobj = JSON.parse(data);
            var length = Object.keys(videoobj.data).length;
            console.log(videoobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                html+='<div class="card facebook-card">';
                html+='<div class="card-header">';
                html+='<div class="facebook-name">'+readJSON(videoobj.data[i].title)+'</div>';
                html+='</div>';
                html+='<div class="card-content">';
                html+='<div class="card-content-inner">';
                html+='<p>'+readJSON(videoobj.data[i].desc)+'</p>';
                html+='<img src="http://img.youtube.com/vi/'+readJSON(videoobj.data[i].youtube_v)+'/0.jpg" width="100%">';
                html+='</div>';
                html+='</div>';
                html+='<div class="card-footer">';
                html+='<a href="#" class="link"></a>';
                html+='<a href="#" class="link"></a>';
                html+='<a href="vdo-detail.html?id='+readJSON(videoobj.data[i].id)+'&jsonfile=video&video_type='+page.query.video_type+'" class="link">View</a>';
                html+='</div>';
                html+='</div>';
            
            }(i))
            // console.log(html);

            }
            $("#vdo").html(html);

        }
        });

    }

    if ("vdo-detail" == page.name) {
        $('#backvdodetail').on('click', function() {
            mainView.router.back();
        });
        console.log(page.query.video_type);
        if (page.query.video_type == 0) {
            $('#vdoheader1').html('อร่อยสัญจร');
        } else if (page.query.video_type == 1) {
            $('#vdoheader1').html('อร่อยกับดารา');
        } else {
            $('#vdoheader1').html('อร่อยสัญจร');
        }

        var videodetailobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/"+page.query.jsonfile+"2json.php", //Relative or absolute path to response.php file
            data: { "id" : page.query.id , "video_type" : page.query.video_type},
            success: function(data) {
            // console.log(data)

            videodetailobj = JSON.parse(data);
            var length = Object.keys(videodetailobj.data).length;
            console.log(videodetailobj)
            var html="";


            for (var i=0; i < length; i++) {
                
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {
                html+='<div class="card facebook-card">';
                html+='<div class="card-content">';
                html+='<div class="card-content-inner">';
                html+='<iframe width="100%" height="300px" src="https://www.youtube.com/embed/'+readJSON(videodetailobj.data[i].youtube_v)+'" frameborder="0" allowfullscreen></iframe>';
                html+='<h3>'+readJSON(videodetailobj.data[i].title)+'</h3>';
                html+='<p>'+readJSON(videodetailobj.data[i].desc)+'</p>';
                html+='</div>';
                html+='</div>';
                html+='</div>';
            
            }(i))
            // console.log(html);

            }
            $("#vdo-detail").html(html);

        }
        });

    }

    if ("university" == page.name) {
        $('#backuniversity').on('click', function() {
            mainView.router.back();
        });
        $('view').ready(function(){

        var uniobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/"+page.query.jsonfile+"2json.php", //Relative or absolute path to response.php file
            data: { "id" : page.query.id , "qtype" : 'q'},
            success: function(data) {
            // console.log(data)

            uniobj = JSON.parse(data);
            var length = Object.keys(uniobj.data).length;
            // console.log(uniobj)
           

            
            for (var i=0; i < length; i++) {
            var html="";
                // console.log(rating[i]);
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            (function (i) {


                html+='<li>';
                html+='<a href="list.html?para=cat&file=universities2json&cat='+readJSON(uniobj.data[i].id)+'" class="item-link item-content">';
                html+='<div class="item-inner">';
                html+='<div class="item-title">'+readJSON(uniobj.data[i].name_th)+'</div>';
                html+='</div>';
                html+='</a>';
                html+='</li>';
                $("#university").append(html).promise();
            }(i))
            // console.log(html);
            
            }
            

        }
        });
    })
       
    }

    if ('favoriteuser' == page.name) {
        $('#backfavoriteuser').on('click', function() {
            mainView.router.back();
        });
        var favorobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/favor2json.php", //Relative or absolute path to response.php file
            data: { "id" : sessionStorage.getItem('userid')},
            success: function(data) {
            // console.log(data)

            favorobj = JSON.parse(data);
            var length = Object.keys(favorobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
                
                
                
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            // console.log('i: '+i) 
            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<li class="card" id="favorplace'+sessionStorage.getItem('userid')+favorobj.data[i].restaurant_id+'">';
                    html+='<div class="card-header">';
                    html+='<div class="facebook-name">'+readJSON(favorobj.data[i].title_th)+'</div>';
                    html+='<div class="facebook-date"><a href="#" onclick="removefav('+sessionStorage.getItem('userid')+','+favorobj.data[i].restaurant_id+')"><i class="link fa fa-times"></i></a></div>';
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
                    html+='<p><i class="fa fa-map-marker"></i>'+readJSON(favorobj.data[i].address_th)+'|'+readJSON(favorobj.data[i].rc_name_th)+'</p>';
                    html+='<img src="http://www.clubaroy.com/home/uploads/galleries/'+readJSON(favorobj.data[i].image)+'" width="100%">';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="card-footer">';
                    html+='<a href="#" class="link">';
                    html+='<input type=hidden name=restaurant-hidden id="resthid'+i+'" value="'+favorobj.data[i].restaurant_id+'">';
                    html+='<span id="frating'+i+'" class="rating blog-rating">';
                    
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    //html+='<span class="icon-star"></span>';
                    html+='</span>';
                    html+='</a>';
                    html+='<a href="#" class="link"></a>';
                    html+='<a href="restaurant.html?rid='+favorobj.data[i].restaurant_id+'" class="link">View</a>';
                    html+='</div>';
                    html+='</li>';

                    $("#favoriteuser").append(html);
                    (function (i) {
                    ratingcheck(favorobj.data[i].restaurant_id, i);
                    }(i))

                    
            }
            // console.log(html);
            
            }
        });



    }

    if ('usercommentlogin' == page.name) {
        $('#backcommentuser').on('click', function() {
            mainView.router.back();
        });
        var ucobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rcommentuser2json.php", //Relative or absolute path to response.php file
            data: { "user_id" : sessionStorage.getItem('userid')},
            success: function(data) {
            console.log(data)

            ucobj = JSON.parse(data);
            var length = Object.keys(ucobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
                
                
                
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            // console.log('i: '+i) 
            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<div class="card facebook-card">';
                    html+='<div class="card-header">';
                    html+='<div class="facebook-avatar"><img src="http://www.clubaroy.com/home/uploads/restaurants/'+readJSON(ucobj.data[i].thumbnail_th)+'" width="34" height="34"></div>';
                    html+='<div class="facebook-name">'+readJSON(ucobj.data[i].title_th)+'</div>';
                    html+='<div class="facebook-date">'+readJSON(ucobj.data[i].created)+'</div>';
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
                    html+='<p>'+readJSON(ucobj.data[i].detail)+'</p>';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="card-footer">';
                    html+='<a href="restaurant.html?rid='+readJSON(ucobj.data[i].restaurant_id)+'" class="link">View</a>';
                    html+='</div>';
                    html+='</div>';

                    $("#usercommentlogin").append(html);
                    (function (i) {
                    
                    }(i))

                    
            }
            // console.log(html);
            
            }
        });

    }

    if ('recipe' == page.name) {
        $('#backrecipes').on('click', function() {
            mainView.router.back();
        })

        if ( sessionStorage.getItem('userid') == "" || sessionStorage.getItem('userid') == null ) {
                $('#loginfirst1').hide();
        } else {
                $('#loginfirst1').show();                    
        }
        var postdata = {};
        if (page.query.method == 1 ) {
            postdata['id'] = page.query.id;
            console.log('with id');
        } else if (page.query.method == 2 ) {
            postdata['uid'] = page.query.uid;
            console.log('with uid');
        } else {
            postdata['xx'] = "xx";
            console.log('without any');
        }
        
        var rcpobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/recipe2json.php", //Relative or absolute path to response.php file
            data: postdata,
            success: function(data) {
            //console.log(data)

            rcpobj = JSON.parse(data);
            var length = Object.keys(rcpobj.data).length;
            // console.log(length)
            html="";
            var avatar = "";
            for (var i=0; i < length; i++) {
                
                
                
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            // console.log('i: '+i) 
            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<div class="card facebook-card">';
                    html+='<div class="card-header">';
                    if (readJSON(rcpobj.data[i].avatar) == "" || readJSON(rcpobj.data[i].avatar) == null) {
                        avatar = "assets/img/tmp/ava4.jpg";
                    } else {
                        avatar = "http://www.clubaroy.com/home/uploads/users/"+readJSON(rcpobj.data[i].avatar);
                    }
                    html+='<div class="facebook-avatar"><img src="'+avatar+'" width="34" height="34"></div>';

                    var nickname = "";
                    if (rcpobj.data[i].facebook_id != "" || rcpobj.data[i].facebook_id != null) {
                        nickname = readJSON(rcpobj.data[i].firstname);
                    } else {
                        nickname = readJSON(rcpobj.data[i].username);
                    }
                    html+='<div class="facebook-name">'+nickname+'</div>';
                    html+='<div class="facebook-date">'+readJSON(rcpobj.data[i].created)+'</div>';
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
					html+='<p>'+readJSON(rcpobj.data[i].title)+'</p>';
                    //console.log(rcpobj.data[i].thumbnail)
                    if (rcpobj.data[i].thumbnail.trim() == "" || rcpobj.data[i].thumbnail == null || rcpobj.data[i].thumbnail == undefined) {

                    } else {
					   html+='<img src="http://www.clubaroy.com/home/uploads/recipes/'+readJSON(rcpobj.data[i].thumbnail)+'" width=100%>'
                    }
					html+='<p class="color-gray">VIEW: '+readJSON(rcpobj.data[i].counter)+' </p>';
                    html+='</div>';
                    html+='</div>';
                    html+='<div class="card-footer">';
                    html+='<a href="recipes-details.html?id='+readJSON(rcpobj.data[i].id)+'" class="link">View</a>';
                    html+='</div>';
                    html+='</div>';

                    $("#recipelist").append(html);
                    (function (i) {
                    
                    }(i))

                    
            }
            // console.log(html);
            
            }
        });
    }

    if ("recipedetails" == page.name) {
        $('#backrecipesdetails').on('click', function() {
            mainView.router.back();
        })
        var rcpxobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/recipe2json.php", //Relative or absolute path to response.php file
            data: { "id" : page.query.id },
            success: function(data) {
            //console.log(data)

            rcpxobj = JSON.parse(data);
            var length = Object.keys(rcpxobj.data).length;
            // console.log(length)
            html="";
            var avatar = "";
            for (var i=0; i < length; i++) {
                
                
                
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            // console.log('i: '+i) 
            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<div class="card facebook-card">';
                    html+='<div class="card-header">';
                    if (readJSON(rcpxobj.data[i].avatar) == "" || readJSON(rcpxobj.data[i].avatar) == null) {
                        avatar = "assets/img/tmp/ava4.jpg";
                    } else {
                        avatar = "http://www.clubaroy.com/home/uploads/users/"+readJSON(rcpxobj.data[i].avatar);
                    }
                    html+='<div class="facebook-avatar"><img src="'+avatar+'" width="34" height="34"></div>';

                    var nickname = "";
                    if (rcpxobj.data[i].facebook_id != "" || rcpxobj.data[i].facebook_id != null) {
                        nickname = readJSON(rcpxobj.data[i].firstname);
                    } else {
                        nickname = readJSON(rcpxobj.data[i].username);
                    }
                    html+='<div class="facebook-name">'+nickname+'</div>';
                    html+='<div class="facebook-date">'+readJSON(rcpxobj.data[i].created)+'</div>';
                    html+='</div>';
                    html+='<div class="card-content">';
                    html+='<div class="card-content-inner">';
                    html+='<p>'+readJSON(rcpxobj.data[i].title)+'</p>';
                    html+=readJSON(rcpxobj.data[i].detail).replace(/uploads/g,'..\/home\/uploads');

                    
                    html+='</div>';
                    html+='</div>';

                    html+='</div>';

                    $("#recipeshow").append(html);
                    (function (i) {
                    
                    }(i))

                    
            }
            // console.log(html);
            
            }
        });
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/updatecounter2json.php", //Relative or absolute path to response.php file
            data: { "id" : page.query.id },
            success: function(data) {
            //console.log(data)


            // console.log(length)
            }
        });
    }

    if ("recipeadd" == page.name) {
        var file = "";
        $('#addrecipe').on('click', function () {
        console.log(page.name);
        if (window.File && window.FileReader && window.FormData) {
            console.log('test 2')
        var $inputField = $('#recipeimage');

        $inputField.on('change', function (e) {
            file = e.target.files[0];
            console.log('test 3')
        
            console.log('clicked')
            if (file) {
                if (/^image\//i.test(file.type)) {
                    freadFile(file);
                } else {
                    alert('Not a valid image!');
                }
            }
            
            
        });
        if (file == "" || file == null) {
            console.log('test 1')
            fsendcomment();
            }
    } else {
        console.log('test 3');
    }  
    
    }) 
     
     $('#tumangadd').on('click', function() {
        mainView.router.back();
     })

    }

    if ("cal" == page.name) {
        $('#backcal').on('click', function() {
            mainView.router.back();
        });
        var ccobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/cal2json.php", //Relative or absolute path to response.php file
            data: { "user_id" : "xx"},
            success: function(data) {
            console.log(data)

            ccobj = JSON.parse(data);
            var length = Object.keys(ccobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
                
                
                
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            // console.log('i: '+i) 
            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<li class="item-content">';
                    html+='<div class="item-inner">';
                    html+='<div class="item-title">'+readJSON(ccobj.data[i].menu)+'</div>';
                    html+='<div class="item-after">'+readJSON(ccobj.data[i].calorie)+'</div>';
                    html+='</div>';
                    html+='</li>';
                    //html+='<div class="facebook-avatar"><img src="http://www.clubaroy.com/home/uploads/restaurants/'+readJSON(ucobj.data[i].thumbnail_th)+'" width="34" height="34"></div>';
                  

                    $("#caldiv").append(html);
                    (function (i) {
                    
                    }(i))

                    
            }
            // console.log(html);
            
            }
        });

    }

    if ("province" == page.name) {
        $('#backprovince').on('click', function() {
            mainView.router.back();
        });
        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);

        $('#km1').on('click', function() {
            mainView.router.loadPage('list.html?distance=on&cat=100&file=allrestaurant2json&para=cat');
        })

        $('#km2').on('click', function() {
            mainView.router.loadPage('list.html?distance=on&cat=5000&file=allrestaurant2json&para=cat');
        })

        $('#km3').on('click', function() {
            mainView.router.loadPage('list.html?distance=on&cat=10000&file=allrestaurant2json&para=cat');
        })

        var pvobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/province2json.php", //Relative or absolute path to response.php file
            data: { "user_id" : "xx"},
            success: function(data) {
            console.log(data)

            pvobj = JSON.parse(data);
            var length = Object.keys(pvobj.data).length;
            // console.log(length)
            html="";

            for (var i=0; i < length; i++) {
                
                
                
            // console.log(decodeURI(tmpobj.data[i].title_th).replace(/\+/g,' '));
            // console.log('i: '+i) 
            //html+='<li class="swipeout"><div class="swipeout-content"><div class="item-content no-padding"><div class="item-inner blog-list"><div class="image"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'"><img src=http://www.clubaroy.com/home/uploads/galleries/'+readJSON(tmpobj.data[i].image)+' width="100%"><span class="rating blog-rating"><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span><span class="icon-star"></span></span></a></div><div class="text"><h4 class="title mt-5 mb-0"><a href="restaurant.html?rid='+tmpobj.data[i].restaurant_id+'">'+readJSON(tmpobj.data[i].title_th)+'</a></h4><small>'+readJSON(tmpobj.data[i].address_th)+'</small><small> | </small><small>'+readJSON(tmpobj.data[i].rname_th)+'</small></div></div></div></div><div class="swipeout-actions-left"><a href="#" class="action-red js-add-to-fav"><i class="fa fa-heart-o"></i></a></div></li>'

                    html='<li>';
                    html+='<a href="list.html?cat='+readJSON(pvobj.data[i].id)+'&file=restaurant-province2json&para=cat" class="item-link item-content item-content-icon item-content-icon-accordion">';
                    html+='<div class="item-inner blog-list">';
                    html+='<div class="text">';
                    html+='<h4 class="title mt-5 mb-0">'+readJSON(pvobj.data[i].name_th)+'</h4>';
                    html+='</div>';
                    html+='</div>';
                    html+='</a>';
                    html+='</li>';
                    //html+='<div class="facebook-avatar"><img src="http://www.clubaroy.com/home/uploads/restaurants/'+readJSON(ucobj.data[i].thumbnail_th)+'" width="34" height="34"></div>';
                  

                    $("#listprovince").append(html);
                    (function (i) {
                    
                    }(i))

                    
            }
            // console.log(html);
            
            }
        });

    }

    if ("category" == page.name) {
        $('#backcategory2').on('click', function() {
            mainView.router.back();
        });
    }

	}), $(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);



    if ((null === localStorage.getItem("newOptions") || localStorage.getItem("newOptions") === !0) && (myApp.popup(".popup-splash"), 
    localStorage.setItem("newOptions", !0)), $(".chart-content").length > 0) {
        var obj = document.querySelector(".chart-content"), ctx = obj.getContext("2d");
        showLineChart(ctx);
    }
    if ($(".line-chart-content").length > 0) {
        var obj = document.querySelector(".line-chart-content"), ctx = obj.getContext("2d");
        showLineChartPage(ctx);
    }
    if ($(".bar-chart-content").length > 0) {
        var obj = document.querySelector(".bar-chart-content"), ctx = obj.getContext("2d");
        showBarChartPage(ctx);
    }
    if ($(".pie-chart-content").length > 0) {
        var obj = document.querySelector(".pie-chart-content"), ctx = obj.getContext("2d");
        showPieChartPage(ctx);
    }
    if ($(".doughnut-chart-content").length > 0) {
        var obj = document.querySelector(".doughnut-chart-content"), ctx = obj.getContext("2d");
        showDoughnutChartPage(ctx);
    }
    if ($(".radar-chart-content").length > 0) {
        var obj = document.querySelector(".radar-chart-content"), ctx = obj.getContext("2d");
        showRadarChartPage(ctx);
    }
    if ($(".polar-chart-content").length > 0) {
        var obj = document.querySelector(".polar-chart-content"), ctx = obj.getContext("2d");
        showPolarChartPage(ctx);
    }
    naxvarBg(), $(".js-toggle-menu").on("click", function() {
        $(this).next().slideToggle(200), $(this).find("span").toggleClass("icon-chevron-down").toggleClass("icon-chevron-up");
    });
}), $.fn.serializeObject = function() {
    var o = {}, a = this.serializeArray();
    return $.each(a, function() {
        void 0 !== o[this.name] ? (o[this.name].push || (o[this.name] = [ o[this.name] ]), 
        o[this.name].push(this.value || "")) : o[this.name] = this.value || "";
    }), o;
};

var defColor = "178, 137, 115", fillColor = "rgba(" + defColor + ", 0.2)", strokeColor = "rgba(" + defColor + ", 1)", pointColor = "rgba(" + defColor + ", 1)", pointStrokeColor = "rgba(255, 255, 255, 1)", pointHighlightFill = "rgba(255, 255, 255, 1)", pointHighlightStroke = "rgba(" + defColor + ", 1)", pointColorHighlight = "rgba(" + defColor + ", 0.5)", defColor2 = "224, 61, 14", fillColor2 = "rgba(" + defColor2 + ", 0.2)", strokeColor2 = "rgba(" + defColor2 + ", 1)", pointColor2 = "rgba(" + defColor2 + ", 1)", pointStrokeColor2 = "rgba(255, 255, 255, 1)", pointHighlightFill2 = "rgba(255, 255, 255, 1)", pointHighlightStroke2 = "rgba(" + defColor2 + ", 1)", pointColorHighlight2 = "rgba(" + defColor2 + ", 0.5)";

// sessionStorage.setItem('userid','1')
        $('#facebookname').html("guest");
        $('#userpicture').attr('src','assets/img/tmp/ava4.jpg');

        $('#logout').click(function(){
            localStorage.setItem('fbloginflag',0);
            sessionStorage.setItem('userid','');
            sessionStorage.setItem('favor','');
            $('#facebookname').html("guest");
            $('#userpicture').attr('src','assets/img/tmp/ava4.jpg');
            $('#lifav').hide();
            $('#lireview').hide();
            $('#limyrec').hide();
            $('#lilogin').show();
            $('#lilogout').hide();
        window.localStorage.removeItem("userid");
        window.localStorage.removeItem("logintype");
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("userpw");
         facebookConnectPlugin.logout( 
                function (response) {  },
                function (response) {  });
        })
        
        $('#lifav').hide();
        $('#lireview').hide();
        $('#limyrec').hide();
        $('#lilogin').show();
        $('#lilogout').hide();
        $('#imagemap2').hide();
        $('map').imageMapResize();
        $('map[name=clubaroi] area').click(function(){
             // alert($(this).attr('href'));
             if ($(this).attr('id') == "aroidara") {
             mainView.router.loadPage('vdo.html?video_type=1&jsonfile=video&offset=0');
             } else if ($(this).attr('id') == "aroiduni") {
             mainView.router.loadPage('university.html?jsonfile=universities');
             } else if ($(this).attr('id') == "aroiwanni") {
             mainView.router.loadPage('favorite.html?offset=0&rand=1');
             } else if ($(this).attr('id') == "aroisala") {
             mainView.router.loadPage('salary.html');
             } else if ($(this).attr('id') == "aroitravel") {
             mainView.router.loadPage('travel.html');
             } else if ($(this).attr('id') == "aroidstar") {
             mainView.router.loadPage('#');
             } else if ($(this).attr('id') == "aroidcat") {
             mainView.router.loadPage('category2.html');
             } else if ($(this).attr('id') == "aroidprov") {
             mainView.router.loadPage('province.html');
             } else if ($(this).attr('id') == "aroidsonjon") {
             mainView.router.loadPage('vdo.html?video_type=0&jsonfile=video&offset=0');
             } else if ($(this).attr('id') == "aroical") {
             mainView.router.loadPage('cal.html');
             }
        })

        $('#searchall').keypress(function(e) {
            if(e.which == 13) {
                mainView.router.loadPage('favorite.html?offset=0&rand=2&xstring='+$('#searchall').val());
            }
        });




        var ucobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rcommentuser2json.php", //Relative or absolute path to response.php file
            data: { "user_id" : sessionStorage.getItem('userid')},
            success: function(data) {
            //console.log(data)

            ucobj = JSON.parse(data);
            var length = Object.keys(ucobj.data).length;
            // console.log(length)
            
            // console.log(html);
            
            }
        });

        $('#registeruser1').on('click', function () {
            $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/adduser2json.php", //Relative or absolute path to response.php file
            data: { "name" : $('#name').val(), "lastname" : $('#lastname').val(), "email" : $('#email').val(), "gender" : $('#gender').val(), "userpassword" : $('#password').val() },
            success: function(data) {
            console.log(data)
            if (data == 1) {
              console.log("finish")
              myApp.closeModal();
              mainView.router.loadPage('index.html');
            }

            // console.log(length)
            
            // console.log(html);
            
            }
        });
        })



  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.



  // Load the SDK asynchronously


  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.

  if (window.localStorage.getItem('logintype') == 'normal' && window.localStorage.getItem("username") != undefined ) {
    // console.log($('#usernameclubaroy').val());
    var loginobj = "";
        $.ajax({
            async: false,
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/username2json.php", //Relative or absolute path to response.php file
            data: { "username" : window.localStorage.getItem("username")},
            success: function(data) {
            //console.log(data)

            loginobj = JSON.parse(data);
            var length = Object.keys(loginobj.data).length;
             //console.log(loginobj)
           

            
            // console.log(html);
            
            }
        });

    if ( window.localStorage.getItem("userpw") == readJSON(loginobj.data[0].password)) {
        //console.log('Successful login for: ' + readJSON(loginobj.data[0].username));
        $('#facebookname').html(readJSON(loginobj.data[0].firstname));
        if (readJSON(loginobj.data[0].avatar) ==  "" || readJSON(loginobj.data[0].avatar) == null ) {
            $('#userpicture').attr('src','assets/img/tmp/ava4.jpg');
        } else {
            $('#userpicture').attr('src','http://www.clubaroy.com/home/uploads/users/'+readJSON(loginobj.data[0].avatar));
        }
        sessionStorage.setItem('userid', readJSON(loginobj.data[0].id));
        sessionStorage.setItem('loginstatus', 1);
        $('#lifav').show();
        $('#lilogin').hide();
        $('#lireview').show();
        $('#limyrec').show();
        $('#lilogout').show();
        $('#userrecipe').attr('href','recipes.html?uid='+sessionStorage.getItem('userid')+'&method=2');
        checkfavor();
        myApp.closeModal();
        var ucobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/rcommentuser2json.php", //Relative or absolute path to response.php file
            data: { "user_id" : sessionStorage.getItem('userid')},
            success: function(data) {
            //console.log(data)

            ucobj = JSON.parse(data);
            var length = Object.keys(ucobj.data).length;
            // console.log(length)
            $('#bareview').html(length);
            // console.log(html);
            
            }
        });

        var rxobj = "";
        $.ajax({
            type: "POST",
            dataType: "html",
            url: "http://www.clubaroy.com/mobile/json/recipe2json.php", //Relative or absolute path to response.php file
            data: { "uid" : sessionStorage.getItem('userid')},
            success: function(data) {
            //console.log(data)

            rxobj = JSON.parse(data);
            var length = Object.keys(rxobj.data).length;
            // console.log(length)
            $('#bamyrec').html(length);
            // console.log(html);
            
            }
        });

    }
  }
    if (localStorage['userid']) {
    } else {
        myApp.popup(".popup-login");      
    }
  