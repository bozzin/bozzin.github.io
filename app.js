const services = [
  {
    id: "residential",
    name: "Residential detox per diem",
    code: "H0010",
    rate: 0,
    units: 7,
    unitLabel: "days",
    required: true,
  },
  {
    id: "medical",
    name: "Medical management",
    code: "H0001",
    rate: 180,
    units: 3,
    unitLabel: "visits",
  },
  {
    id: "nursing",
    name: "24/7 nursing monitoring",
    code: "T1019",
    rate: 95,
    units: 7,
    unitLabel: "days",
  },
  {
    id: "therapy",
    name: "Individual therapy",
    code: "90837",
    rate: 140,
    units: 2,
    unitLabel: "sessions",
  },
  {
    id: "group",
    name: "Group counseling",
    code: "H0005",
    rate: 45,
    units: 5,
    unitLabel: "sessions",
  },
  {
    id: "lab",
    name: "Toxicology screening",
    code: "H0048",
    rate: 120,
    units: 2,
    unitLabel: "tests",
  },
  {
    id: "case",
    name: "Case management",
    code: "T1017",
    rate: 85,
    units: 2,
    unitLabel: "hours",
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const form = document.getElementById("billing-form");
const servicesContainer = document.getElementById("services");
const summary = document.getElementById("summary");
const resetButton = document.getElementById("reset");

const buildServices = () => {
  servicesContainer.innerHTML = "";
  services.forEach((service) => {
    const wrapper = document.createElement("div");
    wrapper.className = "service-item";

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.name = `${service.id}-enabled`;
    toggle.checked = service.required ?? false;

    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = service.name;
    const meta = document.createElement("span");
    meta.textContent = `Code ${service.code}`;
    info.append(title, meta);

    const rate = document.createElement("input");
    rate.type = "number";
    rate.name = `${service.id}-rate`;
    rate.value = service.rate;
    rate.min = "0";
    rate.step = "0.01";
    rate.title = "Rate per unit";

    const units = document.createElement("input");
    units.type = "number";
    units.name = `${service.id}-units`;
    units.value = service.units;
    units.min = "0";
    units.step = "1";
    units.title = "Units";

    const unitLabel = document.createElement("span");
    unitLabel.textContent = service.unitLabel;

    wrapper.append(toggle, info, rate, units, unitLabel);
    servicesContainer.appendChild(wrapper);
  });
};

const getNumber = (name) => {
  const value = Number.parseFloat(form.elements[name]?.value ?? "0");
  return Number.isFinite(value) ? value : 0;
};

const getText = (name) => form.elements[name]?.value ?? "";

const renderSummary = ({
  totalAllowed,
  adjustedAllowed,
  allowedFactor,
  deductibleApplied,
  coinsuranceAmount,
  copayAmount,
  patientResponsibility,
  payerResponsibility,
  oopRemaining,
  billables,
}) => {
  summary.classList.remove("empty");
  summary.innerHTML = `
    <div class="summary-grid">
      <div class="summary-card">
        <h4>Policy snapshot</h4>
        <p><strong>${getText("clientName") || "Client"}</strong></p>
        <p>${getText("planType")} • ${getText("networkStatus") === "in" ? "In-network" : "Out-of-network"}</p>
        <p>${getText("levelOfCare")}</p>
        <span class="tag">Prior auth: ${getText("priorAuth")}</span>
      </div>
      <div class="summary-card">
        <h4>Allowed charges</h4>
        <p>Base allowed: ${currency.format(totalAllowed)}</p>
        <p>Network factor: ${allowedFactor.toFixed(2)}x</p>
        <p><strong>${currency.format(adjustedAllowed)}</strong></p>
      </div>
      <div class="summary-card">
        <h4>Patient responsibility</h4>
        <p>Deductible: ${currency.format(deductibleApplied)}</p>
        <p>Coinsurance: ${currency.format(coinsuranceAmount)}</p>
        <p>Copays: ${currency.format(copayAmount)}</p>
        <p><strong>${currency.format(patientResponsibility)}</strong></p>
      </div>
      <div class="summary-card">
        <h4>Payer responsibility</h4>
        <p><strong>${currency.format(payerResponsibility)}</strong></p>
        <p>OOP remaining cap: ${currency.format(oopRemaining)}</p>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Code</th>
          <th>Units</th>
          <th>Rate</th>
          <th>Allowed</th>
        </tr>
      </thead>
      <tbody>
        ${billables
          .map(
            (service) => `
          <tr>
            <td>${service.name}</td>
            <td>${service.code}</td>
            <td>${service.units}</td>
            <td>${currency.format(service.rate)}</td>
            <td>${currency.format(service.rate * service.units)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const calculateBilling = () => {
  const days = Math.max(1, getNumber("days"));
  const perDiem = Math.max(0, getNumber("perDiem"));
  const allowedFactor = Math.max(0, getNumber("allowedFactor"));
  const deductible = Math.max(0, getNumber("deductible"));
  const oopRemaining = Math.max(0, getNumber("oop"));
  const coinsuranceRate = Math.min(100, Math.max(0, getNumber("coinsurance"))) / 100;
  const copayPerDay = Math.max(0, getNumber("copay"));

  const selectedServices = services.map((service) => {
    const enabled = form.elements[`${service.id}-enabled`]?.checked ?? false;
    const rate = Math.max(0, getNumber(`${service.id}-rate`));
    const units = Math.max(0, getNumber(`${service.id}-units`));
    return {
      ...service,
      enabled,
      rate: service.id === "residential" ? perDiem : rate,
      units: service.id === "residential" ? days : units,
    };
  });

  const billables = selectedServices.filter((service) => service.enabled);
  const totalAllowed = billables.reduce(
    (sum, service) => sum + service.rate * service.units,
    0,
  );
  const adjustedAllowed = totalAllowed * allowedFactor;

  const deductibleApplied = Math.min(deductible, adjustedAllowed);
  const afterDeductible = Math.max(0, adjustedAllowed - deductibleApplied);
  const coinsuranceAmount = afterDeductible * coinsuranceRate;
  const copayAmount = copayPerDay * days;
  let patientResponsibility = deductibleApplied + coinsuranceAmount + copayAmount;

  if (patientResponsibility > oopRemaining) {
    patientResponsibility = oopRemaining;
  }

  const payerResponsibility = Math.max(0, adjustedAllowed - patientResponsibility);

  renderSummary({
    totalAllowed,
    adjustedAllowed,
    allowedFactor,
    deductibleApplied,
    coinsuranceAmount,
    copayAmount,
    patientResponsibility,
    payerResponsibility,
    oopRemaining,
    billables,
  });
};

const analyzeBilling = (event) => {
  event.preventDefault();
  calculateBilling();
};

const resetForm = () => {
  form.reset();
  buildServices();
  calculateBilling();
};

const exportResults = () => {
  const clientName = getText("clientName") || "Client";
  const memberId = getText("memberId") || "N/A";
  const planType = getText("planType");
  const networkStatus = getText("networkStatus") === "in" ? "In-network" : "Out-of-network";
  const levelOfCare = getText("levelOfCare");
  const days = getNumber("days");
  const perDiem = getNumber("perDiem");
  
  const selectedServices = services.map((service) => {
    const enabled = form.elements[`${service.id}-enabled`]?.checked ?? false;
    const rate = Math.max(0, getNumber(`${service.id}-rate`));
    const units = Math.max(0, getNumber(`${service.id}-units`));
    return {
      ...service,
      enabled,
      rate: service.id === "residential" ? perDiem : rate,
      units: service.id === "residential" ? days : units,
    };
  });

  const billables = selectedServices.filter((service) => service.enabled);
  const totalAllowed = billables.reduce(
    (sum, service) => sum + service.rate * service.units,
    0,
  );
  const adjustedAllowed = totalAllowed * getNumber("allowedFactor");
  const deductibleApplied = Math.min(getNumber("deductible"), adjustedAllowed);
  const afterDeductible = Math.max(0, adjustedAllowed - deductibleApplied);
  const coinsuranceAmount = afterDeductible * (getNumber("coinsurance") / 100);
  const copayAmount = getNumber("copay") * days;
  let patientResponsibility = deductibleApplied + coinsuranceAmount + copayAmount;
  
  if (patientResponsibility > getNumber("oop")) {
    patientResponsibility = getNumber("oop");
  }
  
  const payerResponsibility = Math.max(0, adjustedAllowed - patientResponsibility);

  const exportText = `
DETOX RESIDENTIAL TREATMENT BILLING ANALYSIS
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════

CLIENT & POLICY INFORMATION
───────────────────────────────────────────────────────────
Client Name:           ${clientName}
Member ID:             ${memberId}
Plan Type:             ${planType}
Network Status:        ${networkStatus}
Level of Care:         ${levelOfCare}
Days Authorized:       ${days}
Per Diem Rate:         ${currency.format(perDiem)}
Prior Authorization:   ${getText("priorAuth")}

COST SHARE DETAILS
───────────────────────────────────────────────────────────
Deductible Remaining:  ${currency.format(getNumber("deductible"))}
Out-of-Pocket Max:     ${currency.format(getNumber("oop"))}
Coinsurance:           ${getNumber("coinsurance")}%
Copay per Day:         ${currency.format(getNumber("copay"))}

BILLABLE SERVICES
───────────────────────────────────────────────────────────
${billables.map(s => 
  `${s.name} (${s.code})\n  Units: ${s.units} | Rate: ${currency.format(s.rate)} | Total: ${currency.format(s.rate * s.units)}`
).join('\n\n')}

FINANCIAL SUMMARY
═══════════════════════════════════════════════════════════
Total Allowed Amount:       ${currency.format(adjustedAllowed)}
Deductible Applied:         ${currency.format(deductibleApplied)}
Coinsurance Amount:         ${currency.format(coinsuranceAmount)}
Copay Amount:               ${currency.format(copayAmount)}

PATIENT RESPONSIBILITY:     ${currency.format(patientResponsibility)}
PAYER RESPONSIBILITY:       ${currency.format(payerResponsibility)}

═══════════════════════════════════════════════════════════
DISCLAIMER: This is an estimate for internal use only. 
Actual payment may vary based on payer adjudication.
═══════════════════════════════════════════════════════════
`;

  const blob = new Blob([exportText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `billing-analysis-${clientName.replace(/\s+/g, '-')}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

buildServices();
calculateBilling();
form.addEventListener("submit", analyzeBilling);
form.addEventListener("input", calculateBilling);
resetButton.addEventListener("click", resetForm);

const exportButton = document.getElementById("export");
exportButton.addEventListener("click", exportResults);
