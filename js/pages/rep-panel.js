
let rep;
let hospital;
// redraws the whole panel (auth status, machinery table, fee table) after every save
function render() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h1>Hospital representative panel</h1>
    <p>Manage machinery status and fees for ${hospital.name}.</p>

    <div class="card mb-md">
      <h3>Authorisation</h3>
      <p class="caption">Submit or update the document that authorises you to represent this hospital.</p>
      <div class="field">
        <label>Authorisation document / ID</label>
        <input id="authDocInput" value="${rep.authorisationDoc || ""}" placeholder="Issued by your hospital">
      </div>
      <p>Status: ${CC.UI.badge(rep.verified ? "Verified" : "Pending")}</p>
      <button class="btn btn-secondary" id="submitAuthBtn">Submit Authorisation</button>
    </div>

    <div class="card mb-md">
      <h3>Machinery status</h3>
      <p class="caption">Updates are reflected on the hospital's public page immediately after saving.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Machine name</th><th>Status</th><th>Last updated</th><th>Actions</th></tr></thead>
          <tbody>
            ${hospital.machinery.map((m, i) => `
              <tr>
                <td>${m.name}</td>
                <td>
                  <select class="table-input machineryStatus" data-index="${i}">
                    <option ${m.status === "Active" ? "selected" : ""}>Active</option>
                    <option ${m.status === "Pending re-confirmation" ? "selected" : ""}>Pending re-confirmation</option>
                    <option ${m.status === "Under Maintenance" ? "selected" : ""}>Under Maintenance</option>
                  </select>
                </td>
                <td class="caption">${m.lastUpdated}</td>
                <td><button class="btn btn-primary btn-sm saveMachinery" data-index="${i}">Save</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h3>Fee schedule</h3>
      <p class="caption">Currency: PKR. Fees shown here are visible to patients using the cost estimator.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Service</th><th>Billing unit</th><th>Fee (PKR)</th><th>Actions</th></tr></thead>
          <tbody>
            ${hospital.fees.map((f, i) => `
              <tr>
                <td>${f.service}</td>
                <td class="caption">${f.billingUnit}</td>
                <td><input class="table-input feeInput" data-index="${i}" type="number" value="${f.fee}"></td>
                <td><button class="btn btn-primary btn-sm saveFee" data-index="${i}">Save</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
// sends the rep back to 'pending' status whenever they resubmit their authorisation doc
  document.getElementById("submitAuthBtn").addEventListener("click", () => {
    const users = CC.Storage.getUsers();
    const u = users.find((x) => x.id === rep.id);
    u.authorisationDoc = document.getElementById("authDocInput").value.trim();
    u.verified = false;
    u.status = "Pending verification";
    CC.Storage.saveUsers(users);
    rep = u;
    render();
    CC.UI.toast("Authorisation submitted for admin review.", "success");
  });

  document.querySelectorAll(".saveMachinery").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = Number(e.target.dataset.index);
      const select = document.querySelector(`.machineryStatus[data-index="${i}"]`);
      const hospitals = CC.Storage.getHospitals();
      const h = hospitals.find((x) => x.id === hospital.id);
      h.machinery[i].status = select.value;
      h.machinery[i].lastUpdated = new Date().toISOString().slice(0, 10);
      CC.Storage.saveHospitals(hospitals);
      hospital = h;
      render();
      CC.UI.toast("Machinery status saved.", "success");
    });
  });

  document.querySelectorAll(".saveFee").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = Number(e.target.dataset.index);
      const input = document.querySelector(`.feeInput[data-index="${i}"]`);
      const hospitals = CC.Storage.getHospitals();
      const h = hospitals.find((x) => x.id === hospital.id);
      h.fees[i].fee = Number(input.value);
      CC.Storage.saveHospitals(hospitals);
      hospital = h;
      CC.UI.toast("Fee saved.", "success");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  rep = CC.Auth.requireRole("Hospital Representative");
  if (!rep) {
    return;
  }
  CC.UI.renderNavbar("home");

  hospital = CC.Storage.getHospitals().find((h) => h.id === rep.hospitalId);
  if (!hospital) {
    document.getElementById("content").innerHTML = "<p>No hospital is linked to this account.</p>";
    return;
  }

  render();
});
