window.MathJax = {
    extensions: ["tex2jax.js", "TeX/AMSsymbols.js", "TeX/AMSmath.js"],
    jax: ["input/TeX", "output/SVG", "output/NativeMML", "output/CommonHTML"],
    tex2jax: {
        inlineMath: [[ '$','$']],
        displayMath:  [['$$','$$']],
        processEscapes: true
    },
    "HTML-CSS": {
        availableFonts: ["TeX"],
    },
    TeX: {
        Macros: {
            count: "\\mathop{\\rm count}\\limits",
            liml: "\\mathop{\\liml}\\limits",
            prodl: "\\mathop{\\prod}\\limits",
            suml: "\\mathop{\\sum}\\limits",
            sumtext: "\\mathop{\\rm sum}\\limits"
        }
    }
}
