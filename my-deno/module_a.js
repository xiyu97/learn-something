import {outputB} from "./module_b.js";

function outputA(){
    console.log("Module A`s import.meta.url", import.meta.url);
    console.log("Module A`s mainModule url", Deno.mainModule);
    console.log(
        "Is module A the main module via import.meta.main?",
        import.meta.main
    )
}

outputA();
console.log("");
outputB();