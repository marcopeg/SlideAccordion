
/**
 * SlideAccordion
 */

// jQuery Compatibility Wrapper
;(function($) { 

	
	/**
	 * Plugin's Default
	 */
	$.slideAccordion = {
		version: '1.0',
		defaults: {
			
			
			
			// In default behavior any slideAccordion item must have
			// at least two items to be used as handler and body
			handle:	'>:first',
			body:	'>:last',
			
			// The "close" item will close a slingle accordion
			close:	'.close',
			
			// This class will be applied to visible items
			activeClass:	'active',
			openedClass: 	'opened',
			
			// Idenfity one or more item to be always opened
			stikyClass: '.stiky',
			
			// Moving speed for sliding and scrolling
			speed: 	500,
			offset: 0,
			
			// Try to use "scrollTo()" plugin (if availabe) for smooth scroll effect
			useScrollTo: true,
			
			// By opening a different item the visible one is closed
			// This behavior work inside a collection of items represented by the
			// "collection" attribute.
			// By default the collection is the container of the item who's plugin is been applied.
			// You can change this behavior using an xPath idetifier (".group1").
			closeOnOpen: 	false,
			collection: 	'parent',
			
			// By clicking an opened item's handler it will be closed
			closeOnClick: true,
			
		t:0}
	};
	
	
	
	
	
	/**
	 * jQuery Extension :: The Plugin
	 */
	$.fn.slideAccordion = function() {
		
		// Proprietˆ di configurazione interna.
		var cfg = false;

		// Estendo la proprietˆ di configurazione con l'oggetto di
		// configurazione contenuto nel primo parametro del plugin.
		if ( !arguments.length || $.isPlainObject(arguments[0]) ) {
		
			cfg = $.extend({}, $.slideAccordion.defaults, arguments[0] );
		
		}
		
		// Applico la logica agli elementi del contesto (DOM)
		$(this).each(function(){ __loop.call( this, cfg ); });
		
		// Mantengo la possibilitˆ di concatenare plugins.
		return this;
		
	}; // EndOf: "slideAccordion()" ###
	
	
	
	
	
	
	
	
	/**
	 * Plugin Item Logic
	 */
	var __loop = function( cfg ) {
		
		// Compose the Object's context.
		var obj = __object.call( this, cfg );
		
		// Prevent slideAccordion behavior on stiky items.
		// Stiky items can only be scrolled when clicked.
		if ( obj.$.is(cfg.stikyClass) ) {
			
			obj.$handle.bind( 'click', $.proxy(__handleStikyClick,obj) );
			
			return;
		
		};
		
		// Hide Item body by default.
		// This is done in a better way with CSS!
		obj.$body.fadeOut();
		
		// Prevent execution within non compatible DOM objects.
		// An object must have at least two children to be used as header and content.
		if ( !obj.$handle.length || !obj.$body.length ) return;
		
		// Init the click event on the handle object.
		obj.$handle.bind( 'click', $.proxy(__handleClick,obj) );
		
		if ( obj.$close.length ) obj.$close.bind( 'click', $.proxy(__handleClose,obj) );
	
	}; // EndOf: "__loop()" ###
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Hendle Click Event on the Item Handler
	 * this is the main logic method of the plugin.
	 * it exposes only "actions" who's behavior is described into internal low level methods
	 */
	var __handleClick = function( e ) {
		
		e.preventDefault();
		
		// Try to open the item
		if ( this.$body.is(':hidden') ) {
			
			
			
			if ( this.cfg.collection == 'parent' ) {
				var $opened = this.$.parent().find('.'+this.cfg.openedClass);
				
			} else {
				var $opened = $( this.cfg.collection + '.'+this.cfg.openedClass );
				
			}
			
			
			
			// Check for close-then-open behavior
			if ( $opened.length && this.cfg.closeOnOpen ) {
				
				var actualObj 	= this;
				var openedObj 	= __object.call( $opened, this.cfg );
				
				
				// Close Then Open Chain
				__scroll.call( openedObj, {
					complete: function() {
						
						__close.call( this, {
							complete: function() {
								
								actualObj.$.addClass(actualObj.cfg.activeClass);
								
								__open.call( actualObj, {
									complete: function(){
										
										__scroll.call( this );
										
									}
								});
								
							}
						});
						
					}
				});
				
				
			
			// There is no opened items or auto-closing is not requested
			} else {
				
				this.$.addClass(this.cfg.activeClass);
						
				__open.call( this, {
					complete: function() { 
						
						__scroll.call( this );
						
					}
				});
			
			}
			
			
			
			
			
		// Try to close the item (if behavior is configured this way)
		} else if ( this.cfg.closeOnClick ) {
			
			__close.call( this );
			
		}
		
	
	}; // EndOf: "__handleClick()" ###
	
	
	
	/**
	 * Hendle Click Event on the Item Handler for Stiky Items
	 * no hide/display behavior is applied.
	 *
	 * It only scrolls to the top of the item.
	 */
	var __handleStikyClick = function( e ) {
		
		e.preventDefault();
		
		//this.$.addClass(this.cfg.activeClass);
		//this.$.addClass(this.cfg.openedClass);
		
		__scroll.call( this );
	
	}; // EndOf: "__handleStikyClick()" ###
	
	
	
	/**
	 * Handle Click Event to the Close Hanlder
	 */
	var __handleClose = function( e ) {
		
		e.preventDefault();
		
		__scroll.call( this, {
			complete: function () {
				
				__close.call( this );
				
			}
		});
	
	}; // EndOf: "__handleClose()" ###
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Simple open/close methods
	 */
	
	var __open = function() {
		
		var cfg = __config({
			complete: 	function() {},
			context:	this
		},arguments);
		
		var _this = this;
		
		this.$body.slideDown( this.cfg.speed, function(){
			
			_this.$.addClass(_this.cfg.openedClass);
			
			cfg.complete.call( cfg.context );
		
		});
		
	}; // EndOf: "__open()" ###
	
	
	
	var __close = function() {
		
		var cfg = __config({
			complete: 	function() {},
			context:	this
		},arguments);
		
		var _this = this;
		
		this.$body.slideUp( this.cfg.speed, function(){
			
			_this.$.removeClass(_this.cfg.openedClass);
			_this.$.removeClass(_this.cfg.activeClass);
			
			cfg.complete.call( cfg.context );
		
		});
		
	}; // EndOf: __close()" ###
	
	
	
	/**
	 * Simple Scroll Method
	 */
	
	var __scroll = function() {
		
		var cfg = __config({
			to:			this.$handle,
			complete:	function() {},
			context:	this
		},arguments);
		
		// With scrollTo() plugin
		if ( this.cfg.useScrollTo && $.scrollTo ) {
			
			$.scrollTo( this.$handle, {
				speed:		this.cfg.speed,
				offset:		this.cfg.offset,
				onAfter:	$.proxy( cfg.complete, cfg.context )
			});
		
		// Without scrollTo() plugin... 
		} else {
			
			$(window).scrollTop( this.$handle.offset().top + this.cfg.offset );
			
			cfg.complete.call( cfg.context );
			
			
		}
		
	
	}; // EndOf: "scroll()" ###
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Compose an Item Context with link to usefull DOM objects and configuration
	 */
	var __object = function( cfg ) {
	
		return {
			$:			$(this),
			$handle:	$(this).find( cfg.handle ),
			$body:		$(this).find( cfg.body ),
			$close:		$(this).find( cfg.close ),
			cfg:		cfg
		};
	
	}; // EndOf: "__object()" ###
	
	
	
	/**
	 * Compose a configuration object with default values and 
	 * function's input based configuration.
	 *
	 * function() { var cfg = __config({def:'foo',def2:'foo},arguments); }
	 *
	 */
	var __config = function( defaults, arguments ) {
		
		// Apply defaults value
		var cfg = $.extend({},{},defaults);
		
		// Apply received configuration
		if ( arguments.length ) cfg = $.extend({},cfg,arguments[0]);
		
		return cfg;
		
	}; // EndOf: "__config()" ###


})(jQuery);