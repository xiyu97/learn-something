import "./imported.js";


const handler = e => {
    console.log(`got ${e.type} event in event handler (main)`);
};

window.addEventListener("load", handler);

window.addEventListener("unload", handler);

window.onload = e => {
    console.log(`got ${e.type} event in onload function (main)`);
};

window.onunload = e => {
    console.log(`got ${e.type} event in onunload function (main)`);
};

console.log("log from main script");


// log from imported script
// log from main script
// got load event in onload function (main)
// got load event in event handler (imported)
// got load event in event handler (main)
// got unload event in onunload function (main)
// got unload event in event handler (imported)
// got unload event in event handler (main)


// 可以看出，能注册多个监听器，但直接赋值onload和onunload，多个 前面会被覆盖