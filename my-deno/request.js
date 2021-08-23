/**
 * 执行./deno run --allow-net request.js
 */

// import { serve } from "https://deno.land/std@0.74.0/http/server.ts";
// const s = serve({ port: 9696 });
// console.log("http://localhost:9696/");
// for await (const req of s) {
//   req.respond({ body: "Hello World\n" });
// }


/**
 * 执行./deno run --allow-net request.js https://example.com/
 */
const url = Deno.args[0];
console.log(url)
const res = await fetch(url);
const body = new Uint8Array(await res.arrayBuffer());
await Deno.stdout.write(body);
