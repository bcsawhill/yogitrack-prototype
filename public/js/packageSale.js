async function loadCustomers() {
  const res = await fetch("/api/customer/search?q=");
  const customers = await res.json();

  const select = document.getElementById("customerSelect");
  select.innerHTML = "";
  customers.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.customerId;
    opt.textContent = `${c.firstName} ${c.lastName} (${c.customerId})`;
    select.appendChild(opt);
  });
}

async function loadPackages() {
  const res = await fetch("/api/package/all");
  const packages = await res.json();

  const select = document.getElementById("packageSelect");
  select.innerHTML = "";
  packages.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.packageId;
    opt.textContent = `${p.packageName} - $${p.price}`;
    select.appendChild(opt);
  });
}

document.getElementById("completeSaleBtn").addEventListener("click", async () => {
  const customerId = document.getElementById("customerSelect").value;
  const packageId = document.getElementById("packageSelect").value;

  if (!customerId || !packageId) {
    alert("Please select both a customer and a package.");
    return;
  }

  const res = await fetch("/api/package/sale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, packageId })
  });

  const result = await res.json();
  if (res.ok) {
    alert(result.message);
  } else {
    alert(result.message || "Failed to record sale");
  }
});

loadCustomers();
loadPackages();
