// doctor-profile.js - shows a doctor's own editable profile, or a
// read-only public view of it when someone else opens the link
document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("home");
  const viewId = new URLSearchParams(window.location.search).get("id");
  const me = CC.Auth.currentUser();
  const users = CC.Storage.getUsers();
  const isOwnProfile = !viewId || (me && me.id === viewId);
  const doctor = users.find((u) => u.id === (viewId || (me && me.id)));
  const hospitals = CC.Storage.getHospitals();
  const content = document.getElementById("content");

  if (!doctor || doctor.role !== "Doctor") {
    content.innerHTML = "<p>Doctor profile not found.</p>";
    return;
  }

  const hospital = hospitals.find((h) => h.id === doctor.hospitalId);

  if (isOwnProfile && me && me.id === doctor.id) {
    content.innerHTML = `
      <h1>My profile</h1>
      <div class="card">
        <div class="field"><label>Full name</label><input id="dName" value="${doctor.name}"></div>
        <div class="field"><label>Specialisation</label><input id="dSpec" value="${doctor.specialization || ""}"></div>
        <div class="field">
          <label>Hospital affiliation</label>
          <select id="dHospital">${hospitals.map((h) => `<option value="${h.id}" ${h.id === doctor.hospitalId ? "selected" : ""}>${h.name}</option>`).join("")}</select>
        </div>
        <p>Verification status: ${CC.UI.badge(doctor.verified ? "Verified" : "Pending")}</p>
        <button class="btn btn-primary" id="saveBtn">Save Changes</button>
      </div>

      <div class="card mb-md">
        <h3>Credentials</h3>
        <p class="caption">Submit your PMDC number and qualifications for verification.</p>
        <div class="field">
          <label>PMDC number (read-only once verified)</label>
          <input value="${doctor.pmdcNumber || ""}" ${doctor.verified ? "disabled" : "id='dPmdc'"}>
        </div>
        <div class="field">
          <label>Qualifications</label>
          <input id="dQual" value="${doctor.qualifications || ""}" placeholder="e.g. MBBS, FCPS (Oncology)" ${doctor.verified ? "disabled" : ""}>
        </div>
        <button class="btn btn-secondary" id="submitCredentialsBtn" ${doctor.verified ? "disabled" : ""}>Submit Credentials</button>
      </div>
    `;

    document.getElementById("saveBtn").addEventListener("click", () => {
      doctor.name = document.getElementById("dName").value;
      doctor.specialization = document.getElementById("dSpec").value;
      doctor.hospitalId = document.getElementById("dHospital").value;

      const idx = users.findIndex((u) => u.id === doctor.id);
      users[idx] = doctor;
      CC.Storage.saveUsers(users);
      CC.UI.toast("Profile saved.", "success");
    });

    const credBtn = document.getElementById("submitCredentialsBtn");
    if (credBtn) {
      credBtn.addEventListener("click", () => {
        const pmdcInput = document.getElementById("dPmdc");
        if (pmdcInput) {
          doctor.pmdcNumber = pmdcInput.value;
        }
        doctor.qualifications = document.getElementById("dQual").value;
        doctor.pmdcStatus = "Pending";

        const idx = users.findIndex((u) => u.id === doctor.id);
        users[idx] = doctor;
        CC.Storage.saveUsers(users);
        CC.UI.toast("Credentials submitted for verification.", "success");
      });
    }
  } else {
    content.innerHTML = `
      <h1>${doctor.name} ${CC.UI.badge(doctor.verified ? "Verified" : "Pending")}</h1>
      <div class="card">
        <p><strong>Specialisation:</strong> ${doctor.specialization}</p>
        <p><strong>Hospital:</strong> ${hospital ? hospital.name : "Unaffiliated"}</p>
        <p><strong>PMDC number:</strong> ${doctor.verified ? doctor.pmdcNumber : "Pending verification"}</p>
      </div>
    `;
  }
});
