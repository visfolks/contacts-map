// function loadWasm(fileName) { 
//   return fetch(fileName)
//     .then(response => response.arrayBuffer())
//     .then(bits => WebAssembly.compile(bits))
//     .then(module => { return new WebAssembly.Instance(module) });
// };

// loadWasm('./wasm/run_jaccard.wasm')
//   .then(instance => {
//     let fib = instance.exports._test;
//     console.log(fib());
//   });


// function jaccard( fvecs:boolean[], m:number , n:number, dmat:number[]){



// }


// export {jaccard}
