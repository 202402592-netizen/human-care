/**
 * MindCare Mental Health Platform — Patient Experience Controller
 * Powers dashboard, multi-step booking, appointments list, wellness check-ins, favorites & profile.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const store = window.mindcareStore;
  const currentUser = store.getCurrentUser();

  // Populate dynamic user greeting/name if element exists
  const userNameElements = document.querySelectorAll('.mc-user-name');
  userNameElements.forEach(el => el.textContent = currentUser.name || 'Maya Lin');

  const userAvatarElements = document.querySelectorAll('.mc-user-avatar');
  userAvatarElements.forEach(el => {
    if (currentUser.avatar) el.src = currentUser.avatar;
  });

  // =========================================================================
  // 1. Patient Dashboard Page
  // =========================================================================
  const dashboardUpcomingContainer = document.getElementById('dashboardUpcomingApts');
  if (dashboardUpcomingContainer) {
    const apts = await MindCareAPI.appointments.getAll({ patientId: currentUser.id });
    const upcoming = apts.filter(a => a.status === 'confirmed');

    if (upcoming.length === 0) {
      dashboardUpcomingContainer.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-calendar-check fs-1 text-secondary opacity-50 mb-2"></i>
          <p class="mb-2">No upcoming appointments scheduled.</p>
          <a href="book-appointment.html" class="btn btn-mc-primary btn-sm">Book a Session</a>
        </div>
      `;
    } else {
      dashboardUpcomingContainer.innerHTML = upcoming.slice(0, 3).map(apt => `
        <div class="mc-card mc-card-sm mb-3">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <div>
              <span class="mc-badge mc-badge-lavender mb-1">
                <i class="bi bi-clock"></i> ${apt.date} • ${apt.time}
              </span>
              <h5 class="fw-bold mb-1">${apt.therapistName}</h5>
              <p class="text-muted small mb-0">${apt.focus} (${apt.modality})</p>
            </div>
            <div class="d-flex gap-2">
              ${apt.modality.includes('Telehealth') ? `
                <button class="btn btn-mc-primary btn-sm mc-launch-telehealth" data-session-title="${apt.focus}" data-doctor-name="${apt.therapistName}">
                  <i class="bi bi-camera-video me-1"></i> Join Room
                </button>
              ` : `
                <span class="badge bg-light text-dark border p-2">
                  <i class="bi bi-geo-alt me-1"></i> ${apt.room}
                </span>
              `}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // =========================================================================
  // 2. Multi-Step Appointment Booking
  // =========================================================================
  const bookingForm = document.getElementById('mcBookingForm');
  if (bookingForm) {
    const therapistSelect = document.getElementById('bookTherapist');
    const slotContainer = document.getElementById('bookSlotsContainer');
    const therapistPreviewCard = document.getElementById('bookTherapistPreview');

    // Populate therapists dropdown
    const therapists = await MindCareAPI.therapists.getAll();
    if (therapistSelect) {
      therapistSelect.innerHTML = therapists.map(t => `
        <option value="${t.id}" data-rate="${t.hourlyRate}">${t.name} — ${t.title} ($${t.hourlyRate}/session)</option>
      `).join('');

      // Check query param e.g. ?therapist=therapist-002
      const urlParams = new URLSearchParams(window.location.search);
      const preselectedId = urlParams.get('therapist');
      if (preselectedId) {
        therapistSelect.value = preselectedId;
      }

      function updateTherapistPreview() {
        const selected = therapists.find(t => t.id === therapistSelect.value) || therapists[0];
        if (therapistPreviewCard) {
          therapistPreviewCard.innerHTML = `
            <div class="d-flex align-items-center gap-3">
              <img src="${selected.avatar}" class="mc-avatar mc-avatar-lg" alt="${selected.name}">
              <div>
                <h5 class="fw-bold mb-1">${selected.name}</h5>
                <p class="text-muted small mb-1">${selected.title}</p>
                <div class="d-flex gap-2 flex-wrap">
                  <span class="badge bg-light text-primary border">${selected.experienceYears} Years Exp</span>
                  <span class="badge bg-light text-success border"><i class="bi bi-star-fill text-warning me-1"></i>${selected.rating} (${selected.reviewsCount})</span>
                </div>
              </div>
            </div>
          `;
        }

        // Render slots
        if (slotContainer) {
          slotContainer.innerHTML = selected.availableSlots.map(slot => `
            <button type="button" class="mc-slot-btn" data-slot="${slot}">${slot}</button>
          `).join('');

          slotContainer.querySelectorAll('.mc-slot-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              slotContainer.querySelectorAll('.mc-slot-btn').forEach(b => b.classList.remove('selected'));
              this.classList.add('selected');
            });
          });

          // Preselect first slot
          const first = slotContainer.querySelector('.mc-slot-btn');
          if (first) first.classList.add('selected');
        }
      }

      therapistSelect.addEventListener('change', updateTherapistPreview);
      updateTherapistPreview();
    }

    // Modality selection
    document.querySelectorAll('.mc-modality-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.mc-modality-pill').forEach(p => p.classList.remove('selected'));
        this.classList.add('selected');
      });
    });

    // Form submit
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const selectedTherapistId = therapistSelect.value;
      const selectedTherapist = therapists.find(t => t.id === selectedTherapistId) || therapists[0];
      const selectedModality = document.querySelector('.mc-modality-pill.selected')?.getAttribute('data-modality') || 'Telehealth Video';
      const selectedSlot = document.querySelector('.mc-slot-btn.selected')?.getAttribute('data-slot') || '10:30 AM';
      const bookingDate = document.getElementById('bookDate')?.value || 'Next Available (Tomorrow)';
      const bookingReason = document.getElementById('bookReason')?.value.trim() || 'General Counseling & Support';
      const intakeNotes = document.getElementById('bookNotes')?.value.trim() || '';

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Confirming with Clinician...';

      await MindCareAPI.appointments.create({
        therapistId: selectedTherapist.id,
        therapistName: selectedTherapist.name,
        therapistTitle: selectedTherapist.title,
        date: bookingDate,
        time: selectedSlot,
        modality: selectedModality,
        reason: bookingReason,
        notes: intakeNotes
      });

      MindCareUI.showToast('Appointment successfully reserved! A reminder has been set.', 'success');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Confirm & Lock Appointment';

      MindCareUI.showBookingConfirmedModal({
        doctor: selectedTherapist.name,
        dateTime: `${bookingDate} • ${selectedSlot} (45 Min)`,
        modality: selectedModality
      });
    });
  }

  // =========================================================================
  // 3. Patient Appointments List Page
  // =========================================================================
  const appointmentsListContainer = document.getElementById('patientAppointmentsList');
  if (appointmentsListContainer) {
    async function renderAppointments(filterStatus = 'all') {
      const allApts = await MindCareAPI.appointments.getAll({ patientId: currentUser.id });
      const filtered = filterStatus === 'all' ? allApts : allApts.filter(a => a.status === filterStatus);

      if (filtered.length === 0) {
        appointmentsListContainer.innerHTML = `
          <div class="text-center py-5 text-muted mc-card">
            <i class="bi bi-calendar2-x fs-1 opacity-50 mb-3 d-block text-secondary"></i>
            <h5>No appointments found</h5>
            <p class="small text-muted mb-3">You do not have any sessions matching this criteria.</p>
            <a href="book-appointment.html" class="btn btn-mc-primary btn-sm">Schedule New Appointment</a>
          </div>
        `;
        return;
      }

      appointmentsListContainer.innerHTML = filtered.map(apt => {
        let badgeClass = 'mc-badge-lavender';
        if (apt.status === 'confirmed') badgeClass = 'mc-badge-success';
        if (apt.status === 'cancelled') badgeClass = 'mc-badge-danger';
        if (apt.status === 'completed') badgeClass = 'mc-badge-lavender';
        if (apt.status === 'pending') badgeClass = 'mc-badge-warning';

        return `
          <div class="mc-card mb-3">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div class="d-flex align-items-center gap-3">
                <div class="mc-stat-icon lavender">
                  <i class="bi ${apt.modality.includes('Telehealth') ? 'bi-camera-video' : 'bi-hospital'}"></i>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="mc-badge ${badgeClass} text-capitalize">${apt.status}</span>
                    <span class="text-muted small"><i class="bi bi-calendar3 me-1"></i>${apt.date} at ${apt.time}</span>
                  </div>
                  <h5 class="fw-bold mb-1">${apt.therapistName}</h5>
                  <p class="text-muted small mb-0">${apt.focus} • ${apt.modality}</p>
                </div>
              </div>

              <div class="d-flex align-items-center gap-2 flex-wrap">
                ${apt.status === 'confirmed' && apt.modality.includes('Telehealth') ? `
                  <button class="btn btn-mc-primary btn-sm mc-launch-telehealth" data-session-title="${apt.focus}" data-doctor-name="${apt.therapistName}">
                    <i class="bi bi-camera-video me-1"></i> Join Telehealth
                  </button>
                ` : ''}

                ${apt.status === 'confirmed' ? `
                  <button class="btn btn-outline-danger btn-sm rounded-pill mc-cancel-apt-btn" data-apt-id="${apt.id}">
                    Cancel
                  </button>
                ` : ''}

                <button class="btn btn-mc-ghost btn-sm" onclick="alert('Session ID: ${apt.id}\\nTherapist: ${apt.therapistName}\\nNotes: ${apt.notes || 'None'}')">
                  <i class="bi bi-info-circle"></i> Details
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Bind cancel buttons
      appointmentsListContainer.querySelectorAll('.mc-cancel-apt-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const aptId = this.getAttribute('data-apt-id');
          if (confirm('Are you sure you wish to cancel this clinical appointment? Your clinician will be notified.')) {
            await MindCareAPI.appointments.cancel(aptId, 'Cancelled by patient from portal');
            MindCareUI.showToast('Appointment successfully cancelled.', 'info');
            renderAppointments(filterStatus);
          }
        });
      });
    }

    // Filter tabs
    document.querySelectorAll('.mc-apt-tab').forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.mc-apt-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const status = this.getAttribute('data-status');
        renderAppointments(status);
      });
    });

    renderAppointments('all');
  }

  // =========================================================================
  // 4. Wellness Check-in Page
  // =========================================================================
  const wellnessForm = document.getElementById('mcWellnessForm');
  if (wellnessForm) {
    let selectedMood = 'Calm & Grounded';
    let selectedMoodScore = 4;

    document.querySelectorAll('.mc-mood-choice').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.mc-mood-choice').forEach(b => b.classList.remove('active', 'btn-mc-primary'));
        this.classList.add('active', 'btn-mc-primary');
        selectedMood = this.getAttribute('data-mood');
        selectedMoodScore = parseInt(this.getAttribute('data-score') || '4');
      });
    });

    const sleepSlider = document.getElementById('wellSleepHours');
    const sleepValDisplay = document.getElementById('sleepValDisplay');
    if (sleepSlider && sleepValDisplay) {
      sleepSlider.addEventListener('input', () => {
        sleepValDisplay.textContent = `${sleepSlider.value} hrs`;
      });
    }

    const anxietySlider = document.getElementById('wellAnxietyLevel');
    const anxietyValDisplay = document.getElementById('anxietyValDisplay');
    if (anxietySlider && anxietyValDisplay) {
      anxietySlider.addEventListener('input', () => {
        const val = anxietySlider.value;
        anxietyValDisplay.textContent = `${val}/10`;
      });
    }

    async function renderLogs() {
      const logsContainer = document.getElementById('mcWellnessLogsHistory');
      if (!logsContainer) return;

      const logs = await MindCareAPI.wellness.getLogs();
      logsContainer.innerHTML = logs.map(log => `
        <div class="mc-card mc-card-sm mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="mc-badge mc-badge-lavender">${log.date}</span>
            <span class="badge bg-light text-primary border">${log.sleepHours} hrs sleep</span>
          </div>
          <h6 class="fw-bold mb-1"><i class="bi bi-heart-pulse text-primary me-2"></i>Mood: ${log.mood}</h6>
          <p class="text-muted small mb-0">${log.note}</p>
        </div>
      `).join('');
    }

    wellnessForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const note = document.getElementById('wellJournalNote')?.value.trim() || 'Logged daily check-in.';
      const sleepHours = sleepSlider ? parseFloat(sleepSlider.value) : 7.5;
      const anxietyLevel = anxietySlider ? `${anxietySlider.value}/10` : 'Mild (3/10)';

      await MindCareAPI.wellness.createLog({
        mood: selectedMood,
        moodScore: selectedMoodScore,
        sleepHours,
        anxietyLevel,
        note
      });

      MindCareUI.showToast('Wellness check-in logged! Thank you for prioritizing your well-being.', 'success');
      document.getElementById('wellJournalNote').value = '';
      renderLogs();
    });

    renderLogs();
  }

  // =========================================================================
  // 5. Patient Favorites Page
  // =========================================================================
  const favoritesContainer = document.getElementById('patientFavoritesContainer');
  if (favoritesContainer) {
    async function renderFavorites(category = 'all') {
      let articles = await MindCareAPI.articles.getAll({ savedOnly: true });
      if (category !== 'all') {
        articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
      }

      if (articles.length === 0) {
        favoritesContainer.innerHTML = `
          <div class="col-12 text-center py-5 mc-card">
            <i class="bi bi-bookmark-heart fs-1 text-secondary opacity-50 mb-3 d-block"></i>
            <h5>No bookmarked articles yet</h5>
            <p class="text-muted small mb-3">Explore educational resources from licensed clinicians and save key articles here.</p>
            <a href="../resources.html" class="btn btn-mc-primary btn-sm">Explore Resources Directory</a>
          </div>
        `;
        return;
      }

      favoritesContainer.innerHTML = articles.map(art => `
        <div class="col-md-6 mb-4">
          <div class="mc-card h-100 d-flex flex-column">
            <img src="${art.image}" class="rounded-3 mb-3" style="height: 180px; object-fit: cover;" alt="${art.title}">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="mc-badge mc-badge-peach">${art.category}</span>
              <span class="text-muted small">${art.readTime}</span>
            </div>
            <h5 class="fw-bold mb-2">${art.title}</h5>
            <p class="text-muted small flex-grow-1">${art.excerpt}</p>
            <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
              <a href="../article-details.html?id=${art.id}" class="btn btn-mc-outline btn-sm">Read Article</a>
              <button class="btn btn-mc-ghost btn-sm text-danger mc-remove-fav" data-id="${art.id}" title="Remove from favorites">
                <i class="bi bi-trash3 me-1"></i> Remove
              </button>
            </div>
          </div>
        </div>
      `).join('');

      favoritesContainer.querySelectorAll('.mc-remove-fav').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          await MindCareAPI.articles.toggleSave(id);
          MindCareUI.showToast('Article removed from your sanctuary favorites', 'info');
          renderFavorites(category);
        });
      });
    }

    renderFavorites('all');
  }

  // =========================================================================
  // 6. Patient Profile Page
  // =========================================================================
  const profileForm = document.getElementById('mcPatientProfileForm');
  if (profileForm) {
    // Populate form fields
    const nameInput = document.getElementById('profName');
    const emailInput = document.getElementById('profEmail');
    const phoneInput = document.getElementById('profPhone');
    const emergencyInput = document.getElementById('profEmergency');
    const careFocusInput = document.getElementById('profCareFocus');

    if (nameInput) nameInput.value = currentUser.name || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
    if (emergencyInput) emergencyInput.value = currentUser.emergencyContact || '';
    if (careFocusInput) careFocusInput.value = currentUser.careFocus || '';

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedStore = store.getStore();
      updatedStore.currentUser.name = nameInput.value.trim();
      updatedStore.currentUser.email = emailInput.value.trim();
      updatedStore.currentUser.phone = phoneInput ? phoneInput.value.trim() : '';
      updatedStore.currentUser.emergencyContact = emergencyInput ? emergencyInput.value.trim() : '';
      updatedStore.currentUser.careFocus = careFocusInput ? careFocusInput.value.trim() : '';

      store.saveStore(updatedStore);
      MindCareUI.showToast('Profile information successfully saved.', 'success');
    });
  }
});
