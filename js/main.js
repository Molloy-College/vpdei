var MCP = MCP || {};

MCP.data = MCP.data || {};

/**
 * Cached global elements.
 * @module elm
 * @title Elements
 */
MCP.elm = {
	win: $(window),
	doc: $(document),
	body: $('body'),
	header: $('#header-outer'),
	footer: $('.footer'),
	parallax: $('.full-width-section.parallax-section'),
	fullwidthsection: $('.full-width-section'),
	stdlevel2slider: $('.parallax_slider_outer'),
	pageheaderbg: $('#page-header-bg')
};


/*****************************************************************
******************************************************************
Utilities
******************************************************************/
MCP.util = {
  hasTouch        : Modernizr.touch
, hasPosFixed     : Modernizr.positionfixed
, windowWidth   : MCP.elm.win.width()
, windowInnerWidth   : MCP.elm.win.innerWidth()
, windowHeight  : function() { return MCP.elm.win.height()     }
, docHeight       : function() { return MCP.elm.doc.height();    }
, scrollTop       : function() { return MCP.elm.win.scrollTop(); }
, orientation     : function() {
  if (typeof orientation != 'undefined') {
    return (Math.abs(window.orientation) === 90)? "landscape" : "portrait";
  } else {
    return (GG.util.viewportWidth() >= GG.util.viewportHeight()) ? "landscape" : "portrait";
  }
}
, queryString     : function(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)"
      , regex = new RegExp(regexS)
      , results = regex.exec((url)? url : window.location.href);
    if (results == null) {
      return false;
    } else {
      return results[1];
    };
}
, replaceAll: function (txt, replace, with_this) {
  return txt.replace(new RegExp(replace, 'g'),with_this);
}
};

/*****************************************************************
******************************************************************
Data
******************************************************************/
MCP.data = {
	pageHeaderHeight : $('#page-header-bg').attr('data-height'),
	pageHeaderHeightCopy : $('#page-header-bg').attr('data-height'),	
	logoHeight : $('#header-outer').attr('data-logo-height'),
	headerPadding : $('#header-outer').attr('data-padding'),
	headerPadding2 : $('#header-outer').attr('data-padding'),
	extraDef : 10,
	headerResize : $('#header-outer').attr('data-header-resize'),
	headerResizeOffExtra : 0,
	extraHeight : 0, //admin bar
	usingLogoImage : $('#header-outer').attr('data-using-logo'),
	secondaryHeader : 0,
	extResponsivePadding : 30,
	def : new $.Deferred(),		
	add_section : new $.Deferred(),		
	pagetype : $('body').data('pagetype')
};
/*****************************************************************
******************************************************************
Common functions and helpers.
******************************************************************/
var Helpers = (function() {
	"use strict";
	return {
		/**
		 * loadFromAjax(url, dataType, callback)
		 * Performs Ajax calls for loading the needed data.
		 * @param url
		 * @param dataType
		 * @param callback - Returns data through a callback function: callback.success(response)
		 */
		loadFromAjax: function (url, dataType, callback){			
			var requestURL = url;
			var ajaxpromise = $.ajax({
				url: requestURL,
				dataType: dataType				
			});
			
			ajaxpromise.done(function(data){
					callback(data);					
			});
	
			ajaxpromise.fail(function(jqXHR, textStatus, errorThrown) {
					if(dataType != "json"){
						var xdr = new XDomainRequest(); 
						xdr.open('get', requestURL);
						xdr.onprogress = function(){}; // added for ie9
						xdr.ontimeout = function(){}; // added for ie9
						xdr.onload = function() {
							callback(xdr.responseText);
						};
						xdr.onerror = function() {
				            callback({error:"Ajax call error"});
						};
						xdr.send(); 
					}
					else{
						callback({error:"Ajax call error"});
					}
				}
			);
			
			return ajaxpromise;
		},
		/*
        * Helper function to test if input is numeric.
        */
		isNumber: function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		preventDefault: function(thisE) {
			// different browsers handle this differently
			if (thisE.preventDefault) {
				// standards-compliant browsers use this
				thisE.preventDefault();
			} else {
				// MSIE uses this
				thisE.returnValue = false;
			}
		},
/*
        *  Add an <a href> link to the DOM.
        */
		newLink: function(title, url, target) {
			var link = document.createElement("a");
			link.innerHTML = title;
			link.setAttribute('href', url);
			if (target) {
				link.setAttribute('target', target);
			}
			return link;
		},
/*
        *  Add a new <div> to the DOM.
        */
		newDiv: function(thisClass, thisContent) {
			return this.newElement("div", null, thisClass, thisContent);
		},
/*
        *  Add a new element to the DOM.
        */
		newElement: function(thisTag, thisID, thisClass, thisContent) {
			var el = document.createElement(thisTag);
			if (thisID) {
				el.setAttribute("id", thisID);
			}
			if (thisClass) {
				el.setAttribute("class", thisClass);
			}
			if (thisContent) {
				el.innerHTML = thisContent;
			}
			return el;
		},
		/*
		* Removes .00 decimals from pricetags defined in the provided string.
		*/
		removeDecimals: function(text) {
			var re = /\d+(\.\d{1,2})?/;
			var nums = re.exec(text);
			if (nums) {
				var num = Number(nums[0]);
				num = num.toString();
				//Has a decimal point
				if (num.split('.')[1]) {
					if (num.split('.')[1].length < 2) {
						num = num + '0';
					}
				}
				var newstr = text.replace(re, num);
				return newstr;
			} else {
				return text;
			}
		},
		/*
		* This function fixes page X/Y offset for IE8
		*/
		pageOffsetXYCrossBrowser: function (axis){
			var ret=0;
			if(axis=='Y'){
				if(isNaN(window.pageYOffset))
					ret = document.documentElement.scrollTop;
				else
					ret = window.pageYOffset;
			}else if(axis=='X'){
				if(isNaN(window.pageXOffset))
					ret = document.documentElement.scrollLeft;
				else
					ret = window.pageXOffset;
			}
			return ret;
		},
		/*
		* This function gets the height of the page
		*/
		getWindowHeight: function (){
			var $window = $(window);
			var windowHeight = $window.height();
			
			return windowHeight;
		},
		/*
		* This function fixes page X/Y offset for IE8
		*/
		getWindowWidthCrossBrowser: function (){
			var screenWidth=0;
			if (window.innerWidth)
			{
				screenWidth=window.innerWidth;
			}
			else if (document.documentElement && document.documentElement.clientWidth)
			{
				screenWidth=document.documentElement.clientWidth;
			}	
			else if (document.body)
			{
					screenWidth=document.body.clientWidth;
			}
			return screenWidth;
		},
		/*
		 * Helper function that replaces all instances of a character or string with
		 * another character or string.
		 * 
		 * @param find - the character or string that is to be replaced
		 * @param replace - the character or string that will replace the old one
		 * @param str - the string that is being updated
		 */
		replaceAll: function(find, replace, str) {
			return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
			
			function escapeRegExp(string) {
			    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
			}
		},
		fetchImages: function(urlsArray) {
			var imagesDone = jQuery.Deferred(), imgsRemaining = urlsArray.length;
			for (var i = 0; i < urlsArray.length; i++) {
				jQuery('<img src=' + urlsArray[i] +'>').load(function () {
					imgsRemaining--;
					if (imgsRemaining == 0) {
						imagesDone.resolve();
					}
				});
			}
			return imagesDone;
		},
		loadScript: function (src, async, callback) {
			if (typeof src != 'undefined') {
				if (src.indexOf('http:') != -1) {
					if (typeof console != 'undefined' && console.log) {
						console.log("ignoring script load directive: script's protocol is HTTP, not HTTPS");
					}					
				} else {
					var sNew = document.createElement("script");
					sNew.async = typeof async == 'undefined' ? false : async;
					sNew.src = src;
					var s0 = document.getElementsByTagName('script')[0];

					if (typeof callback != 'undefined') {
						// most browsers
						sNew.onload = function() {
							if ( ! sNew.onloadDone ) {
								sNew.onloadDone = true;
								if(callback && typeof callback === 'function') {
									callback();								
								}
								else
								{
									if (typeof console != 'undefined' && console.log) {
										console.log("callback is not a function");
									}					
								}								
							}
						};
						// IE 6 & 7
						sNew.onreadystatechange = function() {
							if ( ( "loaded" === sNew.readyState || "complete" === sNew.readyState ) && ! sNew.onloadDone ) {
								sNew.onloadDone = true;
								if(callback && typeof callback === 'function') {
									callback();								
								}
								else
								{
									if (typeof console != 'undefined' && console.log) {
										console.log("callback is not a function");
									}					
								}																
							}
						}
					}

					s0.parentNode.insertBefore(sNew, s0);
				}
			}
		}
	}; //end Helpers.
})(); /* Other Functions*/
/*****************************************************************
******************************************************************
Initialize Data
******************************************************************/
MCP.initializeData = function() {
	if( isNaN(MCP.data.logoHeight) || MCP.data.usingLogoImage.length == 0) { MCP.data.usingLogoImage = false; MCP.data.logoHeight = 79;}
	if( isNaN(MCP.data.headerPadding) || MCP.data.headerPadding.length == 0) { MCP.data.headerPadding = 4; MCP.data.headerPadding2 = 4;}
	if( MCP.data.headerResize.length == 0 ) { MCP.data.extraDef = 0; MCP.data.headerResizeOffExtra = parseInt(MCP.data.headerPadding2); }
	if( $('header#top #logo img').length == 0 ) { MCP.data.logoHeight = 79; }
	
	if($('#header-outer').attr('data-using-secondary') == '1')
	{		
		MCP.data.secondaryHeader = $("#header-secondary-outer").outerHeight();
	}	
	
	var preloader = function() {
		$(window).load(function() {
             $('.preloader-wrapper').fadeOut('slow');             
		});
	}
	
	preloader();
	
	var checkJavascript = function() {
		if(!window.jQuery){
			if("complete"!=document.readyState)
			{
				//return setTimeout(function(){checkJavascript()},1000),				
			}
		}
	}
	
};

