import * as express from 'express';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';

export default function imageRoutes(app: express.Application): void {
  app.route('/image-upload/:userId').post((req, res) => {
    aws.config.update({
      accessKeyId: process.env.AWS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION
    });
    const bucket = <string>process.env.AWS_BUCKET;
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
        return res.status(422).json({'error': {'type': 'Image Upload Error', 'message': err.message}});
      }
      const s3file: any = req.file; // TS type checking issue
      const pathParts = s3file.key.split('/');
      const fileName = pathParts[pathParts.length - 1];
      return res.status(200).json({'userId': userId, 'file': fileName, 'url': s3file.location});
    });
  });
};

function getFileExtension(name: string): string {
  const nameParts = name.split('.');
  if (nameParts.length > 1) {
    return nameParts[nameParts.length - 1].toLowerCase();
  } else {
    return '';
  }
}
