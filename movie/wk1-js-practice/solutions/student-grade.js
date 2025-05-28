function gradeGenerator(marks){
  if(marks > 79) return "A";
  if(marks >= 60) return "B";
  if(marks >= 50) return "C";
  if(marks >= 40) return "D";
   return "E";
}
const marks = prompt("Enter student marks (0-100):");
console.log(`Grade: ${gradeGenerator(Number(marks))}`);
