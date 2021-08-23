// Output: JSON Data
const json = fetch("https://api.github.com/users/denoland");

json.then(res => {
    return res.json();
}).then(jsonData => {
    console.log(jsonData);
});


// Output: HTML Data
const text = fetch("https://deno.land/");

text.then(res => {
    return res.text();
}).then(textData => {
    console.log(textData);
});


// Output: Error Message
const error = fetch("https://does.not.exist/");
error.catch(error => {
    console.log(error.message);
})