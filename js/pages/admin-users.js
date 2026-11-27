// admin-users.js - user suspend/reactivate list, plus the audit log tab

let admin;
// builds the user table row by row, hides the suspend button on your own account
function renderUsers() {
  const users = CC.Storage.getUsers();
  document.getElementById("userRows").innerHTML = users.map((u) => `
    <tr>
      <td>${u.name}</td>
      <td class="caption">${u.email}</td>
      <td>${u.role}</td>
      <td>${u.city || ""}</td>
      <td>${CC.UI.badge(u.suspended ? "Suspended" : "Active")}</td>
      <td>
        ${u.id === admin.id
          ? `<span class="caption">This is you</span>`
          : `<button class="btn btn-sm ${u.suspended ? "btn-secondary" : "btn-danger"} toggleSuspend" data-id="${u.id}">${u.suspended ? "Reactivate" : "Suspend"}</button>`}
      </td>
    </tr>`).join("");
// flips suspended on/off, re-renders the table and logs the action
  document.querySelectorAll(".toggleSuspend").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const users2 = CC.Storage.getUsers();
      const u = users2.find((x) => x.id === e.target.dataset.id);
      u.suspended = !u.suspended;
      u.status = u.suspended ? "Suspended" : "Active";
      CC.Storage.saveUsers(users2);
      CC.Storage.addAuditEntry(admin.name, u.suspended ? "Suspended user" : "Reactivated user", u.name);
      renderUsers();
      CC.UI.toast(`${u.name} ${u.suspended ? "suspended" : "reactivated"}.`, "success");
    });
  });
}


function filterAuditLog(log, term) {
  if (!term) {
    return log;
  }
  const needle = term.toLowerCase();
  return log.filter((l) =>
    l.action.toLowerCase().includes(needle) ||
    l.target.toLowerCase().includes(needle) ||
    l.adminName.toLowerCase().includes(needle)
  );
}

function renderAudit() {
  const term = document.getElementById("auditFilter") ? document.getElementById("auditFilter").value : "";
  const log = filterAuditLog(CC.Storage.getAuditLog(), term);
  document.getElementById("auditRows").innerHTML = log.map((l) => `
    <tr>
      <td>${l.adminName}</td>
      <td>${l.action}</td>
      <td class="caption">${l.target}</td>
      <td>${new Date(l.timestamp).toLocaleString("en-GB", { timeZone: "Asia/Karachi" })} PKT</td>
    </tr>`).join("") || `<tr><td colspan="4" class="caption">No activity yet.</td></tr>`;
}

document.addEventListener("DOMContentLoaded", () => {
  admin = CC.Auth.requireRole("Administrator");
  if (!admin) {
    return;
  }
  CC.UI.renderNavbar("home");
  renderUsers();
  renderAudit();
  document.getElementById("auditFilter").addEventListener("input", renderAudit);

  const tabUsers = document.getElementById("tabUsers");
  const tabAudit = document.getElementById("tabAudit");
  const usersPanel = document.getElementById("usersPanel");
  const auditPanel = document.getElementById("auditPanel");

  tabUsers.addEventListener("click", () => {
    tabUsers.classList.add("active");
    tabAudit.classList.remove("active");
    usersPanel.classList.remove("hidden");
    auditPanel.classList.add("hidden");
  });

  tabAudit.addEventListener("click", () => {
    tabAudit.classList.add("active");
    tabUsers.classList.remove("active");
    auditPanel.classList.remove("hidden");
    usersPanel.classList.add("hidden");
  });
});
