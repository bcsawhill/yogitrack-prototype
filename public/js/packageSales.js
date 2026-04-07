async function loadSales() {
  const res = await fetch("/api/package/sales");
  const sales = await res.json();

  const tbody = document.querySelector("#salesTable tbody");
  tbody.innerHTML = "";

  sales.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.saleId}</td>
      <td>${s.customerId}</td>
      <td>${s.packageId}</td>
      <td>${new Date(s.date).toLocaleDateString()}</td>
      <td>$${s.pricePaid.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}

loadSales();