/*****************************************************************
******************************************************************
 MCP.instantiateHeader()
 Global Header Navigation
******************************************************************/
MCP.instantiateHeader = function() {	
	var logoHeight = parseInt(MCP.data.logoHeight);
	var headerPadding = parseInt(MCP.data.headerPadding);
	var usingLogoImage = MCP.data.usingLogoImage;
	var secondaryHeader = MCP.data.secondaryHeader;
	
	//inital calculations
	function headerInit(){
				
		$('#header-outer #logo img').css({
			'height' : logoHeight				
		});	
			
		$('#header-outer').css({
			'padding-top' : headerPadding
		});	
			
		$('header#top nav > ul > li > a').css({
			'padding-bottom' : Math.ceil( ((logoHeight/2) - ($('header#top nav > ul > li > a').height()/2)) + headerPadding),
			'padding-top' : Math.ceil( (logoHeight/2) - ($('header#top nav > ul > li > a').height()/2))
		});					
					
		$('header#top nav > ul li#search-btn').css({
			'padding-bottom' : (logoHeight/2) - ($('header#top nav > ul li#search-btn input').height()/2),
			'padding-top' : (logoHeight/2) - ($('header#top nav > ul li#search-btn input').height()/2)
		});	
			
		$('header#top .sf-menu > li > ul, header#top .sf-menu > li.sfHover > ul').css({
			'top' : $('header#top nav > ul > li > a').outerHeight() 
		});	
			
		//header space					
		if($('#header-outer').attr('data-using-secondary') == '1'){
			$('#header-space').css('height', parseInt($('#header-outer').outerHeight()) + secondaryHeader);
			$('#header-outer').css('top',secondaryHeader);
		} else {
			$('#header-space').css('height', $('#header-outer').outerHeight());
		}
		
		$('#header-outer .container').css('visibility','visible');
	}	
	
	function HeaderResize(){
		//is header resize on scroll enabled?		
		if( parseInt(MCP.data.headerResize) == 1 ){
			headerInit();	
			$(window).bind('scroll',smallNav);
		} else {
			headerInit();			
		}
			
		//if user starts in mobile but resizes to large, don't break the nav
		if($('body').hasClass('mobile')){
			$(window).resize(headerInit);
		}
	}

	function smallNav(){
		var $offset = $(window).scrollTop();
		var $windowWidth = $(window).width();
		var shrinkNum = 6;
			
		if (logoHeight >= 40 && logoHeight < 60) shrinkNum = 8;
		else if (logoHeight >= 60 && logoHeight < 80) shrinkNum = 10;
		else if (logoHeight >= 80 ) shrinkNum = 14;
			
		if($offset > 0 && $windowWidth > 1000) {												
			$('#header-outer').addClass('small-nav');
			
			$('#header-outer #logo img').stop(true,true).animate({
				'height' : logoHeight - shrinkNum
			},{queue:false, duration:250, easing: 'easeOutCubic'});	
				
			$('#header-outer').stop(true,true).animate({
				'padding-top' : headerPadding / 1.8
			},{queue:false, duration:250, easing: 'easeOutCubic'});	
				
			$('header#top nav > ul > li > a').stop(true,true).animate({
				'padding-bottom' :  (((logoHeight-shrinkNum)/2) - ($('header#top nav > ul > li > a').height()/2)) + headerPadding / 1.8 ,
				'padding-top' :  ((logoHeight-shrinkNum)/2) - ($('header#top nav > ul > li > a').height()/2) 
			},{queue:false, duration:250, easing: 'easeOutCubic'});	 
				
			$('header#top nav > ul li#search-btn').stop(true,true).animate({
				'padding-bottom' : Math.floor(((logoHeight-shrinkNum)/2) - ($('header#top nav > ul li#search-btn input').height()/2)),
				'padding-top' : Math.floor(((logoHeight-shrinkNum)/2) - ($('header#top nav > ul li#search-btn input').height()/2))
			},{queue:false, duration:250, easing: 'easeOutCubic'});	
				
			$('header#top .sf-menu > li > ul, header#top .sf-menu > li.sfHover > ul').stop(true,true).animate({
				'top' : Math.floor($('header#top nav > ul > li > a').height() + (((logoHeight-shrinkNum)/2) - ($('header#top nav > ul > li > a').height()/2))*2 + headerPadding / 1.8),
			},{queue:false, duration:250, easing: 'easeOutCubic'});		
				
			//if no image is being used
			if(usingLogoImage == false) $('header#top #logo').stop(true,true).animate({
				'margin-top' : 0
			},{queue:false, duration:450, easing: 'easeOutExpo'});	
				
			$(window).unbind('scroll',smallNav);
			$(window).bind('scroll',bigNav);
		}
	}
		
	function bigNav(){
		var $offset = $(window).scrollTop();
		var $windowWidth = $(window).width();
		if($offset == 0 && $windowWidth > 1000) {			
			$('#header-outer').removeClass('small-nav');									
			
			$('#header-outer #logo img').stop(true,true).animate({
				'height' : logoHeight,				
			},{queue:false, duration:250, easing: 'easeOutCubic'});	
			

			$('#header-outer').stop(true,true).animate({
				'padding-top' : headerPadding 
			},{queue:false, duration:250, easing: 'easeOutCubic'});	
			
			$('header#top nav > ul > li > a').stop(true,true).animate({
				'padding-bottom' : ((logoHeight/2) - ($('header#top nav > ul > li > a').height()/2)) + headerPadding,
				'padding-top' : (logoHeight/2) - ($('header#top nav > ul > li > a').height()/2) 
			},{queue:false, duration:250, easing: 'easeOutCubic'});	
			
			$('header#top nav > ul li#search-btn').stop(true,true).animate({
				'padding-bottom' : Math.floor((logoHeight/2) - ($('header#top nav > ul li#search-btn input').height()/2)),
				'padding-top' : Math.ceil((logoHeight/2) - ($('header#top nav > ul li#search-btn input').height()/2))
			},{queue:false, duration:250, easing: 'easeOutCubic'});	
			
			$('header#top .sf-menu > li > ul, header#top .sf-menu > li.sfHover > ul').stop(true,true).animate({
				'top' : $('header#top nav > ul > li > a').height() + (((logoHeight)/2) - ($('header#top nav > ul > li > a').height()/2))*2 + headerPadding,
			},{queue:false, duration:250, easing: 'easeOutCubic'});		
				
			//if no image is being used
			if(usingLogoImage == false) $('header#top #logo').stop(true,true).animate({
				'margin-top' : 4
			},{queue:false, duration:450, easing: 'easeOutExpo'});	
		
			$(window).unbind('scroll',bigNav);
			$(window).bind('scroll',smallNav);
		}
	}

	function mobileMenuInit(){
		//responsive nav
		$('#toggle-nav').click(function(){	
			$('#mobile-menu').stop(true,true).slideToggle(500);
			return false;
		});
			
		////append dropdown indicators / give classes
		$('#mobile-menu .container ul li').each(function(){
			if($(this).find('> ul').length > 0) {
				 $(this).addClass('has-ul');
				 $(this).find('> a').append('<span class="sf-sub-indicator"><i class="icon-angle-down"></i></span>');
			}
		});
			
		////events
		$('#mobile-menu .container ul li:has(">ul") > a .sf-sub-indicator').click(function(){
			$(this).parent().parent().toggleClass('open');
			$(this).parent().parent().find('> ul').stop(true,true).slideToggle();
			return false;
		});
	}
	
	//headerInit();
	//one last check to make sure the header space is correct (only if the user hasn't scrolled yet)
	$(window).load(function(){
		if($(window).scrollTop() == 0 ) { 
			if($('#header-outer').attr('data-using-secondary') == '1'){
				$('#header-space').css('height', parseInt($('#header-outer').outerHeight()) + secondaryHeader);
			} else {
				$('#header-space').css('height', $('#header-outer').outerHeight());
			}					
		}
	});
	HeaderResize();
	mobileMenuInit();
}


