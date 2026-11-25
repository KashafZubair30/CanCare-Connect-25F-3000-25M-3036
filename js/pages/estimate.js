// estimate.js - cost estimator form
// renders the range, breakdown table and a downloadable PDF summary

document.addEventListener("DOMContentLoaded", () => {
  CC.UI.renderNavbar("estimate");
  const user = CC.Auth.currentUser();

  const params = new URLSearchParams(window.location.search);
  if (params.get("hospitalType")) {
    document.getElementById("fHospitalType").value = params.get("hospitalType");
  }
  if (params.get("city")) {
    document.getElementById("fCity").value = params.get("city");
  }

  let lastInputs = null;
  let lastResult = null;
// runs the estimate and fills in the result card, or shows the no-match message instead
  document.getElementById("estimateForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = {
      cancerType: document.getElementById("fCancer").value,
      stage: document.getElementById("fStage").value,
      treatment: document.getElementById("fTreatment").value,
      hospitalType: document.getElementById("fHospitalType").value,
      city: document.getElementById("fCity").value
    };

    const result = CC.Estimator.calculate(inputs);
    const resultCard = document.getElementById("resultCard");
    const noMatchCard = document.getElementById("noMatchCard");

    if (!result.ok) {
      resultCard.classList.add("hidden");
      noMatchCard.classList.remove("hidden");
      document.getElementById("noMatchText").textContent = result.error;
      return;
    }

    noMatchCard.classList.add("hidden");
    resultCard.classList.remove("hidden");

    document.getElementById("matchCaption").textContent =
      result.matchType === "exact"
        ? `Based on ${result.breakdown.length} matching cost record${result.breakdown.length !== 1 ? "s" : ""}.`
        : `No exact match — showing a broader estimate based on ${result.breakdown.length} record(s) for this treatment.`;

    document.getElementById("rangeText").textContent = `${CC.UI.fmtPKR(result.minCost)} – ${CC.UI.fmtPKR(result.maxCost)}`;

    document.getElementById("breakdownTable").innerHTML = result.breakdown.map((b) => `
      <tr>
        <td>${b.label}</td>
        <td>${CC.UI.fmtPKR(b.min)} &ndash; ${CC.UI.fmtPKR(b.max)}</td>
        <td class="caption">${b.source} &middot; ${b.sourceDate}</td>
      </tr>`).join("");

    document.getElementById("outdatedNote").classList.toggle("hidden", !result.outdated);
    document.getElementById("disclaimerText").textContent = result.disclaimer;

    lastInputs = inputs;
    lastResult = result;

    if (user && user.role === "Patient / Caregiver") {
      CC.Estimator.saveEstimate(user.id, inputs, result);
    }
  });
// lays the same estimate text out onto a real PDF page using jsPDF
  document.getElementById("downloadBtn").addEventListener("click", () => {
    if (!lastResult) {
      return;
    }

    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const marginLeft = 14;
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    doc.setFontSize(11);
    CC.Estimator.buildDownloadText(lastInputs, lastResult).split("\n").forEach((line) => {
      doc.splitTextToSize(line || " ", 180).forEach((wrapped) => {
        if (y > pageHeight - 15) {
          doc.addPage();
          y = 20;
        }
        doc.text(wrapped, marginLeft, y);
        y += 6;
      });
    });

    doc.save("cancare-connect-estimate.pdf");
  });
});
