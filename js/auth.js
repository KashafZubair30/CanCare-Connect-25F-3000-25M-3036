// auth.js - login, register, logout. covers the login()/logout()/
// updateProfile() behaviour of the User class (and its Doctor,
// Patient, HospitalRepresentative, Administrator subclasses)
 
var CC = window.CC = window.CC || {};

CC.Auth = (function () {
  const SESSION_KEY = "cc_session_user_id";

  async function hash(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // the seeded demo accounts don't have a real password

  async function ensureSeedPasswords() {
    const users = CC.Storage.getUsers();
    let changed = false;
    const defaultPw = localStorage.getItem("cc_default_pw_hint") || "Password123";
    const defaultHash = await hash(defaultPw);

    for (const u of users) {
      if (!u.passwordHash) {
        u.passwordHash = defaultHash;
        changed = true;
      }
    }

    if (changed) {
      CC.Storage.saveUsers(users);
    }
  }

  function currentUser() {
    const id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      return null;
    }
    return CC.Storage.getUsers().find((u) => u.id === id) || null;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  }

  async function register({ name, email, city, password, role, pmdcNumber, hospitalAuthId }) {
    const users = CC.Storage.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return {
        ok: false,
        error: "This email is already registered. Please log in instead."
      };
    }

    const passwordHash = await hash(password);
    const needsApproval = role === "Doctor" || role === "Hospital Representative";
    const user = {
      id: CC.Storage.uid("U"),
      name,
      email,
      city,
      passwordHash,
      role: role || "Patient / Caregiver",
      language: "en",
      
      verified: !needsApproval,
      status: needsApproval ? "Pending verification" : "Active",
      suspended: false
    };

    if (role === "Doctor") {
      user.pmdcNumber = pmdcNumber || "";
      user.pmdcStatus = "Pending";
      user.qualifications = "";
    }
    if (role === "Hospital Representative") {
      user.hospitalAuthId = hospitalAuthId || "";
      user.authorisationDoc = hospitalAuthId || "";
      user.designation = "";
    }

    users.push(user);
    CC.Storage.saveUsers(users);

    return {
      ok: true,
      user,
      simulatedEmail: `Verification email simulated for ${email}`
    };
  }

  async function login(email, password) {
    const users = CC.Storage.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        ok: false,
        error: "No account found with this email."
      };
    }

    if (user.suspended) {
      return {
        ok: false,
        error: "This account has been suspended. Please contact support."
      };
    }

    const incomingHash = await hash(password);
    if (incomingHash !== user.passwordHash) {
      return {
        ok: false,
        error: "Incorrect password."
      };
    }

    sessionStorage.setItem(SESSION_KEY, user.id);
    return { ok: true, user };
  }

  function redirectHome(role) {
    window.location.href = "dashboard.html";
  }

  function requireRole(...roles) {
    const u = currentUser();
    if (!u || !roles.includes(u.role)) {
      window.location.href = "index.html";
      return null;
    }
    return u;
  }

  document.addEventListener("DOMContentLoaded", ensureSeedPasswords);

  return {
    register,
    login,
    logout,
    currentUser,
    redirectHome,
    requireRole,
    hash
  };
})();
