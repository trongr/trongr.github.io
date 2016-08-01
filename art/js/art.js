var ArtJS = (function(){
    var ArtJS = {}

    ArtJS.bindExpandHiddenImages = function(){
        $("a.hidden_img").on("click", function(e){
            var src = $(this).attr("href")
            $(this).parent().after($('<img />', {src:src}))
            return false
        })
    }

    return ArtJS
}())

$(window).on("load", function(e){
    ArtJS.bindExpandHiddenImages()
})
