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
            a: "\\alpha",
            b: "\\beta",
            d: "\\delta",
            e: "\\varepsilon",
            g: "\\gamma",
            h: "\\eta",
            l: "\\lambda",
            m: "\\mu",
            r: "\\rho",

            D: "\\Delta",
            L: "\\Lambda",

            CC: "\\mathbf C",
            NN: "\\mathbf N",
            QQ: "\\mathbf Q",
            RR: "\\mathbf R",

            span: "\\mathop{\\rm span}",
            tr: "\\mathop{\\rm tr}",

            Sum: "\\sum\\limits",
            Prod: "\\prod\\limits",
            Lim: "\\lim\\limits",
            count: "\\mathop{\\rm count}\\limits",
            textsum: "\\mathop{\\rm sum}\\limits",

        }
    }
}
