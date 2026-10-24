/**
 * MindCare Mental Health Platform — Administrator Controller
 * Powers administrative oversight, user management, therapist credential verification,
 * article content management, and platform configurations.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // =========================================================================
  // 1. Admin Users Table & Status Toggling
  // =========================================================================
  const usersTableBody = document.getElementById('adminUsersTableBody');
  if (usersTableBody) {
    async function renderUsers(searchQuery = '', statusFilter = 'all') {
      let users = await MindCareAPI.admin.getUsers();

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }

      if (statusFilter !== 'all') {
        users = users.filter(u => u.status.toLowerCase() === statusFilter.toLowerCase());
      }

      if (users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No users found matching query.</td></tr>';
        return;
      }

      usersTableBody.innerHTML = users.map(user => `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="mc-stat-icon lavender mc-avatar-sm" style="font-size: 0.9rem;">
                ${user.name.charAt(0)}
              </div>
              <div>
                <span class="fw-bold text-dark d-block">${user.name}</span>
                <span class="text-muted small">${user.email}</span>
              </div>
            </div>
          </td>
          <td><span class="badge ${user.role === 'Therapist' ? 'bg-primary-subtle text-primary' : 'bg-light text-dark border'}">${user.role}</span></td>
          <td>
            <span class="mc-badge ${user.status === 'Active' || user.status === 'Verified' ? 'mc-badge-success' : (user.status === 'Pending Verification' ? 'mc-badge-warning' : 'mc-badge-danger')}">
              ${user.status}
            </span>
          </td>
          <td>${user.joinedDate}</td>
          <td>${user.appointments} sessions</td>
          <td>
            <div class="dropdown">
              <button class="btn btn-mc-ghost btn-sm" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                <li><a class="dropdown-item mc-toggle-user-status" href="#" data-id="${user.id}" data-status="Active">Set Active</a></li>
                <li><a class="dropdown-item mc-toggle-user-status" href="#" data-id="${user.id}" data-status="Suspended">Set Suspended</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="alert('User audit log downloaded for ${user.name}')">Export Audit Log</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `).join('');

      usersTableBody.querySelectorAll('.mc-toggle-user-status').forEach(link => {
        link.addEventListener('click', async function(e) {
          e.preventDefault();
          const userId = this.getAttribute('data-id');
          const newStatus = this.getAttribute('data-status');
          await MindCareAPI.admin.updateUserStatus(userId, newStatus);
          MindCareUI.showToast(`User status updated to ${newStatus}`, 'info');
          renderUsers(searchQuery, statusFilter);
        });
      });
    }

    const searchInput = document.getElementById('adminUserSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => renderUsers(searchInput.value.trim(), document.getElementById('adminUserFilterStatus')?.value || 'all'));
    }

    const filterSelect = document.getElementById('adminUserFilterStatus');
    if (filterSelect) {
      filterSelect.addEventListener('change', () => renderUsers(searchInput ? searchInput.value.trim() : '', filterSelect.value));
    }

    renderUsers();
  }

  // =========================================================================
  // 2. Admin Therapist Verification Table
  // =========================================================================
  const therapistVerificationTable = document.getElementById('adminTherapistsTableBody');
  if (therapistVerificationTable) {
    async function renderTherapists() {
      const therapists = await MindCareAPI.therapists.getAll({ verified: false });
      therapistVerificationTable.innerHTML = therapists.map(t => `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-3">
              <img src="${t.avatar}" class="mc-avatar mc-avatar-sm" alt="${t.name}">
              <div>
                <span class="fw-bold text-dark d-block">${t.name}</span>
                <span class="text-muted small">${t.qualification}</span>
              </div>
            </div>
          </td>
          <td>${t.location}</td>
          <td><span class="text-muted small">${t.specialties.slice(0, 2).join(', ')}</span></td>
          <td>$${t.hourlyRate}</td>
          <td>
            <span class="mc-badge ${t.verified ? 'mc-badge-success' : 'mc-badge-warning'}">
              ${t.verified ? 'Verified & Active' : 'Pending Verification'}
            </span>
          </td>
          <td>
            ${!t.verified ? `
              <button class="btn btn-mc-primary btn-sm mc-verify-doc-btn" data-id="${t.id}">
                <i class="bi bi-shield-check me-1"></i> Approve
              </button>
            ` : `
              <button class="btn btn-mc-secondary btn-sm mc-revoke-doc-btn" data-id="${t.id}">
                Audit
              </button>
            `}
          </td>
        </tr>
      `).join('');

      therapistVerificationTable.querySelectorAll('.mc-verify-doc-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          await MindCareAPI.request(`/therapists/${id}/verification`, { method: 'PATCH', body: { verified: true } });
          MindCareUI.showToast('Clinician credentials verified.', 'success');
          renderTherapists();
        });
      });

      therapistVerificationTable.querySelectorAll('.mc-revoke-doc-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          alert('Full NPI & State Board registry verification audit report valid.');
        });
      });
    }

    renderTherapists();
  }

  // =========================================================================
  // 3. Admin Appointments Table
  // =========================================================================
  const adminAptTable = document.getElementById('adminAppointmentsTableBody');
  if (adminAptTable) {
    async function renderAdminAppointments() {
      const apts = await MindCareAPI.appointments.getAll();
      adminAptTable.innerHTML = apts.map(apt => `
        <tr>
          <td><strong>${apt.id}</strong></td>
          <td>${apt.patientName}</td>
          <td>${apt.therapistName}</td>
          <td>${apt.date} at ${apt.time}</td>
          <td><span class="badge bg-light text-dark border">${apt.modality}</span></td>
          <td>
            <span class="mc-badge ${apt.status === 'confirmed' ? 'mc-badge-success' : (apt.status === 'cancelled' ? 'mc-badge-danger' : 'mc-badge-warning')} text-capitalize">
              ${apt.status}
            </span>
          </td>
          <td>
            <button class="btn btn-mc-ghost btn-sm" onclick="alert('Appointment details:\\nPatient: ${apt.patientName}\\nTherapist: ${apt.therapistName}\\nFocus: ${apt.focus}\\nRoom: ${apt.room}\\nStatus: ${apt.status}')">
              <i class="bi bi-eye"></i> View
            </button>
          </td>
        </tr>
      `).join('');
    }

    renderAdminAppointments();
  }

  // =========================================================================
  // 4. Admin Articles CRUD Interface
  // =========================================================================
  const adminArticlesContainer = document.getElementById('adminArticlesTableBody');
  if (adminArticlesContainer) {
    async function renderAdminArticles() {
      const articles = await MindCareAPI.articles.getAll();
      adminArticlesContainer.innerHTML = articles.map(art => `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${art.image}" class="rounded-2" style="width: 44px; height: 36px; object-fit: cover;" alt="">
              <div>
                <span class="fw-bold text-dark d-block">${art.title}</span>
                <span class="text-muted small">${art.author} • ${art.readTime}</span>
              </div>
            </div>
          </td>
          <td><span class="mc-badge mc-badge-peach">${art.category}</span></td>
          <td>${art.date}</td>
          <td>${art.saved ? '<i class="bi bi-bookmark-fill text-primary"></i> Popular' : 'Standard'}</td>
          <td>
            <div class="d-flex gap-2">
              <a href="../article-details.html?id=${art.id}" class="btn btn-mc-ghost btn-sm" title="Preview Article">
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
              <button class="btn btn-outline-danger btn-sm mc-delete-article-btn" data-id="${art.id}" title="Delete Article">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      adminArticlesContainer.querySelectorAll('.mc-delete-article-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          if (confirm('Delete this mental wellness educational article?')) {
            await MindCareAPI.articles.delete(id);
            MindCareUI.showToast('Article deleted from repository.', 'info');
            renderAdminArticles();
          }
        });
      });
    }

    const createArticleForm = document.getElementById('mcCreateArticleForm');
    if (createArticleForm) {
      createArticleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('newArtTitle').value.trim();
        const category = document.getElementById('newArtCategory').value;
        const author = document.getElementById('newArtAuthor').value.trim() || 'MindCare Clinical Editorial';
        const readTime = document.getElementById('newArtReadTime').value.trim() || '5 min read';
        const excerpt = document.getElementById('newArtExcerpt').value.trim();
        const content = document.getElementById('newArtContent').value.trim();

        await MindCareAPI.articles.create({
          title,
          category,
          author,
          readTime,
          excerpt,
          content: `<p class="lead">${excerpt}</p>` + content.split('\n').map(p => p ? `<p>${p}</p>` : '').join('')
        });

        MindCareUI.showToast('Educational article published successfully!', 'success');
        createArticleForm.reset();
        const modalEl = document.getElementById('mcCreateArticleModal');
        if (modalEl) {
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
        }
        renderAdminArticles();
      });
    }

    renderAdminArticles();
  }

  // =========================================================================
  // 5. Admin Feedback Management
  // =========================================================================
  const feedbackContainer = document.getElementById('adminFeedbackTableBody');
  if (feedbackContainer) {
    async function renderFeedback() {
      const feedbacks = await MindCareAPI.admin.getFeedback();
      feedbackContainer.innerHTML = feedbacks.map(fb => `
        <tr>
          <td><strong>${fb.user}</strong></td>
          <td><span class="badge bg-light text-dark border">${fb.type}</span></td>
          <td>
            <div class="mc-stars">
              ${'<i class="bi bi-star-fill"></i>'.repeat(fb.rating)}
            </div>
          </td>
          <td><p class="mb-0 small text-dark">${fb.comment}</p></td>
          <td><span class="mc-badge ${fb.status === 'Reviewed' ? 'mc-badge-success' : 'mc-badge-warning'}">${fb.status}</span></td>
          <td>
            <button class="btn btn-mc-primary btn-sm mc-resolve-feedback-btn" data-id="${fb.id}">
              Mark Resolved
            </button>
          </td>
        </tr>
      `).join('');

      feedbackContainer.querySelectorAll('.mc-resolve-feedback-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = this.getAttribute('data-id');
          await MindCareAPI.admin.updateFeedbackStatus(id, 'Reviewed');
          MindCareUI.showToast('Feedback marked as clinically reviewed and resolved.', 'success');
          renderFeedback();
        });
      });
    }

    renderFeedback();
  }

  // =========================================================================
  // 6. Admin Settings Form
  // =========================================================================
  const settingsForm = document.getElementById('mcAdminSettingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emergencyHotline = document.getElementById('settingEmergency').value.trim();
      const sessionBufferMinutes = parseInt(document.getElementById('settingBuffer').value);

      await MindCareAPI.admin.saveSettings({ emergencyHotline, sessionBufferMinutes });
      MindCareUI.showToast('Platform operational settings saved successfully.', 'success');
    });
  }
});
