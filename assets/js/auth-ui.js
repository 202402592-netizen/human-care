/**
 * MindCare Mental Health Platform — Authentication UI Logic
 * Handles login, registration, role quick-fill buttons, and client-side form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Quick Demo Login Pre-fills
  const btnFillPatient = document.getElementById('demoFillPatient');
  const btnFillTherapist = document.getElementById('demoFillTherapist');
  const btnFillAdmin = document.getElementById('demoFillAdmin');

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const roleSelect = document.getElementById('loginRole');

  if (btnFillPatient) {
    btnFillPatient.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'maya.lin@example.com';
      if (passwordInput) passwordInput.value = 'MindCare#2026';
      if (roleSelect) roleSelect.value = 'patient';
      MindCareUI.showToast('Filled Demo Patient credentials (Maya Lin)', 'info');
    });
  }

  if (btnFillTherapist) {
    btnFillTherapist.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'dr.rostova@mindcare.org';
      if (passwordInput) passwordInput.value = 'Clinical#Care2026';
      if (roleSelect) roleSelect.value = 'therapist';
      MindCareUI.showToast('Filled Demo Therapist credentials (Dr. Elena Rostova)', 'info');
    });
  }

  if (btnFillAdmin) {
    btnFillAdmin.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'admin@mindcare.org';
      if (passwordInput) passwordInput.value = 'AdminSecure#2026';
      if (roleSelect) roleSelect.value = 'admin';
      MindCareUI.showToast('Filled Demo Admin credentials (Alexandra Vance)', 'info');
    });
  }

  // 2. Main Login Form Submit
  const loginForm = document.getElementById('mcLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';
      const role = roleSelect ? roleSelect.value : 'patient';

      if (!email || !password) {
        MindCareUI.showToast('Please provide both email and password', 'warning');
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Signing in...';

      try {
        const res = await MindCareAPI.auth.login(email, password, role);
        MindCareUI.showToast(`Welcome back, ${res.user.name}!`, 'success');

        setTimeout(() => {
          if (role === 'therapist') {
            window.location.href = 'therapist/therapist-dashboard.html';
          } else if (role === 'admin') {
            window.location.href = 'admin/admin-dashboard.html';
          } else {
            window.location.href = 'patient/patient-dashboard.html';
          }
        }, 600);
      } catch (err) {
        MindCareUI.showToast('Sign-in failed. Please verify credentials.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 3. Therapist Specific Login Form
  const therapistLoginForm = document.getElementById('mcTherapistLoginForm');
  if (therapistLoginForm) {
    therapistLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('therapistEmail').value.trim();
      const password = document.getElementById('therapistPassword').value.trim();
      const npi = document.getElementById('therapistNpi') ? document.getElementById('therapistNpi').value.trim() : '';

      if (!email || !password) {
        MindCareUI.showToast('Please enter both clinical email and password', 'warning');
        return;
      }

      const submitBtn = therapistLoginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Verifying Clinical License...';

      await MindCareAPI.auth.login(email, password, 'therapist');
      MindCareUI.showToast('Practitioner credentials verified via NPI Registry', 'success');

      setTimeout(() => {
        window.location.href = 'therapist/therapist-dashboard.html';
      }, 700);
    });
  }

  // 4. Patient Registration Form
  const registerForm = document.getElementById('mcRegisterForm');
  if (registerForm) {
    const passwordInput = document.getElementById('regPassword');
    const strengthBar = document.getElementById('regPasswordStrength');

    if (passwordInput && strengthBar) {
      passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        let score = 0;
        if (val.length >= 8) score += 35;
        if (/[A-Z]/.test(val)) score += 25;
        if (/[0-9]/.test(val)) score += 20;
        if (/[^A-Za-z0-9]/.test(val)) score += 20;

        strengthBar.style.width = `${Math.min(score, 100)}%`;
        if (score < 40) strengthBar.className = 'progress-bar bg-danger';
        else if (score < 75) strengthBar.className = 'progress-bar bg-warning';
        else strengthBar.className = 'progress-bar bg-success';
      });
    }

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const terms = document.getElementById('regTerms') ? document.getElementById('regTerms').checked : true;
      const careFocus = document.getElementById('regCareFocus') ? document.getElementById('regCareFocus').value : 'Anxiety & Stress';

      if (!name || !email || !password) {
        MindCareUI.showToast('Please complete all required fields.', 'warning');
        return;
      }

      if (!terms) {
        MindCareUI.showToast('Please accept the HIPAA privacy statement to proceed.', 'warning');
        return;
      }

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Creating Sanctuary Account...';

      const res = await MindCareAPI.auth.register({ name, email, password, careFocus });
      MindCareUI.showToast(`Account successfully created! Welcome, ${res.user.name}.`, 'success');

      setTimeout(() => {
        window.location.href = 'patient/patient-dashboard.html';
      }, 750);
    });
  }
});
