// Mobile nav toggle — keeps aria-expanded in sync for screen readers
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
})();

// Contact form validation — errors are field-level, announced via role="alert",
// and focus moves to the first invalid field so keyboard users aren't stranded.
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");

  const rules = [
    {
      input: document.getElementById("name"),
      errorEl: document.getElementById("name-error"),
      fieldEl: document.getElementById("field-name"),
      validate: (v) => v.trim().length > 0,
    },
    {
      input: document.getElementById("email"),
      errorEl: document.getElementById("email-error"),
      fieldEl: document.getElementById("field-email"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    },
    {
      input: document.getElementById("message"),
      errorEl: document.getElementById("message-error"),
      fieldEl: document.getElementById("field-message"),
      validate: (v) => v.trim().length > 0,
    },
  ];

  function setFieldValid(rule) {
    rule.errorEl.hidden = true;
    rule.fieldEl.removeAttribute("data-invalid");
    rule.input.removeAttribute("aria-invalid");
  }

  function setFieldInvalid(rule) {
    rule.errorEl.hidden = false;
    rule.fieldEl.setAttribute("data-invalid", "true");
    rule.input.setAttribute("aria-invalid", "true");
  }

  rules.forEach((rule) => {
    rule.input.addEventListener("blur", () => {
      if (rule.validate(rule.input.value)) setFieldValid(rule);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let firstInvalid = null;

    rules.forEach((rule) => {
      const valid = rule.validate(rule.input.value);
      if (valid) {
        setFieldValid(rule);
      } else {
        setFieldInvalid(rule);
        if (!firstInvalid) firstInvalid = rule.input;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = "Please fix the highlighted fields before sending.";
      status.dataset.state = "error";
      return;
    }

    // No backend wired up — this is a static skeleton, so simulate success.
    status.textContent = "Message sent. Thanks for reaching out — I'll reply within a couple of days.";
    status.dataset.state = "success";
    form.reset();
  });
})();