/*****************************************************************
******************************************************************
 MCP.instantiateSuperfish()
 Global Header Navigation
******************************************************************/
MCP.instantiateSuperfish = function() {
	/***************** Superfish ******************/
	function initSF(){
		$(".sf-menu").superfish({
			 delay: 700,
			 speed: 'fast',
			 speedOut: 'fast' 
			 
		}); 
	}
	
	function addOrRemoveSF(){		
		if( window.innerWidth < 1000 && MCP.elm.body.attr('data-responsive') == '1'){
			MCP.elm.body.addClass('mobile');
			$('header#top nav').hide();
		}		
		else {
			MCP.elm.body.removeClass('mobile');
			$('header#top nav').show();
			$('#mobile-menu').hide();
			
			//recalc height of dropdown arrow
			$('.sf-sub-indicator').css('height',$('a.sf-with-ul').height());
		}
	}
	
	function SFArrows(){
		//set height of dropdown arrow
		$('.sf-sub-indicator').css('height',$('a.sf-with-ul').height());
	}
	
	addOrRemoveSF();
	initSF();	
	MCP.elm.win.resize(addOrRemoveSF);
	SFArrows();
}

/*****************************************************************
******************************************************************
 MCP.instantiateHomePageRevSlider()
 Initialize Home Page Revolution Slider
******************************************************************/
MCP.instantiateHomePageRevSlider = function() {
/***********************************************************************************************
************************************************************************************************
***********************************************************************************************/
/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for kenburn Slider
 * @version: 2.3.9 (03.04.2013)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
**************************************************************************/
	var revapi;
	
	var sliderHeight = Helpers.getWindowHeight() - MCP.data.logoHeight - MCP.data.headerPadding;

	var slide_timer = numSec * 1000;
	
	var heroArea = jQuery('#hero_section'),
		imgQuality = null,
		windowW = jQuery(window).width(),
		jDoc = jQuery(document),
		addHerosToDom = function (herosArray) {
            var markup = '<img alt="" class="hero-img" data-bgfit="cover" data-bgposition="center top" data-bgrepeat="no-repeat"/>',
                heroEl,
                heroIndex;

            for (var i = 0; i < herosArray.length; i++) {
                heroIndex = jQuery('.hero-img').length + 1;

                heroEl = jQuery(markup).addClass('img' + heroIndex);
				heroEl.attr("src", herosArray[i]);                                

                jQuery('.hero' + heroIndex).prepend(heroEl);				
            }
        }
	Helpers.fetchImages(homepageimgUrls).done(function () {
        addHerosToDom(homepageimgUrls);		
		
		jQuery(document).ready(function() {		
			revapi = jQuery('.home .tp-banner').revolution(
				{
					delay:slide_timer,
					startheight: 1000,
					startwidth:1280,
					autoHeight:"on",

					hideThumbs:10,
					
					navigationType:"bullet",
					navigationArrows:"solo",

					navigationStyle:"round",

					hideBulletsOnMobile:"on",
					hideArrowsOnMobile:"off",
					touchenabled:"on",                      // Enable Swipe Function : on/off
					onHoverStop:"on",                       // Stop Banner Timet at Hover on Slide on/off

					swipe_velocity: 0.5,				
					
					stopAtSlide:-1,
					stopAfterLoops:-1,							

					hideCaptionAtLimit:480,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
					hideAllCaptionAtLilmit:0,				// Hide all The Captions if Width of Browser is less then this value
					hideSliderAtLimit:0,					// Hide the whole slider, and stop also functions if Width of Browser is less than this value

					shadow:0,                               //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
					fullWidth:"off",                          // Turns On or Off the Fullwidth Image Centering in FullWidth Modus
					hideTimerBar:"on", 
					fullScreen:"on",
					fullScreenAlignForce:"on",
					fullScreenOffsetContainer: "#header-outer, #footer"
				});
				
				revapi.bind("revolution.slide.onloaded",function (e) {										
					MCP.data.def.resolve();
					
				});
		});		
		
        heroArea.addClass('hero-loaded');				
	});
}
/*****************************************************************
******************************************************************
  MCP.instantiatePageHeaderRevSlider()
  Initialize StandardLevel2Page Header Revolution Slider
******************************************************************/
MCP.instantiatePageHeaderRevSlider = function() {	
	var pageheader_revapi;
	
		pageheader_revapi = jQuery('.parallax_slider_outer .tp-banner').revolution(
		{
			delay:4000,
			startheight: 600,
			startwidth:1280,
			autoHeight:"off",

			hideThumbs:10,
			
			navigationType:"bullet",
			navigationArrows:"solo",

			navigationStyle:"round",

			hideBulletsOnMobile:"on",
			hideArrowsOnMobile:"on",
			touchenabled:"on",                      // Enable Swipe Function : on/off
			onHoverStop:"on",                       // Stop Banner Timet at Hover on Slide on/off

			swipe_velocity: 0.5,				
			
			stopAtSlide:-1,
			stopAfterLoops:-1,							

			hideCaptionAtLimit:480,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
			hideAllCaptionAtLilmit:0,				// Hide all The Captions if Width of Browser is less then this value
			hideSliderAtLimit:0,					// Hide the whole slider, and stop also functions if Width of Browser is less than this value

			shadow:0,                               //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
			fullWidth:"on",                          // Turns On or Off the Fullwidth Image Centering in FullWidth Modus
			hideTimerBar:"on", 
			fullScreen:"off",
			fullScreenAlignForce:"off",
			fullScreenOffsetContainer: "#header-outer, #footer"
		});	
		
		pageheader_revapi.bind("revolution.slide.onloaded",function (e) {					
							
		});
}
/*****************************************************************
******************************************************************
  MCP.instantiateFullWidthSection()
  Initialize FullWidth Sections
******************************************************************/
MCP.fullWidthSections = function() {
	/***************** FULL WIDTH SECTION ******************/	
	//bootstrap container has internal padding of 15 on left and right side - add the extra padding into the calcs
	var $extResponsivePadding = 30;
	
	if($(window).width() <= parseInt($('.main-content').css('width'))) { 
		var $windowWidth = parseInt($('.main-content').css('width'));				
	} else { 
		var $windowWidth = $(window).width();
	}
	
	$justOutOfSight = Math.ceil( (($windowWidth + $extResponsivePadding - parseInt($('.main-content').css('width'))) / 2));		
	
	$('.full-width-section').each(function(){
		$(this).css({
			'margin-left': - $justOutOfSight,
			'padding-left': $justOutOfSight,
			'padding-right': $justOutOfSight,
			'visibility': 'visible'
		});			  						
	});	
}
/*****************************************************************
******************************************************************
  MCP.instantiateFullWidthSection()
  Initialize FullWidth Sections
******************************************************************/
MCP.instantiateFullWidthSection = function() {
	
	var $contentElementsNum = $('.main-content > section').length;
	
	//if fullwidth section is first or last, remove the margins so it fits flush against header/footer
	$('.full-width-section, .parallax_slider_outer, .tp-banner-container').each(function(){			
		if($(this).parents('.mc-row').length > 0){
			////first
			if($(this).parents('.mc-row').index() == '0' && $('#page-header-bg').length != 0 || $(this).parents('.mc-row').index() == '0' && $('.parallax_slider_outer').length != 0 && $('.tp-banner-container').length != 0){
				//$(this).css('margin-top','-2.1em').addClass('first-section nder-page-header');

			} 
			else if($(this).parents('.mc-row').index() == '0' && $('#page-header-bg').length == 0 && $('.page-header-no-bg').length == 0 
					 && $(this).parents('.mc-row').index() == '0' 
					 && $('.parallax_slider_outer').length == 0
					 && $('.tp-banner-container').length == 0 
					 && $('body[data-bg-header="true"]').length == 0 ){		         	
				$(this).css('margin-top','-70px').addClass('first-section');
			} 
						
			//check if it's also last (i.e. the only fws)
			if($(this).parents('.mc-row').index() == $contentElementsNum-1 ) { 					
				$('.container-wrap').css('padding-bottom','0px');										
			} 			
		} else {
			////first
			if($(this).index() == '0' && $('#page-header-bg').length != 0 || $(this).index() == '0' && $('.parallax_slider_outer').length != 0 && $('.tp-banner-container').length != 0){
				//$(this).css('margin-top','-2.1em').addClass('first-section nder-page-header');
				$(this).addClass('first-section');

			} 
			else if($(this).index() == '0' && $('#page-header-bg').length == 0 && $(this).index() == '0' && $('.page-header-no-bg').length == 0 && 
					$(this).index() == '0' && $('.parallax_slider_outer').length == 0 && $('.tp-banner-container').length == 0) {
						
				$(this).css('margin-top','-70px').addClass('first-section');
			}						
			
			//if section has testimonial component make section padding-bottom = 0			
			if($('#page.testimonialcomponent #component-body[data-components="testimonialcomponent"]').length > 0) {
				if($(this).find('#component-body[data-components="testimonialcomponent"]').length > 0)
				{
					$(this).css('padding-bottom','0px');
				}				
			}
			
			//check if it's also last (i.e. the only fws)
			if($(this).index() == $contentElementsNum-1) { 
				$('.container-wrap').css('padding-bottom','0px');						
			} 				
		}
	});
	
	$('.parallax_slider_outer').each(function(){		
		////first
		if($(this).parent().index() == '0' && $('#page-header-bg').length != 0){
			$(this).addClass('first-section nder-page-header');
		} 
		else if($(this).parent().index() == '0' && $('#page-header-bg').length == 0){
			$(this).css('margin-top','-40px').addClass('first-section');				
		} 
		
		//check if it's also last (i.e. the only fws)
		if($(this).parent().index() == $contentElementsNum-1) {				
			$('.container-wrap').hide();
		}
	
	});
	
	MCP.fullWidthSections();	
	
		////set inital sizes
	$('.full-width-section').each(function(){		
		var $fwsHeight = $(this).outerHeight(true);
		
		//make sure it's empty and also not being used as a small dvider
		if($(this).find('.col-md-12 *').length == 0 && $.trim( $(this).find('.col-md-12').text() ).length == 0  && $fwsHeight > 40){
			$(this).addClass('bg-only');
			$(this).css({'height': $fwsHeight, 'padding-top': '0px', 'padding-bottom': '0px'});
			$(this).attr('data-image-height',$fwsHeight);
		}

	});
	
	$('.container-wrap').animate({
		'opacity': 1
	}, 1000);
	
	$(window).resize(function () {
		MCP.fullWidthSections();
	});
	
}
/*****************************************************************
******************************************************************
 MCP.instantiateParallax()
 Initialize Parallax Sections
******************************************************************/
MCP.instantiateParallax = function() {
	/***************** PARALLAX SCROLL ******************/
	var $window = $(window);
	var windowHeight = $window.height();
	
	$window.resize(function () {
		windowHeight = $window.height();
	});
	
	$.fn.parallaxScroll = function(xpos, speedFactor, outerHeight) {
		var $this = $(this);
		var getHeight;
		var firstTop;
		var paddingTop = 0;
		
		//get the starting position of each element to have parallax applied to it		
		$this.each(function(){
		    firstTop = $this.offset().top;
		});
		
		$window.resize(function () {
			$this.each(function(){
		  	    firstTop = $this.offset().top;
			});
		});
		
		$window.load(function(){
			$this.each(function(){
		  	    firstTop = $this.offset().top;
			}); 
		});
	 
	
		getHeight = function(jqo) {
			return jqo.outerHeight(true);
		};
		 
			
		// setup defaults if arguments aren't specified
		if (arguments.length < 1 || xpos === null) xpos = "50%";
		if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
		if (arguments.length < 3 || outerHeight === null) outerHeight = true;
		
		// function to be called whenever the window is scrolled or resized
		function update(){
			var pos = $window.scrollTop();				
	
			$this.each(function(){
				var $element = $(this);
				var top = $element.offset().top;
				var height = getHeight($element);
				// Check if totally above or totally below viewport
				if (top + height < pos || top > pos + windowHeight) {
					return;
				}

				$this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
				
			});
		}		
	
		$window.bind('scroll', update).resize(update);
		update();
	};

	$('.full-width-section.parallax-section').each(function(){
	   var $id = $(this).attr('id');
	   $('#'+$id + ".parallax-section").parallaxScroll("50%", 0.2);
	});
	
	
}
/*****************************************************************
******************************************************************
  MCP.instantiatePageHeaders()
  Initialize Page Headers
******************************************************************/
MCP.instantiatePageHeaders = function() {
	/***************** Page Headers ******************/

	var pageHeaderHeight = parseInt(MCP.data.pageHeaderHeight);
	var pageHeaderHeightCopy = parseInt(MCP.data.pageHeaderHeightCopy);
	var pageHeadingHeight;
	
	var $scrollTop = $(window).scrollTop();
	
	//set the user defined height
	if($('#header-outer[data-transparent-header="true"]').length > 0) {
		//if( pageHeaderHeight < $('#header-space').height() + 150) {
		//	pageHeaderHeight = $('#header-space').height() + 150;
		//	pageHeaderHeightCopy = $('#header-space').height() + 150;
		//}
	}

	$('#page-header-bg').css('height',pageHeaderHeight+'px').removeClass('not-loaded');
	setTimeout(function(){ $('#page-header-bg').css('overflow','visible') },800);
	
	function pageHeader(){		
		if( window.innerWidth < 1000 && window.innerWidth > 690 ) {			
			$('#page-header-bg').attr('data-height', pageHeaderHeightCopy/1.6).css('height',pageHeaderHeightCopy/1.6 +'px');			
		}
		else if( window.innerWidth <= 690 && window.innerWidth > 480){			
			$('#page-header-bg').attr('data-height', pageHeaderHeightCopy/2.1).css('height',pageHeaderHeightCopy/2.1 +'px');			
		}
		else if( window.innerWidth <= 480){			
			$('#page-header-bg').attr('data-height', pageHeaderHeightCopy/2.5).css('height',pageHeaderHeightCopy/2.5 +'px');			
		}
		else{
			$('#page-header-bg').attr('data-height', pageHeaderHeightCopy).css('height',pageHeaderHeightCopy +'px');
			if($('#page-header-bg[data-parallax="1"]').length == 0) 
			{				
				$('#page-header-wrap').css('height',pageHeaderHeightCopy +'px');			
			}
			else if($('#page-header-wrap').css('height') != pageHeaderHeightCopy) 
			{				
				$('#page-header-wrap').css('height',pageHeaderHeightCopy +'px');			
			}
			
		}
		
		if(!$('body').hasClass('mobile')){
			//recalc
			pageHeaderHeight = parseInt($('#page-header-bg').attr('data-height'));
			$('#page-header-bg .container > .row').css('top',0);
			
			//center the heading
			pageHeadingHeight = $('#page-header-bg .page-phrase-title').height();
			pageHeadSliderHeight = $('#page-header-bg .page-header-carousel').height();
			
			//center the page phrase title if not parallax header
			if($('#header-outer[data-transparent-header="true"]').length > 0) {
				$('#page-header-bg:not("[data-parallax=1]") .page-phrase-title').css('top', ((pageHeaderHeight+$('#header-space').height())/2) - (pageHeadingHeight/2));
				if($('#page-header-bg .page_header_slider').length > 0) {
					$('#page-header-bg:not("[data-parallax=1]") .page-header-carousel').css('top', ((pageHeaderHeight+$('#header-space').height())/2) - (pageHeadSliderHeight/2));
				}
				
			} else {			
				$('#page-header-bg:not("[data-parallax=1]") .page-phrase-title').css('top', (pageHeaderHeight/2) - (pageHeadingHeight/2) + 22);
				if($('#page-header-bg:not("[data-parallax=1]") .page_header_slider').length > 0) {
					$('#page-header-bg:not("[data-parallax=1]") .page-header-carousel').css('top', (pageHeaderHeight/2) - (pageHeadSliderHeight/2) - 10);
				}
			}
			
			//page phrase title if parallax header
			if($('#page-header-bg[data-parallax="1"] .page-phrase-title').css('opacity') > 0) {		
				if($('#header-outer[data-transparent-header="true"]').length > 0) {
					//center the parallax heading
					$('#page-header-bg[data-parallax="1"] .page-phrase-title').css({ 
						'opacity' : 1-($scrollTop/(pageHeaderHeight-($('#page-header-bg .page-phrase-title').height()*2)+60)),
						'top' : (((pageHeaderHeight+$('#header-space').height())/2) - (pageHeadingHeight/2)) +"px"
					});					
			  } else {			  
					//center the parallax heading
					$('#page-header-bg[data-parallax="1"] .page-phrase-title').css({ 
						'opacity' : 1-($scrollTop/(pageHeaderHeight-($('#page-header-bg .page-phrase-title').height()*2)+60)),
						'top' : ((pageHeaderHeight/2) - (pageHeadingHeight/2)) +10 +"px"
					});
					
					var title_opacity = 1-($scrollTop/(pageHeaderHeight-($('#page-header-bg .page-phrase-title').height()*2)+60));
					if(title_opacity < 0)
					{
						$('#page-header-bg .page-phrase-title').hide();						
					}
					else
					{
						$('#page-header-bg .page-phrase-title').show();
					}
			  }
		   }
		   
		   //page header slider
		   if($('#page-header-bg .page_header_slider').length > 0) {
				if($('#page-header-bg[data-parallax="1"] .page-header-carousel').css('opacity') > 0) {		
					if($('#header-outer[data-transparent-header="true"]').length > 0) {						
					
						//center the parallax header slider
						$('#page-header-bg[data-parallax="1"] .page-header-carousel').css({ 
							'opacity' : 1-($scrollTop/(pageHeaderHeight- $('#page-header-bg .page-header-carousel').height() +60)),
							'top' : (((pageHeaderHeight+$('#header-space').height())/2) - (pageHeadSliderHeight/2)) +"px"
						});					
				  } else {				  
						//center the parallax header slider
						$('#page-header-bg[data-parallax="1"] .page-header-carousel').css({ 
							'opacity' : 1-($scrollTop/(pageHeaderHeight- $('#page-header-bg .page-header-carousel').height() +60)),
							'top' : ((pageHeaderHeight/2) - (pageHeadSliderHeight/2)) -30 +"px"
						});					
				  }
			   }
		   }
			
		}		
		else {
			//recalc
			pageHeaderHeight = parseInt($('#page-header-bg').attr('data-height'));
			
			//center the heading
			var pageHeadingHeight = $('#page-header-bg .container > .row').height();
			$('#page-header-bg .container > .row').css('top', (pageHeaderHeight/2) - (pageHeadingHeight/2) + 5);			

			//page header title
			$('#page-header-bg .page-phrase-title').css('top', 0);
			
			//page header component
			if($('#page-header-bg .page_header_slider').length > 0) {
				$('#page-header-bg .page-header-carousel').css('top', 0);				
			}		
		}

		$('#page-header-bg .container > .row').css('visibility','visible');
	}

	pageHeader();
	
	if($('#header-outer').attr('data-header-resize') == '' || $('#header-outer').attr('data-header-resize') == '0'){
		$('#page-header-wrap').css('margin-top','0');
	}
	
	$(window).resize(pageHeader);
}
/*****************************************************************
******************************************************************
  MCP.instantiateParallaxPageHeaders()
  Initialize Parallax Page Headers
******************************************************************/
MCP.instantiateParallaxPageHeaders = function() {	
	var logoHeight = parseInt(MCP.data.logoHeight);
	var headerPadding = parseInt(MCP.data.headerPadding);
	var headerPadding2 = parseInt(MCP.data.headerPadding2);
	var extraDef = 10;
	var headerResize = $('#header-outer').attr('data-header-resize');
	var headerResizeOffExtra = MCP.data.headerResizeOffExtra;
	var extraHeight = 0; //admin bar
	var usingLogoImage = true;		
	var secondaryHeader = MCP.data.secondaryHeader;
	
	if( $('header#top #logo img').length == 0 ) { logoHeight = 79; }
	
	/***************** Parallax Page Headers ******************/
	if($('#page-header-bg[data-parallax="1"]').length > 0) {
		//fadeIn
		function extractUrl(input) {
			return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
		}
		
		var img = new Image();
		
		var imgX, imgY, aspectRatio;
		var diffX, diffY;
		var pageHeadingHeight = $('#page-header-bg .page-phrase-title').height();
		var pageHeadSliderHeight = $('#page-header-bg .page-header-carousel').height();
		var pageHeaderHeight = parseInt($('#page-header-bg').attr('data-height'));
		var headerPadding2 = parseInt($('#header-outer').attr('data-padding'))*2;				
		
		function pageHeaderInit(){
			 //transparent
			  if($('#header-outer[data-transparent-header="true"]').length > 0) {	
				$('#page-header-bg[data-parallax="1"]').css({'top': extraHeight });
			  } else {
				 $('#page-header-bg[data-parallax="1"]').css({'top': (logoHeight+headerPadding+headerResizeOffExtra-extraDef+secondaryHeader)  + 'px' });
			  }
			  
			  $('#page-header-bg[data-parallax="1"]').animate({ 'opacity' : 1},650,'easeInCubic');
			  
			  $('#page-header-wrap').css({'height' : pageHeaderHeight});			  
			  
			  //verify smooth scorlling
			var $smoothActive = $('body').attr('data-smooth-scrolling'); 
			var $smoothCache = ( $smoothActive == 1 ) ? true : false;
		
			if( $smoothCache == true && $(window).width() > 690 && $('body').outerHeight(true) > $(window).height() && Modernizr.csstransforms3d && !navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)){ 
				//window.mcp.niceScrollInit(); $(window).trigger('resize');
			} 
			  
			  /* $('#page-header-bg[data-parallax="1"] .span_6').css({ 
					'opacity' : 1-($scrollTop/(pageHeaderHeight-($('#page-header-bg .col.span_6').height()*2)+60))
					'top' : ((pageHeaderHeight/2) - (pageHeadingHeight/2)) +10 +"px"
			   });
			   
			   $('#page-header-bg[data-parallax="1"] #portfolio-filters').css({ 
					'opacity' : 1-($scrollTop/(pageHeaderHeight-($('#page-header-bg .col.span_6').height()*2)+75)),
					'top' : ($scrollTop*-0.10) + ((pageHeaderHeight/2)) - 7 +"px"
			   }); */		  
		}
		
		var $initialImgCheck = extractUrl($('#page-header-bg[data-parallax="1"]').css('background-image'));
		
		if ($initialImgCheck && $initialImgCheck.indexOf('.') !== -1) {
			img.onload = function() {
			   pageHeaderInit(); 
			}
			
			img.src = extractUrl($('#page-header-bg[data-parallax="1"]').css('background-image'));
			
		} else {
			 pageHeaderInit();
		}
		
		var extraHeight = 0; //admin bar
		
		$(window).scroll(function(){			
			var $scrollTop = $(window).scrollTop();
			var pageHeadingHeight = $('#page-header-bg .page-phrase-title').height();
			var pageHeadSliderHeight = $('#page-header-bg .page-header-carousel').height();
			
			if(!$('body').hasClass('mobile') && navigator.userAgent.match(/iPad/i) == null){		
				//calc bg pos
				//$('#page-header-bg[data-parallax="1"]').css({'top': ((- $scrollTop / 5)+logoHeight+headerPadding+headerResizeOffExtra+extraHeight-extraDef+secondaryHeader)  + 'px' });
				$('#page-header-bg[data-parallax="1"]').transition({ y: $(window).scrollTop()*-.2 },0);	
				
				var multipler = ($('body').hasClass('single')) ? 1 : 2;
				
				//page phrase title
				$('#page-header-bg[data-parallax="1"] .page-phrase-title').css({ 
					'opacity' : 1-($scrollTop/(pageHeaderHeight-($('#page-header-bg .page-phrase-title').height()*multipler)+60))
				});
				
				//page header slider
				if($('#page-header-bg .page_header_slider').length > 0) {									
					$('#page-header-bg[data-parallax="1"] .page-header-carousel').css({ 
						'opacity' : 1-($scrollTop/(pageHeaderHeight-($('#page-header-bg .page-header-carousel').height())+0))
					});
				}				
				
				//page phrase title
				$('#page-header-bg[data-parallax="1"] .page-phrase-title').stop(true,true).transition({ y: $(window).scrollTop()*-.14 },0);
				
				//page header slider
				if($('#page-header-bg .page_header_slider').length > 0) {
					$('#page-header-bg[data-parallax="1"] .page-header-carousel').stop(true,true).transition({ y: $(window).scrollTop()*-.14 },0);
				}
								
				//page phrase title
				if($('#page-header-bg[data-parallax="1"] .page-phrase-title').css('opacity') == 0){
					$('#page-header-bg[data-parallax="1"] .page-phrase-title').hide();
				} else {
					$('#page-header-bg[data-parallax="1"] .page-phrase-title').show();
				}
				
				//page header slider
				if($('#page-header-bg .page_header_slider').length > 0) {
					if($('#page-header-bg[data-parallax="1"] .page-header-carousel').css('opacity') == 0){
						$('#page-header-bg[data-parallax="1"] .page-header-carousel').hide();
					} else {
						$('#page-header-bg[data-parallax="1"] .page-header-carousel').show();
					}
				}				
				
				//hide elements to allow other parallax sections to work in webkit browsers
				if( ($scrollTop / (pageHeaderHeight + $('#header-space').height() + extraHeight)) > 1 ) {
					$('#page-header-bg').css('visibility','hidden').hide();
				}
				else {
					$('#page-header-bg').css('visibility','visible').show();
				}				
			}			
		});
	}	
}
/*****************************************************************
******************************************************************
 MCP.instantiateAnimateContents()
 Initialize Content Animation
******************************************************************/
MCP.instantiateAnimateContents = function() {
	
	var isMobile = false;
	 
	$(function() {

		/* --- MOBILE DETECT --- */
		if (navigator.userAgent.match(/Android/i) || 
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) || 
			navigator.userAgent.match(/iPad/i)|| 
			navigator.userAgent.match(/iPod/i) || 
			navigator.userAgent.match(/BlackBerry/i)) {                 
			isMobile = true;            
		}


		/* --- ADD NECESSARY CLASS --- */
		if (isMobile == true) {
			$('.animated').removeClass('animated');
			
			
		}       

		/* --- ANIMATE CONTENT --- */
		if (isMobile == false) {
			$('*[data-animated]').addClass('animated');
		}
		

		function animated_contents() {
			$(".animated:appeared").each(function (i) {
				var $this    = $(this),
					animated = $(this).data('animated');

				setTimeout(function () {
					$this.addClass(animated);
				}, 100 * i);
			
			});
		}
		
		animated_contents();
		
		$(window).scroll(function () {
			animated_contents();
		}); 
						
	});
	 
	
}
/*****************************************************************
******************************************************************
  MCP.instantiateAdditionalJS()
  Initialize Additional Javascript on Standard Pages
******************************************************************/
MCP.instantiateAdditionalJS = function() {							 
	var fnstring = "InternalJS";
	
	var func = window[fnstring];

	if(func && typeof func === 'function') {
		func();
	}					
}
/*****************************************************************
******************************************************************
  MCP.instantiateScrollToTop()
  Initialize Scroll To Top Button
******************************************************************/
MCP.instantiateScrollToTop = function() {	
	var $scrollTop = $(window).scrollTop();

	//starting bind
	if( $('#to-top').length > 0 && $(window).width() > 1020) {		
		if($scrollTop > 350){
			$(window).bind('scroll',hideToTop);
		}
		else {
			$(window).bind('scroll',showToTop);
		}
	}

	function showToTop(){		
		if( $scrollTop > 350 ){
			$('#to-top').stop(true,true).animate({
				'bottom' : '17px'
			},350,'easeInOutCubic');	
			
			$(window).unbind('scroll',showToTop);
			$(window).bind('scroll',hideToTop);
		}
	}

	function hideToTop(){		
		if( $scrollTop < 350 ){
			$('#to-top').stop(true,true).animate({
				'bottom' : '-30px'
			},350,'easeInOutCubic');	
			
			$(window).unbind('scroll',hideToTop);
			$(window).bind('scroll',showToTop);				
		}
	}
	
	//to top color
	if( $('#to-top').length > 0 ) {		
		var $windowHeight, $pageHeight, $footerHeight, $ctaHeight;
		
		function calcToTopColor(){
			$scrollTop = $(window).scrollTop();
			$windowHeight = $(window).height();
			$pageHeight = $('body').height();
			$footerHeight = $('.footer').height();
			$ctaHeight = 0;
			
			if( ($scrollTop-35 + $windowHeight) >= ($pageHeight - $footerHeight)){
				$('#to-top').addClass('dark');
			}			
			else {
				$('#to-top').removeClass('dark');
			}
		}
		
		//calc on scroll
		$(window).scroll(calcToTopColor);
		
		//calc on resize
		$(window).resize(calcToTopColor);
	}
		
	//scroll up event
	$('#to-top').click(function(){
		$('body,html').stop().animate({
			scrollTop:0
		},800,'easeOutQuad')
		return false;
	});
}
/*****************************************************************
******************************************************************
  MCP.instantiateFlexSlider()
  Initialize Flex Slider
******************************************************************/
MCP.instantiateFlexSlider = function() {
	/*
	*	FlexSlider
	*/
	jQuery('.flexslider li img.slide_bg').each(function(){
		jQuery(this).parent().attr('style', 'background-image:url('+$(this).attr('src')+');');		
	});
	
	jQuery('.flexslider').flexslider({
        animation: "slide",
		slideshowSpeed: 15000,
		touch: true,
		controlNav: false
    });
}
/*****************************************************************
******************************************************************
  MCP.instantiateStats()
  Initialize Fact Number Stats Animation
******************************************************************/
MCP.instantiateStats = function() {
	if(MCP.util.windowWidth > 690)
	{
		animateStats.animateStats_square();
	}
}
/*****************************************************************
******************************************************************
  MCP.instantiateOwlCarousel()
  Initialize jQuery Owl Carousel
******************************************************************/
MCP.instantiateOwlCarousel = function() {	
	var owl = $(".promo-carousel");
	var items_count = $(".promo-carousel").attr('data-carouselitems');
	
      owl.owlCarousel({

        // Define custom and unlimited items depending from the width
        // If this option is set, itemsDeskop, itemsDesktopSmall, itemsTablet, itemsMobile etc. are disabled
        // For better preview, order the arrays by screen size, but it's not mandatory
        // Don't forget to include the lowest available screen size, otherwise it will take the default one for screens lower than lowest available.
        // In the example there is dimension with 0 with which cover screens between 0 and 450px
        
        items : items_count,
        navigation : true,		
		navigationText:["<i class=\"icon-angle-left\"></i>","<i class=\"icon-angle-right\"></i>"],
		pagination: false
      });
}
/*****************************************************************
******************************************************************
  MCP.instantiateNewsIsotopeGrid()
  Initialize NewsEventsPage Isotope Masonry News Grid
******************************************************************/
MCP.instantiateNewsIsotopeGrid = function(numCols) {
	var colstoshow = numCols;
	
	var $container = $('#news_post_area');
	
	if($container.hasClass('masonry')) { 
		//move the meta to the bottom
		$container.find('article').each(function(){
			
			var $metaClone = $(this).find('.post-meta').clone();

			$(this).find('.post-meta').remove();

			$(this).find('.content-inner').after($metaClone);					
		});
		
		var $cols = colstoshow;
		var $element = $container;
		
		if($container.find('img').length == 0) $element = $('<img />');
		
		imagesLoaded($element,function(instance){								
			$container.isotope({
			   itemSelector: 'article',
			   layoutMode: 'masonry',
			   cellsByRow:{
					columnWidth: $('#news_post_area').width() / $cols,
					rowHeight: 500
			   },
			   
			   masonry: { columnWidth: $('#news_post_area').width() / $cols}
			});
			
			setTimeout(function(){ $container.animate({'opacity': 1},1300); },200);
			
			$(window).trigger('resize')
				
		});
		
		$(window).resize(function(){					
			var mediaQuerySize; //= getComputedStyle(document.body, ':after').getPropertyValue('content'); 
			var windowSize = $(window).width();

			//remove double quotes for FF
			//if (navigator.userAgent.match('MSIE 8') == null) {
			//	mediaQuerySize = mediaQuerySize.replace(/"/g, '');
			///}
			
			
			if(window.innerWidth > 1600){
				mediaQuerySize = 'five';
			} else if(window.innerWidth <= 1600 && window.innerWidth >= 1300){
				mediaQuerySize = 'four';
			} else if(window.innerWidth < 1300 && window.innerWidth >= 990){
				mediaQuerySize = 'three';
			} else if(window.innerWidth < 990 && window.innerWidth >= 470){
				mediaQuerySize = 'two';
			} else if(window.innerWidth < 470){
				mediaQuerySize = 'one';
			}
			
			
			//boxed
			if($('#boxed').length > 0) {
				if(window.innerWidth > 1300){
					mediaQuerySize = 'four';
				} else if(window.innerWidth < 1300 && window.innerWidth > 990){
					mediaQuerySize = 'three';
				} else if(window.innerWidth < 990){
					mediaQuerySize = 'one';
				}
				
			}
			
			
			switch (mediaQuerySize) {
				case 'five':
					$cols = 5;
				break;
				
				case 'four':
					$cols = 4;
				break;
				
				case 'three':
					$cols = 3;
				break;
				
				case 'two':
					$cols = 2;
				break;
				
				case 'one':
					$cols = 1;
				break;
			}
		});
		
		$(window).smartresize(function(){
		   $container.isotope({
			  masonry: { columnWidth: $('#news_post_area').width() / $cols}
		   });
		});			
	}	
}

