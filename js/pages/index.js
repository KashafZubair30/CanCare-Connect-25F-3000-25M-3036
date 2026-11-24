// index.js - login / register page logic

document.addEventListener("DOMContentLoaded", () => {
 
  if (CC.Auth.currentUser()) {
    window.location.href = "dashboard.html";
    return;
  }

  CC.UI.renderNavbar("home");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const regRoleInput = document.getElementById("regRole");

  
  document.querySelectorAll(".role-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".role-toggle").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      regRoleInput.value = btn.dataset.role;
      document.getElementById("pmdcField").classList.toggle("hidden", btn.dataset.role !== "Doctor");
      document.getElementById("hospitalAuthField").classList.toggle("hidden", btn.dataset.role !== "Hospital Representative");
    });
  });

  document.getElementById("guestBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
    e.preventDefault();
    CC.UI.toast("Password reset isn't available in this demo. Try Continue as Guest instead.", "error");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = document.getElementById("loginError");
    errEl.classList.remove("show");

    const res = await CC.Auth.login(
      document.getElementById("loginEmail").value.trim(),
      document.getElementById("loginPassword").value
    );

    if (!res.ok) {
      errEl.textContent = res.error;
      errEl.classList.add("show");
      return;
    }

    CC.Auth.redirectHome(res.user.role);
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = document.getElementById("regError");
    errEl.classList.remove("show");

    const res = await CC.Auth.register({
      name: document.getElementById("regName").value.trim(),
      email: document.getElementById("regEmail").value.trim(),
      password: document.getElementById("regPassword").value,
      role: document.getElementById("regRole").value,
      pmdcNumber: document.getElementById("regPmdc").value.trim(),
      hospitalAuthId: document.getElementById("regHospitalAuth").value.trim()
    });

    if (!res.ok) {
      errEl.textContent = res.error;
      errEl.classList.add("show");
      return;
    }

    alert("Account created. " + res.simulatedEmail + "\n\nYou can now log in.");
    registerForm.reset();
    document.getElementById("loginEmail").value = res.user.email;
    document.getElementById("loginEmail").focus();
  });
});
