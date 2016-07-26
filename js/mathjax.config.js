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
            EE: "\\mathbf E",
            FF: "\\mathbf F",
            NN: "\\mathbf N",
            QQ: "\\mathbf Q",
            RR: "\\mathbf R",
            aa: "\\mathbf a",
            rr: "\\mathbf r",
            vv: "\\mathbf v",
            ww: "\\mathbf w",

            tr: "\\mathop{\\rm tr}",

            count: "\\mathop{\\rm count}\\limits",
            sumtext: "\\mathop{\\rm sum}\\limits",

        }
    }
}
