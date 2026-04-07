const searchInput = document.getElementById("searchInput");
const resultsTable = document.querySelector("#resultsTable tbody");

// Live search
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  const res = await fetch(`/api/instructor/search?q=${query}`);
  const instructors = await res.json();

  resultsTable.innerHTML = "";

  instructors.forEach(c => {
    const row = document.createElement("tr");

row.innerHTML = `
  <td>${c.instructorId}</td>
  <td>${c.firstName} ${c.lastName}</td>
  <td>${c.email}</td>
  <td>${c.phone}</td>
  <td>${c.address || ""}</td>
  <td>${c.pref || ""}</td>
  <td>
    <button class="btn editBtn" data-id="${c.instructorId}">Edit</button>
    <button class="btn deleteBtn" data-id="${c.instructorId}">Delete</button>
  </td>
`;

    resultsTable.appendChild(row);
  });

  attachEditButtons();
  attachDeleteButtons();
});

// Attach edit button events
function attachEditButtons() {
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const res = await fetch(`/api/instructor/${id}`);
      const instructor = await res.json();

      // Fill modal
      document.getElementById("edit_instructorId").value = instructor.instructorId;
      document.getElementById("edit_firstName").value = instructor.firstName;
      document.getElementById("edit_lastName").value = instructor.lastName;
      document.getElementById("edit_email").value = instructor.email;
      document.getElementById("edit_phone").value = instructor.phone;
      document.getElementById("edit_address").value = instructor.address;

      document.getElementById("editModal").classList.remove("hidden");
    });
  });
}

function attachDeleteButtons() {
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmDelete = confirm(`Are you sure you want to delete instructor ${id}?`);
      if (!confirmDelete) return;

      const res = await fetch(`/api/instructor/delete/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Instructor deleted");
        searchInput.dispatchEvent(new Event("input")); // refresh results
      } else {
        alert("Failed to delete instructor");
      }
    });
  });
}

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

// Save changes
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updated = {
    instructorId: document.getElementById("edit_instructorId").value,
    firstName: document.getElementById("edit_firstName").value.trim(),
    lastName: document.getElementById("edit_lastName").value.trim(),
    email: document.getElementById("edit_email").value.trim(),
    phone: document.getElementById("edit_phone").value.trim(),
    address: document.getElementById("edit_address").value.trim()
  };

  const res = await fetch(`/api/instructor/update/${updated.instructorId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });

  if (res.ok) {
    alert("Instructor updated");
    document.getElementById("editModal").classList.add("hidden");
    searchInput.dispatchEvent(new Event("input"));
  } else {
    alert("Update failed");
  }
});
