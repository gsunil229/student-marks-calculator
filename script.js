// ================== STUDENT CLASS ==================
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

// ================== GLOBAL VARIABLES ==================
let currentPage = 1;
const rowsPerPage = 5;
let filteredList = null;

// Load students from storage
let students = (JSON.parse(localStorage.getItem("students")) || [])
  .map(s => new Student(s.name, s.marks));

// ================== STORAGE ==================
function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

// ================== ADD STUDENT ==================
function addStudent() {
  const name = document.getElementById("name").value.trim();
  const marks = parseInt(document.getElementById("marks").value);

  if (!name || isNaN(marks)) {
    showToast("Please enter valid data", "error");
    return;
  }

  if (marks < 0 || marks > 100) {
    showToast("Marks must be between 0 and 100", "error");
    return;
  }

  students.push(new Student(name, marks));
  saveToStorage();

  document.getElementById("name").value = "";
  document.getElementById("marks").value = "";

  showToast("Student added successfully", "success");
}

// ================== DISPLAY STUDENTS ==================
function displayStudents() {
  const tbody = document.querySelector("#studentTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const data = filteredList || students;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No students found</td></tr>`;
    document.getElementById("pageInfo").innerText = "";
    updateStatistics();
    return;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const pageData = data.slice(start, start + rowsPerPage);

  pageData.forEach(s => {
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
  updateStatistics();
}

// ================== PAGINATION ==================
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

// ================== DELETE ==================
function deleteStudent(index) {
  if (confirm("Are you sure?")) {
    students.splice(index, 1);
    saveToStorage();
    showToast("Student deleted", "success");
    displayStudents();
  }
}

// ================== EDIT ==================
function editStudent(index) {
  let newName = prompt("Enter name:", students[index].name);
  let newMarks = parseInt(prompt("Enter marks:", students[index].marks));

  if (!newName || isNaN(newMarks) || newMarks < 0 || newMarks > 100) {
    showToast("Invalid input", "error");
    return;
  }

  students[index].name = newName;
  students[index].marks = newMarks;
  saveToStorage();
  showToast("Student updated", "success");
  displayStudents();
}

// ================== SEARCH ==================
function searchStudent() {
  const value = document.getElementById("searchInput").value.toLowerCase();
  currentPage = 1;

  filteredList = value
    ? students.filter(s => s.name.toLowerCase().includes(value))
    : null;

  displayStudents();
}

// ================== SORT ==================
function sortStudents() {
  const value = document.getElementById("sortSelect").value;
  let data = filteredList || students;

  if (value === "name-asc") data.sort((a,b)=>a.name.localeCompare(b.name));
  if (value === "name-desc") data.sort((a,b)=>b.name.localeCompare(a.name));
  if (value === "marks-asc") data.sort((a,b)=>a.marks-b.marks);
  if (value === "marks-desc") data.sort((a,b)=>b.marks-a.marks);

  currentPage = 1;
  displayStudents();
}

// ================== STATISTICS ==================
function updateStatistics() {
  const data = filteredList || students;

  document.getElementById("totalStudents").innerText = data.length || 0;
  document.getElementById("avgMarks").innerText =
    data.length ? (data.reduce((s,x)=>s+x.marks,0)/data.length).toFixed(2) : 0;
  document.getElementById("topMarks").innerText =
    data.length ? Math.max(...data.map(s=>s.marks)) : 0;
  document.getElementById("passPercent").innerText =
    data.length ? ((data.filter(s=>s.marks>=40).length/data.length)*100).toFixed(1)+"%" : "0%";
}

// ================== TOPPER ==================
function isTopper(student) {
  const data = filteredList || students;
  return student.marks === Math.max(...data.map(s=>s.marks));
}

// ================== THEME ==================
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light");
}

// Load theme
(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").checked = true;
  }
})();

// ================== PRINT ==================
function printResults() {
  const data = filteredList || students;
  if (!data.length) return showToast("No data to print", "error");

  let rows = data.map(s =>
    `<tr><td>${s.name}</td><td>${s.marks}</td><td>${s.getGrade()}</td><td>${s.getStatus()}</td></tr>`
  ).join("");

  document.body.innerHTML = `
    <h2>Student Results</h2>
    <table border="1" width="100%">
      <tr><th>Name</th><th>Marks</th><th>Grade</th><th>Status</th></tr>
      ${rows}
    </table>`;
  window.print();
  location.reload();
}

// ================== TOAST ==================
function showToast(msg, type="info") {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.className = `toast show ${type}`;
  setTimeout(()=>toast.className="toast",3000);
}

// ================== NAVIGATION ==================
function goHome(){ window.location.href="index.html"; }
function goToResult(){ window.location.href="result.html"; }

// ================== INIT ==================
displayStudents();
