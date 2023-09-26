import multiparty from 'multiparty';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs, { readFileSync } from 'fs';
import mime from 'mime-types';

export default async function handle(req, res) {
  const form = new multiparty.Form();

  const bucket_name = 'sasser-next-ecommerce-admin-image-bucket';

  form.parse(req, async function (err, fields, files) {
    const links = [];
    let photos_arr = files.file;

    const client = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    for (const file of photos_arr) {
      const ext = file.originalFilename.toLowerCase().split('.').pop();
      const file_name = file.originalFilename.toLowerCase().split('.').shift();
      const new_file_name = Date.now() + '-' + file_name + '.' + ext;

      await client.send(
        // mime installed to find the file-type from the file
        new PutObjectCommand({
          Bucket: bucket_name,
          Key: new_file_name,
          Body: fs.readFileSync(file.path),
          ACL: 'public-read',
          ContentType: mime.lookup(file.path),
        })
      );
      const link = `https://${bucket_name}.s3.amazonaws.com/${new_file_name}`;
      links.push(link);
    }
    return res.json({ links });
  });
}

export const config = {
  api: { bodyParser: false },
};
