var Showcase = (function() {
	
	var $el = $( '#wrapper'),
	    $el_2 = $( '#wrapper-2'),
	    $el_3 = $( '#wrapper-3'),
	    
		// front_1 element
		$front_1 = $el.find( '.front' ),
		$front_2 = $el_2.find( '.front-2' ),
		$front_3 = $el_3.find( '.front-3' ),
		// the front_1 image wrapper
		$trigger = $front_1.children( '.p-1' ),
		$trigger_2 = $front_2.children( '.p-2' ),
		$trigger_3 = $front_3.children( '.p-3' ),
		// the screens
		$screens = $el.find( '.text_onclick-1 > p' ),
		$screens_2 = $el_2.find( '.text_onclick-2 > p' ),
		$screens_3 = $el_3.find( '.text_onclick-3 > p' ),
		// the front_1 screen image
		$screenImg = $front_1.find( 'img' ),
		$screenImg_2 = $front_2.find( 'img' ),
		$screenImg_3 = $front_3.find( 'img' ),
		// HTML Body element
		$body = $( 'body' ); 

	function init() {
		// show grid
		$trigger.on( 'click', show_data );
		$trigger_2.on( 'click', show_data2 );
		$trigger_3.on( 'click', show_data3 );
		// when a grid´s screen is clicked, show the respective image on the front_1
		
		$screens.on( 'click', function() {
			showScreen( $( this ) );
			return false;
		} );
		$screens_2.on( 'click', function() {
			showScreen( $( this ) );
			return false;
		} );
		$screens_3.on( 'click', function() {
			showScreen( $( this ) );
			return false;
		} );
	}

	function show_data() {
		$el.addClass( 'text_onclickview' );
		// clicking somewhere else on the page closes the grid view
		$body.off( 'click' ).on( 'click', function() { showScreen(); } );
		return false;
	}
	function show_data2() {
		$el_2.addClass( 'text_onclickview' );
		// clicking somewhere else on the page closes the grid view
		$body.off( 'click' ).on( 'click', function() { showScreen(); } );
		return false;
	}
	function show_data3() {
		$el_3.addClass( 'text_onclickview' );
		// clicking somewhere else on the page closes the grid view
		$body.off( 'click' ).on( 'click', function() { showScreen(); } );
		return false;
	}

	function showScreen( $screen ) {
	window.onclick = function(event) {
				$el.removeClass( 'text_onclickview' );
				$el_2.removeClass( 'text_onclickview' );
				$el_3.removeClass( 'text_onclickview' );
	   } 
    	
		if( $screen ) {
				$el.removeClass( 'text_onclickview' );
				$el_2.removeClass( 'text_onclickview' );
				$el_3.removeClass( 'text_onclickview' );
		}
	 }
	// function showScreen2( $screen ) {
	// window.onclick = function(event) {
	// 			$el_2.removeClass( 'text_onclickview' );
	//    } 
    	
	// 	if( $screen ) {
	// 			$el_2.removeClass( 'text_onclickview' );
	// 	}
	// }
	// function showScreen3( $screen ) {
	// window.onclick = function(event) {
	// 			$el_3.removeClass( 'text_onclickview' );
	//    } 
    	
	// 	if( $screen ) {
	// 			$el_3.removeClass( 'text_onclickview' );
	// 	}
	// }

	return { init : init };

})();