"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer = __importStar(require("multer"));
const multerS3 = __importStar(require("multer-s3"));
const aws = __importStar(require("aws-sdk"));
function imageRoutes(app) {
    app.route('/image-upload/:userId').post((req, res) => {
        aws.config.update({
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET,
            region: process.env.AWS_REGION
        });
        const bucket = process.env.AWS_BUCKET;
        const s3 = new aws.S3();
        const environment = process.env.NODE_ENV;
        const pathPrefix = 'users';
        const userId = req.params.userId;
        const upload = multer.default({
            storage: multerS3.default({
                s3: s3,
                bucket: bucket,
                acl: 'public-read',
                key: function (req, file, cb) {
                    cb(null, environment + '/' + pathPrefix + '/' + userId + '/' + Date.now().toString() + '.' + getFileExtension(file.originalname));
                }
            })
        });
        const singleUpload = upload.single('image'); // image is the name of the field in the submitted form
        singleUpload(req, res, (err) => {
            if (err) {
                console.log(err);
                return res.status(422).json({ 'error': { 'type': 'Image Upload Error', 'message': err.message } });
            }
            const s3file = req.file; // TS type checking issue
            const pathParts = s3file.key.split('/');
            const fileName = pathParts[pathParts.length - 1];
            return res.status(200).json({ 'userId': userId, 'file': fileName, 'url': s3file.location });
        });
    });
}
exports.default = imageRoutes;
;
function getFileExtension(name) {
    const nameParts = name.split('.');
    if (nameParts.length > 1) {
        return nameParts[nameParts.length - 1].toLowerCase();
    }
    else {
        return '';
    }
}
