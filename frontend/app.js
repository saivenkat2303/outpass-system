// Handle student outpass submission
const outpassForm = document.getElementById("outpassForm");
if (outpassForm) {
  outpassForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(outpassForm);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:5000/api/outpass/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    alert(msg.message);
  });
}

// Load requests in warden dashboard
if (window.location.pathname.includes("dashboard-warden.html")) {
  fetch("http://localhost:5000/api/warden/all")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("requests");
      data.forEach((req) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p><b>${req.name}</b> (${req.rollno}) - ${req.reason}</p>
          <p>Parent: ${req.parentMobile}</p>
          <button onclick="callParent('${req.parentMobile}')">Call</button>
          <button onclick="approveOutpass('${req._id}')">Approve</button>
          <button onclick="downloadPDF('${req._id}')">Download PDF</button>
          <hr/>
        `;
        container.appendChild(div);
      });
    });
}

// Call parent (opens dialer)
function callParent(number) {
  window.location.href = `tel:${number}`;
}

// Approve request
async function approveOutpass(id) {
  await fetch(`http://localhost:5000/api/outpass/approve/${id}`, {
    method: "PUT",
  });
  alert("Approved!");
  location.reload();
}

// Download PDF
async function downloadPDF(id) {
  const res = await fetch(`http://localhost:5000/api/outpass/pdf/${id}`);
  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `outpass-${id}.pdf`;
  link.click();
}

// Security form
const secForm = document.getElementById("securityForm");
if (secForm) {
  secForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(secForm);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:5000/api/security/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    alert(msg.message);
  });

  // Load logs
  fetch("http://localhost:5000/api/security/logs")
    .then((res) => res.json())
    .then((logs) => {
      const container = document.getElementById("logData");
      logs.forEach((log) => {
        const div = document.createElement("div");
        div.innerHTML = `<p>${log.rollno} - ${log.action} @ ${new Date(log.timestamp).toLocaleString()}</p>`;
        container.appendChild(div);
      });
    });
}
