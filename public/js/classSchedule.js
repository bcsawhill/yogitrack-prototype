// -----------------------------------------------------
// GLOBALS
// -----------------------------------------------------
let isNew = false;

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const TIMES = [
  "6AM","7AM","8AM","9AM","10AM","11AM",
  "12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM"
];

let classes = [];


// -----------------------------------------------------
// LOAD CLASSES
// -----------------------------------------------------
async function loadClasses() {
  const res = await fetch("/api/class/all");
  classes = await res.json();
  renderSchedule();
}


// -----------------------------------------------------
// RENDER WEEKLY SCHEDULE
// -----------------------------------------------------
function renderSchedule() {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  DAYS.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.innerHTML = `<h2>${day}</h2>`;

    const dayClasses = classes
      .filter(c => c.dayOfWeek === day)
      .sort((a, b) => TIMES.indexOf(a.time) - TIMES.indexOf(b.time));

    if (dayClasses.length === 0) {
      dayDiv.innerHTML += `<p style="opacity:.6">(no classes)</p>`;
    } else {
      dayClasses.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.style.margin = "0.25rem";
        btn.textContent = c.time;
        btn.addEventListener("click", () => openEditModal(c.classId));
        dayDiv.appendChild(btn);
      });
    }

    container.appendChild(dayDiv);
  });
}


// -----------------------------------------------------
// ADD CLASS BUTTON
// -----------------------------------------------------
document.getElementById("addClassBtn").addEventListener("click", async () => {
  isNew = true;

  const idRes = await fetch("/api/class/getNextId");
  const { classId } = await idRes.json();

  fillModal({
    classId,
    dayOfWeek: "Sunday",
    time: "9AM",
    className: "",
    description: "",
    instructorId: ""
  });

  document.getElementById("editModal").classList.remove("hidden");
});


// -----------------------------------------------------
// OPEN EDIT MODAL
// -----------------------------------------------------
async function openEditModal(classId) {
  isNew = false;

  const res = await fetch(`/api/class/${classId}`);
  const cls = await res.json();

  fillModal(cls);
  document.getElementById("editModal").classList.remove("hidden");
}


// -----------------------------------------------------
// FILL MODAL FIELDS
// -----------------------------------------------------
function fillModal(cls) {
  document.getElementById("edit_classId").value = cls.classId;
  document.getElementById("edit_day").value = cls.dayOfWeek;
  document.getElementById("edit_time").value = cls.time;
  document.getElementById("edit_name").value = cls.className;
  document.getElementById("edit_description").value = cls.description;
  document.getElementById("edit_instructor").value = cls.instructorId;
}


// -----------------------------------------------------
// SAVE CLASS
// -----------------------------------------------------
document.getElementById("editForm").addEventListener("submit", async e => {
  e.preventDefault();

  const cls = {
    classId: document.getElementById("edit_classId").value,
    dayOfWeek: document.getElementById("edit_day").value,
    time: document.getElementById("edit_time").value,
    className: document.getElementById("edit_name").value,
    description: document.getElementById("edit_description").value,
    instructorId: document.getElementById("edit_instructor").value
  };

  let res;

  if (isNew) {
    res = await fetch("/api/class/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cls)
    });
  } else {
    res = await fetch(`/api/class/update/${cls.classId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cls)
    });
  }

  if (res.ok) {
    alert("Saved!");
    document.getElementById("editModal").classList.add("hidden");
    loadClasses();
  } else {
    alert("Failed to save class");
  }
});


// -----------------------------------------------------
// DELETE CLASS
// -----------------------------------------------------
document.getElementById("deleteClassBtn").addEventListener("click", async () => {
  const id = document.getElementById("edit_classId").value;

  if (!confirm("Delete this class?")) return;

  const res = await fetch(`/api/class/delete/${id}`, { method: "DELETE" });

  if (res.ok) {
    alert("Class deleted");
    document.getElementById("editModal").classList.add("hidden");
    loadClasses();
  } else {
    alert("Failed to delete class");
  }
});


// -----------------------------------------------------
// CLOSE MODAL
// -----------------------------------------------------
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});


// -----------------------------------------------------
// INSTRUCTOR SEARCH-AS-YOU-TYPE
// -----------------------------------------------------
async function searchInstructors(query) {
  if (!query || query.trim() === "") {
    document.getElementById("instructorResults").classList.add("hidden");
    return;
  }

  const res = await fetch(`/api/instructor/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();

  const box = document.getElementById("instructorResults");
  box.innerHTML = "";

  if (results.length === 0) {
    box.innerHTML = "<div>No results</div>";
  } else {
    results.forEach(i => {
      const div = document.createElement("div");
      div.textContent = `${i.firstName} ${i.lastName} (${i.instructorId})`;
      div.addEventListener("click", () => {
        document.getElementById("edit_instructor").value = i.instructorId;
        box.classList.add("hidden");
      });
      box.appendChild(div);
    });
  }

  box.classList.remove("hidden");
}

document.getElementById("edit_instructor").addEventListener("input", (e) => {
  searchInstructors(e.target.value);
});

document.addEventListener("click", (e) => {
  const box = document.getElementById("instructorResults");
  const input = document.getElementById("edit_instructor");

  if (!box.contains(e.target) && e.target !== input) {
    box.classList.add("hidden");
  }
});


// -----------------------------------------------------
// INITIALIZE
// -----------------------------------------------------
loadClasses();
