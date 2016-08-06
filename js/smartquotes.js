/*!
 * smartquotes.js v0.1.4
 * http://github.com/kellym/smartquotesjs
 * MIT licensed
 *
 * Copyright (C) 2013 Kelly Martin, http://kelly-martin.com
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.smartquotes = factory();
    }
}(this, function () {

    var TEXT_NODE = Element.TEXT_NODE || 3;
    var whitelist = ['code', 'pre', 'script', 'style'];

    // The smartquotes function should just delegate to the other functions
    function smartquotes(context) {
        if (typeof context === 'undefined') {
            return smartquotes.element(document.body);
        }

        if (typeof context === 'string') {
            return smartquotes.string(context);
        }

        if (context instanceof HTMLElement) {
            return smartquotes.element(context);
        }
    }

    smartquotes.string = function smartquotesString(str) {
        return str
            .replace(/'''/g, '\u2034')                                                   // triple prime
            .replace(/(\W|^)"(\S)/g, '$1\u201c$2')                                       // beginning "
            .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2')          // ending "
            .replace(/([^0-9])"/g,'$1\u201d')                                            // remaining " at end of word
            .replace(/''/g, '\u2033')                                                    // double prime
            .replace(/(\W|^)'(\S)/g, '$1\u2018$2')                                       // beginning '
            .replace(/([a-z])'([a-z])/ig, '$1\u2019$2')                                  // conjunction's possession
            .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3')                 // ending '
            .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3')     // abbrev. years like '93
            .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019') // backwards apostrophe
            .replace(/'/g, '\u2032')
            .replace(/---/g, '\u2014') // Highjacking smartquotes.js for other stuff!
            .replace(/--/g, '\u2013')
            .replace(/\\qed/g, '\u220E')
            .replace(/fi/g, '\uFB01') // ligatures
            .replace(/fl/g, '\uFB02')
    };

    // Check not just whether el is whitelisted, but also whether an
    // ancestor of el's is whitelisted e.g. for cases like <code>curl
    // <span>"http://eg.com"</span></code>, where the span is inserted
    // by a highlighting library. If we only check el, the quotes in
    // span will be replaced, which we don't want.
    function isAncestorWhitelisted(el){
        var elmt = el
        while (elmt && whitelist.indexOf(elmt.nodeName.toLowerCase()) == -1){
            elmt = elmt.parentElement;
        }
        return elmt != null
    }

    function handleElement(el) {
        if (isAncestorWhitelisted(el)){
            return
        }
        var childNodes = el.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType === TEXT_NODE) {
                node.nodeValue = smartquotes.string(node.nodeValue);
            }
        }
    }

    smartquotes.element = function smartquotesElement(root) {
        handleElement(root);
        var children = root.getElementsByTagName('*');
        for (var i = 0; i < children.length; i++) {
            handleElement(children[i]);
        }
    }

    return smartquotes
}));
