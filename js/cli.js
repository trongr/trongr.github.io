var CLI = (function(){ // command line interface
    var CLI = {}

    var modules = {}
    var cliinput = null

    CLI.init = function(){
        $("body").append(makeCliTemplate())
        cliinput = $("#cliinput").focus()
        bindCliEnter(cliinput)
    }

    // modules will call this method to add themselves to cli
    CLI.addModule = function(name, module){
        modules[name] = module
    }

    CLI.toggleConsole = function(show){
        if (show){
            $("#cliinputbox").show()
        } else {
            $("#cliinputbox").hide()
        }
    }

    function makeCliTemplate(){
        return "<div id='cliinputbox'>"
            +      "<input id='cliinput' placeholder='Type ls to list available modules'>"
            +  "</div>"
    }

    function bindCliEnter(cliinput){
        cliinput.on("keydown", function(event){
            if (event.which == 13){ // enter
                processInput(cliinput.val())
                cliinput.val("")
            }
        })
    }

    function processInput(text){
        console.log(text)
    }

    return CLI
}());

$(window).on("load", function(e){
    CLI.init()
});
