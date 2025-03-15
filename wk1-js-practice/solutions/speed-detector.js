function speedDetector(speed) {
  const speedLimit = 70;
  const kmPerDemerit = 5;
  const maxDemeritPoints = 12;

  if (speed < speedLimit) {
    console.log("Ok");
  } else {
    let demeritPoints = Math.floor((speed - speedLimit) / kmPerDemerit);
    if (demeritPoints > maxDemeritPoints) {
      console.log("License suspended");
    } else {
      console.log(`Points: ${demeritPoints}`);
    }
  }
}

// Prompt user for speed and convert to a number
const speed = Number(prompt("Enter the car speed:"));

// Validate input
if (isNaN(speed) || speed < 0) {
  console.log("Invalid input! Please enter a positive number.");
} else {
  speedDetector(speed);
}