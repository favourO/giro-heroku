const fs = require('fs');
const path = require('path');
// let dir = __dirname + './public/uploads';
// if(!path.existsSync(dir)) {
//     dir = fs.mkdirSync(dir, 0744);
// }


// let dir = '../uploads';

// Creating folders
// if (!fs.existsSync(dir)){
//     dir = fs.mkdirSync(dir);
// }
// console.log(fs.readdir(dir));

//reading files and folders
// console.log(fs.readdirSync('../../giro', {withFileTypes: true})
// .filter(item => item.isDirectory())
// .map(item => item.name))
let dir = '../public/uploads';
(!fs.existsSync(dir)) ? fs.mkdirSync(dir) : '';

const fileContent = fs.readFileSync(fileName);