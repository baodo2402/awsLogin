const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');

const dynamodb = new AWS.DynamoDB();

async function listTables() {
    try {
        const data = await dynamodb.listTables({}).promise();
        console.log('Table names:', data.TableNames);
        return util.buildResponse(200, {
          message: data.TableNames,
        });
      } catch (err) {
        console.error('Error listing tables:', err);
        return util.buildResponse(401, {
          message: 'Error listing tables: ' + err.message,
        });
      }
}

module.exports.listTables = listTables;
