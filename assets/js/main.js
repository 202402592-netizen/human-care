/**
 * MindCare Mental Health Platform — Main UI & Interaction Engine
 * Handles navigation, interactive demo switching, toasts, crisis modals,
 * password toggles, and shared client-side components.
 */

const MindCareUI = {
  /**
   * Display a floating, non-intrusive toast notification
   */
  showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('mcToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mcToastContainer';
      container.className = 'mc-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `mc-toast ${type}`;

    let icon = 'bi-info-circle';
    if (type === 'success') icon = 'bi-check-circle-fill';
    if (type === 'warning') icon = 'bi-exclamation-triangle-fill';
    if (type === 'danger') icon = 'bi-x-circle-fill';

    toast.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <i class="bi ${icon} fs-5"></i>
        <span class="fw-semibold text-dark" style="font-size: 0.9rem;">${message}</span>
      </div>
      <button type="button" class="btn-close" style="font-size: 0.75rem;" aria-label="Close"></button>
    `;

    const closeBtn = toast.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => toast.remove());

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Setup password visibility toggles
   */
  setupPasswordToggles() {
    document.querySelectorAll('.mc-toggle-password').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = this.querySelector('i');
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('bi-eye', 'bi-eye-slash');
          } else {
            input.type = 'password';
            icon.classList.replace('bi-eye-slash', 'bi-eye');
          }
        }
      });
    });
  },

  /**
   * Render Demo Top Switcher Bar on every page for easy grading and role switching
   */
  initDemoBar() {
    const isSubdir = window.location.pathname.includes('/patient/') || 
                     window.location.pathname.includes('/therapist/') || 
                     window.location.pathname.includes('/admin/');
    const basePath = isSubdir ? '../' : './';

    const currentRole = (window.mindcareStore && window.mindcareStore.getCurrentUser().role) || 'patient';

    const bar = document.createElement('div');
    bar.className = 'mc-demo-bar d-flex justify-content-between align-items-center flex-wrap gap-2';
    bar.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-white text-dark py-1 px-2 fw-bold" style="font-size: 0.7rem;">MINDCARE DEMO</span>
        <span class="d-none d-md-inline" style="opacity: 0.9;">Role Simulation Switcher:</span>
      </div>
      <div class="d-flex align-items-center gap-1 flex-wrap">
        <a href="${basePath}index.html" class="demo-link ${!isSubdir ? 'active' : ''}">
          <i class="bi bi-globe"></i> Public
        </a>
        <a href="${basePath}patient/patient-dashboard.html" class="demo-link ${window.location.pathname.includes('/patient/') ? 'active' : ''}" onclick="window.mindcareStore.setCurrentRole('patient')">
          <i class="bi bi-person-heart"></i> Patient
        </a>
        <a href="${basePath}therapist/therapist-dashboard.html" class="demo-link ${window.location.pathname.includes('/therapist/') ? 'active' : ''}" onclick="window.mindcareStore.setCurrentRole('therapist')">
          <i class="bi bi-clipboard2-pulse"></i> Therapist
        </a>
        <a href="${basePath}admin/admin-dashboard.html" class="demo-link ${window.location.pathname.includes('/admin/') ? 'active' : ''}" onclick="window.mindcareStore.setCurrentRole('admin')">
          <i class="bi bi-shield-lock"></i> Admin
        </a>
        <button id="mcResetDemoBtn" class="ms-2" title="Reset all demo data to default">
          <i class="bi bi-arrow-counterclockwise"></i> Reset
        </button>
      </div>
    `;

    document.body.insertBefore(bar, document.body.firstChild);

    document.getElementById('mcResetDemoBtn').addEventListener('click', () => {
      if (confirm('Reset all demo data (appointments, mock articles, check-ins) to initial state?')) {
        window.mindcareStore.resetToDefaults();
        MindCareUI.showToast('Demo data reset to factory defaults', 'success');
        setTimeout(() => window.location.reload(), 400);
      }
    });
  },

  /**
   * Setup Emergency Hotline Modal
   */
  setupEmergencyModal() {
    const modalHtml = `
      <div class="modal fade" id="mcEmergencyModal" tabindex="-1" aria-labelledby="emergencyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0">
            <div class="modal-header bg-danger-subtle border-0">
              <h5 class="modal-title text-danger fw-bold d-flex align-items-center gap-2" id="emergencyModalLabel">
                <i class="bi bi-shield-fill-exclamation fs-4"></i> Urgent Crisis & Safety Support
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
              <p class="text-dark fw-semibold mb-3">
                If you or someone you know is in immediate danger, having thoughts of self-harm, or experiencing a psychiatric crisis, compassionate free help is available 24/7:
              </p>
              
              <div class="mc-card bg-light p-3 mb-3 border-start border-4 border-danger">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="fw-bold mb-1 text-dark">Suicide & Crisis Lifeline</h6>
                    <p class="mb-0 small text-muted">Free, confidential 24/7 call and text support</p>
                  </div>
                  <a href="tel:988" class="btn btn-danger fw-bold rounded-pill px-3 py-1">
                    <i class="bi bi-telephone-fill me-1"></i> Call 988
                  </a>
                </div>
              </div>

              <div class="mc-card bg-light p-3 mb-3 border-start border-4 border-primary">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="fw-bold mb-1 text-dark">Crisis Text Line</h6>
                    <p class="mb-0 small text-muted">Text with a trained crisis counselor</p>
                  </div>
                  <span class="badge bg-secondary rounded-pill px-3 py-2 fs-6">Text HOME to 741741</span>
                </div>
              </div>

              <div class="mc-card bg-light p-3 border-start border-4 border-success">
                <h6 class="fw-bold mb-1 text-dark"><i class="bi bi-flower1 text-success me-1"></i> 60-Second Calming Grounding</h6>
                <p class="small text-muted mb-2">Feel your feet firmly on the floor. Inhale slowly for 4 seconds... pause... and exhale for 6 seconds.</p>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 bg-light">
              <button type="button" class="btn btn-mc-secondary w-100" data-bs-dismiss="modal">I am safe for now</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Bind all emergency links
    document.querySelectorAll('.mc-crisis-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = new bootstrap.Modal(document.getElementById('mcEmergencyModal'));
        modal.show();
      });
    });
  },

  /**
   * Booking Confirmed Modal (Matches Screen 1)
   */
  showBookingConfirmedModal(details = {}) {
    let modal = document.getElementById('mcBookingConfirmedModal');
    if (!modal) {
      const html = `
        <div class="modal fade" id="mcBookingConfirmedModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-xl" style="border-radius: 28px;">
              <div class="modal-body p-4 p-md-5 text-center">
                <!-- Icon badge -->
                <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 64px; height: 64px; background: #ede0f7; color: #704c91;">
                  <i class="bi bi-check-circle-fill fs-2"></i>
                </div>
                <h3 class="fw-bold text-dark mb-1">Booking Confirmed!</h3>
                <p class="text-muted small mb-4">Appointment successfully scheduled with <span id="confDoctorName">Dr. Elena Rostova</span></p>

                <!-- Patient & Session summary card -->
                <div class="mc-card text-start p-3 mb-4 bg-light border-0" style="border-radius: 20px;">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                         class="mc-avatar mc-avatar-sm" alt="Maya Lin">
                    <div>
                      <h6 class="fw-bold text-dark mb-0">Maya Lin <span class="mc-badge mc-badge-lavender ms-1" style="font-size: 0.7rem;">29y</span></h6>
                      <span class="text-muted" style="font-size: 0.75rem;">ID: #HC-8821 • Anxiety & Sleep Hygiene</span>
                    </div>
                  </div>

                  <div class="small text-muted mb-2">
                    <i class="bi bi-calendar3 text-primary me-2"></i>
                    <strong class="text-dark" id="confDateTime">Wednesday, Oct 24, 2026 • 11:30 AM (45 Min)</strong>
                  </div>

                  <div class="small text-muted mb-2">
                    <i class="bi bi-camera-video text-primary me-2"></i>
                    <strong class="text-dark" id="confModality">Telehealth Video</strong>
                    <span class="badge bg-white text-muted border ms-1" style="font-size: 0.68rem;">Encrypted Room</span>
                  </div>

                  <div class="small text-muted mb-3">
                    <i class="bi bi-compass text-primary me-2"></i>
                    <span>CBT & Mindfulness Protocol (Session 7 of 8 • Core Intervention)</span>
                  </div>

                  <div class="d-flex flex-wrap gap-1 pt-2 border-top">
                    <span class="badge bg-white text-success border" style="font-size: 0.72rem;"><i class="bi bi-check2 me-1"></i>SMS & Email Sent</span>
                    <span class="badge bg-white text-success border" style="font-size: 0.72rem;"><i class="bi bi-check2 me-1"></i>Calendar Synced</span>
                    <span class="badge bg-white text-primary border" style="font-size: 0.72rem;"><i class="bi bi-check2 me-1"></i>Pre-Session GAD-7</span>
                  </div>
                </div>

                <div class="d-grid gap-2 mb-3">
                  <a href="patient-appointments.html" class="btn btn-mc-primary py-2 fw-bold" id="confViewScheduleBtn">
                    <i class="bi bi-calendar-event me-2"></i> View Appointment in Schedule
                  </a>
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-mc-secondary btn-sm flex-grow-1" onclick="MindCareUI.showToast('Calendar .ics invite saved.', 'info')">
                      <i class="bi bi-calendar-plus me-1"></i> Add to Calendar
                    </button>
                    <button type="button" class="btn btn-mc-secondary btn-sm flex-grow-1" onclick="navigator.clipboard?.writeText('https://mindcare.org/room/mc-8821'); MindCareUI.showToast('Encrypted room link copied!', 'info');">
                      <i class="bi bi-clipboard me-1"></i> Copy Room Link
                    </button>
                  </div>
                </div>

                <a href="patient-dashboard.html" class="small text-muted text-decoration-none d-block mb-3">
                  Back to Dashboard
                </a>

                <div class="small text-muted" style="font-size: 0.72rem;">
                  <i class="bi bi-shield-lock-fill text-success me-1"></i> HIPAA Encrypted & Audit Logged
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', html);
      modal = document.getElementById('mcBookingConfirmedModal');
    }

    if (details.doctor) document.getElementById('confDoctorName').textContent = details.doctor;
    if (details.dateTime) document.getElementById('confDateTime').textContent = details.dateTime;
    if (details.modality) document.getElementById('confModality').textContent = details.modality;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  },

  /**
   * Active Telehealth Simulator Experience (Matches Screen 2)
   */
  openTelehealthSimulator(sessionTitle = 'Clinical Consultation', clinicianName = 'Dr. Elena Rostova') {
    let modal = document.getElementById('mcTelehealthModal');
    if (!modal) {
      const html = `
        <div class="modal fade" id="mcTelehealthModal" data-bs-backdrop="static" tabindex="-1">
          <div class="modal-dialog modal-fullscreen-lg-down modal-xl modal-dialog-centered">
            <div class="modal-content bg-white border-0 shadow-2xl overflow-hidden" style="border-radius: 28px;">
              <!-- Header Bar -->
              <div class="modal-header border-bottom py-2 px-4 d-flex justify-content-between align-items-center bg-light">
                <div class="d-flex align-items-center gap-3">
                  <div class="mc-brand-logo" style="width: 32px; height: 32px; font-size: 1rem;"><i class="bi bi-camera-video-fill"></i></div>
                  <div>
                    <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                      Active Telehealth Session
                      <span class="mc-badge mc-badge-success py-1" style="font-size: 0.68rem;">HIPAA Encrypted</span>
                    </h6>
                    <span class="text-muted" style="font-size: 0.72rem;">Session 7 of 8: CBT & Mindfulness • 23:42 / 45:00</span>
                  </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <!-- Main Split Canvas: Left Video Feed, Right Clinical Sidecar -->
              <div class="modal-body p-4 bg-light">
                <div class="row g-4">
                  <!-- Video Area -->
                  <div class="col-lg-7">
                    <div class="mc-video-wrapper position-relative">
                      <!-- Patient Main Stream (Maya Lin) -->
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
                           class="mc-video-patient-feed" alt="Maya Lin">

                      <!-- Top Status Chips -->
                      <div class="position-absolute top-0 start-0 m-3 d-flex gap-2">
                        <span class="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-2 small">
                          <i class="bi bi-soundwave text-success me-1"></i> Maya Lin (Patient) • Crisp Audio
                        </span>
                        <span class="badge bg-dark bg-opacity-75 text-white rounded-pill px-2 py-2 small">
                          <i class="bi bi-wifi text-success me-1"></i> HD
                        </span>
                      </div>

                      <div class="position-absolute bottom-0 start-0 m-3">
                        <span class="badge bg-primary rounded-pill px-3 py-2 small shadow">
                          <i class="bi bi-flower1 me-1"></i> Steady breathing rate
                        </span>
                      </div>

                      <!-- Clinician PiP Inset (Dr. Rostova) -->
                      <div class="mc-video-pip">
                        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80" alt="Dr. Rostova">
                        <span class="position-absolute bottom-0 start-0 ms-1 mb-1 badge bg-dark bg-opacity-75" style="font-size: 0.65rem;">● Dr. Rostova</span>
                      </div>
                    </div>

                    <!-- Floating Call Bar -->
                    <div class="text-center mt-3">
                      <div class="mc-telehealth-callbar">
                        <button type="button" class="mc-call-btn" id="mcToggleMic" title="Mute Microphone">
                          <i class="bi bi-mic-fill"></i>
                        </button>
                        <button type="button" class="mc-call-btn" id="mcToggleCam" title="Turn Camera Off">
                          <i class="bi bi-camera-video-fill"></i>
                        </button>
                        <button type="button" class="mc-call-btn" onclick="MindCareUI.showToast('Screen share request sent.', 'info')" title="Share Screen">
                          <i class="bi bi-display"></i>
                        </button>
                        <button type="button" class="mc-call-btn" onclick="MindCareUI.showToast('Opened private clinical notes tab.', 'info')" title="Session Notes">
                          <i class="bi bi-journal-text"></i>
                        </button>
                        <button type="button" class="mc-call-btn end-call" id="mcEndCallBtn">
                          <i class="bi bi-telephone-x-fill"></i> End Call
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Right Sidecar: Clinical Metrics & Live SOAP -->
                  <div class="col-lg-5">
                    <!-- Quick Metrics 2-Up -->
                    <div class="row g-2 mb-3">
                      <div class="col-6">
                        <div class="mc-card mc-card-sm p-3 bg-white h-100">
                          <span class="text-muted small d-block">GAD-7 Baseline</span>
                          <div class="d-flex align-items-center gap-2">
                            <span class="fw-bold text-dark fs-4">8</span>
                            <span class="badge bg-warning-subtle text-warning-emphasis rounded-pill small">Mild (-4 pts)</span>
                          </div>
                          <span class="text-success small" style="font-size: 0.72rem;">Significant reduction</span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="mc-card mc-card-sm p-3 bg-white h-100">
                          <span class="text-muted small d-block">Clinical Focus</span>
                          <strong class="text-dark small d-block">Thought Reframing</strong>
                          <span class="text-primary small" style="font-size: 0.72rem;"><i class="bi bi-check2-circle me-1"></i>2 of 3 met</span>
                        </div>
                      </div>
                    </div>

                    <!-- Live Clinical Notes Tab -->
                    <div class="mc-card p-3 bg-white mb-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold text-dark small"><i class="bi bi-pencil-square text-primary me-1"></i> Subjective & Objective Notes</span>
                        <span class="badge bg-light text-muted border" style="font-size: 0.68rem;">Auto-saved 1m ago</span>
                      </div>
                      <textarea id="liveSessionNotesInput" class="form-control small mb-2" rows="4">Patient reports improved sleep latency (down to ~25 min) with evening journaling. Demonstrates grounded somatic posture during 4-7-8 rhythm.</textarea>
                      
                      <button type="button" class="btn btn-mc-secondary btn-sm w-100" id="btnPushBreathGuide">
                        <i class="bi bi-flower1 text-primary me-1"></i> Push 4-7-8 Breath Guide to Maya
                      </button>
                    </div>

                    <!-- Quick Agenda Checklist -->
                    <div class="mc-card mc-card-sm bg-white p-3">
                      <span class="fw-bold text-dark small d-block mb-2">Session 7 Agenda Items</span>
                      <div class="form-check small mb-1">
                        <input class="form-check-input" type="checkbox" checked id="chk1">
                        <label class="form-check-label" for="chk1">Review weekly sleep latency trend</label>
                      </div>
                      <div class="form-check small mb-1">
                        <input class="form-check-input" type="checkbox" checked id="chk2">
                        <label class="form-check-label" for="chk2">Decatastrophize Tuesday standup trigger</label>
                      </div>
                      <div class="form-check small">
                        <input class="form-check-input" type="checkbox" id="chk3">
                        <label class="form-check-label" for="chk3">Prescribe 3-column CBT homework</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', html);
      modal = document.getElementById('mcTelehealthModal');

      // Setup button toggles
      const micBtn = document.getElementById('mcToggleMic');
      micBtn.addEventListener('click', () => {
        const icon = micBtn.querySelector('i');
        icon.classList.toggle('bi-mic-fill');
        icon.classList.toggle('bi-mic-mute-fill');
        micBtn.classList.toggle('btn-danger');
      });

      const camBtn = document.getElementById('mcToggleCam');
      camBtn.addEventListener('click', () => {
        const icon = camBtn.querySelector('i');
        icon.classList.toggle('bi-camera-video-fill');
        icon.classList.toggle('bi-camera-video-off-fill');
        camBtn.classList.toggle('btn-danger');
      });

      document.getElementById('btnPushBreathGuide').addEventListener('click', () => {
        MindCareUI.showToast('4-7-8 Calming Breathwork Guide pushed to Maya Lin\'s portal.', 'success');
      });

      document.getElementById('mcEndCallBtn').addEventListener('click', () => {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
        MindCareUI.showToast('Session concluded. Opening Post-Session Clinical Summary...', 'info');
        const isSubdir = window.location.pathname.includes('/therapist/') || window.location.pathname.includes('/patient/') || window.location.pathname.includes('/admin/');
        const targetUrl = isSubdir ? '../therapist/post-session-summary.html' : 'therapist/post-session-summary.html';
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 800);
      });
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  },

  /**
   * Screen 4 & Drawer: Open the Clinical Voice Anchor Drawer (Matches Screen Voice Drawer)
   */
  openVoiceAnchorDrawer(patientName = 'Maya Lin', patientId = 'HC-8821') {
    let drawerEl = document.getElementById('mcVoiceAnchorDrawer');
    if (!drawerEl) {
      drawerEl = document.createElement('div');
      drawerEl.id = 'mcVoiceAnchorDrawer';
      drawerEl.className = 'modal fade';
      drawerEl.tabIndex = -1;
      drawerEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered" style="max-width: 580px;">
          <div class="modal-content border-0 shadow-lg" style="border-radius: 24px; background: #fff7fd;">
            <div class="modal-header border-0 pb-0 pt-3 px-4 d-flex justify-content-between align-items-center">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <div class="text-center flex-grow-1">
                <h6 class="fw-bold text-dark mb-0">Clinical Session Drawer</h6>
                <span class="text-muted small">${patientName} • #${patientId}</span>
              </div>
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80" 
                   class="mc-avatar mc-avatar-sm" alt="Dr. Rostova">
            </div>

            <div class="modal-body p-4 pt-2">
              <!-- Top Pill -->
              <div class="text-center my-2">
                <span class="mc-badge mc-badge-lavender py-1 px-3">
                  <i class="bi bi-circle-fill text-primary me-1" style="font-size: 6px;"></i> CLINICAL VOICE ANCHOR • Dr. Elena Rostova, PsyD
                </span>
              </div>

              <!-- Trigger Card -->
              <div class="mc-card p-3 mb-3 bg-white border border-light-subtle">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <span class="fw-bold text-dark small">${patientName} <span class="badge bg-light text-primary border ms-1">#${patientId}</span></span>
                  <span class="badge bg-primary-subtle text-primary rounded-pill small"><i class="bi bi-flower1 me-1"></i>Session 7 Follow-up</span>
                </div>
                <div class="small text-muted d-flex align-items-start gap-2 mt-2">
                  <i class="bi bi-shield-check text-primary mt-1"></i>
                  <span>Triggered after <strong>4-7-8 Breathwork & CBT Log completion</strong>. Vagal Brake Cycle 3 confirmed via biometric telemetry drop (-12 bpm).</span>
                </div>
              </div>

              <!-- Suggested Clinical Anchors -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small fw-bold text-dark"><i class="bi bi-lightbulb text-warning me-1"></i> Suggested Clinical Anchors</span>
                  <span class="badge bg-light text-muted small">30-60s Target</span>
                </div>
                <div class="d-flex gap-2 flex-wrap mb-2">
                  <span class="badge bg-primary text-white py-1 px-3 rounded-pill small cursor-pointer"><i class="bi bi-check2 me-1"></i> Validate Cycle 3 Vagal Shift</span>
                  <span class="badge bg-white text-dark border py-1 px-3 rounded-pill small cursor-pointer"><i class="bi bi-sparkles text-warning me-1"></i> Celebrate Standup Reframe</span>
                </div>
                <div class="p-2 bg-light rounded-3 small text-muted" style="font-size: 0.78rem;">
                  <i class="bi bi-stars text-primary me-1"></i> Short, warm audio praise notes within 2 hours increase homework retention by <strong>74%</strong> and deepen autonomic safety pathways.
                </div>
              </div>

              <!-- Audio Recording Widget -->
              <div class="mc-card p-3 mb-3 bg-white text-center">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="d-flex align-items-center gap-2">
                    <span class="mc-rec-pulse"></span>
                    <strong class="text-danger small">Recording Active</strong>
                    <span class="badge bg-light text-muted border small"><i class="bi bi-soundwave me-1"></i>Vocal DSP Isolator ON</span>
                  </div>
                  <span class="small text-muted"><i class="bi bi-arrow-repeat me-1"></i>Capturing biometrics</span>
                </div>

                <div class="fs-2 fw-bold text-dark my-1" id="mcVoiceTimer">00:38 <span class="text-muted fs-6 fw-normal">/ 01:00 max</span></div>

                <!-- Animated Waveform Bars -->
                <div class="d-flex align-items-center justify-content-center gap-1 my-3" style="height: 48px;">
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 18px; animation: mcWave 1s infinite alternate 0.1s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 28px; animation: mcWave 1.2s infinite alternate 0.3s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 14px; animation: mcWave 0.9s infinite alternate 0.2s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 42px; animation: mcWave 1.4s infinite alternate 0.4s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 32px; animation: mcWave 1.1s infinite alternate 0.1s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 20px; animation: mcWave 0.8s infinite alternate 0.5s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 38px; animation: mcWave 1.3s infinite alternate 0.2s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 46px; animation: mcWave 1.5s infinite alternate 0.3s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 26px; animation: mcWave 0.9s infinite alternate 0.4s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 34px; animation: mcWave 1.2s infinite alternate 0.1s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 16px; animation: mcWave 1.0s infinite alternate 0.3s;"></div>
                  <div class="bg-primary rounded-pill" style="width: 4px; height: 10px; animation: mcWave 0.8s infinite alternate 0.2s;"></div>
                </div>

                <!-- Control Buttons -->
                <div class="d-flex justify-content-center align-items-center gap-3">
                  <button type="button" class="btn btn-outline-secondary btn-sm rounded-circle p-2" style="width: 40px; height: 40px;" title="Discard" onclick="MindCareUI.showToast('Discarded draft voice anchor.', 'info');">
                    <i class="bi bi-trash"></i>
                  </button>
                  <button type="button" class="btn btn-mc-primary rounded-circle p-2" style="width: 52px; height: 52px;" id="mcBtnVoicePause" onclick="const icon = this.querySelector('i'); if(icon.classList.contains('bi-pause-fill')){ icon.classList.replace('bi-pause-fill', 'bi-play-fill'); MindCareUI.showToast('Voice recording paused', 'info'); } else { icon.classList.replace('bi-play-fill', 'bi-pause-fill'); MindCareUI.showToast('Voice recording resumed', 'info'); }">
                    <i class="bi bi-pause-fill fs-4"></i>
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm rounded-circle p-2" style="width: 40px; height: 40px;" title="Preview" onclick="MindCareUI.showToast('Previewing encrypted audio anchor stream...', 'info');">
                    <i class="bi bi-play-fill"></i>
                  </button>
                </div>
              </div>

              <!-- Encrypted Live Audio Transcript -->
              <div class="mc-card p-3 mb-3 bg-white">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small fw-bold text-dark"><i class="bi bi-file-earmark-music text-primary me-1"></i> Encrypted Live Audio Transcript</span>
                  <span class="badge bg-light text-primary border small">FHIR Audio</span>
                </div>
                <p class="small text-plum mb-2 fst-italic" style="line-height: 1.55; background: #fff7fd; padding: 10px; border-radius: 8px;">
                  “Maya, I just reviewed your telemetry from this morning's 4-7-8 practice. Seeing your heart rate drop 12 bpm right at cycle 3 while your vagal brake engaged was remarkable. When you take this steady, grounded sensation into your 10:00 AM standup, remember that your body already knows how to return to calm. I am so proud of your commitment today.”
                </p>
                <div class="d-flex justify-content-between align-items-center pt-1 border-top small">
                  <a href="#" class="text-decoration-none text-muted" onclick="event.preventDefault(); MindCareUI.showToast('Transcript editor activated.', 'info');"><i class="bi bi-pencil me-1"></i>Edit Transcript</a>
                  <span class="text-success"><i class="bi bi-tag-fill me-1"></i>Add CBT Tag 98.4% Confidence</span>
                </div>
              </div>

              <!-- Care Routing & Permissions -->
              <div class="mc-card p-3 mb-3 bg-white">
                <span class="small fw-bold text-dark d-block mb-2"><i class="bi bi-sliders2 text-primary me-1"></i> Care Routing & Permissions</span>
                <div class="d-flex flex-column gap-2 small">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="d-block text-dark">Maya's Companion App</strong>
                      <span class="text-muted" style="font-size: 0.76rem;">Appears on 'Daily Somatic Exercises' banner</span>
                    </div>
                    <i class="bi bi-lock-fill text-muted"></i>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="d-block text-dark">Gentle Haptic Push Alert</strong>
                      <span class="text-muted" style="font-size: 0.76rem;">"Dr. Elena sent you a clinical audio anchor"</span>
                    </div>
                    <div class="form-check form-switch m-0">
                      <input class="form-check-input" type="checkbox" checked>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="d-block text-dark">Attach to Session 7 EHR</strong>
                      <span class="text-muted" style="font-size: 0.76rem;">Automatic HL7 FHIR v4 Observation writeback</span>
                    </div>
                    <div class="form-check form-switch m-0">
                      <input class="form-check-input" type="checkbox" checked>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="d-block text-dark">Allow Gratitude Reaction</strong>
                      <span class="text-muted" style="font-size: 0.76rem;">Maya can send a 1-tap "Anchored & Ready" reply</span>
                    </div>
                    <div class="form-check form-switch m-0">
                      <input class="form-check-input" type="checkbox" checked>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Send Button -->
              <button type="button" class="btn btn-mc-primary w-100 py-3 fw-bold rounded-pill" id="mcBtnSendVoiceAnchor" onclick="bootstrap.Modal.getInstance(document.getElementById('mcVoiceAnchorDrawer')).hide(); MindCareUI.showToast('Clinical Voice Anchor dispatched to Maya Lin Companion App.', 'success');">
                <i class="bi bi-send-fill me-2"></i> Send Voice Anchor to Maya
              </button>
              <div class="text-center text-muted mt-2" style="font-size: 0.72rem;">
                <i class="bi bi-shield-lock-fill me-1"></i> 256-Bit Encrypted Somatic Voice Note • HL7 FHIR Compliant
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawerEl);
    }

    const modal = new bootstrap.Modal(drawerEl);
    modal.show();
  },

  /**
   * Notifications Center Modal
   */
  openNotifications() {
    let notifEl = document.getElementById('mcNotificationsModal');
    if (!notifEl) {
      notifEl = document.createElement('div');
      notifEl.id = 'mcNotificationsModal';
      notifEl.className = 'modal fade';
      notifEl.tabIndex = -1;
      document.body.appendChild(notifEl);
    }

    const notifs = window.mindcareState ? window.mindcareState.getNotifications() : [];
    const isSubdir = window.location.pathname.includes('/patient/') || 
                     window.location.pathname.includes('/therapist/') || 
                     window.location.pathname.includes('/admin/');
    const basePath = isSubdir ? '../' : './';

    notifEl.innerHTML = `
      <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" style="max-width: 480px;">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 24px;">
          <div class="modal-header border-0 pb-0 pt-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 class="fw-bold text-dark mb-0">Notifications Center</h5>
              <span class="text-muted small" style="font-size: 0.75rem;">Simulated in-memory demo updates</span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body p-3">
            <div class="d-flex justify-content-between align-items-center px-2 mb-2 pb-2 border-bottom">
              <span class="small text-muted fw-semibold">${notifs.filter(n => n.unread).length} Unread</span>
              <button type="button" class="btn btn-link btn-sm text-primary text-decoration-none p-0 fw-semibold" id="btnMarkAllNotifsRead">
                <i class="bi bi-check2-all me-1"></i> Mark All as Read
              </button>
            </div>

            <div class="d-flex flex-column gap-2" id="notifListContainer">
              ${notifs.map(n => `
                <div class="p-3 rounded-3 mc-notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}" onclick="MindCareUI.handleNotificationClick('${n.id}', '${n.link}')">
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <strong class="text-dark small d-flex align-items-center gap-2">
                      ${n.unread ? '<span class="mc-notif-dot"></span>' : ''}
                      ${n.title}
                    </strong>
                    <span class="text-muted small" style="font-size: 0.7rem;">${n.time}</span>
                  </div>
                  <p class="text-muted small mb-0" style="font-size: 0.78rem; line-height: 1.4;">${n.body}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="modal-footer border-0 pt-0 pb-3 px-4 text-center">
            <span class="text-muted small w-100" style="font-size: 0.72rem;">
              <i class="bi bi-info-circle me-1"></i> Temporary non-persisted frontend notifications
            </span>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnMarkAllNotifsRead')?.addEventListener('click', () => {
      window.mindcareState.markAllNotificationsRead();
      MindCareUI.updateNotificationBadges();
      MindCareUI.openNotifications(); // re-render
      MindCareUI.showToast('All notifications marked as read.', 'info');
    });

    const modal = new bootstrap.Modal(notifEl);
    modal.show();
  },

  handleNotificationClick(id, link) {
    if (window.mindcareState) {
      window.mindcareState.markNotificationRead(id);
      MindCareUI.updateNotificationBadges();
    }
    const bsModal = bootstrap.Modal.getInstance(document.getElementById('mcNotificationsModal'));
    if (bsModal) bsModal.hide();
    if (link) {
      const isSubdir = window.location.pathname.includes('/patient/') || 
                       window.location.pathname.includes('/therapist/') || 
                       window.location.pathname.includes('/admin/');
      const target = link.startsWith('patient/') && isSubdir ? link.replace('patient/', '') : link;
      window.location.href = target;
    }
  },

  updateNotificationBadges() {
    const unread = window.mindcareState ? window.mindcareState.getUnreadCount() : 0;
    document.querySelectorAll('.badge.bg-danger').forEach(badge => {
      if (badge.parentElement && badge.parentElement.querySelector('.bi-bell')) {
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'inline-block' : 'none';
      }
    });
  },

  /**
   * AI Wellness Companion Response Simulator
   */
  getAIResponse(userText) {
    const text = userText.toLowerCase();

    if (text.includes('panic') || text.includes('anxious') || text.includes('anxiety') || text.includes('overwhelm') || text.includes('scared')) {
      return "I hear how intense this feels right now. Let's take a pause together. Your nervous system is in a high-arousal sympathetic state, which makes your body feel under threat even when you are physically safe. Place both feet firmly on the ground, drop your shoulders away from your ears, and try one 4-second inhale followed by a long, 8-second exhale. Would you like me to open the 4-7-8 Breathwork Pacer with you?";
    }
    if (text.includes('sleep') || text.includes('awake') || text.includes('insomnia') || text.includes('tired')) {
      return "Restlessness at night can feel very lonely. A cornerstone of CBT-I (Cognitive Behavioral Therapy for Insomnia) is removing pressure to fall asleep immediately. If you have been awake in bed for more than 20 minutes, consider getting up, keeping lights dim, sipping warm water, and avoiding screens. Remember: resting quietly with soft eyes still rejuvenates your nervous system.";
    }
    if (text.includes('reframe') || text.includes('thought') || text.includes('spiral') || text.includes('catastrophe') || text.includes('impostor')) {
      return "That sounds like a classic catastrophic thought loop. Let's examine it with gentle curiosity: What is the hard evidence supporting this fear? And what is the objective counter-evidence from your past experience? You might find our 3-Column Decatastrophizing tool really helpful for writing this down step-by-step.";
    }
    if (text.includes('burnout') || text.includes('work') || text.includes('boss') || text.includes('standup') || text.includes('meeting')) {
      return "Workplace exhaustion is often prolonged nervous system dysregulation in an unsustainable setting. Remember that saying 'I need time to review this' is a legitimate boundary. What is one small demand you can decline or delegate today to protect your peace?";
    }
    if (text.includes('ground') || text.includes('breathing') || text.includes('exercise')) {
      return "Let's do the 5-4-3-2-1 Sensory Grounding exercise right now: Notice 5 things you can see around the room, 4 things you can physically feel (like your chair or clothing), 3 sounds you hear, 2 scents in the air, and 1 taste. Taking these in anchors you right back to the present moment.";
    }
    return "Thank you for sharing that with me. Acknowledging what you're experiencing is already a powerful act of self-compassion. Remember that emotions are real messengers, but they are not always factual forecasts of what will happen. Take your time, breathe gently, and know that you are safe in this moment. How else can I support your calm today?";
  },

  /**
   * Theme Support (Calm Light / Calm Dark Mode)
   */
  setupThemeSupport() {
    const savedTheme = localStorage.getItem('mindcare_theme') || 'light';
    if (savedTheme === 'calm-dark') {
      document.documentElement.setAttribute('data-theme', 'calm-dark');
    }

    document.querySelectorAll('.mc-theme-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'calm-dark' ? 'light' : 'calm-dark';
        if (next === 'calm-dark') {
          document.documentElement.setAttribute('data-theme', 'calm-dark');
          localStorage.setItem('mindcare_theme', 'calm-dark');
          MindCareUI.showToast('Switched to Serene Calm Dark Theme.', 'info');
        } else {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('mindcare_theme', 'light');
          MindCareUI.showToast('Switched to Warm Minimalist Theme.', 'info');
        }
      });
    });
  }
};

// Initialize common hooks on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  MindCareUI.initDemoBar();
  MindCareUI.setupPasswordToggles();
  MindCareUI.setupEmergencyModal();
  MindCareUI.setupThemeSupport();
  MindCareUI.updateNotificationBadges();

  // Bind video telehealth buttons across all portals
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.mc-launch-telehealth');
    if (btn) {
      e.preventDefault();
      const title = btn.getAttribute('data-session-title') || 'Clinical Telehealth Consultation';
      const doctor = btn.getAttribute('data-doctor-name') || 'Dr. Elena Rostova';
      MindCareUI.openTelehealthSimulator(title, doctor);
    }

    const voiceBtn = e.target.closest('.mc-launch-voice-anchor');
    if (voiceBtn) {
      e.preventDefault();
      const patient = voiceBtn.getAttribute('data-patient') || 'Maya Lin';
      const patientId = voiceBtn.getAttribute('data-patient-id') || 'HC-8821';
      MindCareUI.openVoiceAnchorDrawer(patient, patientId);
    }

    const notifBtn = e.target.closest('.mc-open-notifications, [data-bs-toggle="notifications"]');
    if (notifBtn || (e.target.closest('button') && e.target.closest('button').querySelector('.bi-bell'))) {
      if (!e.target.closest('.dropdown-toggle')) {
        e.preventDefault();
        MindCareUI.openNotifications();
      }
    }
  });

  // Highlight active navbar link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.mc-nav-link, .mc-sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace('./', '').replace('../', ''))) {
      link.classList.add('active');
    }
  });
});


