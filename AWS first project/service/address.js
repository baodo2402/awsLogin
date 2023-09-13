const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-southeast-2',
});
const util = require('../utils/util');
const csv = require('csv-parser');
const s3 = new AWS.S3();

const bucketName = 'client-building-addresses';
const objectKey = 'Client_Contact_List.csv';

async function address() {
  const csvData = [];

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const s3Stream = s3.getObject(params).createReadStream();
    
    s3Stream
      .pipe(csv()) // pipe transform the stream of CSV into objects (row -> object)
      .on('data', (row) => {
        csvData.push({ suburb: row.Suburb, street: row.Street });
      })
      .on('end', () => {
        console.log('CSV data loaded and parsed.');
      });

    await new Promise((resolve, reject) => {
      s3Stream.on('end', resolve);
      s3Stream.on('error', reject);
    });

    return util.buildResponse(200, csvData);
  } catch (error) {
    console.error('Error fetching CSV file from S3:', error);
    return util.buildResponse(500, { message: 'Internal Server Error' });
  }
}

module.exports.address = address;
