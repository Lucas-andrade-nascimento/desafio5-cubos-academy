const aws = require("aws-sdk");

const endpoint = new aws.Endpoint(process.env.ENDPOINT_BACKBLAZE);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APP_KEY,
  },
});

const excluirImagemDoProduto = async (path) => {
  await s3
    .deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: path,
    })
    .promise();
};

module.exports = excluirImagemDoProduto;
