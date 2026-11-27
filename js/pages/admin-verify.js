// admin-verify.js - administrator queue for approving/rejecting doctor
// and hospital representative sign-ups
let admin;

function render() {
  const users = CC.Storage.getUsers();
  // only show doctors/hosp-reps that haven't been verified yet
  const pending = users.filter((u) => (u.role === "Doctor" || u.role === "Hospital Representative") && !u.verified);

  document.getElementById("pendingCount").textContent =
    `${pending.length} pending account${pending.length !== 1 ? "s" : ""}`;

  document.getElementById("rows").innerHTML = pending.map((u) => `
    <tr>
      <td>${u.name}</td>
      <td>${u.role}</td>
      <td class="caption">${u.role === "Doctor"
        ? `PMDC: ${u.pmdcNumber || "n/a"}${u.qualifications ? " &middot; " + u.qualifications : ""}`
        : `Authorisation doc: ${u.authorisationDoc || "n/a"}`}</td>
      <td>
        <button class="btn btn-primary btn-sm" data-id="${u.id}" data-act="approve">Approve</button>
        <button class="btn btn-danger btn-sm" data-id="${u.id}" data-act="reject">Reject</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="4" class="caption">No accounts awaiting approval.</td></tr>`;
// approve flips verified+status, reject just deletes the user either way, log it and re-render
  document.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const act = e.target.dataset.act;
      const users2 = CC.Storage.getUsers();
      const u = users2.find((x) => x.id === id);

      if (act === "approve") {
        u.verified = true;
        u.status = "Active";
        if (u.role === "Doctor") {
          u.pmdcStatus = "Verified";
        }
        CC.Storage.addAuditEntry(admin.name, "Approved verification", u.name);
        CC.UI.toast(`${u.name} approved.`, "success");
      } else {
        users2.splice(users2.indexOf(u), 1);
        CC.Storage.addAuditEntry(admin.name, "Rejected verification", u.name);
        CC.UI.toast(`${u.name} rejected.`, "error");
      }

      CC.Storage.saveUsers(users2);
      render();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  admin = CC.Auth.requireRole("Administrator");
  if (!admin) {
    return;
  }
  CC.UI.renderNavbar("home");
  render();
});
