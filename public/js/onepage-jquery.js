(function ( $ ) {

	//function to bind to onpopstate event
	function loadFromHistory(e){
		if(e.state){
			if (settings.target === document)
				replaceDocument(e.state.html);
			else
				replaceElement(settings.target, e.state.html);
		}
	};

	//replace whole document with new html
	function replaceDocument(html) {
		var newDoc = document.open("text/html");
		newDoc.write(html);
		newDoc.close();
		
		if (settings.transition == 'fade') {
			$('html').hide().fadeIn(settings.transitionDuration);
		}
		
		window.onpopstate = loadFromHistory;
	}
	
	//replace element with new html
	function replaceElement(el, html) {
		if (settings.transition == 'fade') {
			$(el).fadeOut(settings.transitionDuration, function() {
				$(this).html(html).hide().fadeIn(settings.transitionDuration);
			});
		} else {
			$(el).html(html);
		}
		
		window.onpopstate = loadFromHistory;
	}

	//main function
    $.fn.onepage = function(options) {
        settings = $.extend( {}, $.fn.onepage.defaults, options );

		history.replaceState(
			{
				html: settings.target===document ? $('html').html() : $(settings.target).html(),
				title: $(document).find("title").text()
			},
			'',
			''
		);
		
		//this.filter('a').each(function() {
		$('body').on('click', this.selector, function(e) {
			e.preventDefault();
			
			var url = $(this).attr('href');	
			
			if (settings.transition == 'fade') {
				if (settings.target === document)
					var el = 'html'
				else
					var el = settings.target;
				
				$(el).fadeOut(settings.transitionDuration, function(){
					$.fn.onepage.openLink(url);
				});
			} else {
				$.fn.onepage.openLink(url);
			}
			
		});
		//});
    };
	
	//get link html and open it
	$.fn.onepage.openLink = function(url) {
		$.get({
			url: url,
			data: settings.mode,
			success: function(data) {
				if (settings.target === document)
					replaceDocument(data);
				else
					replaceElement(settings.target, data);
				
				if (settings.linkFormatter !== undefined)
					url = settings.linkFormatter(url);
				
				history.pushState(
					{"html": data},
					"",
					url
				);
			}	
		});
	};
	
	//default settings
	$.fn.onepage.defaults = {
		mode: 'html',					// expected data format from server ('html','json')
		target: document,				// element to replace its HTML (string, jQuery obj, document obj)
										// when mode='json' (not implemented) target should also be JSON which "maps"
										// targets to values from server's JSON
										// like {target1: json_key1, target2: json_key2} 
		transition: 'none',				// transition to use when changing pages ('none','fade')
		transitionDuration: 250,		// transition duration in ms
		linkFormatter: undefined,		// function with one param which formats link in addr bar
		query: ''						// data to send to server with every request
	};
	 
}( jQuery ));