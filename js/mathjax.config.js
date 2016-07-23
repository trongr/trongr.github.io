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
            CC: "\\mathbf C",
            RR: "\\mathbf R",
            QQ: "\\mathbf Q",
            NN: "\\mathbf N",

            tr: "\\mathop{\\rm tr}",

            count: "\\mathop{\\rm count}\\limits",
            sumtext: "\\mathop{\\rm sum}\\limits",

        }
    }
}
