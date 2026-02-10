const year = document.getElementById("year");
const leadForm = document.getElementById("lead-form");
const formStatus = document.getElementById("form-status");

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

if (leadForm && formStatus) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent =
      "Thanks — your request has been received. A treatment specialist will reach out shortly.";
    leadForm.reset();
  });
}
