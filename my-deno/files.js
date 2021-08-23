/**
 * 执行./deno run --allow-read files.js
 */
const data = await Deno.readTextFile("./hello.json");
console.log(data);


const write = Deno.writeTextFile("./hello.txt", "hello");
write.then(() =>{
    console.log("file written to ./hello.txt")
})