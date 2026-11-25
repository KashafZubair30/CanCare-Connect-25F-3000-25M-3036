// estimator.js - the CostEstimator class 


var CC = window.CC = window.CC || {};

CC.Estimator = (function () {
  function daysSince(dateStr) {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.floor((now - then) / (1000 * 60 * 60 * 24));
  }
// looks for an exact cost match first, falls back to a broader one, and flags the data as outdated if it's over 30 days old
  function calculate({ cancerType, stage, treatment, hospitalType, city }) {
    const records = CC.Storage.getCostRecords();

    const exact = records.filter((r) =>
      r.cancerType === cancerType &&
      r.stage === stage &&
      r.treatment === treatment &&
      r.hospitalType === hospitalType
    );

    let matchType = "exact";
    let matches = exact;

    // no exact match: broaden the search by dropping hospital type and try again
    if (matches.length === 0) {
      matches = records.filter((r) => r.cancerType === cancerType && r.treatment === treatment);
      matchType = "broader";
    }

    if (matches.length === 0) {
      return {
        ok: false,
        error: "No cost data is available yet for this combination. Try a different treatment or hospital type."
      };
    }

    const minCost = Math.min(...matches.map((r) => r.minCost));
    const maxCost = Math.max(...matches.map((r) => r.maxCost));
    const oldestDays = Math.max(...matches.map((r) => daysSince(r.sourceDate)));
    const outdated = oldestDays > 30;

    return {
      ok: true,
      matchType,
      minCost,
      maxCost,
      breakdown: matches.map((r) => ({
        label: `${r.treatment} (${r.hospitalType}, ${r.city})`,
        min: r.minCost,
        max: r.maxCost,
        source: r.source,
        sourceDate: r.sourceDate
      })),
      outdated,
      disclaimer: "This is an approximate estimate based on available data. It is not medical advice. " +
        "Please confirm exact costs with the hospital directly."
    };
  }

  function saveEstimate(userId, inputs, result) {
    const estimates = CC.Storage.getEstimates();
    const record = {
      id: CC.Storage.uid("EST"),
      userId,
      inputs,
      result,
      createdAt: new Date().toISOString()
    };
    estimates.unshift(record);
    CC.Storage.saveEstimates(estimates);
    return record;
  }

 // turns the result into plain text lines for the downloadable PDF
  function buildDownloadText(inputs, result) {
    const lines = [
      "CanCare Connect — Cost Estimate",
      "",
      `Cancer type: ${inputs.cancerType}`,
      `Stage: ${inputs.stage}`,
      `Treatment: ${inputs.treatment}`,
      `Hospital type: ${inputs.hospitalType}`,
      `City: ${inputs.city}`,
      "",
      `Estimated range: PKR ${result.minCost.toLocaleString()} - PKR ${result.maxCost.toLocaleString()}`,
      result.outdated ? "Note: some source data is older than 30 days and may be outdated." : "",
      "",
      "Breakdown:",
      ...result.breakdown.map((b) => `  - ${b.label}: PKR ${b.min.toLocaleString()} - PKR ${b.max.toLocaleString()} (source: ${b.source}, ${b.sourceDate})`),
      "",
      result.disclaimer
    ];
    return lines.filter(Boolean).join("\n");
  }

  return { calculate, saveEstimate, buildDownloadText };
})();