/*****************************************************************
******************************************************************
  MCP.instantiateImageGrid()
  Initialize Masonry Image Grid
******************************************************************/
MCP.instantiateImageGrid = function() {
	//load script if its standard page
	if(MCP.data.pagetype != "home")
	{
		Helpers.loadScript("prebuilt/js/FWDGrid.js",false,MCP.renderImageGrid);
	}
	else
	{
		MCP.renderImageGrid();
	}
}

/*****************************************************************
******************************************************************
  MCP.renderImageGrid()
  Render Masonry Image Grid after script load
******************************************************************/
MCP.renderImageGrid = function() {
	var grid;		
	var imagegridload = jQuery.Deferred();
	
	function resizeGrid(){
		//imagegridload = jQuery.deferred();			
		var windowWidth = $(window).width();
		var max_grid_images;
		var noimagegrids = $('#image_grid_playlist ul[data-cat="Category one"] ul').length;
		
		if(((windowWidth <= 1024) && (windowWidth > 640)) && noimagegrids > 7)
		{ //remove last 3 image grid
			max_grid_images = 7;
			$('#image_grid_playlist ul[data-cat="Category one"] ul').each(function(n, item){
				if(n > (max_grid_images - 1))
				{
					$(item).remove();
				}
			});
			
			imagegridload.resolve();
		}
		else if((windowWidth <= 640) && noimagegrids > 8)
		{ //remove last 2 image grid
			max_grid_images = 8;
			$('#image_grid_playlist ul[data-cat="Category one"] ul').each(function(n, item){
				if(n > (max_grid_images - 1))
				{
					$(item).remove();
				}
			});
			
			imagegridload.resolve();
		}
		else
		{			
			imagegridload.resolve();
		}
	}
	
	var initGrid = imagegridload.done(function(){	
		grid = new FWDGrid({
			//main settings
			gridHolderId:"image_grid",
			gridPlayListAndSkinId:"image_grid_playlist",
			showContextMenu:"no",
			//grid settings
			thumbnailOverlayType:"text",
			addMargins:"yes",
			loadMoreThumbsButtonOffest:0,
			thumbnailBaseWidth:240,
			thumbnailBaseHeight:160,
			nrOfThumbsToShowOnSet:27,
			horizontalSpaceBetweenThumbnails:8,
			verticalSpaceBetweenThumbnails:8,
			thumbnailBorderSize:1,
			thumbnailBorderRadius:8,
			thumbnailOverlayOpacity:.85,
			backgroundColor:"#e0e4e4",
			thumbnailOverlayColor:"#000000",
			thumbnailBackgroundColor:"#333333",
			thumbnailBorderNormalColor:"#FFFFFF",
			thumbnailBorderSelectedColor:"#FFFFFF",
			//combobox settings
			startAtCategory:1,
			selectLabel:"SELECT CATEGORIES",
			allCategoriesLabel:"All Categories",
			showAllCategories:"no",
			comboBoxPosition:"topleft",
			selctorBackgroundNormalColor:"#FFFFFF",
			selctorBackgroundSelectedColor:"#000000",
			selctorTextNormalColor:"#000000",
			selctorTextSelectedColor:"#FFFFFF",
			buttonBackgroundNormalColor:"#FFFFFF",
			buttonBackgroundSelectedColor:"#000000",
			buttonTextNormalColor:"#000000",
			buttonTextSelectedColor:"#FFFFFF",
			comboBoxShadowColor:"#000000",
			comboBoxHorizontalMargins:12,
			comboBoxVerticalMargins:12,
			comboBoxCornerRadius:4,
			//ligtbox settings
			addLightBoxKeyboardSupport:"yes",
			showLightBoxNextAndPrevButtons:"yes",
			showLightBoxZoomButton:"yes",
			showLightBoxInfoButton:"yes",
			showLighBoxSlideShowButton:"yes",
			showLightBoxInfoWindowByDefault:"no",
			slideShowAutoPlay:"no",
			lightBoxVideoAutoPlay:"no",
			lighBoxBackgroundColor:"#000000",
			lightBoxInfoWindowBackgroundColor:"#FFFFFF",
			lightBoxItemBorderColor:"#FFFFFF",
			lightBoxItemBackgroundColor:"#222222",
			lightBoxMainBackgroundOpacity:.8,
			lightBoxInfoWindowBackgroundOpacity:.9,
			lightBoxBorderSize:1,
			lightBoxBorderRadius:8,
			lightBoxSlideShowDelay:4	
		});		
	});
		
	function destroy(){
		grid.destroy();
	}
		
	resizeGrid();
	
	//$(window).resize(resizeGrid);
}


