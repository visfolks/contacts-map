"use strict";
// function loadWasm(fileName) { 
//   return fetch(fileName)
//     .then(response => response.arrayBuffer())
//     .then(bits => WebAssembly.compile(bits))
//     .then(module => { return new WebAssembly.Instance(module) });
// };
exports.__esModule = true;
exports.jaccard = void 0;
// loadWasm('./wasm/run_jaccard.wasm')
//   .then(instance => {
//     let fib = instance.exports._test;
//     console.log(fib());
//   });
function jaccard(fvecs, m, n, dmat) {
    console.log("hi");
}
exports.jaccard = jaccard;
