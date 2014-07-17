/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/
function getCellData(lat,lon){
	//map lat long to ij using mapping file
	
	return $.ajax({		
	    url: "http://23.20.175.183/slosh/ll/"+lon+"/"+lat,
	    jsonp: "callback",
	    dataType: "jsonp",

	    success: function(response) {
	        //console.log( response ); // server response	       
	    }, 
	});
	 
      
}