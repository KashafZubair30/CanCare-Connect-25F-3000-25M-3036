// hospital-detail.js : machinery status, fee schedule,
// and a shortcut into the cost estimator pre-filled for this hospital

document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("search");
  // pull hospital by id from the url, bail out early if it doesn't exist
  const id = new URLSearchParams(window.location.search).get("id");
  const hospital = CC.Storage.getHospitals().find((h) => h.id === id);
  const content = document.getElementById("content");

  if (!hospital) {
    content.innerHTML = "<p>Hospital not found.</p>";
    return;
  }
// build the whole page in one go machinery table, fees table, estimate CTA
  content.innerHTML = `
    <h1>${hospital.name}</h1>
    <p>${hospital.address}</p>
    <p class="caption">Address source: hospital's official contact page.</p>

    <div class="grid-2">
      <div>
        <div class="card mb-md">
          <h3>Machinery status</h3>
          <p class="caption">Equipment reported by the hospital.</p>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Machine name</th><th>Status</th><th>Last updated</th></tr></thead>
              <tbody>
                ${hospital.machinery.map((m) => `<tr><td>${m.name}</td><td>${CC.UI.badge(m.status)}</td><td>${m.lastUpdated}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3>Fee schedule</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Service</th><th>Billing unit</th><th>Estimated fee</th></tr></thead>
              <tbody>
                ${hospital.fees.map((f) => `<tr><td>${f.service}</td><td>${f.billingUnit}</td><td>${CC.UI.fmtPKR(f.fee)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div class="card mb-md">
          <h3>Cost estimate</h3>
          <p class="caption">Get a personalised cost estimate based on your treatment and this hospital's type.</p>
          <a class="btn btn-primary btn-block" href="estimate.html?hospitalType=${encodeURIComponent(hospital.type)}&city=${encodeURIComponent(hospital.city)}">Get Cost Estimate for this Hospital</a>
        </div>
        <div class="disclaimer">
          Equipment availability, fees and appointment requirements must be confirmed directly with the hospital.
        </div>
      </div>
    </div>
  `;
});
