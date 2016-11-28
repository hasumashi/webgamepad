(function ( $ ) {

	this.PrettyAlert = function() {

		var defaults = {
			title: "Alert",
			icon: '/img/alert.png',
			content: ""
		}

		// Create options by extending defaults with the passed in arugments
        this.options = $.extend( {}, defaults, arguments[0] );
	};
	
	PrettyAlert.prototype.open = function(data) {
		var _ = this;	// store original PrettyAlert object
		
		var html = '\
			<div class="pa-shadow pa-show"></div>' +
			'<div class="pa-alert pa-show">' +
				'<img src="'+this.options.icon+'">' +
				'<h2>'+this.options.title+'</h2>' +
				
				'<div class="pa-alert-content">' +
					this.options.content
				'</div>' +
			'</div>';
		
		var alert = $(html).prependTo('body');
		alert.filter('.pa-alert').find('.pa-close').click(function() {
			_.close()
		});
	};
	 
	PrettyAlert.prototype.close = function() {
		$('.pa-alert').removeClass('pa-show').addClass('pa-hide');
		$('.pa-shadow').removeClass('pa-show');
		
		$(".pa-alert").one("animationend webkitAnimationEnd oAnimationEnd", function() {
			this.remove();
		});
		$(".pa-shadow").one("transitionend webkitTransitionEnd oTransitionEnd", function() {
			this.remove();
		});
	};
	 
}( jQuery ));
