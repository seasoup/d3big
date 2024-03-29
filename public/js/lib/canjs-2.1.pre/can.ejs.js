/*!
 * CanJS - 2.1.0-pre
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 10 Feb 2014 20:24:31 GMT
 * Licensed MIT
 * Includes: can/view/ejs
 * Download from: http://canjs.com
 */
(function(can) {
    // ## ejs.js
    // `can.EJS`  
    // _Embedded JavaScript Templates._
    // Helper methods.
    var extend = can.extend,
        EJS = function(options) {
            // Supports calling EJS without the constructor
            // This returns a function that renders the template.
            if (this.constructor !== EJS) {
                var ejs = new EJS(options);
                return function(data, helpers) {
                    return ejs.render(data, helpers);
                };
            }
            // If we get a `function` directly, it probably is coming from
            // a `steal`-packaged view.
            if (typeof options === 'function') {
                this.template = {
                    fn: options
                };
                return;
            }
            // Set options on self.
            extend(this, options);
            this.template = this.scanner.scan(this.text, this.name);
        };
    can.EJS = EJS;

    EJS.prototype.

    render = function(object, extraHelpers) {
        object = object || {};
        return this.template.fn.call(object, object, new EJS.Helpers(object, extraHelpers || {}));
    };
    extend(EJS.prototype, {

            scanner: new can.view.Scanner({
                    text: {
                        outStart: 'with(_VIEW) { with (_CONTEXT) {',
                        outEnd: "}}",
                        argNames: '_CONTEXT,_VIEW',
                        context: "this"
                    },

                    tokens: [
                        ["templateLeft", "<%%"], // Template
                        ["templateRight", "%>"], // Right Template
                        ["returnLeft", "<%=="], // Return Unescaped
                        ["escapeLeft", "<%="], // Return Escaped
                        ["commentLeft", "<%#"], // Comment
                        ["left", "<%"], // Run --- this is hack for now
                        ["right", "%>"], // Right -> All have same FOR Mustache ...
                        ["returnRight", "%>"]
                    ],
                    helpers: [

                        {
                            name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                            fn: function(content) {
                                var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                                    parts = content.match(quickFunc);

                                return "can.proxy(function(__){var " + parts[1] + "=can.$(__);" + parts[2] + "}, this);";
                            }
                        }
                    ],

                    transform: function(source) {
                        return source.replace(/<%([\s\S]+?)%>/gm, function(whole, part) {
                            var brackets = [],
                                foundBracketPair, i;
                            // Look for brackets (for removing self-contained blocks)
                            part.replace(/[{}]/gm, function(bracket, offset) {
                                brackets.push([
                                        bracket,
                                        offset
                                    ]);
                            });
                            // Remove bracket pairs from the list of replacements
                            do {
                                foundBracketPair = false;
                                for (i = brackets.length - 2; i >= 0; i--) {
                                    if (brackets[i][0] === '{' && brackets[i + 1][0] === '}') {
                                        brackets.splice(i, 2);
                                        foundBracketPair = true;
                                        break;
                                    }
                                }
                            } while (foundBracketPair);
                            // Unmatched brackets found, inject EJS tags
                            if (brackets.length >= 2) {
                                var result = ['<%'],
                                    bracket, last = 0;
                                for (i = 0; bracket = brackets[i]; i++) {
                                    result.push(part.substring(last, last = bracket[1]));
                                    if (bracket[0] === '{' && i < brackets.length - 1 || bracket[0] === '}' && i > 0) {
                                        result.push(bracket[0] === '{' ? '{ %><% ' : ' %><% }');
                                    } else {
                                        result.push(bracket[0]);
                                    }
                                    ++last;
                                }
                                result.push(part.substring(last), '%>');
                                return result.join('');
                            } // Otherwise return the original
                            else {
                                return '<%' + part + '%>';
                            }
                        });
                    }
                })
        });
    EJS.Helpers = function(data, extras) {
        this._data = data;
        this._extras = extras;
        extend(this, extras);
    };

    EJS.Helpers.prototype = {
        // TODO Deprecated!!
        list: function(list, cb) {
            can.each(list, function(item, i) {
                cb(item, i, list);
            });
        },
        each: function(list, cb) {
            // Normal arrays don't get live updated
            if (can.isArray(list)) {
                this.list(list, cb);
            } else {
                can.view.lists(list, cb);
            }
        }
    };
    // Options for `steal`'s build.
    can.view.register({
            suffix: 'ejs',
            script: function(id, src) {
                return 'can.EJS(function(_CONTEXT,_VIEW) { ' + new EJS({
                        text: src,
                        name: id
                    })
                    .template.out + ' })';
            },
            renderer: function(id, text) {
                return EJS({
                        text: text,
                        name: id
                    });
            }
        });
    return can;
})(can);