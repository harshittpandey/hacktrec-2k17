/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	var bodyEl = document.body,
		docElem = window.document.documentElement,
		// http://stackoverflow.com/a/1147768
		docWidth = Math.max(bodyEl.scrollWidth, bodyEl.offsetWidth, docElem.clientWidth, docElem.scrollWidth, docElem.offsetWidth),
		docHeight = Math.max(bodyEl.scrollHeight, bodyEl.offsetHeight, docElem.clientHeight, docElem.scrollHeight, docElem.offsetHeight);

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * Circle Slideshow
	 */
	function CircleSlideshow(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );

		// items
		this.items = [].slice.call(this.el.querySelectorAll('.sponsor_slide'));
		// total items
		this.itemsTotal = this.items.length;
		if( this.itemsTotal < 1 ) return;

		// content close control
		this.closeCtrl = this.el.querySelector('.action--close');
		// index of current slide
		this.current = 0;
		// all items are closed initially
		this.isClosed = true;

		this._init();
	}

	CircleSlideshow.prototype.options = {};

	CircleSlideshow.prototype._init = function() {
		// add navigation ctrls and left & right circles to the DOM
		
		
		
		// add the expander element per slide (.deco--expander)
		this.items.forEach(function(item) {
			var expanderEl = document.createElement('div');
			expanderEl.className = 'deco deco--circle deco--expander';

			var slideEl = item.querySelector('.sponsor_slide__item');
			slideEl.insertBefore(expanderEl, slideEl.firstChild);
		});

		// position current item:
		classie.add(this.items[this.current], 'sponsor_slide--current');
		// event binding
		this._initEvents();
	};

	CircleSlideshow.prototype._initEvents = function() {
		var self = this;

		
		// opening items
		this.items.forEach(function(item) {
			item.querySelector('.action--open').addEventListener('click', function(ev) {
				self._openContent(item);
				ev.target.blur();
			});
		});

		// closing items
		this.closeCtrl.addEventListener('click', function() { self._closeContent(); });

		// keyboard navigation events
		document.addEventListener('keydown', function(ev) {
			var keyCode = ev.keyCode || ev.which;
			switch (keyCode) {
				case 37:
					self._navigate('left');
					break;
				case 39:
					self._navigate('right');
					break;
				case 13: // enter
					if( self.isExpanded ) return;
					self._openContent(self.items[self.current]);
					break;
				case 27: // esc
					if( self.isClosed ) return;
					self._closeContent();
					break;
			}
		});

		// swipe navigation
		// from http://stackoverflow.com/a/23230280
		this.el.addEventListener('touchstart', handleTouchStart, false);        
		this.el.addEventListener('touchmove', handleTouchMove, false);
		var xDown = null;
		var yDown = null;
		function handleTouchStart(evt) {
			xDown = evt.touches[0].clientX;
			yDown = evt.touches[0].clientY;
		};
		function handleTouchMove(evt) {
			if ( ! xDown || ! yDown ) {
				return;
			}

			var xUp = evt.touches[0].clientX;
			var yUp = evt.touches[0].clientY;

			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;

			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
				if ( xDiff > 0 ) {
					/* left swipe */
					if( !self.isExpanded ) {
						self._navigate('right');	
					}
				} else {
					/* right swipe */
					if( !self.isExpanded ) {
						self._navigate('left');	
					}
				}
			} 
			/* reset values */
			xDown = null;
			yDown = null;
		};
	};

	CircleSlideshow.prototype._navigate = function(dir) {
		if( this.isExpanded ) {
			return false;
		}

		this._moveCircles(dir);

		var self = this,
			itemCurrent = this.items[this.current],
			currentEl = itemCurrent.querySelector('.sponsor_slide__item'),
			currentTitleEl = itemCurrent.querySelector('.sponsor_slide__title');

		// update new current value
		if( dir === 'right' ) {
			this.current = this.current < this.itemsTotal-1 ? this.current + 1 : 0;
		}
		else {
			this.current = this.current > 0 ? this.current - 1 : this.itemsTotal-1;
		}

		var itemNext = this.items[this.current],
			nextEl = itemNext.querySelector('.sponsor_slide__item'),
			nextTitleEl = itemNext.querySelector('.sponsor_slide__title');
		
		// animate the current element out
		dynamics.animate(currentEl, 
			{
				translateX: dir === 'right' ? -1*currentEl.offsetWidth : currentEl.offsetWidth, scale: 0.7
			}, 
			{
				type: dynamics.spring, duration: 2000, friction: 600,
				complete: function() {
					dynamics.css(itemCurrent, { visibility: 'hidden' });
				}
			}
		);

		// animate the current title out
		dynamics.animate(currentTitleEl, 
			{
				translateX: dir === 'right' ? -250 : 250, opacity: 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 450
			}
		);

		// set the right properties for the next element to come in
		dynamics.css(itemNext, {visibility: 'visible'});
		dynamics.css(nextEl, {translateX: dir === 'right' ? nextEl.offsetWidth : -1*nextEl.offsetWidth, scale: 0.7});

		// animate the next element in
		dynamics.animate(nextEl, 
			{
				translateX: 0
			}, 
			{
				type: dynamics.spring, duration: 3000, friction: 700, frequency: 500,
				complete: function() {
					self.items.forEach(function(item) { classie.remove(item, 'sponsor_slide--current'); });
					classie.add(itemNext, 'sponsor_slide--current');
				}
			}
		);

		// set the right properties for the next title to come in
		dynamics.css(nextTitleEl, { translateX: dir === 'right' ? 250 : -250, opacity: 0 });
		// animate the next title in
		dynamics.animate(nextTitleEl, 
			{
				translateX: 0, opacity: 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000
			}
		);
	};

	CircleSlideshow.prototype._moveCircles = function(dir) {
		var animProps = {
			type: dynamics.easeIn, 
			duration: 100,
			complete: function(el) {
				dynamics.animate(el, 
					{
						translateX: 0, scale: 0.8
					}, 
					{ 
						type: dynamics.spring, duration: 1000, friction: 300
					}
				);
			}
		};

		dynamics.animate(this.circles.right, 
			{
				translateX: dir === 'right' ? -this.circles.right.offsetWidth/3 : this.circles.right.offsetWidth/3, scale: 0.9
			}, 
			animProps
		);
		dynamics.animate(this.circles.left, 
			{
				translateX: dir === 'right' ? -this.circles.left.offsetWidth/3 : this.circles.left.offsetWidth/3, scale: 0.9
			}, 
			animProps
		);
	};

	CircleSlideshow.prototype._openContent = function(item) {
		this.isExpanded = true;
		this.isClosed = false;
		this.expandedItem = item;

		var self = this,
			expanderEl = item.querySelector('.deco--expander'),
			scaleVal = Math.ceil(Math.sqrt(Math.pow(docWidth, 2) + Math.pow(docHeight, 2)) / expanderEl.offsetWidth),
			smallImgEl = item.querySelector('.sponsor_slide__img--small'),
			contentEl = item.querySelector('.sponsor_slide__content'),
			largeImgEl = contentEl.querySelector('.sponsor_slide__img--large'),
			titleEl = contentEl.querySelector('.sponsor_slide__title--main'),
			descriptionEl = contentEl.querySelector('.sponsor_slide__description'),
			priceEl = contentEl.querySelector('.sponsor_slide__price'),
			buyEl = contentEl.querySelector('.button--buy');

		// add slide--open class to the item
		classie.add(item, 'sponsor_slide--open');
		// prevent scrolling
		bodyEl.style.top = -scrollY() + 'px';
		classie.add(bodyEl, 'lockscroll');
		
		// position the content elements:
		// - image (large image)
		dynamics.css(largeImgEl, {translateY : 800, opacity: 0});
		// - title
		dynamics.css(titleEl, {translateY : 600, opacity: 0});
		// - description
		dynamics.css(descriptionEl, {translateY : 400, opacity: 0});
		// - price
		dynamics.css(priceEl, {translateY : 400, opacity: 0});
		// - buy button
		dynamics.css(buyEl, {translateY : 400, opacity: 0});

		// animate (scale up) the expander element
		dynamics.animate(expanderEl, 
			{
				scaleX : scaleVal, scaleY : scaleVal
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.5,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.5,"y":1}]}], duration: 1700
			}
		);
		
		// animate the small image out
		dynamics.animate(smallImgEl, 
			{
				translateY : -600, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 300, delay: 75
			}
		);

		// animate the large image in
		dynamics.animate(largeImgEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 300
			}
		);

		// animate the title element in
		dynamics.animate(titleEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 400
			}
		);

		// animate the description element in
		dynamics.animate(descriptionEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 500
			}
		);

		// animate the price element in
		dynamics.animate(priceEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 600
			}
		);

		// animate the buy element in
		dynamics.animate(buyEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 700,
				complete: function() {
					// add .noscroll to body and .scrollable to .slide__content
					classie.add(bodyEl, 'noscroll');
					classie.add(contentEl, 'scrollable');
					
					// force redraw (chrome)
					contentEl.style.display = 'none';
					contentEl.offsetHeight;
					contentEl.style.display = 'block';
					
					// allow scrolling
					classie.remove(bodyEl, 'lockscroll');
				}
			}
		);
	};

	CircleSlideshow.prototype._closeContent = function() {
		this.isClosed = true;

		var self = this,
			item = this.expandedItem,
			expanderEl = item.querySelector('.deco--expander'),
			smallImgEl = item.querySelector('.sponsor_slide__img--small'),
			contentEl = item.querySelector('.sponsor_slide__content'),
			largeImgEl = contentEl.querySelector('.sponsor_slide__img--large'),
			titleEl = contentEl.querySelector('.sponsor_slide__title--main'),
			descriptionEl = contentEl.querySelector('.sponsor_slide__description'),
			priceEl = contentEl.querySelector('.sponsor_slide__price'),
			buyEl = contentEl.querySelector('.button--buy');

		// add slide--close class to the item
		classie.add(item, 'sponsor_slide--close');

		// remove .noscroll from body and .scrollable from .slide__content
		classie.remove(bodyEl, 'noscroll');
		classie.remove(contentEl, 'scrollable');

		// animate the buy element out
		dynamics.stop(buyEl);
		dynamics.animate(buyEl, 
			{
				translateY : 400, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000
			}
		);

		// animate the price element out
		dynamics.stop(priceEl);
		dynamics.animate(priceEl, 
			{
				translateY : 400, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000
			}
		);

		// animate the description element out
		dynamics.stop(descriptionEl);
		dynamics.animate(descriptionEl, 
			{
				translateY : 400, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 100
			}
		);

		// animate the title element out
		dynamics.stop(titleEl);
		dynamics.animate(titleEl, 
			{
				translateY : 600, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 1000, delay: 200
			}
		);

		// animate the large image out
		dynamics.animate(largeImgEl, 
			{
				translateY : 800, opacity : 0
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 500, delay: 300,
				complete: function() {
					// remove slide--open class to the item
					classie.remove(item, 'sponsor_slide--open');
					// remove slide--close class to the item
					classie.remove(item, 'sponsor_slide--close');
					// allow scrolling
					classie.remove(bodyEl, 'lockscroll');
					self.isExpanded = false;
				}
			}
		);

		// animate the small image in
		dynamics.animate(smallImgEl, 
			{
				translateY : 0, opacity : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}], duration: 700, delay: 500
			}
		);

		// animate (scale down) the expander element
		dynamics.animate(expanderEl, 
			{
				scaleX : 1, scaleY : 1
			}, 
			{
				type: dynamics.bezier, points: [{"x":0,"y":0,"cp":[{"x":0.5,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.5,"y":1}]}], duration: 700, delay: 250
			}
		);
	};

	window.CircleSlideshow = CircleSlideshow;

})(window);