const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-southeast-2',
});

const util = require('../utils/util');
const uuid = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const addressMap = require('../utils/addressMap');
const addressCoordinate = addressMap.coordinates();


async function compareCoordinates(userInfo) {
    const userLat = userInfo.userLat;
    const userLon = userInfo.userLon;
    const name = userInfo.name;
    const time = userInfo.time;

    let keyAddress = '';
    let failedCoordinates = '';
    let address;

    const firstRow = addressCoordinate.values().next().value;
    const splitFirstRow = firstRow.split(', ');
    const firstLat = parseFloat(splitFirstRow[0]);
    const firstLon = parseFloat(splitFirstRow[1]);

    for (const [key, element] of addressCoordinate.entries()) {
        const splitElement = element.split(', ');
    
        const lat = parseFloat(splitElement[0]);
        const lon = parseFloat(splitElement[1]);
        
        // Checking if user in in the zone of Metro Village (5 Queen st), as the zone is a lot bigger than all others
        if( 
            (userLat <= firstLat + 0.0002 && userLat >= firstLat - 0.0002) &&
            (userLon <= firstLon + 0.0009 && userLon >= firstLon - 0.0009)
        ) {
            console.log(key);
            keyAddress = key;
            break;
        } else if ( // checking all other normal zone
        (userLat <= lat + 0.0006 && userLat >= lat - 0.0006) &&
        (userLon <= lon + 0.0006 && userLon >= lon - 0.0006)
        ) {
        console.log(key);
        keyAddress = key;
        break;
        } else {
            failedCoordinates = userLat + ' ' + userLon
        }
    }

    if(keyAddress) {
        return util.buildResponse(200, {
            message: keyAddress
        })
    } else {
        const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}`
        try {
            const response = await fetch(geoApiUrl);
            const data = await response.json();
            console.log(data);
            address = data.address.house_number + ', ' + data.address.road + ', ' + data.address.suburb + ', ' + data.address.state, ', ' + data.address.postcode;

            await saveFailedCoordinates(name, address, failedCoordinates, time);

            return util.buildResponse(401, {
                message: 'Your location does not match any workplaces. Please try again. ' + 'Your current address: ' + address + ' ' + failedCoordinates
            });
        } catch (error) {
            console.error('Error fetching data from the geocoding API:', error);
            return util.buildResponse(500, {
                message: 'Internal Server Error'
            });
        }
    }
}

async function saveFailedCoordinates(name, address, failedCoordinates, time) {
    const tableName = 'Failed-Coordinates'
    const uniqueId = uuid.v4();

    const params = {
        TableName: tableName,
        Item: {
            id: uniqueId,
            name: name,
            address: address,
            failedCoordinates: failedCoordinates,
            time: time
        }
    }

    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving failed coordinates: ', error)
    });

}

module.exports.compareCoordinates = compareCoordinates