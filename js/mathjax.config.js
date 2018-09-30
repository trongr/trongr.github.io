window.MathJax = {
  extensions: ["tex2jax.js", "TeX/AMSsymbols.js", "TeX/AMSmath.js"],
  jax: ["input/TeX", "output/SVG"],
  tex2jax: {
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
    processEscapes: true,
    skipTags: ["script", "noscript", "style", "textarea", "pre", "code"],
  },
  "HTML-CSS": {
    availableFonts: ["TeX"],
  },
  SVG: {
    // font: "STIX-Web"
    styles: {
      ".mjx-svg-href": {
        fill: "#FF4A4A",
        stroke: "#FF4A4A",
      },
    },
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
      by: "\\times",

      // environments
      bar: ["\\overline{#1}", 1],
      "<": "\\langle",
      ">": "\\rangle",
      rf: "\\rfloor",
      lf: "\\lfloor",

      // functions and operators
      Lim: "\\lim\\limits",
      Sum: "\\sum\\limits",
      Prod: "\\prod\\limits",
      Cup: "\\bigcup\\limits",
      Cap: "\\bigcap\\limits",
      Times: "\\mathop{\\Large\\times}\\limits",
      stab: "\\mathop{\\rm stab}",
      count: "\\mathop{\\rm count}\\limits",
      span: "\\mathop{\\rm span}",
      rank: "\\mathop{\\rm rank}",
      tr: "\\mathop{\\rm tr}",
      char: "\\mathop{\\rm char}",
      mod: "\\bmod",
      Mod: "\\mod",

      // symbols
      0: "\\varnothing",
      AA: "\\mathbf A",
      a: "\\alpha",
      b: "\\beta",
      bB: "\\mathbf B",
      BB: "\\mathbf B",
      c: "\\chi",
      CC: "\\mathbf C",
      d: "\\delta",
      dd: "\\partial",
      D: "\\Delta",
      e: "\\varepsilon",
      g: "\\gamma",
      G: "\\Gamma",
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
      n: "\\nu",
      NN: "\\mathbf N",
      o: "\\omega",
      O: "\\Omega",
      p: "\\pi",
      PP: "\\mathbf P",
      QQ: "\\mathbf Q",
      r: "\\rho",
      RR: "\\mathbf R",
      bbR: "\\mathbb R",
      bbZ: "\\mathbb Z",
      bbC: "\\mathbb C",
      bbN: "\\mathbb N",
      TT: "\\mathbf T",
      s: "\\sigma",
      t: "\\tau",
      th: "\\theta",
      ZZ: "\\mathbf Z",

      bE: "\\mathbf E",
      bF: "\\mathbf F",
      br: "\\mathbf r",
      bN: "\\mathbf N",
      bQ: "\\mathbf Q",
      bR: "\\mathbf R",
      bs: "\\mathbf s",
      btau: "\\boldsymbol \\tau",
      bZ: "\\mathbf Z",
      bC: "\\mathbf C",

      rd: "{\\rm d}",
      ry: "{\\rm y}",

      qed: "\\ \\blacksquare",
    },
  },
}
