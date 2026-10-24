/**
 * MindCare Mental Health Platform — Therapist Portal Controller
 * Controls Dr. Elena Rostova's clinical dashboard, schedule, SOAP notes, and availability.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const store = window.mindcareStore;
  const therapistData = store.getStore().therapistUser;

  // =========================================================================
  // 1. Therapist Dashboard Page
  // =========================================================================
  const timelineContainer = document.getElementById('therapistTodayTimeline');
  if (timelineContainer) {
    const apts = await MindCareAPI.appointments.getAll();
    const todayApts = apts.filter(a => a.date === 'Today');

    timelineContainer.innerHTML = todayApts.map(apt => `
      <div class="mc-card mc-card-sm mb-3">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div class="d-flex align-items-center gap-3">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                 class="mc-avatar" alt="${apt.patientName}">
            <div>
              <div class="d-flex align-items-center gap-2">
                <h6 class="fw-bold mb-0 text-dark">${apt.patientName}</h6>
                <span class="mc-badge mc-badge-lavender">29y</span>
                <span class="badge ${apt.status === 'confirmed' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill">
                  ${apt.status === 'confirmed' ? 'Ready to Join' : apt.status}
                </span>
              </div>
              <p class="text-muted small mb-0">${apt.focus}</p>
            </div>
          </div>
          <div class="text-end">
            <h6 class="fw-bold text-primary mb-0">${apt.time}</h6>
            <span class="text-muted small">${apt.duration}</span>
          </div>
        </div>

        <div class="mc-telehealth-banner mb-3 py-2 px-3 small">
          <span class="text-dark fw-semibold">
            <i class="bi ${apt.modality.includes('Telehealth') ? 'bi-shield-check text-primary' : 'bi-geo-alt text-success'} me-1"></i>
            ${apt.room}
          </span>
          <span class="badge bg-white text-muted border">Encrypted</span>
        </div>

        <div class="d-flex gap-2">
          ${apt.modality.includes('Telehealth') ? `
            <button class="btn btn-mc-primary btn-sm flex-grow-1 mc-launch-telehealth" data-session-title="${apt.focus}" data-doctor-name="Dr. Elena Rostova">
              <i class="bi bi-camera-video-fill me-1"></i> Start Session
            </button>
          ` : `
            <button class="btn btn-mc-secondary btn-sm flex-grow-1" onclick="MindCareUI.showToast('Notified patient in reception waiting area Room 3B', 'info')">
              <i class="bi bi-bell me-1"></i> Call to Room
            </button>
          `}
          <a href="therapist-session-notes.html?patient=${encodeURIComponent(apt.patientName)}" class="btn btn-mc-secondary btn-sm">
            <i class="bi bi-journal-medical me-1"></i> Chart
          </a>
        </div>
      </div>
    `).join('');
  }

  // Week strip interactive clicks
  document.querySelectorAll('.mc-week-day').forEach(day => {
    day.addEventListener('click', function() {
      document.querySelectorAll('.mc-week-day').forEach(d => d.classList.remove('active'));
      this.classList.add('active');
      MindCareUI.showToast(`Loaded clinical schedule for ${this.querySelector('.fw-bold')?.textContent || 'selected date'}`, 'info');
    });
  });

  // =========================================================================
  // 2. Therapist Appointments & Requests Page
  // =========================================================================
  const requestsContainer = document.getElementById('therapistPendingRequests');
  if (requestsContainer) {
    const apts = await MindCareAPI.appointments.getAll();
    const pending = apts.filter(a => a.status === 'pending');

    if (pending.length === 0) {
      requestsContainer.innerHTML = '<p class="text-muted small mb-0">No pending intake requests requiring clinician sign-off.</p>';
    } else {
      requestsContainer.innerHTML = pending.map(req => `
        <div class="mc-card mc-card-sm mb-3 border-start border-4 border-warning">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="mc-badge mc-badge-warning">Intake Request</span>
                <span class="text-muted small">${req.date} at ${req.time}</span>
              </div>
              <h6 class="fw-bold mb-1">${req.patientName}</h6>
              <p class="text-muted small mb-0">${req.focus} • ${req.notes || 'Awaiting initial triage'}</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-mc-primary btn-sm mc-accept-req-btn" data-id="${req.id}">
                <i class="bi bi-check-lg me-1"></i> Accept Intake
              </button>
              <button class="btn btn-outline-secondary btn-sm rounded-pill mc-decline-req-btn" data-id="${req.id}">
                Propose New Time
              </button>
            </div>
          </div>
        </div>
      `).join('');

      requestsContainer.querySelectorAll('.mc-accept-req-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          await MindCareAPI.appointments.updateStatus(id, 'confirmed');
          MindCareUI.showToast('Intake request accepted and calendar slot locked.', 'success');
          setTimeout(() => window.location.reload(), 500);
        });
      });

      requestsContainer.querySelectorAll('.mc-decline-req-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          MindCareUI.showToast('Alternative appointment times sent to patient intake portal.', 'info');
          this.closest('.mc-card').remove();
        });
      });
    }
  }

  // =========================================================================
  // 3. Clinical SOAP Notes Page
  // =========================================================================
  const soapForm = document.getElementById('mcSoapNotesForm');
  if (soapForm) {
    const patientParam = new URLSearchParams(window.location.search).get('patient');
    if (patientParam) {
      const titleSpan = document.getElementById('soapPatientTitle');
      if (titleSpan) titleSpan.textContent = decodeURIComponent(patientParam);
    }

    soapForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const saveBtn = soapForm.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Encrypting & Signing...';

      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="bi bi-shield-check me-2"></i> Save Encrypted SOAP Note';
        MindCareUI.showToast('Clinical progress note encrypted and appended to patient chart.', 'success');
        document.getElementById('soapDraftStatus').textContent = 'Signed & Locked: ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }, 600);
    });

    const exportPdfBtn = document.getElementById('btnExportSoapPdf');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        MindCareUI.showToast('Generating HIPAA-compliant PDF summary for clinical records...', 'info');
        setTimeout(() => window.print(), 800);
      });
    }
  }

  // =========================================================================
  // 4. Availability Configuration Page
  // =========================================================================
  const availForm = document.getElementById('mcAvailabilityForm');
  if (availForm) {
    availForm.addEventListener('submit', (e) => {
      e.preventDefault();
      MindCareUI.showToast('Clinical availability and buffer schedules successfully updated.', 'success');
    });
  }

  // =========================================================================
  // 5. Therapist Profile Page
  // =========================================================================
  const therapistProfileForm = document.getElementById('mcTherapistProfileForm');
  if (therapistProfileForm) {
    therapistProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      MindCareUI.showToast('Practitioner profile and clinical credentials updated.', 'success');
    });
  }
});
