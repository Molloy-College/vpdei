$(document).ready(function() {        
    //Department Search
    $('#btnsearch1').bind('click', function() {      
      var deptlist = getByDept($('#department').val());
	        
    });
    
    //Browse By Search        
    $('#browseby li a').each(function(){
        $(this).bind('click', function(event) {            
            event.preventDefault();            
            getBrowseBy($.trim($(this).text()));
          });
    });
    
    //Last Name Search    
    $('#btnsearch2').bind('click', function(event) {      
      event.preventDefault();
      
      var firstlastname = $.trim($('#first_or_lastname').val());
      
      if(firstlastname == '')
      {
        alert("Please mention the First or Last Name");
      }
      else
      {
          getByLastFirstName(firstlastname);
      }
      
      
      
    });
    
    //Last Name Search - if user presses ENTER key
    $('#frmfilter').submit(function (evt) {
        evt.preventDefault();
        
        var firstlastname = $.trim($('#first_or_lastname').val());

        if(firstlastname == '')
        {
          alert("Please mention the First or Last Name");
        }
        else
        {
            getByLastFirstName(firstlastname);
        }
    });
    
});


function getByDept(deptname)
{    
    var deptSearch = $.ajax({
        type: "POST",
        url: "getempdata.php",
        data: {departmentname: deptname}        
    });
    
    $('#ajax-loader').show();
    
    deptSearch.done(function(data)
    {
       //returns an array of JSON Objects
       //alert(data[0].ID);
       //var result = JSON.stringify(data);
       $('#ajax-loader').hide();
       $('#profiledetails').css('display','none');
       $('#seachresults').css('display','block');
       $('#seachresults').html(data);       
    });
    
    deptSearch.fail(function(jqXHR, textStatus)
    {
         alert( "There was an error processing your request, please try again or contact the Web Team if the problem persists (" + textStatus + ")." );
    });
	
	$('body,html').animate({
		scrollTop:$("#seachresults").offset().top - $('#header-space').height()
	},800)
    
}

function getBrowseBy(browseLetter)
{    
    var browseSearch = $.ajax({
        type: "POST",
        url: "getempdata.php",
        data: {browseby: browseLetter}        
    });
    
	$('#ajax-loader').show();
	
    browseSearch.done(function(data)
    {
       //returns an array of JSON Objects
       //alert(data[0].ID);
       //var result = JSON.stringify(data);
	   $('#ajax-loader').hide();
       $('#profiledetails').css('display','none');
       $('#seachresults').css('display','block');
       $('#seachresults').html(data);       
    });
    
    browseSearch.fail(function(jqXHR, textStatus)
    {
         alert( "There was an error processing your request, please try again or contact the Web Team if the problem persists (" + textStatus + ")." );
    });
    
	$('body,html').animate({
		scrollTop:$("#seachresults").offset().top - $('#header-space').height()
	},800)
}


function getByLastFirstName(flname)
{        
    var LastFirstSearch = $.ajax({
        type: "POST",
        url: "getempdata.php",
        data: {firstlastname: flname}        
    });
    
	$('#ajax-loader').show();
	
    LastFirstSearch.done(function(data)
    {
       //returns an array of JSON Objects
       //alert(data[0].ID);
       //var result = JSON.stringify(data);
	   $('#ajax-loader').hide();
       $('#profiledetails').css('display','none');
       $('#seachresults').css('display','block');
       
       $('#seachresults').html(data);       
    });
    
    LastFirstSearch.fail(function(jqXHR, textStatus)
    {
         alert( "There was an error processing your request, please try again or contact the Web Team if the problem persists (" + textStatus + ")." );
    });
    
	$('body,html').animate({
		scrollTop:$("#seachresults").offset().top - $('#header-space').height()
	},800)
}


function getProfile(id)
{    
    var ProfileDetails = $.ajax({
        type: "POST",
        url: "getempdata.php",
        data: {profileid: id}        
    });
    
    ProfileDetails.done(function(data)
    {
       //returns an array of JSON Objects
       //alert(data[0].ID);
       //var result = JSON.stringify(data);
       
       $('#seachresults').css('display','none');
       $('#profiledetails').css('display','block');
       $('#profiledetails').html(data);       
    });
    
    ProfileDetails.fail(function(jqXHR, textStatus)
    {
         alert( "There was an error processing your request, please try again or contact the Web Team if the problem persists (" + textStatus + ")." );
    });
    
}

function backtosearch()
{
    $('#profiledetails').css('display','none');
    $('#seachresults').css('display','block');
    
}