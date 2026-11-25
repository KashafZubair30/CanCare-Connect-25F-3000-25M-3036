// dashboard.js - home page logic: greeting, admin shortcuts, saved estimates

document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("home");
  const user = CC.Auth.currentUser();

  if (user) {
    document.getElementById("greeting").textContent = `Welcome, ${user.name.split(" ")[0]}.`;
    document.getElementById("subheading").textContent = `Role: ${user.role}${user.city ? " · " + user.city : ""}`;
// admins get quick-link shortcuts here, patients see their last 3 saved estimates instead
    if (user.role === "Administrator") {
      document.getElementById("myEstimates").innerHTML = `
        <div class="card">
          <h3>Administrator shortcuts</h3>
          <div class="flex">
            <a class="btn btn-secondary" href="admin-verify.html">Verification Queue</a>
            <a class="btn btn-secondary" href="admin-data.html">Cost &amp; Aid Data</a>
            <a class="btn btn-secondary" href="admin-users.html">Users &amp; Audit Log</a>
          </div>
        </div>`;
    } else if (user.role === "Patient / Caregiver") {
      const estimates = CC.Storage.getEstimates().filter((e) => e.userId === user.id).slice(0, 3);
      if (estimates.length) {
        document.getElementById("myEstimates").innerHTML = `
          <h2>My Saved Estimates</h2>
          <div class="card-grid">
            ${estimates.map((e) => `
              <div class="card">
                <h3>${e.inputs.cancerType}</h3>
                <p class="caption">${e.inputs.treatment} &middot; ${e.inputs.hospitalType}</p>
                <p>${CC.UI.fmtPKR(e.result.minCost)} &ndash; ${CC.UI.fmtPKR(e.result.maxCost)}</p>
              </div>`).join("")}
          </div>`;
      }
    }
  } else {
    document.getElementById("greeting").textContent = "Find the right hospital for you.";
    document.getElementById("subheading").textContent = "Browsing as Guest. Log in to save estimates and access more features.";
  }
// grabs the quick search box text and sends the user to the search page with it as a query param
  document.getElementById("quickSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("quickQuery").value.trim();
    window.location.href = "search.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
});
