const express = require('express'),
    app = express(),
    PORT = 8080,
    fs = require('fs');

// system-wide variables
const CLIENT_IMG_PACK = 10; // how many images send to each client to download
let CUR_INDEX = 0, // will have to update this to the most current
    IMG_LINKS = [],
    AI_DATA = '';

//#region System-wide functions
/**
 * Warper for fs.readFileSync function
 * @param {String} path Path of the file to read
 * @returns {String} File content
 */
function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

/**
 * Warper for fs.writeFileSync
 * @param {String} path Path to write
 * @param {String|Number} data Data to write
 */
function writeFile(path, data) {
    if (typeof(data) == 'number') data.toString();
    fs.writeFileSync(path, data, 'utf-8');
}
//#endregion

//#region Initialize functions
// read current image index
(() => {
    CUR_INDEX = parseInt(readFile('current_img'));
    AI_DATA = readFile('AI.json');
})();
//#endregion

//#region Cycle functions
setInterval(() => {
    // auto save every 10 seconds
    writeFile('current_img', CUR_INDEX);
    IMG_LINKS = readFile('img_links').split('\n');
}, 10000); 
//#endregion

//#region Server
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/online', (req, res) => {
    let imgLinks = IMG_LINKS.splice(CUR_INDEX, CUR_INDEX + CLIENT_IMG_PACK).join('\n');
    res.send(imgLinks); // send respond
    CUR_INDEX += CLIENT_IMG_PACK; // set CUR_INDEX after send
});

app.get('/downloaded', (req, res) => {
    res.send(AI_DATA);
});

app.post('/trained', (req, res) => {
    AI_DATA = req.body;
    res.send(CUR_INDEX);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
//#endregion