/*****************************************************************
******************************************************************
  MCP.instantiateAdditionalSection()
  Initialize Additional Section using AJAX
******************************************************************/
MCP.instantiateAdditionalSection = function() {		
	var has_additionalsection = parseInt($('body').data('additionalsection'));		
	if(has_additionalsection == 1)
	{
		var additional_section_url = $('body').data('additionalsectionurl');
		if(window.location.host == "192.168.200.44")
		{
			var requestURL = "http://" + window.location.host + "/molloydev4/" + additional_section_url;
		}
		else
		{
			var requestURL = "http://" + window.location.host + "/" + additional_section_url;
		}		
		
		var ajax_response;
		var sectionloaded = MCP.data.def.then(function(){
			Helpers.loadFromAjax(requestURL, "html", function(data){						
				ajax_response = data;
				//MCP.data.def.then($('.main-content').append(ajax_response));
				$('.main-content').append(ajax_response);
				MCP.data.add_section.resolve();
			});		
		});	
	}
	else
	{		
		MCP.data.add_section.resolve();
	}
	
}
/*****************************************************************
******************************************************************
  MCP.instantiateResizeIframe()
  Resize Iframe for Forms
******************************************************************/
MCP.instantiateResizeIframe = function() {	
	
	function resize_iframe(){
		if($('iframe').length > 0)
		{
			var iframe_id = $('iframe').attr('id');
			
			if(iframe_id == "ft_form")
			{				
				$('iframe').iFrameResize([{
					log: true,
					enablePublicMethods: true
				}]);
				
			}
		}	
	}
	
	resize_iframe();
}
/*****************************************************************
******************************************************************
  MCP.instantiateResponsiveTable()
  Responsive Table
******************************************************************/
MCP.instantiateResponsiveTable = function() {	
	
	function set_table_responsive(){
				
		$('table').each(function(e){
			if($(this).hasClass("table"))
			{
				$(this).wrap( "<div class='table-responsive'></div>" );
			}				
		});			
	}
	
	set_table_responsive();
}
/*****************************************************************
******************************************************************
  MCP.instantiateTestimonialFooter()
  Adjust Testimonial Footer
******************************************************************/
MCP.instantiateTestimonialFooter = function() {	
	
	function set_testimonial_footer(){
				
		$('.testimonial_footer').each(function(e){
					
			$(this).parents(".mc-row").css("background-color","#232323");
			$(this).parents(".mc-row").css("border-top","5px solid #981e32");
			$(this).parents(".mc-row").css('padding-top', 0);			
			$(this).parents(".mc-row").css('margin-top', '58px');						
		});			
	}
	
	set_testimonial_footer();
}
/*****************************************************************
******************************************************************
  MCP.instantiateTwitterFeed()
  Twitter Feed
******************************************************************/
MCP.instantiateTwitterFeed = function() {	
	
	function set_tweet_feed(){
				
	$('.footer .twitter_slider').twittie({
            username: 'MolloyCollege',
            list: '',
            dateFormat: '%b. %d, %Y',
            template: '<div class="tweet"><blockquote><p><a target="_blank" href="">{{screen_name}}</a> {{tweet}}</p></blockquote><span class="time">{{date}}</span></div>',
            count: 10
        }, function () {
            MCP.instantiateFlexSlider();
        });		
	}
	
	set_tweet_feed();
}
/*****************************************************************
******************************************************************
  MCP.instantiateFormValidator()
  Initialize Form Validator using BootstrapValidator v0.5.2
******************************************************************/
MCP.instantiateFormValidator = function() {
	var key_count = 0;
	
	$('#ft_form_49').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            full_name: {                
                validators: {
                    notEmpty: {
                        message: 'The Name is required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 50,
                        message: 'The Name must be more than 6 and less than 50 characters long'
                    },
                    regexp: {                        
						regexp: /^[a-z\s]+$/i,
                        message: 'The username can only consist of alphabetical characters and spaces only'
                    }                    
                }
            },
            email_address: {				
                validators: {
                    notEmpty: {
                        message: 'The email address is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The email address is not a valid'
                    }
                }
            },
            question: {
                validators: {
                    notEmpty: {
                        message: 'The Question is required and cannot be empty'
                    },                    
                    stringLength: {
                        min: 8,
						max: 500,
                        message: 'The Question must be more than 8 and less than 500 characters long'
                    }
                }
            },
			captcha_code: {
				validators: {
					notEmpty: {
                        message: 'The Captcha Code is required and cannot be empty'
                    },                    
                    stringLength: {                        
						max: 6,
                        message: 'The Captcha Code must have at least 6 characters'
                    }
				}
			}
        }
    })
	.on('success.field.bv', '[name="email_address"]', function() {				
		key_count = key_count + 1;
		if(key_count == 1)
		{
			if($(".ft_form #captcha_image_box img").attr('src') == '')
			{
				var formsURL = "http://blogs.molloy.edu/formtools/securimage/securimage_getcaptcha_id.php";
				
				Helpers.loadFromAjax(formsURL, "json", function(data){											
					var captcha_img_src = "http://blogs.molloy.edu/formtools/securimage/captcha_display.php?captchaId="+data.captcha_id;
					$(".ft_form #captchaId").val(data.captcha_id);				
					$(".ft_form #captcha_image_box img").attr('src',captcha_img_src);
					$(".ft_form #captcha_image_box").show();					
				});		
			}			
		}							
	})	
	.on('success.form.bv', function(e) {
		// Prevent form submission
		e.preventDefault();

		// Get the form instance
		var $form = $(e.target);

		// Get the BootstrapValidator instance
		var bv = $form.data('bootstrapValidator');
		
		var postData = $form.serializeArray();
		
		var formURL = $form.attr("action");
		
		$('#ft_form_49 button').text('Sending ...');

		$.ajax(
		{
			url : formURL,
			type: "POST",
			crossDomain: true,
			xhrFields:{
				withCredentials: false
			},
			data : postData,
			dataType: "json",
			success:function(data, textStatus, jqXHR) 
			{														
				if(data.status == "success")
				{
					$("#ft_form_49").hide();
					$("#ft_form_response").html("<p><i style='display: inline-block;color: #3c763d;margin-right: 10px;' class='form-control-feedback glyphicon glyphicon-ok'></i>Thank you.<br/>Your message has been sent successfully. We'll get back to you shortly.</p>");
				}
				else
				{
					
					var error_message = JSON.parse(data.page_vars);
					
					var error_type = error_message.message_type;
					var error_text = error_message.message;
					
					if(error_type == "error_captcha")
					{
						var show_error = "<p><i style='display: inline-block;color: #a94442;margin-right: 10px;' class='form-control-feedback glyphicon glyphicon-remove'></i>"+error_text+"</p>";
						//document.getElementById('captcha').src = 'http://blogs.molloy.edu/formtools/securimage/securimage_show.php?' + Math.random();
						$(".ft_form #captcha_code").val('');
						$('#ft_form_49 button').text('Submit');
						$("#ft_form_response").html(show_error);						
					}
					else
					{
						$("#ft_form_49").hide();
						$("#ft_form_response").html("<p><i style='display: inline-block;color: #a94442;margin-right: 10px;' class='form-control-feedback glyphicon glyphicon-remove'></i>Sorry, There seems to be some technical problem.<br/>Your message was not sent. Please contact the helpdesk at 516.323.4800 .</p>");
					}					
				}
			},
			error: function(jqXHR, textStatus, errorThrown) 
			{				
				$("#ft_form_49").hide();
				$("#ft_form_response").html("<p><i style='display: inline-block;color: #a94442;margin-right: 10px;' class='form-control-feedback glyphicon glyphicon-remove'></i>Sorry, There seems to be some connection problem.<br/>Your message was not sent. Please contact the helpdesk at 516.323.4800 .</p>");
			}
		});
	});
	
	//Reload Captcha Image
	$(".ft_form #reload_captcha").on('click', function(e) {
		// Prevent regular click
		e.preventDefault();
		
		if($("#ft_form_49").length > 0)
		{
			var formsURL = "http://blogs.molloy.edu/formtools/securimage/securimage_getcaptcha_id.php";
			
			Helpers.loadFromAjax(formsURL, "json", function(data){										
				var captcha_img_src = "http://blogs.molloy.edu/formtools/securimage/captcha_display.php?captchaId="+data.captcha_id;
				$(".ft_form #captchaId").val(data.captcha_id);				
				$(".ft_form #captcha_image_box img").attr('src',captcha_img_src);
			});		
		}
	});
}
/*****************************************************************
******************************************************************
Molloy Components
******************************************************************/
MCP.MolloyComponents = (function() {
	"use strict";
	return {
		init: function() {
			$('.mc-row #component-body').each(function(){	
				var components = $(this).data('components');
			
				if(components) {					
					var func = components;
		 
					if(MCP.MolloyComponents[func] && typeof MCP.MolloyComponents[func].init === 'function') {
						MCP.MolloyComponents[func].init();
					}					
				}
				
			});
			
			
		},
		
		molloyfactnumberscomponent: {
			init: function() {
				MCP.instantiateStats();
			}
		},
		
		carouselslidercomponent: {
			init: function() {
				MCP.instantiateOwlCarousel();			
			}
		},
		
		imagegridcomponent: {
			init: function() {
				MCP.instantiateImageGrid();
			}
		},
		
		testimonialslidercomponent: {
			init: function() {
				MCP.instantiateFlexSlider();
			}
		},
		
		testimonialcomponent: {
			init: function() {
				MCP.instantiateTestimonialFooter();
			}
		}
		
	}; 
})();//end MolloyComponents.
/*****************************************************************
******************************************************************
PageTypes
******************************************************************/
MCP.pages = (function() {
	"use strict";
	return {
		init: function() {
			MCP.initializeData();
			
			MCP.instantiateSuperfish();					
			
			MCP.instantiateHeader();
			
		},
		finalize: function() {
			
			//$.when(MCP.data.def, MCP.instantiateAdditionalSection()).done(function(){
			MCP.data.def.done(function(){
				MCP.instantiateAdditionalSection();
									
					MCP.data.add_section.done(function(){	
						//FullWidth Sections	
						MCP.instantiateFullWidthSection();
						
						//Parallax Sections
						MCP.instantiateParallax();											
						
						MCP.MolloyComponents.init();											
						
						MCP.instantiateAnimateContents();						
						
						MCP.instantiateTwitterFeed();
					});					
					
					
				});
			
			if(MCP.data.pagetype != "home")
			{				
				MCP.data.def.resolve();
			}
			
			
		},		
		home: {
			init: function() {	
				//Revolution Slider
				MCP.instantiateHomePageRevSlider();	 
			}
		},
		StandardPage: {
			init: function() {				
				MCP.instantiatePageHeaders();
				
				MCP.instantiateParallaxPageHeaders();
				
				if($('#page-featured-news-events').length > 0)
				{
					MCP.instantiateOwlCarousel();					
				}
				
				MCP.instantiateScrollToTop();
				
				MCP.instantiateResizeIframe();
				
				MCP.instantiateResponsiveTable();
				
				MCP.instantiateFormValidator();
				
				MCP.instantiateAdditionalJS();
			}
		},
		StandardLevel2Page: {
			init: function() {				
				MCP.instantiatePageHeaderRevSlider();
				
				MCP.instantiatePageHeaders();
				
				MCP.instantiateParallaxPageHeaders();

				MCP.instantiateResizeIframe();
				
				MCP.instantiateFormValidator();
			}
		},
		NewsEventsPage: {
			init: function() {				
				MCP.instantiatePageHeaders();
				
				MCP.instantiateParallaxPageHeaders();
				
				MCP.instantiateNewsIsotopeGrid(2);				
				
				MCP.instantiateResizeIframe();
				
				MCP.instantiateFormValidator();
			}
		},
		ArticleDetailPage: {
			init: function() {				
				MCP.instantiatePageHeaders();
				
				MCP.instantiateParallaxPageHeaders();	
				
				if($('#page-featured-news-events').length > 0)
				{
					MCP.instantiateOwlCarousel();					
				}

				MCP.instantiateResizeIframe();
				
				MCP.instantiateFormValidator();
			}
		},
		NewsIndexNewsArchivePage: {
			init: function() {				
				MCP.instantiatePageHeaders();
				
				MCP.instantiateParallaxPageHeaders();
				
				MCP.instantiateNewsIsotopeGrid(3);		

				MCP.instantiateResizeIframe();
				
				MCP.instantiateFormValidator();
			}
		},
		FacultyProfilePage: {
			init: function() {				
				MCP.instantiatePageHeaders();
				
				MCP.instantiateParallaxPageHeaders();		
				
				if($('#page-featured-news-events').length > 0)
				{
					MCP.instantiateOwlCarousel();					
				}
				
				MCP.instantiateResizeIframe();
				
				MCP.instantiateFormValidator();
			}
		},
		SearchResultsPage: {
			init: function() {				
				MCP.instantiatePageHeaders();
				
				MCP.instantiateParallaxPageHeaders();
				
				MCP.instantiateScrollToTop();							
			}
		}
	}; 
})();//end Pages.

/* Document Ready
   ========================================================================== */
$(document).ready(function(){
	var pagetype = $('body').data('pagetype');			
	var namespace = MCP.pages
	if(pagetype) {						 
		var func = pagetype;
		MCP.pages.init();		
		
		if(namespace[func] && typeof namespace[func].init === 'function') {
			namespace[func].init();
		}	
		
		MCP.pages.finalize();
	}
});