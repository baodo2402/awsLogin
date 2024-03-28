// // Sample data from your Excel file
// const streets = [
//     'Church Street', 'Raglan Street', 'McArthur Street', 'Military Road', 'Gladstone Parade',
//     'Ivy Street', 'Morley Avenue', 'McEvoy Street', 'Victoria Street', 'Abercrombie Street',
//     'Metters Street', 'Milford Street', 'Buckland Street', 'Wycombe Road', 'The Esplanade',
//     'Pelican Street', 'Sailors Bay Road', 'McEvoy Street', 'Queen Street', 'Adelaide Street',
//     'New Canterbury Road', 'McEvoy Street', 'Doody Street', "O'Riordan Street", 'Victoria Street',
//     'Riley St', 'Victoria Street', 'Bourke Road', 'Foster Street', 'Dunninng Ave', 'Dixon Street'
//   ];
  
//   const suburbs = [
//     'Willoughby', 'Mosman', 'Ultimo', 'Mosman', 'Lindfield', 'Darlington', 'Rosebery', 'Waterloo',
//     'Beaconsfield', 'Dalington', 'Dalington', 'Dalington', 'Chippendale', 'Neutral Bay', 'Mosman',
//     'Surry Hills', 'Northbridge', 'Waterloo', 'Beaconsfield', 'Surry Hills', 'Petersham', 'Waterloo',
//     'Alexandria', 'Alexandria', 'McMahons Point', 'Surry Hills', 'McMahons Point', 'Alexandria',
//     'Surry Hills', 'Rosebery', 'Haymarket'
//   ];
  
//   // Create an array of maps
//   let arrayOfMaps = [];
  
//   // Build the array of maps
//   for (let i = 0; i < streets.length; i++) {
//     const street = streets[i];
//     const suburb = suburbs[i];
  
//     // Check if there is already a map for the suburb
//     const existingMap = arrayOfMaps.find((map) => map.get('suburb') === suburb);
  
//     if (existingMap) {
//       existingMap.set(street, suburb);
//     } else {
//       const newMap = new Map([[street, suburb], ['suburb', suburb]]);
//       arrayOfMaps.push(newMap);
//     }
//   }
  
//   // Display the result
//   arrayOfMaps.forEach((map, index) => {
//     console.log(`Map ${index + 1}:`);
//     map.forEach((value, key) => {
//       console.log(`${key}: ${value}`);
//     });
//     console.log('---');
//   });
// Sample JSON data
const jsonData = [
  {"key1": "value1", "key2": "value2", "key3": "value3"},
  {"key2": "value4", "key4": "value5", "key5": "value6"},
  {"key1": "value7", "key6": "value8", "key7": "value9"}
];

// Function to compare keys of two objects
function compareKeys(obj1, obj2) {
  return Object.keys(obj1).every(key => !obj2.hasOwnProperty(key));
}

// Iterate through each object
jsonData.forEach((obj, i) => {
  // Iterate through other objects
  jsonData.forEach((otherObj, j) => {
      if (i !== j) {  // Skip current object
          // Check if keys of current object don't exist in other object
          if (compareKeys(obj, otherObj)) {
              // Assign properties to other object
              Object.assign(otherObj, obj);
              // Clear properties from current object
              Object.keys(obj).forEach(key => delete obj[key]);
          }
      }
  });
});

// Filter out empty objects
const filteredData = jsonData.filter(obj => Object.keys(obj).length > 0);

// Output the updated JSON
console.log(JSON.stringify(filteredData, null, 4));

