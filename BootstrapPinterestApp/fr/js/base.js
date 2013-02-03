


$(window).load(function() {

	var markup = '<div class="box col3"><h3>${RecipeName}</h3>'
					+'<img src="${image}" alt="${RecipeName}"/>'
					+'<p>{{html Recipe}}</p>'
					+'{{if featured == "1"}}<img src="icons/star.png" style="width:20px;height:20px"/>{{/if}}'
					+'<p style="text-align:right"><a href="${file}">Download this recipt</a></p>'
			+'</div>';

	//define a global data array to holding the data
	var recipeData = new Array();
	var country =  new Array();
	var countryUnique =  new Array();
	var ingerdient =  new Array();
	var ingerdientUnique =  new Array();

	var browser_height = $(document).height();
	var browser_weight = $(document).width();

	$(".refresh").click(function(){
		location.reload();
	});

	getAllRecipt();
	//stickySidebar();

	function getAllRecipt(){

	  	$.getJSON('data/recipes.json', function(data) {

		    for(var i = 0; i<data.length;i++){

		    	country.push(data[i].Country);
		    	ingerdient.push(data[i].Ingredients);
		    	recipeData.push(data[i]);
		      	    	
		      	/*if(data[i].featured == "1"){
		      		$("#content").append('<div class="box"><h3>'+data[i].RecipeName+'</h3><img src="'+data[i].image+'" alt="'+data[i].RecipeName+'" /><p>'+data[i].Recipe+'<br/><img src="icons/star.png" style="width:20px;height:20px"/></p><p style="text-align:right"><a href="'+data[i].file+'">Download this recipt</a></p></div>');
		      	}else{
		      		$("#content").append('<div class="box"><h3>'+data[i].RecipeName+'</h3><img src="'+data[i].image+'" alt="'+data[i].RecipeName+'" /><p>'+data[i].Recipe+'</p><p style="text-align:right"><a href="'+data[i].file+'">Download this recipt</a></p></div>');
		      	}*/
		    }

		    $("#loading").remove();

		    $.tmpl(markup,data).appendTo("#content");
		    //Init jQuery Masonry layout
    		init_masonry();
	    
		    $.each(country, function(i, el){
			    if($.inArray(el, countryUnique) === -1) countryUnique.push(el);
			});		

			$.each(ingerdient, function(i, el){
			    if($.inArray(el, ingerdientUnique) === -1) ingerdientUnique.push(el);
			});

			menuSetup();	

		});
	}

	function menuSetup(){
		for(var i = 0; i<countryUnique.length; i++){
				$("ul#country").append('<li><a href="#">'+countryUnique[i]+'</a></li>');
			}
		for(var i = 0; i<ingerdientUnique.length; i++){
				$("ul#ingerdient").append('<li><a href="#">'+ingerdientUnique[i]+'</a></li>');
			}	
		$("ul#country li a").click(function(){
				getReciptCountry($(this).text());
		});
		$("ul#ingerdient li a").click(function(){
				getReciptIngerdient($(this).text());
		});
	}

	function getReciptCountry(e){	
		var content = getObjects(recipeData, "Country", e);	
		//clear old container
		$(".box").remove();
		$.tmpl(markup,content).appendTo("#content");
		//Init jQuery Masonry layout
    	init_masonry();
	};

	function getReciptIngerdient(e){	
		var content = getObjects(recipeData, "Ingredients", e);	
		//clear old container
		$(".box").remove();
		$.tmpl(markup,content).appendTo("#content");
		//Init jQuery Masonry layout
    	init_masonry();
	};

	function getObjects(obj, key, val) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(getObjects(obj[i], key, val));
			} else if (i == key && obj[key] == val) {
				objects.push(obj);
			}
		}
		return objects;
	}


	if(browser_weight>=960){
		stickySidebar();
	}

});

function init_masonry(){
		var $container = $('#content');
	    $container.imagesLoaded( function(){
	        $container.masonry({
	            itemSelector : '.box'
	        });
	    });
}


function stickySidebar(){

	if (!!$('.sticky').offset()) { // make sure ".sticky" element exists
 
    var stickyTop = $('.sticky').offset().top; // returns number 
 
    $(window).scroll(function(){ // scroll event
 
      var windowTop = $(window).scrollTop(); // returns number 
 		
 	  var widthSticky = $(".well").width();
      if (stickyTop < windowTop){
        $('.sticky').css({ position: 'fixed', top: 60 , width: widthSticky});
      }
      else {
        $('.sticky').css('position','static');
      }
 
    });
 
  }

}


