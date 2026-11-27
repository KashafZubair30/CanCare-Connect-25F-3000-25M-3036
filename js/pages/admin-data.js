// admin-data.js - administrator CRUD screen for cost records and aid programmes

let admin;

function renderCostRows() {
  const records = CC.Storage.getCostRecords();
  document.getElementById("costRows").innerHTML = records.map((r) => `
    <tr>
      <td>${r.cancerType}</td>
      <td>${r.treatment} (${r.stage})</td>
      <td>${r.hospitalType}</td>
      <td>${CC.UI.fmtPKR(r.minCost)} &ndash; ${CC.UI.fmtPKR(r.maxCost)}</td>
      <td class="caption">${r.source}</td>
      <td>${r.sourceDate}</td>
      <td><button class="btn btn-secondary btn-sm archiveCost" data-id="${r.id}">Archive</button></td>
    </tr>`).join("");

  document.querySelectorAll(".archiveCost").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const records2 = CC.Storage.getCostRecords();
      const rec = records2.find((r) => r.id === e.target.dataset.id);
      const filtered = records2.filter((r) => r.id !== e.target.dataset.id);
      CC.Storage.saveCostRecords(filtered);
      CC.Storage.addAuditEntry(admin.name, "Archived cost record", `${rec.cancerType} - ${rec.treatment}`);
      renderCostRows();
      CC.UI.toast("Cost record archived.", "success");
    });
  });
}

function renderAidRows() {
  const programs = CC.Storage.getAidPrograms();
  document.getElementById("aidRows").innerHTML = programs.map((p) => `
    <tr>
      <td>${p.name}</td>
      <td>${p.provider}</td>
      <td>${p.type}</td>
      <td>${p.lastReviewed}</td>
      <td><button class="btn btn-secondary btn-sm archiveAid" data-id="${p.id}">Archive</button></td>
    </tr>`).join("");

  document.querySelectorAll(".archiveAid").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const programs2 = CC.Storage.getAidPrograms();
      const prog = programs2.find((p) => p.id === e.target.dataset.id);
      const filtered = programs2.filter((p) => p.id !== e.target.dataset.id);
      CC.Storage.saveAidPrograms(filtered);
      CC.Storage.addAuditEntry(admin.name, "Archived aid program", prog.name);
      renderAidRows();
      CC.UI.toast("Aid program archived.", "success");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  admin = CC.Auth.requireRole("Administrator");
  if (!admin) {
    return;
  }
  CC.UI.renderNavbar("home");
  renderCostRows();
  renderAidRows();

  const modal = document.getElementById("modalBackdrop");

  document.getElementById("addRecord").addEventListener("click", () => {
    modal.classList.add("show");
  });

  document.getElementById("cancelModal").addEventListener("click", () => {
    modal.classList.remove("show");
  });

  document.getElementById("confirmModal").addEventListener("click", () => {
    const records = CC.Storage.getCostRecords();
    // pull every field from the modal form and build one new cost record object
    records.push({
      id: CC.Storage.uid("C"),
      cancerType: document.getElementById("mCancer").value,
      stage: document.getElementById("mStage").value,
      treatment: document.getElementById("mTreatment").value,
      costItem: document.getElementById("mTreatment").value,
      hospitalType: document.getElementById("mHospType").value,
      city: document.getElementById("mCity").value,
      minCost: Number(document.getElementById("mMin").value),
      maxCost: Number(document.getElementById("mMax").value),
      confidence: "Medium",
      archived: false,
      source: document.getElementById("mSource").value,
      sourceDate: new Date().toISOString().slice(0, 10)
    });
    // save it, log who added it, then close the modal and refresh the table
    CC.Storage.saveCostRecords(records);
    CC.Storage.addAuditEntry(admin.name, "Added cost record", document.getElementById("mCancer").value);
    modal.classList.remove("show");
    renderCostRows();
    CC.UI.toast("Cost record added.", "success");
  });

  const aidModal = document.getElementById("aidModalBackdrop");

  document.getElementById("addAidProgram").addEventListener("click", () => {
    aidModal.classList.add("show");
  });

  document.getElementById("cancelAidModal").addEventListener("click", () => {
    aidModal.classList.remove("show");
  });

  document.getElementById("confirmAidModal").addEventListener("click", () => {
    const programs = CC.Storage.getAidPrograms();
    const name = document.getElementById("aName").value;
    const contact = document.getElementById("aContact").value;
    programs.push({
      id: CC.Storage.uid("A"),
      name,
      provider: document.getElementById("aProvider").value,
      type: document.getElementById("aType").value,
      eligibility: document.getElementById("aEligibility").value,
      contact,
      helpline: contact,
      source: document.getElementById("aSource").value,
      lastReviewed: new Date().toISOString().slice(0, 10)
    });
    CC.Storage.saveAidPrograms(programs);
    CC.Storage.addAuditEntry(admin.name, "Added aid program", name);
    aidModal.classList.remove("show");
    renderAidRows();
    CC.UI.toast("Aid program added.", "success");
  });
});
