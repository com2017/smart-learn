/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * 
 */
$(document).ready(function (){
    var navigation = '<div class="navbar-header">'+
    '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">'+
                    '<span class="sr-only">Toggle navigation</span>'+
                    '<span class="icon-bar"></span>'+
                    '<span class="icon-bar"></span>'+
                    '<span class="icon-bar"></span>'+
                '</button>' +         
                
                    '<a class="navbar-brand" href="../../index.html">Smart Learn</a>'+
            '</div>'+
            '<div id="navbar" class="collapse in">'+
                '<ul class="nav navbar-nav">'+
                    '<li id="showcourse"><a href="../user/user.html">Take Course</a></li>'+
                    '<li id="showmentor"><a href="../mentor/mentor.html">Mentor</a></li>'+
                    '<li id="showstat"><a href="../statistics/statistics.html">Statistics</a></li>'+
                    '<li id="showadmin"><a href="../admin/admin.html">Administration</a></li>'+
                '</ul>'+
            '</div>'+

        '</nav>';
    $('.navbar').append(navigation);
});