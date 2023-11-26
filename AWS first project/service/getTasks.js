const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-southeast-2',
});
const util = require('../utils/util');
const csv = require('csv-parser');
const s3 = new AWS.S3();

const bucketName = 'client-building-addresses';

//getting tasks from s3 bucket (no status)
async function getTasks(userInfo) {
    const csvData = [];
    let csvHeaders = [];

    const dayOfWeek = userInfo.dayOfWeek;
    const recurrence_pattern = userInfo.recurrence_pattern;
    const suburb = userInfo.suburb;

    const columnName = recurrence_pattern + dayOfWeek;
    const fileName = suburb + "_Job_Control.csv"

    const params = {
        Bucket: bucketName,
        Key: fileName,
      };

      if (!columnName) {
        console.error('Column name is null or empty. Aborting.');
        return util.buildResponse(400, { message: 'Bad Request' });
      }

    try {
        const s3Stream = s3.getObject(params).createReadStream();
    
    s3Stream
      .pipe(csv({ BOM: true })) // pipe transform the stream of CSV into objects (row -> object)
      .on('data', (row) => {
        csvHeaders = Object.keys(row)
        if (columnName in row) {
        csvData.push(row[columnName]);
        } else {
            console.warn('column name not found');
        }
      })
      .on('end', () => {
        console.log('CSV data loaded and parsed.');
      });

    await new Promise((resolve, reject) => {
      s3Stream.on('end', resolve);
      s3Stream.on('error', reject);
    });

    return util.buildResponse(200, { csvData: csvData, csvHeaders: csvHeaders });

    } catch (error) {
        console.error('Error fetching CSV file from S3:', error);
        return util.buildResponse(500, { message: 'Internal Server Error' });
      }

}

module.exports.getTasks=getTasks;