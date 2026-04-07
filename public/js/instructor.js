document.getElementById("instructorForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // Get the next available instructor ID
    const idRes = await fetch("/api/instructor/getNextId");
    const { nextId } = await idRes.json();

    const instructorData = {
      instructorId: nextId,
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      pref: document.querySelector("input[name='pref']:checked")?.value || "email"
    };

    const res = await fetch("/api/instructor/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructorData)
    });
    console.log(instructorData);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to add instructor");

    alert(`Instructor ${instructorData.instructorId} added successfully!`);
    document.getElementById("instructorForm").reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
});