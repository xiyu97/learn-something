const watcher = Deno.watchFs(".");
for await (const event of watcher) {
    console.log(">>>> event", event);
    // >>>> event { kind: "create", paths: [ "D:\\VSCspace\\my-deno\\.\\hh.json" ] }
    // >>>> event { kind: "remove", paths: [ "D:\\VSCspace\\my-deno\\.\\hh.json" ] }
}