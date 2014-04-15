/*!
 * CanJS - 2.1.0-pre
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 10 Feb 2014 20:24:20 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
steal('can/util/can.js', function (can) {
	can.each = function (elements, callback, context) {
		var i = 0,
			key;
		if (elements) {
			if (typeof elements.length === 'number' && elements.pop) {
				if (elements.attr) {
					elements.attr('length');
				}
				for (key = elements.length; i < key; i++) {
					if (callback.call(context || elements[i], elements[i], i, elements) === false) {
						break;
					}
				}
			} else if (elements.hasOwnProperty) {
				if (can.Map && elements instanceof can.Map) {
					if (can.__reading) {
						can.__reading(elements, '__keys');
					}
					elements = elements.__get();
				}
				for (key in elements) {
					if (elements.hasOwnProperty(key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
						break;
					}
				}
			}
		}
		return elements;
	};
	return can;
});
