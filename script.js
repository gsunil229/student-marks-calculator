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

// Pagination concept
let currentPage = 1;
const rowsPerPage = 5;
let filteredList = null; // used for search + pagination


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

  const data = filteredList || students;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No students found</td></tr>`;
    document.getElementById("pageInfo").innerText = "";
    return;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = data.slice(start, end);

  pageData.forEach((s) => {
    const index = students.indexOf(s);

    tbody.innerHTML += `
      <tr>
        <td>
            ${s.name}
            ${isTopper(s) ? `<span class="topper">⭐ Topper</span>` : ""}
        </td>
        <td>${s.marks}</td>
        <td><span class="badge grade-${s.getGrade()}">${s.getGrade()}</span></td>
        <td>
          <span class="badge ${s.getStatus() === "Pass" ? "pass" : "fail"}">
            ${s.getStatus()}
          </span>
        </td>
        <td>
          <button class="action-btn edit" onclick="editStudent(${index})">Edit</button>
          <button class="action-btn delete" onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  updatePageInfo(data.length);
}

function nextPage() {
  const data = filteredList || students;
  if (currentPage * rowsPerPage < data.length) {
    currentPage++;
    displayStudents();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayStudents();
  }
}

function updatePageInfo(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${totalPages}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
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

// ----Search by student name feature-------
function searchStudent() {
  let searchValue = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  currentPage = 1;

  if (searchValue === "") {
    filteredList = null;
    displayStudents();
    return;
  }

  filteredList = students.filter(student =>
    student.name.toLowerCase().includes(searchValue)
  );

  displayStudents();
}



function displayFilteredStudents(filteredStudents) {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";

  if (filteredStudents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No matching students found</td></tr>`;
    return;
  }

  filteredStudents.forEach((s) => {
    const index = students.indexOf(s);

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
          <button class="action-btn edit" onclick="editStudent(${index})">Edit</button>
          <button class="action-btn delete" onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}


displayStudents();

//------- theme change logic----------
function toggleTheme() {
  const toggle = document.getElementById("themeToggle");
  document.body.classList.toggle("dark", toggle.checked);
  localStorage.setItem("theme", toggle.checked ? "dark" : "light");
}

// Load saved theme
(function () {
  const savedTheme = localStorage.getItem("theme");
  const toggle = document.getElementById("themeToggle");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggle.checked = true;
  }
})();


// -----print pdf logic-------------
function printResults() {
  const dataToPrint = filteredList || students;

  if (dataToPrint.length === 0) {
    alert("No students to print");
    return;
  }

  let tableHTML = `
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #000; padding:8px;">Name</th>
          <th style="border:1px solid #000; padding:8px;">Marks</th>
          <th style="border:1px solid #000; padding:8px;">Grade</th>
          <th style="border:1px solid #000; padding:8px;">Status</th>
        </tr>
      </thead>
      <tbody>
  `;

  dataToPrint.forEach(s => {
    tableHTML += `
      <tr>
        <td style="border:1px solid #000; padding:8px;">${s.name}</td>
        <td style="border:1px solid #000; padding:8px;">${s.marks}</td>
        <td style="border:1px solid #000; padding:8px;">${s.getGrade()}</td>
        <td style="border:1px solid #000; padding:8px;">${s.getStatus()}</td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;

  const originalContent = document.body.innerHTML;

  document.body.innerHTML = `
    <h2 style="text-align:center;">Student Results</h2>
    ${tableHTML}
  `;

  window.print();
  document.body.innerHTML = originalContent;
  location.reload();
}

function isTopper(student) {
  const list = filteredList || students;
  const highest = Math.max(...list.map(s => s.marks));
  return student.marks === highest;
}
