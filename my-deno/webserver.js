/**
 * ./deno run --allow-net webserver.js
 */

 import {serve} from "https://deno.land/std@0.74.0/http/server.ts";

 const server = serve({
     hostname: "0.0.0.0",
     port: 9696
 });
 console.log("HTTP webserver running.  Access it at:  http://localhost:9696/");

 for await (const req of server) {
     let bodyContent = "Your user-agent is:\n\n";
     bodyContent += req.headers.get("user-agent") || "Unknown";

     req.respond({
         status: 200,
         body: bodyContent
     })
 }