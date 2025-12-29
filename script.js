class Student {
  constructor(name, marks) {
    this.name = name;
    this.marks = marks;
  }

  getGrade() {
    if (this.marks >= 80) return "A";
    if (this.marks >= 60) return "B";
    if (this.marks >= 40) return "C";
    return "Fail";
  }
}

// Get stored students OR empty array
let storedStudents = JSON.parse(localStorage.getItem("students")) || [];

// Convert plain objects → Student objects
let students = storedStudents.map(
  s => new Student(s.name, s.marks)
);

function addStudent() {
  let name = document.getElementById("name").value;
  let marks = parseInt(document.getElementById("marks").value);

  if (name === "" || isNaN(marks)) {
    alert("Please enter valid data");
    return;
  }

  students.push(new Student(name, marks));

  // Save plain data only
  localStorage.setItem(
    "students",
    JSON.stringify(students.map(s => ({
      name: s.name,
      marks: s.marks
    })))
  );

  document.getElementById("name").value = "";
  document.getElementById("marks").value = "";

  alert("Student added successfully!");
}

function goToResult() {
  window.location.href = "result.html";
}

function goHome() {
  window.location.href = "index.html";
}

function displayStudents() {
  let resultDiv = document.getElementById("result");
  if (!resultDiv) return;

  if (students.length === 0) {
    resultDiv.innerHTML = "No students added yet.";
    return;
  }

  let output = "";
  students.forEach((s, i) => {
    output += `${i + 1}. ${s.name} - Marks: ${s.marks}, Grade: ${s.getGrade()}<br>`;
  });

  resultDiv.innerHTML = output;
}

displayStudents();
