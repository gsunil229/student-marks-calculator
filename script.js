class Student {
  constructor(name, marks) {
    this.name = name;
    this.marks = marks;
  }

   getGrade() {
    if (this.marks >= 80) return "A";
    if (this.marks >= 60) return "B";
    if (this.marks >= 40) return "C";
    return "F";
  }

  getStatus() {
    return this.marks >= 40 ? "Pass" : "Fail";
  }

}

// Get stored students OR empty array
let storedStudents = JSON.parse(localStorage.getItem("students")) || [];

// Convert plain objects → Student objects
let students = storedStudents.map(
  s => new Student(s.name, s.marks)
);


// ---------- SAVE ----------
function saveToStorage() {
  localStorage.setItem(
    "students",
    JSON.stringify(students)
  );
}
// function saveToStorage() {
//   localStorage.setItem(
//     "students",
//     JSON.stringify(students.map(s => ({
//       name: s.name,
//       marks: s.marks
//     })))
//   );
// }


// ---------- ADD STUDENT ----------
function addStudent() {
  let name = document.getElementById("name").value;
  let marks = parseInt(document.getElementById("marks").value);

  if (name === "" || isNaN(marks)) {
    alert("Please enter valid data");
    return;
  }

  if (marks < 0 || marks > 100) {
    alert("Marks must be between 0 and 100");
    return;
  }

  students.push(new Student(name, marks));
  saveToStorage();

  document.getElementById("name").value = "";
  document.getElementById("marks").value = "";

  alert("Student added successfully!");
}

// ---------- DISPLAY TABLE ----------
function displayStudents() {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No students added</td></tr>`;
    return;
  }

  students.forEach((s, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.marks}</td>
        <td>
          <span class="badge grade-${s.getGrade()}">${s.getGrade()}</span>
        </td>
        <td>
          <span class="badge ${s.getStatus() === "Pass" ? "pass" : "fail"}">
            ${s.getStatus()}
          </span>
        </td>
        <td>
          <button class="action-btn edit" onclick="editStudent(${i})">Edit</button>
          <button class="action-btn delete" onclick="deleteStudent(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ---------- DELETE ----------
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    saveToStorage();
    displayStudents();
  }
}

// ---------- EDIT ----------
function editStudent(index) {
  let newName = prompt("Enter new name:", students[index].name);
  let newMarks = prompt("Enter new marks:", students[index].marks);

  if (newName === null || newMarks === null) return;

  newMarks = parseInt(newMarks);

  if (newName === "" || isNaN(newMarks)) {
    alert("Invalid input");
    return;
  }

  if (newMarks < 0 || newMarks > 100) {
    alert("Marks must be between 0 and 100");
    return;
  }

  students[index].name = newName;
  students[index].marks = newMarks;

  saveToStorage();
  displayStudents();
}


// ---------- NAVIGATION ----------
function goToResult() {
  window.location.href = "result.html";
}

function goHome() {
  window.location.href = "index.html";
}

displayStudents();

