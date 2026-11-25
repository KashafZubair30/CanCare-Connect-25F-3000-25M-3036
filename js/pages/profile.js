// profile.js -My Profile page (User.updateProfile()).

document.addEventListener("DOMContentLoaded", () => {
  const me = CC.Auth.currentUser();
  if (!me) {
    window.location.href = "index.html";
    return;
  }

  // doctors/reps have their own page already, so just send them there
  if (me.role === "Doctor") {
    window.location.href = "doctor-profile.html";
    return;
  }
  if (me.role === "Hospital Representative") {
    window.location.href = "rep-panel.html";
    return;
  }

  CC.UI.renderNavbar("home");

  const content = document.getElementById("content");
  content.innerHTML = `
    <h1>My profile</h1>
    <div class="card">
      <div class="field"><label>Full name</label><input id="pName" value="${CC.UI.escapeHtml(me.name)}"></div>
      <div class="field"><label>City</label><input id="pCity" value="${CC.UI.escapeHtml(me.city || "")}"></div>
      <div class="field">
        <label>Preferred language</label>
        <select id="pLang">
          <option value="en" ${me.language === "en" ? "selected" : ""}>English</option>
          <option value="ur" ${me.language === "ur" ? "selected" : ""}>Urdu</option>
        </select>
      </div>
      <p>Account status: ${CC.UI.badge(me.status || (me.suspended ? "Suspended" : "Active"))}</p>
      <button class="btn btn-primary" id="saveProfileBtn">Save Changes</button>
    </div>
  `;
// saves the edited fields back to storage and refreshes the navbar in case the language changed
  document.getElementById("saveProfileBtn").addEventListener("click", () => {
    const users = CC.Storage.getUsers();
    const idx = users.findIndex((u) => u.id === me.id);
    users[idx].name = document.getElementById("pName").value;
    users[idx].city = document.getElementById("pCity").value;
    users[idx].language = document.getElementById("pLang").value;
    CC.Storage.saveUsers(users);
    CC.UI.setLang(users[idx].language);
    CC.UI.toast("Profile saved.", "success");
    CC.UI.renderNavbar("home");
  });
});
