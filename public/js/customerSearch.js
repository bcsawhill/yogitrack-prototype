const searchInput = document.getElementById("searchInput");
const resultsTable = document.querySelector("#resultsTable tbody");

// Live search
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  const res = await fetch(`/api/customer/search?q=${query}`);
  const customers = await res.json();

  resultsTable.innerHTML = "";

  customers.forEach(c => {
    const row = document.createElement("tr");

row.innerHTML = `
  <td>${c.customerId}</td>
  <td>${c.firstName} ${c.lastName}</td>
  <td>${c.email}</td>
  <td>${c.phone}</td>
  <td>${c.classBalance}</td>
  <td>
    <button class="btn editBtn" data-id="${c.customerId}">Edit</button>
    <button class="btn deleteBtn" data-id="${c.customerId}">Delete</button>
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
      const res = await fetch(`/api/customer/${id}`);
      const customer = await res.json();

      // Fill modal
      document.getElementById("edit_customerId").value = customer.customerId;
      document.getElementById("edit_firstName").value = customer.firstName;
      document.getElementById("edit_lastName").value = customer.lastName;
      document.getElementById("edit_email").value = customer.email;
      document.getElementById("edit_phone").value = customer.phone;
      document.getElementById("edit_address").value = customer.address;
      document.getElementById("edit_classBalance").value = customer.classBalance;
      document.getElementById("edit_senior").checked = customer.senior;

      document.getElementById("editModal").classList.remove("hidden");
    });
  });
}

function attachDeleteButtons() {
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmDelete = confirm(`Are you sure you want to delete customer ${id}?`);
      if (!confirmDelete) return;

      const res = await fetch(`/api/customer/delete/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Customer deleted");
        searchInput.dispatchEvent(new Event("input")); // refresh results
      } else {
        alert("Failed to delete customer");
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
    customerId: document.getElementById("edit_customerId").value,
    firstName: document.getElementById("edit_firstName").value.trim(),
    lastName: document.getElementById("edit_lastName").value.trim(),
    email: document.getElementById("edit_email").value.trim(),
    phone: document.getElementById("edit_phone").value.trim(),
    address: document.getElementById("edit_address").value.trim(),
    classBalance: Number(document.getElementById("edit_classBalance").value),
    senior: document.getElementById("edit_senior").checked
  };

  const res = await fetch(`/api/customer/update/${updated.customerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  });

  if (res.ok) {
    alert("Customer updated");
    document.getElementById("editModal").classList.add("hidden");
    searchInput.dispatchEvent(new Event("input"));
  } else {
    alert("Update failed");
  }
});
