;(function() {
  $(window).on("load", function(e) {
    smartquotes()
    escapeHTMLInCodeBlocks()
    highlightPreCode()
    initTOC()
  })

  function initTOC() {
    try {
      $("#toc").toc()
    } catch (error) {
      // console.error("Cannot generate Table of Contents", error)
    }
  }

  function highlightPreCode() {
    $("pre code").each(function(i, block) {
      hljs.highlightBlock(block)
    })
  }

  // NOT DOING THIS ANYMORE, but old code snippets still use this,
  // so don't remove:
  //
  // code listings are pasted in data-content of
  // <code data-content=''></code> instead of inside the tag, so we
  // can preprocess and escape div tags, e.g. for HTML code.
  function escapeHTMLInCodeBlocks() {
    $("code").each(function() {
      if (!$(this).attr("data-content")) return
      var content = $(this)
        .attr("data-content")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      $(this).html(content)
    })
  }
})()
