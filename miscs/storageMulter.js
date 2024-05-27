const multer = require('multer');

module.exports = () => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    });
};