const p = Deno.run({
    cmd: ["echo", "hello"]
})

await p.status();


// ./deon run --allow-run denoRunTest.js

// 本js在windows下无法运行，
// 因为在linux系统中 echo是一个可执行文件，
// 在windows的powershall中echo是一个命令。