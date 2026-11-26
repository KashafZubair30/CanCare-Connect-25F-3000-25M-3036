// compare.js - side-by-side comparison of hospitals 

document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("search");
  // read selected hospital ids from ids, keep only the ones that still exist
  const ids = (new URLSearchParams(window.location.search).get("ids") || "").split(",").filter(Boolean);
  const hospitals = CC.Storage.getHospitals().filter((h) => ids.includes(h.id));
  const grid = document.getElementById("compareGrid");

  if (hospitals.length < 2) {
    grid.innerHTML = "<p>Select at least two hospitals from the search results to compare.</p>";
    return;
  }

  document.getElementById("compareTitle").textContent = `Comparing ${hospitals.length} hospitals`;


  grid.style.gridTemplateColumns = `repeat(${hospitals.length}, minmax(0, 1fr))`;

  grid.innerHTML = hospitals.map((h) => `
    <div class="card">
      <h3>${h.name}</h3>
      <p class="caption">${h.city} &middot; ${h.type}</p>
      <div class="table-wrap">
        <table>
          <tr><th>Machinery</th><td>${h.machinery.map((m) => m.name + " " + CC.UI.badge(m.status)).join("<br>")}</td></tr>
          <tr><th>Location</th><td>${h.address}</td></tr>
          <tr><th>Fee range</th><td>${CC.UI.fmtPKR(Math.min(...h.fees.map((f) => f.fee)))} &ndash; ${CC.UI.fmtPKR(Math.max(...h.fees.map((f) => f.fee)))}</td></tr>
        </table>
      </div>
      <button class="btn-link removeBtn" data-id="${h.id}">Remove from comparison</button>
    </div>
  `).join("");

 // removing one card just drops that id and reloads with the rest, not the whole comparison
  document.querySelectorAll(".removeBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const remaining = ids.filter((id) => id !== e.target.dataset.id);
      sessionStorage.setItem("cc_compare_selection", JSON.stringify(remaining));
      window.location.href = remaining.length >= 2
        ? "compare.html?ids=" + remaining.join(",")
        : "search.html";
    });
  });
});
