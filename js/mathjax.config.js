window.MathJax = {
    extensions: ["tex2jax.js", "TeX/AMSsymbols.js", "TeX/AMSmath.js"],
    jax: ["input/TeX", "output/SVG"],
    tex2jax: {
        inlineMath: [[ '$','$']],
        displayMath:  [['$$','$$']],
        processEscapes: true
    },
    "HTML-CSS": {
        availableFonts: ["TeX"],
    },
    SVG: {
        // font: "STIX-Web"
    },
    TeX: {
        equationNumbers: { autoNumber: "AMS" },
        Macros: {

            def: "\\stackrel{\\text{df}}{=}",
            bar: ["\\overline{#1}", 1],

            span: "\\mathop{\\rm span}",
            tr: "\\mathop{\\rm tr}",
            char: "\\mathop{\\rm char}",

            Sum: "\\sum\\limits",
            Prod: "\\prod\\limits",
            Lim: "\\lim\\limits",
            Cup: "\\bigcup\\limits",
            Cap: "\\bigcap\\limits",
            count: "\\mathop{\\rm count}\\limits",
            textsum: "\\mathop{\\rm sum}\\limits",

            0: "\\varnothing",

            a: "\\alpha",
            b: "\\beta",
            d: "\\delta",
            e: "\\varepsilon",
            g: "\\gamma",
            h: "\\eta",
            l: "\\lambda",
            m: "\\mu",
            p: "\\pi",
            r: "\\rho",
            s: "\\sigma",
            t: "\\tau",
            th: "\\theta",

            D: "\\Delta",
            L: "\\Lambda",

            BB: "\\mathbf B",
            CC: "\\mathbf C",
            NN: "\\mathbf N",
            QQ: "\\mathbf Q",
            RR: "\\mathbf R",
        }
    }
}
