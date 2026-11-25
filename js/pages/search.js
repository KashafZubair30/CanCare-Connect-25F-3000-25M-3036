// search.js - hospital search/filter page, plus the compare-selection checkboxes


let selected = JSON.parse(sessionStorage.getItem("cc_compare_selection") || "[]");
const allMachinery = ["PET-CT Scanner", "Linear Accelerator (LINAC)", "MRI Scanner", "Brachytherapy Unit", "Cobalt-60 Unit"];

function saveSelection() {
  sessionStorage.setItem("cc_compare_selection", JSON.stringify(selected));
}

function updateCompareButton() {
  const btn = document.getElementById("compareBtn");
  btn.textContent = `Compare Selected (${selected.length})`;
  btn.disabled = selected.length < 2;
}

function renderMachineryChecks() {
  document.getElementById("machineryChecks").innerHTML = allMachinery.map((m) => `
    <label class="check-row">
      <input type="checkbox" class="machCheck" value="${m}"> ${m}
    </label>`).join("");
}
// reads the current city/type/cancer dropdowns and checked machinery boxes into one object
function getFilters() {
  const checked = Array.from(document.querySelectorAll(".machCheck:checked")).map((c) => c.value);
  return {
    city: document.getElementById("filterCity").value,
    type: document.getElementById("filterType").value,
    cancer: document.getElementById("filterCancer").value,
    machinery: checked
  };
}
// re-runs the filters and redraws the hospital cards
function renderResults() {
  const { city, type, cancer, machinery } = getFilters();
  let hospitals = CC.Storage.getHospitals();

  if (city) {
    hospitals = hospitals.filter((h) => h.city === city);
  }
  if (type) {
    hospitals = hospitals.filter((h) => h.type === type);
  }
  if (cancer) {
    hospitals = hospitals.filter((h) => (h.specialties || []).includes(cancer));
  }
  if (machinery.length) {
    hospitals = hospitals.filter((h) => machinery.every((m) => h.machinery.some((x) => x.name === m)));
  }

  document.getElementById("resultCount").textContent = `${hospitals.length} hospital${hospitals.length !== 1 ? "s" : ""} found`;

  document.getElementById("results").innerHTML = hospitals.map((h) => `
    <div class="card mb-sm">
      <div class="flex-between">
        <div>
          <h3>${h.name}</h3>
          <p class="caption">${h.city}, Punjab, Pakistan &middot; ${h.type}${h.specialties ? " &middot; Treats: " + h.specialties.join(", ") : ""}</p>
          <div>${h.machinery.map((m) => `${CC.UI.escapeHtml(m.name)} ${CC.UI.badge(m.status)}`).join(" &nbsp; ")}</div>
        </div>
        <div class="text-right">
          <label class="caption flex justify-end">
            <input type="checkbox" class="compareCheck" value="${h.id}" ${selected.includes(h.id) ? "checked" : ""}> Compare
          </label>
          <a class="btn btn-primary btn-sm" href="hospital-detail.html?id=${h.id}">View Details</a>
        </div>
      </div>
    </div>`).join("") || `<p>No hospitals match these filters. Try widening your search.</p>`;
// tracks which hospitals are checked for comparison, max 3 allowed
  document.querySelectorAll(".compareCheck").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      if (e.target.checked) {
        if (selected.length >= 3) {
          e.target.checked = false;
          CC.UI.toast("You can compare up to 3 hospitals.", "error");
          return;
        }
        selected.push(e.target.value);
      } else {
        selected = selected.filter((id) => id !== e.target.value);
      }
      saveSelection();
      updateCompareButton();
    });
  });

  updateCompareButton();
}

document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("search");
  renderMachineryChecks();
  renderResults();

  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    const hospitals = CC.Storage.getHospitals();
    const cityMatch = hospitals.find((h) => h.city.toLowerCase() === q.toLowerCase());
    if (cityMatch) {
      document.getElementById("filterCity").value = cityMatch.city;
    }
    renderResults();
  }

  document.getElementById("applyFilters").addEventListener("click", renderResults);
  document.getElementById("compareBtn").addEventListener("click", () => {
    window.location.href = "compare.html?ids=" + selected.join(",");
  });
});
