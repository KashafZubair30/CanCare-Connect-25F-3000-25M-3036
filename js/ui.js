// ui.js - shared UI bits: navbar, status badges, PKR/date
// and the EN/Urdu toggle

var CC = window.CC = window.CC || {};

CC.UI = (function () {
  const STRINGS = {
    en: {
      home: "Home",
      search: "Search",
      estimate: "Estimate",
      aid: "Aid",
      myAccount: "My Account",
      login: "Login",
      logout: "Logout"
    },
    ur: {
      home: "ہوم",
      search: "تلاش",
      estimate: "تخمینہ",
      aid: "امداد",
      myAccount: "میرا اکاؤنٹ",
      login: "لاگ ان",
      logout: "لاگ آؤٹ"
    }
  };

  function getLang() {
    return localStorage.getItem("cc_lang") || "en";
  }

  function setLang(l) {
    localStorage.setItem("cc_lang", l);
    document.documentElement.setAttribute("dir", l === "ur" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  }
// shows the right nav links based on who's logged in (admin/doctor/rep all see a different panel link)
  function renderNavbar(activePage) {
    const mount = document.getElementById("navbar");
    if (!mount) {
      return;
    }

    const user = CC.Auth.currentUser();
    const lang = getLang();
    const t = STRINGS[lang];
    setLang(lang);

    const links = [
      { key: "home", href: "dashboard.html" },
      { key: "search", href: "search.html" },
      { key: "estimate", href: "estimate.html" },
      { key: "aid", href: "aid.html" }
    ];

    const linksHtml = links.map((l) =>
      `<a href="${l.href}" class="${activePage === l.key ? "active" : ""}">${t[l.key]}</a>`
    ).join("");

    let accountHtml;
    if (user) {
      let panelLink = "";
      if (user.role === "Hospital Representative") {
        panelLink = `<a href="rep-panel.html">Hospital Panel</a>`;
      } else if (user.role === "Doctor") {
        panelLink = `<a href="doctor-profile.html">My Profile</a>`;
      } else if (user.role === "Administrator") {
        panelLink = `<a href="admin-verify.html">Admin Panel</a> <a href="profile.html">My Profile</a>`;
      } else {
        panelLink = `<a href="profile.html">My Profile</a>`;
      }

      accountHtml = `
        ${panelLink}
        <span class="caption">${user.name} (${user.role})</span>
        <button class="btn btn-secondary btn-sm" id="logoutBtn">${t.logout}</button>
      `;
    } else {
      accountHtml = `<a href="index.html" class="btn btn-primary btn-sm">${t.login}</a>`;
    }

    mount.innerHTML = `
      <div class="logo"><span>CanCare</span> Connect</div>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu">&#9776;</button>
      <nav>${linksHtml}</nav>
      <div class="account">
        ${accountHtml}
        <button class="lang-toggle" id="langToggle">&#127760; ${lang === "en" ? "اردو" : "EN"}</button>
      </div>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", CC.Auth.logout);
    }

    document.getElementById("langToggle").addEventListener("click", () => {
      setLang(lang === "en" ? "ur" : "en");
      renderNavbar(activePage);
    });

    
    document.getElementById("navToggle").addEventListener("click", () => {
      mount.querySelector("nav").classList.toggle("mobile-open");
    });
  }

  function toast(message, type = "") {
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
// turns a raw status word into the right coloured badge, so Active/Pending/Suspended always look the same everywhere
  function badge(status) {
    const map = {
      "Active": "badge-active",
      "Verified": "badge-verified",
      "Pending": "badge-pending",
      "Pending re-confirmation": "badge-pending",
      "Suspended": "badge-suspended",
      "Under Maintenance": "badge-pending",
      "Government-funded": "badge-govt",
      "NGO-funded": "badge-verified",
      "Zakat-supported": "badge-pending"
    };
    const cls = map[status] || "badge-pending";
    return `<span class="badge ${cls}">${status}</span>`;
  }

  function fmtPKR(n) {
    return "PKR " + Number(n).toLocaleString("en-PK");
  }


  function fmtDate(iso) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [y, m, d] = iso.split("-");
    return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  return { renderNavbar, toast, badge, fmtPKR, fmtDate, escapeHtml, getLang, setLang };
})();
