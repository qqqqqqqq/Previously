;(function(){ // namespace func
	
var ZONETEST = { 
		_testingOn: true, 
		genreData: {},
		checkboxes: {},
		api: {
			apiKey: "e3e16c2fe349f4d6a723aefc2e71d301",
			filmsUrl: "https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=",
			genresUrl: "https://api.themoviedb.org/3/genre/movie/list?api_key=",
			imgBase: {
				small: "https://image.tmdb.org/t/p/w92",
				medium: "https://image.tmdb.org/t/p/w154"				
			},
			errorMsg: "**** FAILED API CALL, details logged to Console.. ****",
			callApis: {
		
				getGenres: function(){ // retrieves api of genres, stores data, calls functions to render genre filter and film list
					  
					let reqSettings = {
						"async": true,
						"crossDomain": true,
						"url": ZONETEST.api.genresUrl + ZONETEST.api.apiKey,
						"method": "GET",
						"headers": {},
						"data": "{}"
						};
						
					let ajaxCall = $.ajax(reqSettings)
						.done(function( response ) { 
							ZONETEST.genresInput = response.genres;
							ZONETEST.genresInput.forEach(store);
							//  store data in object, and initialise checkbox indicators to true for each
							function store(thisGenre, index, arr ) { 
								ZONETEST.genreData[thisGenre.id] = thisGenre.name;	
								ZONETEST.checkboxes[thisGenre.id] = true;
							}		
							
							ZONETEST.drawGenreFilter();
							ZONETEST.drawFilmList();						
						})
						.fail(function( ajaxCall, textStatus, err ) {
							let str = ajaxCall + " :: " + textStatus + " :: " + err;
							console.log(ZONETEST.api.errorMsg);
							console.log(str);
						});
				  
				}, // getGenres()
				  
				getNowPlaying: function(){ // retrieves api of films, stores data then calls function to retrieve genre list
					  
					let reqSettings = {
						"async": true,
						"crossDomain": true,
						"url": ZONETEST.api.filmsUrl + ZONETEST.api.apiKey,
						"method": "GET",
						"headers": {},
						"data": "{}"
					};

					let ajaxCall = $.ajax(reqSettings)
						.done(function( response ) { 
							ZONETEST.nowPlayingData = response;				
							// sort to descending popularity prop
							ZONETEST.nowPlayingData.results.sort((a,b) => (a.popularity < b.popularity) ? 1 : ((b.popularity < a.popularity) ? -1 : 0));
							
							ZONETEST.api.callApis.getGenres(); 
						})
						.fail(function( ajaxCall, textStatus, err ) {
							let str = ajaxCall + " :: " + textStatus + " :: " + err;
							console.log(ZONETEST.api.errorMsg);
							console.log(str);
						});
				  
				} // getNowPlaying()
		
			} // callApis
		} // api
	}; // ZONETEST object

	
 $(document).ready(function(){ 
				
	ZONETEST.drawFilmList = function(){ // renders film listings
		
		ZONETEST.nowPlayingData.results.forEach(draw);		
		function draw(thisFilm, index, arr ) { 			
			let thisFilmListing = $('<li></li>');
			thisFilmListing.addClass("film_item");	
			thisFilmListing.attr( 'id', thisFilm.id );			

			let thisImgContain = $("<div></div>");
			thisImgContain.addClass("film_img_contain");	
			thisFilmListing.append(thisImgContain);		
			
			let thisImg = $("<img>");			
			let imgUrl = ZONETEST.api.imgBase.medium + thisFilm.poster_path;
			thisImg.attr( 'src', imgUrl);	
			thisImgContain.append( thisImg );

			let thisInfo = $("<div></div>");
			thisInfo.addClass("film_info");
			thisFilmListing.append( thisInfo );
			
			let thisTitle = $("<h2></h2>");
			thisTitle.addClass("film_title");
			thisTitle.text(thisFilm.title);
			thisInfo.append( thisTitle );
							
			let thisGenres = $("<ul></ul>");
			thisGenres.addClass("film_genres");
			thisGenres.attr("id", "genre_item" + thisFilm.id);
			
			thisFilm.genre_ids.forEach(drawGenres);			
			function drawGenres(genre, index, arr ) {
				thisFilmListing.addClass("genre" + genre);
				let thisGenre = $("<li></li>");
				thisGenre.text( ZONETEST.genreData[genre] );
				thisGenres.append( thisGenre );
			}				
			thisInfo.append( thisGenres );		
			
			$("#film_list").append( thisFilmListing );					
			ZONETEST._test.drawFilmGenres(thisFilm.id, thisFilm.genre_ids);
		}
		
		ZONETEST._test.drawFilmList();
		ZONETEST.filterRatings(); //  filter films initially to the default 3
	};
	
	ZONETEST.drawGenreFilter = function(){ // renders genre filter boxes, calls function to bind filter actions to checkboxes
	
		for ( var ii = 0; ii < ZONETEST.genresInput.length; ii += 1 ) { 
			let thisGenreListing = $('<li></li>');
			
			let thisBox = $('<input type="checkbox" checked="checked">');
			thisBox.attr("id", "checkGenre" + ZONETEST.genresInput[ii].id); 
			thisBox.attr("data-genre", ZONETEST.genresInput[ii].id); 					
			thisGenreListing.append( thisBox );
			
			let thislabel = $('<label></label>');
			thislabel.attr("for", "checkGenre" + ZONETEST.genresInput[ii].id);
			thislabel.text( ZONETEST.genresInput[ii].name );
			thisGenreListing.append( thislabel );

			$("ul#genre_list").append( thisGenreListing ); 
		}; 
		
		ZONETEST._test.drawGenreFilter();
		ZONETEST.bindCheckboxes();
	}; //  ZONETEST.drawGenreFilter()
		
	ZONETEST.filterFilmList = function(){ // filters film list from checkbox data to show only films with selected genres
		$("ul#film_list li.film_item").addClass("hidden_genre");  //  hide all initially		
		for( var thisBoxGenre in ZONETEST.checkboxes){ //  loop through all genres
			if( !ZONETEST.checkboxes.hasOwnProperty( thisBoxGenre ) ){ continue; } 
			if( !ZONETEST.checkboxes[ thisBoxGenre ] === true ){ continue; } //  miss those not checked
			$("ul#film_list li.film_item").each(function(){
				if ( $(this).hasClass("genre" + thisBoxGenre) ){ // show film if has a class relating to that genre
					$(this).removeClass("hidden_genre");
				} 								
			});
		};
		ZONETEST._test.filterFilmList();
	}; 

		
	ZONETEST.bindCheckboxes = function(){ //  binds actions to genre filter checkboxes, and to 'select all' box
		
		$("ul#genre_list li input:not(#checkAll)").each(function(index){	
			$(this).change(function(){
				
				let thisGenre = $(this).attr("data-genre");
				ZONETEST.checkboxes[ thisGenre ] = ( $(this).is(':checked') ) ? true : false; // update object  genre:checked data
				ZONETEST._test.notCheckAll(thisGenre, index);
				ZONETEST.filterFilmList(); 		
			}); 
		});			
		
		$("#checkAll").click(function(){ 
			let checkedVal = $(this).prop('checked'); 
			$('#genre_list').find("input:not(#checkAll)").prop("checked", checkedVal); 
			
			for( var thisBoxGenre in ZONETEST.checkboxes){
				ZONETEST.checkboxes[ thisBoxGenre ] = checkedVal; // load object with genre:checked data
			} 
			ZONETEST._test.checkAll(checkedVal);
			ZONETEST.filterFilmList();	
		});
		
	};  // ZONETEST.bindCheckboxes()

	 
	ZONETEST.filterRatings = function(){ // shows or hides films from their rating
		let filteredRating = $("#rating_filter input").val();		
		ZONETEST.nowPlayingData.results.forEach(filterAction);	
		function filterAction( thisFilm, index, arr ) { 
			let thisListing = $( "li#" + thisFilm.id );
			(thisFilm.vote_average < filteredRating) ? thisListing.addClass("hidden_rating") : thisListing.removeClass("hidden_rating"); 
		}
		ZONETEST._test.filterRatings(filteredRating);
	};

	$("#rating_filter input").click(function(){			
		ZONETEST.filterRatings();
	});	
		
	ZONETEST.api.callApis.getNowPlaying();   // initialises.
  
 }); // document.ready
 
	ZONETEST._test = {

		filterFilmList: function(){ 
			if( !ZONETEST._testingOn ){ return; }
			console.log("TEST filterFilmList()...");
			this.assure( $("ul#film_list li.film_item").length === $("ul#film_list li.film_item.hidden_genre").length + $("ul#film_list li.film_item:not('.hidden_genre')").length, "******* DOM film list render error" );			
		},
		
		filterRatings: function(filteredRating){ 
			if( !ZONETEST._testingOn ){ return; }
			console.log("TEST filterRatings()...");
			
			this.assure( !( ((!filteredRating) && (filteredRating !== 0)) || (filteredRating > 10) ), "******* filteredRating has spurious val: " + filteredRating );
			
			this.assure( ( ($("ul#film_list li.film_item").length === $("ul#film_list li.film_item.hidden_rating").length + $("ul#film_list li.film_item:not('.hidden_rating')").length) && (ZONETEST.nowPlayingData.results.length === $("ul#film_list li.film_item").length) ), "******* DOM film list ratings filter render error" );				
		},
		
		notCheckAll: function(thisGenre, index){
			if( !ZONETEST._testingOn ){ return; }
			console.log("TEST notCheckAll()...");
			this.assure( $.isNumeric(thisGenre), "******* checkbox indexed " + index + ", ZONETEST.genresInput[index]= " + ZONETEST.genresInput[index] + " has spurious data-genre val: " + thisGenre ); 
			this.assure( ZONETEST.genresInput.length === Object.keys(ZONETEST.checkboxes).length, "******* genre hash length corrupted" );
		},
		checkAll: function(checkedVal){
			if( !ZONETEST._testingOn ){ return; }
			console.log("TEST checkAll()...");
			this.assure( ((checkedVal === true) || (checkedVal === false)), "******* checkedVal has spurious val: " ); 
			this.assure( ZONETEST.genresInput.length === Object.keys(ZONETEST.checkboxes).length, "******* genre hash length corrupted" );
		},
		
		drawGenreFilter: function(){
			if( !ZONETEST._testingOn ){ return; }
			console.log("TEST drawGenreFilter()...");
			this.assure( ZONETEST.genresInput.length === $("ul#genre_list li:not(#checkAll_li)").length, "******* genre filter tickboxes render error" ); 
			this.assure( ZONETEST.genresInput.length === $("ul#genre_list input:not(#checkAll)").length, "******* genre filter tickboxes render error" ); 
		},
				
		drawFilmList: function(){
			if( !ZONETEST._testingOn ){ return; }
			console.log("TEST drawFilmList()...");
			this.assure( $("ul#film_list li.film_item").length === ZONETEST.nowPlayingData.results.length, "******* DOM film list render error"); 
		},
		
		
		drawFilmGenres: function(filmId, thisFilmGenre_ids){
			if( !ZONETEST._testingOn ){ return; }
			console.log("TEST drawFilmGenres()...");
			this.assure( $("ul#genre_item" + filmId + " li").length == thisFilmGenre_ids.length, "******* film listing's genre list render error, film id= " + filmId ); 
			
		},
		
		assure: function(testQ, msg){
			if( !testQ ){
				console.log( msg );
			}
		}
	};

	
}()); // scope function 

