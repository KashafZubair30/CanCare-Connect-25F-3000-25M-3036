// doctors.js - doctor directory with specialisation / hospital filters
function render() {
  const spec = document.getElementById("filterSpec").value;
  const hospId = document.getElementById("filterHospital").value;
  const hospitals = CC.Storage.getHospitals();
  let doctors = CC.Storage.getUsers().filter((u) => u.role === "Doctor");

  if (spec) {
    doctors = doctors.filter((d) => d.specialization === spec);
  }
  if (hospId) {
    doctors = doctors.filter((d) => d.hospitalId === hospId);
  }

  document.getElementById("doctorList").innerHTML = doctors.map((d) => {
    const h = hospitals.find((x) => x.id === d.hospitalId);
    return `
    <div class="card flex-between mb-sm">
      <div>
        <h3>${d.name} ${CC.UI.badge(d.verified ? "Verified" : "Pending")}</h3>
        <p class="caption">${d.specialization} &middot; ${h ? h.name : "Unaffiliated"}</p>
      </div>
      <a class="btn btn-primary btn-sm" href="doctor-profile.html?id=${d.id}">View Profile</a>
    </div>`;
  }).join("") || "<p>No doctors match these filters.</p>";
}

document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("search");
  const hospitals = CC.Storage.getHospitals();
  const doctors = CC.Storage.getUsers().filter((u) => u.role === "Doctor");
  const specs = [...new Set(doctors.map((d) => d.specialization))];

  document.getElementById("filterSpec").innerHTML += specs.map((s) => `<option>${s}</option>`).join("");
  document.getElementById("filterHospital").innerHTML += hospitals.map((h) => `<option value="${h.id}">${h.name}</option>`).join("");

  document.getElementById("filterSpec").addEventListener("change", render);
  document.getElementById("filterHospital").addEventListener("change", render);
  render();
});
