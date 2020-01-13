/*
  Name: jQuery.prettyQuote.js
  Version: 1.2
  Required: jQuery.js (tested on jQuery 1.4.2)
  Copy: Copyright (c) Unformed Building (http://unformedbuilding.com/)
  Author: Matori/ub-pnr (pnr.matori@gmail.com)
  Lisence: MIT
  Date: 2010-09-17
  Modified: 2010-09-28
*/

(function($) {

	$.check = {

		// check tagName
		tag: function (element) {
			var elm = element[0].tagName.toLowerCase();
			if(elm === 'blockquote') {
				return true;
			}
			else if(elm === 'q') {
				return true;
			}
			else {
				return false;
			}
		},

		// Convert ISBN-13 to ISBN-10.
		isbn: function (isbn13) {
			var isbn10 = isbn13.toString().slice(3,-1);
			var digit = 0;
			for(var i = 0; i < 9; i++){
				digit += Number(isbn10.charAt(i)) * (10 - i);
			}
			digit = (11 - (digit % 11)) %11;
			digit = digit === 10 ? 'X' : digit.toString();
			return isbn10 + digit;
		}

	};

	$.fn.prettyQuote = function(options) {

		// default settings & set options
		var opts = $.extend({
			newWin: true,
			container: { tag: 'div', className: 'prettyQuote'},
			quoteWrap: { wrap: false, tag: 'div', className: 'body' },
			header: { display: true, tag: 'div', className: 'header' },
			footer: { display: true, tag: 'div', className: 'footer', text: 'uri' }, // text can be specified 'title' or 'uri'
			tooltip: '', // 'any text' or 'title'
			amazonId: '' // 'XXX-2n'
		}, options);

		this.each(function() {

			var $this = $(this);

			// check container tag
			if(!opts.container.tag) return;

			// check elements
			if(!$.check.tag($this)) return;

			// blockquote or q attributes
			var values = {
				title: $this.attr('title'),
				cite: $this.attr('cite'),
				url: $this.filter('[cite^="http"]').attr('cite'),
				isbn: $this.filter('[cite^="urn:isbn:"]').attr('cite')
			},
			anc, ancTxt;

			// web
			if(values.cite === values.url) {
				anc = values.url;
				if(opts.footer.text === 'title') {
					ancTxt = values.title ? values.title : decodeURI(values.url);
				}
				else if(opts.footer.text === 'uri') {
					ancTxt = decodeURI(values.url);
				}
			} // end if(values.cite === values.url)

			// books
			else if(values.cite === values.isbn) {
				var isbnCode = values.isbn.replace(/^urn:isbn:/i, '').toUpperCase(), // urn:isbn:XXX-X-XXXX... -> XXX-X-XXXX...
					n = isbnCode.split('-').join(''), // XXX-X-XXXX... -> XXXXXXXX...
					pat = /^[a-z]+\-2[0-9]$/; // amazon id matching pattern

				// anc
				anc = 'http://www.amazon.co.jp/exec/obidos/ASIN/';

				// ISBN-13
				if(n.length === 13) {
					anc += $.check.isbn(n) + '/';
				}
				// ISBN-10
				else if(n.length === 10) {
					anc += n + '/';
				}
				// invalid ISBN
				else {
					anc = null;
				}
				if(pat.test(opts.amazonId)) {
					anc += opts.amazonId + '/ref=nosim/';
				}
				// ancTxt
				if(opts.footer.text === 'title') {
					ancTxt = values.title ? values.title : 'ISBN:' + isbnCode;
				}
				else if(opts.footer.text === 'uri') {
					ancTxt = 'ISBN:' + isbnCode;
				}
			} // end if(values.cite === values.isbn)

			else if(values.title && !values.cite) {
				ancTxt = values.title;
			}

			// create HTML
			var link, header, footer, quote, container;

			// anchor
			if(anc != null){

				// anchor attribute
				var attributes = {'href': anc}
				if(opts.newWin) {
					attributes['target'] = '_blank';
				}
				if(opts.tooltip) {
					var t = opts.tooltip === 'title' ? values.title : opts.tooltip;
					if(t) attributes['title'] = t;
				}
				link = $('<cite/>').html($('<a/>').attr(attributes).text(ancTxt));

			}
			else {
				link = $('<cite/>').html(ancTxt);
			}

			// header
			if(opts.header.display && values.title) {
				header = opts.header.tag
					? $('<' + opts.header.tag + '/>').addClass(opts.header.className).text(values.title)
					: values.title;
			}

			// footer
			if(opts.footer.display && ancTxt) {
				footer = opts.footer.tag
					? $('<' + opts.footer.tag + '/>').addClass(opts.footer.className).html(link)
					: link;
			}

			// body (quote)
			if(opts.quoteWrap.wrap && opts.quoteWrap.tag) {
				quote = $('<' + opts.quoteWrap.tag + '/>').addClass(opts.quoteWrap.className).html($this.clone());
			}
			else {
				quote = $this.clone();
			}

			// wrapping container
			container = $('<' + opts.container.tag + '/>').addClass(opts.container.className);

			// HTML
			$this.wrap(container).before(header).after(footer).replaceWith(quote);

		});

		return this;

	};

})(jQuery);