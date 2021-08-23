// {
//     "presets": [["@babel/preset-env", {
//       "targets": {
//         "browser": ["> 1%", "last 2 versions"]
//       }
//     }]],
//     "plugins":["@babel/plugin-transform-runtime"]
// }
// module.exports = api => {
//     return {
//         plugins: [
//             "@babel/plugin-transform-runtime"
//         ],
//         presets: [
//             [
//                 "@babel/preset-env",
//                 {
//                     useBuiltIns: "entry",
//                     targets: {
//                         "browser": ["> 1%", "last 2 versions"]
//                     }
//                 }
//             ]
//         ]
//     }
// }