const multer = require('multer');

const storage = multer.memoryStorage();


const singleUplode = multer({ storage }).single("file");

module.exports = singleUplode;