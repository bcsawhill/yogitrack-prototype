let isNewPackage = false;

async function loadPackages() {
  const res = await fetch("/api/package/all");
  const packages = await res.json();

  const tbody = document.querySelector("#packageTable tbody");
  tbody.innerHTML = "";

  packages.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.packageId}</td>
      <td>${p.packageName}</td>
      <td>${p.description}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.classCount}</td>
      <td>${p.isUnlimited ? "Yes" : "No"}</td>
      <td>
        <button class="btn editBtn" data-id="${p.packageId}">Edit</button>
        <button class="btn btn--danger deleteBtn" data-id="${p.packageId}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  attachEditButtons();
  attachDeleteButtons();
}

function attachEditButtons() {
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      isNewPackage = false;

      const id = btn.dataset.id;
      const res = await fetch("/api/package/all");
      const packages = await res.json();
      const pkg = packages.find(p => p.packageId === id);
      if (!pkg) return;

      document.getElementById("edit_packageId").value = pkg.packageId;
      document.getElementById("edit_packageId").disabled = true;

      document.getElementById("edit_packageName").value = pkg.packageName;
      document.getElementById("edit_description").value = pkg.description;
      document.getElementById("edit_price").value = pkg.price;
      document.getElementById("edit_classCount").value = pkg.classCount;
      document.getElementById("edit_isUnlimited").checked = pkg.isUnlimited;

      document.getElementById("editModal").classList.remove("hidden");
    });
  });
}

function attachDeleteButtons() {
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm(`Delete package ${id}?`);
      if (!confirmDelete) return;

      const res = await fetch(`/api/package/delete/${id}`, {
        method: "DELETE"
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        loadPackages();
      } else {
        alert(result.message || "Failed to delete package");
      }
    });
  });
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const packageId = document.getElementById("edit_packageId").value.trim();
  const updated = {
    packageName: document.getElementById("edit_packageName").value.trim(),
    description: document.getElementById("edit_description").value.trim(),
    price: Number(document.getElementById("edit_price").value),
    classCount: Number(document.getElementById("edit_classCount").value),
    isUnlimited: document.getElementById("edit_isUnlimited").checked
  };

  let res;

  if (isNewPackage) {
    // ADD NEW PACKAGE
    updated.packageId = packageId;

    res = await fetch(`/api/package/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

  } else {
    // UPDATE EXISTING PACKAGE
    res = await fetch(`/api/package/update/${packageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
  }

  const result = await res.json();

  if (res.ok) {
    alert(result.message);
    document.getElementById("editModal").classList.add("hidden");
    loadPackages();
  } else {
    alert(result.message || "Failed to save package");
  }
});

loadPackages();

document.getElementById("newPackageBtn").addEventListener("click", () => {
  isNewPackage = true;

  // Clear all fields
  document.getElementById("edit_packageId").value = "";
  document.getElementById("edit_packageName").value = "";
  document.getElementById("edit_description").value = "";
  document.getElementById("edit_price").value = "";
  document.getElementById("edit_classCount").value = "";
  document.getElementById("edit_isUnlimited").checked = false;

  // Allow editing packageId for new packages
  document.getElementById("edit_packageId").disabled = false;

  document.getElementById("editModal").classList.remove("hidden");
});