document.getElementById("customerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // Get the next available customer ID
    const idRes = await fetch("/api/customer/getNextId");
    const { nextId } = await idRes.json();

    const customerData = {
      customerId: nextId,
      firstName: document.getElementById("firstinput").value.trim(),
      lastName: document.getElementById("lastinput").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      senior: document.getElementById("senior").checked
    };

    const res = await fetch("/api/customer/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData)
    });
    console.log(customerData);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to add customer");

    alert(`Customer ${customerData.customerId} added successfully!`);
    document.getElementById("customerForm").reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
});