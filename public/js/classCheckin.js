// -----------------------------------------------------
// GLOBALS
// -----------------------------------------------------
let selectedClass = null;
let selectedInstructor = null;
let attendees = [];


// -----------------------------------------------------
// LOAD CLASSES FOR DROPDOWN
// -----------------------------------------------------
async function loadClassesForDropdown() {
  const res = await fetch("/api/class/all");
  const classes = await res.json();

  const select = document.getElementById("select_class");
  select.innerHTML = "";

  // Sort by day + time
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const TIMES = [
    "6AM","7AM","8AM","9AM","10AM","11AM",
    "12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM"
  ];

  classes.sort((a, b) => {
    const dayDiff = DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek);
    if (dayDiff !== 0) return dayDiff;
    return TIMES.indexOf(a.time) - TIMES.indexOf(b.time);
  });

  classes.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.classId;
    opt.textContent = `${c.dayOfWeek} ${c.time} – ${c.className}`;
    select.appendChild(opt);
  });
}


// -----------------------------------------------------
// INSTRUCTOR SEARCH-AS-YOU-TYPE (MODAL)
// -----------------------------------------------------
async function searchInstructorsModal(query) {
  const box = document.getElementById("selectInstructorResults");

  if (!query || query.trim() === "") {
    box.classList.add("hidden");
    return;
  }

  const res = await fetch(`/api/instructor/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();

  box.innerHTML = "";

  if (results.length === 0) {
    box.innerHTML = "<div>No results</div>";
  } else {
    results.forEach(i => {
      const div = document.createElement("div");
      div.textContent = `${i.firstName} ${i.lastName} (${i.instructorId})`;
      div.addEventListener("click", () => {
        document.getElementById("select_instructor").value = i.instructorId;
        selectedInstructor = i;
        box.classList.add("hidden");
      });
      box.appendChild(div);
    });
  }

  box.classList.remove("hidden");
}

document.getElementById("select_instructor").addEventListener("input", (e) => {
  searchInstructorsModal(e.target.value);
});

document.addEventListener("click", (e) => {
  const box = document.getElementById("selectInstructorResults");
  const input = document.getElementById("select_instructor");

  if (!box.contains(e.target) && e.target !== input) {
    box.classList.add("hidden");
  }
});


// -----------------------------------------------------
// START CHECK-IN BUTTON
// -----------------------------------------------------
document.getElementById("startCheckinBtn").addEventListener("click", async () => {
  attendees = [];
  selectedClass = null;
  selectedInstructor = null;

  await loadClassesForDropdown();

  document.getElementById("selectModal").classList.remove("hidden");
});


// -----------------------------------------------------
// CONTINUE BUTTON (AFTER SELECTING CLASS + INSTRUCTOR)
// -----------------------------------------------------
document.getElementById("continueBtn").addEventListener("click", async () => {
  const classId = document.getElementById("select_class").value;
  const instructorId = document.getElementById("select_instructor").value;

  if (!classId || !instructorId) {
    alert("Please select both class and instructor.");
    return;
  }

  // Load class details
  const res = await fetch(`/api/class/${classId}`);
  selectedClass = await res.json();

  selectedInstructor = { instructorId };

  // Update UI
  document.getElementById("checkinTitle").textContent =
    `${selectedClass.dayOfWeek} ${selectedClass.time} – ${selectedClass.className}`;

  document.getElementById("checkinInstructor").textContent =
    `Instructor: ${instructorId}`;

  // Switch screens
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("checkinScreen").classList.remove("hidden");
  document.getElementById("selectModal").classList.add("hidden");
});


// -----------------------------------------------------
// CUSTOMER SEARCH-AS-YOU-TYPE
// -----------------------------------------------------
async function searchCustomers(query) {
  const box = document.getElementById("customerResults");

  if (!query || query.trim() === "") {
    box.classList.add("hidden");
    return;
  }

  const res = await fetch(`/api/customer/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();

  box.innerHTML = "";

  if (results.length === 0) {
    box.innerHTML = "<div>No results</div>";
  } else {
    results.forEach(c => {
      const div = document.createElement("div");
      div.textContent = `${c.firstName} ${c.lastName} (${c.customerId})`;

      div.addEventListener("click", () => {
        addAttendee(c);
        box.classList.add("hidden");
        document.getElementById("customerSearch").value = "";
      });

      box.appendChild(div);
    });
  }

  box.classList.remove("hidden");
}

document.getElementById("customerSearch").addEventListener("input", (e) => {
  searchCustomers(e.target.value);
});

document.addEventListener("click", (e) => {
  const box = document.getElementById("customerResults");
  const input = document.getElementById("customerSearch");

  if (!box.contains(e.target) && e.target !== input) {
    box.classList.add("hidden");
  }
});


// -----------------------------------------------------
// ADD ATTENDEE (PREVENT DUPLICATES)
// -----------------------------------------------------
function addAttendee(customer) {
  if (attendees.some(a => a.customerId === customer.customerId)) {
    alert("This customer is already checked in.");
    return;
  }

  attendees.push(customer);
  renderAttendees();
}


// -----------------------------------------------------
// RENDER ATTENDEE LIST
// -----------------------------------------------------
function renderAttendees() {
  const list = document.getElementById("attendeeList");
  list.innerHTML = "";

  attendees.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.firstName} ${c.lastName} (${c.customerId})`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn--danger btn--small";
    removeBtn.style.marginLeft = "1rem";

    removeBtn.addEventListener("click", () => {
      attendees = attendees.filter(a => a.customerId !== c.customerId);
      renderAttendees();
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}


// -----------------------------------------------------
// SUBMIT CLASS RECORD
// -----------------------------------------------------
document.getElementById("submitRecordBtn").addEventListener("click", async () => {
  if (!selectedClass || !selectedInstructor) {
    alert("Missing class or instructor.");
    return;
  }

  const idRes = await fetch("/api/classRecord/getNextId");
  const { recordId } = await idRes.json();

  const today = new Date().toISOString().split("T")[0];

  const record = {
    recordId,
    classId: selectedClass.classId,
    instructorId: selectedInstructor.instructorId,
    date: today,
    attendees: attendees.map(a => a.customerId)
  };

  const res = await fetch("/api/classRecord/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });

  if (res.ok) {
    alert("Class record submitted!");

    // Reset UI
    attendees = [];
    selectedClass = null;
    selectedInstructor = null;

    document.getElementById("checkinScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
  } else {
    alert("Failed to submit record.");
  }
});


// -----------------------------------------------------
// CANCEL CHECK-IN
// -----------------------------------------------------
document.getElementById("cancelCheckinBtn").addEventListener("click", () => {
  attendees = [];
  selectedClass = null;
  selectedInstructor = null;

  document.getElementById("checkinScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
});


// -----------------------------------------------------
// CLOSE SELECT MODAL
// -----------------------------------------------------
document.getElementById("closeSelectModal").addEventListener("click", () => {
  document.getElementById("selectModal").classList.add("hidden");
});
