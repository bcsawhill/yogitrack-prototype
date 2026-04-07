// -----------------------------------------------------
// LOAD ALL CLASS RECORDS
// -----------------------------------------------------
let classMap = {};
let instructorMap = {};
let customerMap = {};

async function loadClassRecords() {
  const [recordsRes, classesRes, instructorsRes, customersRes] = await Promise.all([
    fetch("/api/classRecord/all"),
    fetch("/api/class/all"),
    fetch("/api/instructor/search?q="),
    fetch("/api/customer/search?q=")
  ]);

  const records = await recordsRes.json();
  const classes = await classesRes.json();
  const instructors = await instructorsRes.json();
  const customers = await customersRes.json();

  // Build lookup maps
  classes.forEach(c => classMap[c.classId] = c);
  instructors.forEach(i => instructorMap[i.instructorId] = i);
  customers.forEach(c => customerMap[c.customerId] = c);

  renderRecords(records);
}


// -----------------------------------------------------
// RENDER TABLE WITH EXPANDABLE ROWS
// -----------------------------------------------------
function renderRecords(records) {
  const table = document.getElementById("recordsTable");
  table.innerHTML = "";

  records.forEach(record => {
    const cls = classMap[record.classId];
    const inst = instructorMap[record.instructorId];

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${record.date}</td>
      <td>${cls.dayOfWeek} ${cls.time} – ${cls.className}</td>
      <td>${inst.firstName} ${inst.lastName}</td>
      <td>${record.attendees.length}</td>
      <td><button class="btn btn--small" data-id="${record.recordId}">View</button></td>
    `;

    table.appendChild(row);

    // Expandable row
    const expandRow = document.createElement("tr");
    expandRow.classList.add("hidden");

    const attendeeList = record.attendees
      .map(id => {
        const c = customerMap[id];
        return `<li>${c.firstName} ${c.lastName} (${c.customerId})</li>`;
      })
      .join("");

    expandRow.innerHTML = `
      <td colspan="5">
        <strong>Attendees:</strong>
        <ul>${attendeeList}</ul>
      </td>
    `;

    table.appendChild(expandRow);

    // Toggle logic
    row.querySelector("button").addEventListener("click", () => {
      expandRow.classList.toggle("hidden");
    });
  });
}


// -----------------------------------------------------
// INIT
// -----------------------------------------------------
loadClassRecords();
