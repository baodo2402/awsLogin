function generateDates(startDate, recurrencePattern) {
    const resultDates = [];

    // Convert input string to Date object
    startDate = new Date(startDate);

    // Set the frequency of recurrence
    let delta;
    if (recurrencePattern === "Weekly") {
        delta = 7;
    } else if (recurrencePattern === "Fortnightly") {
        delta = 14;
    } else if (recurrencePattern === "Monthly") {
        delta = 1; // Initialize to 1 day
    } else {
        throw new Error("Invalid recurrence pattern");
    }

    // Loop through the year and generate dates
    let currentDate = new Date(startDate);
    while (currentDate.getFullYear() === startDate.getFullYear()) {
        resultDates.push(currentDate.toISOString().slice(0, 10));

        if (recurrencePattern === "Monthly") {
            // Move to the next month
            currentDate.setMonth(currentDate.getMonth() + 1);
            
            // Adjust the day to the same day of the week as the start date
            currentDate.setDate(1); // Set to the first day to avoid issues with different month lengths
            while (currentDate.getDay() !== startDate.getDay()) {
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else {
            // Move by the specified delta
            currentDate.setDate(currentDate.getDate() + delta);
        }
    }

    return resultDates;
}

// Example usage:
const startDate = "2024-01-17";
const recurrencePattern = "Fortnightly";
const result = generateDates(startDate, recurrencePattern);
console.log(result);
