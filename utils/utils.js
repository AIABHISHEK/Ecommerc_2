const fs = require('fs');


exports.deleteImage = (imagePath) => {
    fs.unlink(imagePath, (err) => {
        if (err) {
            throw err;
        }
    });
};
