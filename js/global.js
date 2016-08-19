$(window).on("load", function(e){
    smartquotes()
    escapeHTMLInCodeBlocks()
    highlightPreCode()
})

function highlightPreCode(){
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

// code listings are pasted in data-code of <code data-code=''></code>
// instead of inside the tag, so we can preprocess and escape div
// tags, e.g. for HTML code.
function escapeHTMLInCodeBlocks(){
    $("code").each(function(){
        if (!$(this).attr("data-code")) return
        var content = $(this).attr("data-code")
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        $(this).html(content)
    });
}
