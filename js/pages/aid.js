// aid.js - lists the financial aid / assistance programmes

document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("aid");
  // pulls the aid programs from storage and builds a card for each one
  const programs = CC.Storage.getAidPrograms();

  document.getElementById("aidList").innerHTML = programs.map((p) => `
    <div class="card">
      <h3>${p.name}</h3>
      <p>${CC.UI.badge(p.type)}</p>
      <p class="caption">Provider: ${p.provider}</p>
      <p><strong>Eligibility</strong><br>${p.eligibility}</p>
      <p><strong>Contact</strong><br>${p.contact}</p>
      <p><strong>Last reviewed</strong><br>${CC.UI.fmtDate(p.lastReviewed)}</p>
    </div>
  `).join("");
});
