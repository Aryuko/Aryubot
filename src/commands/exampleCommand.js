const Command 	= require("../Command.js");

module.exports = new Command (
    "examplecommand",
    (message, input, client) => 
    {
        return true 
    },
    [],
    "An example command that shows how to build commands.",
    "examplecommand",
    []
);