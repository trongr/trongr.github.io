window.MathJax = {
    extensions: ["tex2jax.js", "TeX/AMSsymbols.js", "TeX/AMSmath.js"],
    jax: ["input/TeX", "output/SVG"],
    tex2jax: {
        inlineMath: [[ '$','$']],
        displayMath:  [['$$','$$']],
        processEscapes: true,
        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    },
    "HTML-CSS": {
        availableFonts: ["TeX"],
    },
    SVG: {
        // font: "STIX-Web"
        styles: {
            ".mjx-svg-href": {
                fill: "red", stroke: "red",
            },
        }
    },
    TeX: {
        equationNumbers: { autoNumber: "AMS" },
        Macros: {

            // comparison operators
            def: "\\stackrel{\\text{df}}{=}",
            eq: "\\equiv",
            normal: "\\trianglelefteq",

            // binary ops
            ".": "\\cdot",

            // environments
            bar: ["\\overline{#1}", 1],
            "<": "\\langle",
            ">": "\\rangle",

            // functions and operators
            Sum: "\\sum\\limits",
            Prod: "\\prod\\limits",
            Lim: "\\lim\\limits",
            Cup: "\\bigcup\\limits",
            Cap: "\\bigcap\\limits",
            stab: "\\mathop{\\rm stab}",
            count: "\\mathop{\\rm count}\\limits",
            textsum: "\\mathop{\\rm sum}\\limits",
            span: "\\mathop{\\rm span}",
            tr: "\\mathop{\\rm tr}",
            char: "\\mathop{\\rm char}",
            mod: "\\bmod",
            Mod: "\\mod",

            // symbols
            0: "\\varnothing",
            8: "\\infty",
            a: "\\alpha",
            b: "\\beta",
            BB: "\\mathbf B",
            CC: "\\mathbf C",
            ch: "\\chi",
            d: "\\delta",
            dd: "\\partial",
            D: "\\Delta",
            e: "\\varepsilon",
            g: "\\gamma",
            // gg is >>, do not redefine.
            f: "\\phi",
            ff: "\\varphi",
            F: "\\Phi",
            h: "\\eta",
            k: "\\kappa",
            l: "\\lambda",
            // ll is <<, do not redefine.
            L: "\\Lambda",
            m: "\\mu",
            NN: "\\mathbf N",
            o: "\\omega",
            O: "\\Omega",
            p: "\\pi",
            PP: "\\mathbf P",
            QQ: "\\mathbf Q",
            r: "\\rho",
            RR: "\\mathbf R",
            s: "\\sigma",
            t: "\\tau",
            th: "\\theta",
            ZZ: "\\mathbf Z",

            qed: "\\ \\blacksquare",
        }
    }
}
