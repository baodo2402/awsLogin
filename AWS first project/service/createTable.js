const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB();

async function createTable(userInfo) {
    const { tableName, keySchema,  } = userInfo;

    if (!tableName, !keySchema) {
        return util.buildResponse(401, {
            message: "All fields required"
        })
    }   
    
    const dynamoDatabase = await createDatabase(tableName, keySchema);

    return util.buildResponse(200, {
            message: dynamoDatabase
        })
    
    
}

async function createDatabase(tableName, keySchema) {
    const params = {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: keySchema,
          KeyType: 'HASH', // 'HASH' for partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: keySchema,
          AttributeType: 'S',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };
  
    try {
      await dynamodb.createTable(params).promise();
      console.log('DynamoDB table created successfully');
      return true;
    } catch (error) {
      console.error('Error creating DynamoDB table:', error.message);
      return error.message
    }
  }
  
module.exports.createTable = createTable;