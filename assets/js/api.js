/** Human Care API adapter.
 * The browser communicates only with the NestJS API.
 * MongoDB is never exposed directly to the frontend.
 */
(function () {
  const IS_LOCAL =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  const DEFAULT_API_URL = IS_LOCAL
    ? 'http://localhost:5000/api/v1'
    : 'https://human-care-api.vercel.app/api/v1';

  const API_CONFIG = {
    BASE_URL: (
      window.HUMAN_CARE_API_URL ||
      DEFAULT_API_URL
    ).replace(/\/+$/, ''),

    TIMEOUT: 10000,

    USE_MOCK_FALLBACK: Boolean(
      window.HUMAN_CARE_OFFLINE_MODE
    )
  };

  async function request(endpoint, options = {}) {
    const controller = new AbortController();

    const timer = setTimeout(
      () => controller.abort(),
      API_CONFIG.TIMEOUT
    );

    const token = localStorage.getItem(
      'human_care_access_token'
    );

    const headers = {
      Accept: 'application/json',

      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),

      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),

      ...(options.headers || {})
    };

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {
          ...options,
          headers,
          signal: controller.signal,

          body:
            options.body &&
              typeof options.body !== 'string'
              ? JSON.stringify(options.body)
              : options.body
        }
      );

      const payload = await response
        .json()
        .catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem(
          'human_care_access_token'
        );

        window.dispatchEvent(
          new CustomEvent(
            'human-care:unauthorized'
          )
        );
      }

      if (!response.ok) {
        const error = new Error(
          payload.message ||
          `Request failed (${response.status})`
        );

        error.status = response.status;
        error.details = payload;

        throw error;
      }

      return payload;
    } finally {
      clearTimeout(timer);
    }
  }

  const store = () => window.mindcareStore;

  const fallback = async (fn) => {
    if (!API_CONFIG.USE_MOCK_FALLBACK) {
      throw new Error(
        'Human Care API is unavailable'
      );
    }

    return fn();
  };

  const normalize = (value) =>
    Array.isArray(value)
      ? value.map(normalize)
      : value &&
        typeof value === 'object'
        ? value._id && !value.id
          ? {
            ...value,
            id: value._id,

            ...(value.userId &&
              typeof value.userId ===
              'object'
              ? {
                userId:
                  value.userId._id
              }
              : {})
          }
          : value
        : value;

  const MindCareAPI = {
    config: API_CONFIG,

    auth: {
      async login(
        email,
        password,
        role = 'patient'
      ) {
        try {
          const result = await request(
            '/auth/login',
            {
              method: 'POST',
              body: {
                email,
                password,
                role
              }
            }
          );

          localStorage.setItem(
            'human_care_access_token',
            result.accessToken
          );

          return result;
        } catch (error) {
          return fallback(() => ({
            success: true,

            user: store().setCurrentRole(
              role
            ),

            accessToken:
              'offline-demo-token'
          }));
        }
      },

      async register(data) {
        const result = await request(
          '/auth/register',
          {
            method: 'POST',
            body: data
          }
        );

        localStorage.setItem(
          'human_care_access_token',
          result.accessToken
        );

        return result;
      },

      async getCurrentUser() {
        try {
          return await request(
            '/auth/me'
          );
        } catch (error) {
          return fallback(() =>
            store().getCurrentUser()
          );
        }
      },

      async logout() {
        try {
          await request('/auth/logout', {
            method: 'POST'
          });
        } finally {
          localStorage.removeItem(
            'human_care_access_token'
          );
        }

        return {
          success: true
        };
      }
    },

    therapists: {
      async getAll(filters = {}) {
        try {
          return normalize(
            await request(
              '/therapists?' +
              new URLSearchParams(
                filters
              )
            )
          );
        } catch (error) {
          return fallback(
            () =>
              store().getStore()
                .therapists
          );
        }
      },

      async getById(id) {
        try {
          return normalize(
            await request(
              `/therapists/${id}`
            )
          );
        } catch (error) {
          return fallback(() =>
            store()
              .getStore()
              .therapists.find(
                (therapist) =>
                  therapist.id === id
              )
          );
        }
      },

      async updateAvailability(
        id,
        availability
      ) {
        return request(
          '/therapists/me/availability',
          {
            method: 'PATCH',
            body: availability
          }
        );
      }
    },

    appointments: {
      async getAll(params = {}) {
        try {
          return await request(
            '/appointments?' +
            new URLSearchParams(params)
          );
        } catch (error) {
          return fallback(
            () =>
              store().getStore()
                .appointments
          );
        }
      },

      async create(data) {
        return {
          success: true,

          appointment:
            await request(
              '/appointments',
              {
                method: 'POST',
                body: data
              }
            )
        };
      },

      async cancel(
        id,
        reason = ''
      ) {
        return {
          success: true,

          appointment:
            await request(
              `/appointments/${id}/cancel`,
              {
                method: 'POST',
                body: { reason }
              }
            )
        };
      },

      async updateStatus(
        id,
        status
      ) {
        return {
          success: true,

          appointment:
            await request(
              `/appointments/${id}/status`,
              {
                method: 'PATCH',
                body: { status }
              }
            )
        };
      }
    },

    articles: {
      async getAll(filters = {}) {
        try {
          return await request(
            '/articles?' +
            new URLSearchParams(
              filters
            )
          );
        } catch (error) {
          return fallback(
            () =>
              store().getStore()
                .articles
          );
        }
      },

      async getById(id) {
        return request(
          `/articles/${id}`
        );
      },

      async toggleSave(id) {
        return request(
          `/articles/${id}/favorite`,
          {
            method: 'POST'
          }
        );
      },

      async create(data) {
        return request('/articles', {
          method: 'POST',
          body: data
        });
      },

      async delete(id) {
        return request(
          `/articles/${id}`,
          {
            method: 'DELETE'
          }
        );
      }
    },

    wellness: {
      async getLogs() {
        try {
          return await request(
            '/wellness/logs'
          );
        } catch (error) {
          return fallback(
            () =>
              store().getStore()
                .wellnessLogs
          );
        }
      },

      async createLog(data) {
        return {
          success: true,

          log: await request(
            '/wellness/logs',
            {
              method: 'POST',
              body: data
            }
          )
        };
      }
    },

    care: {
      async journals(query = {}) {
        return request(
          '/journals?' +
          new URLSearchParams(query)
        );
      },

      async journal(id) {
        return request(
          `/journals/${id}`
        );
      },

      async createJournal(data) {
        return request('/journals', {
          method: 'POST',
          body: data
        });
      },

      async updateJournal(
        id,
        data
      ) {
        return request(
          `/journals/${id}`,
          {
            method: 'PATCH',
            body: data
          }
        );
      },

      async deleteJournal(id) {
        return request(
          `/journals/${id}`,
          {
            method: 'DELETE'
          }
        );
      },

      async purgeJournals() {
        return request('/journals', {
          method: 'DELETE'
        });
      },

      async goals() {
        return request('/goals');
      },

      async createGoal(data) {
        return request('/goals', {
          method: 'POST',
          body: data
        });
      },

      async progressGoal(
        id,
        data
      ) {
        return request(
          `/goals/${id}/progress`,
          {
            method: 'PATCH',
            body: data
          }
        );
      },

      async deleteGoal(id) {
        return request(
          `/goals/${id}`,
          {
            method: 'DELETE'
          }
        );
      },

      async cbt() {
        return request('/cbt');
      },

      async createCbt(data) {
        return request('/cbt', {
          method: 'POST',
          body: data
        });
      },

      async exerciseProgress() {
        return request(
          '/exercises/progress'
        );
      },

      async saveExerciseProgress(
        data
      ) {
        return request(
          '/exercises/progress',
          {
            method: 'POST',
            body: data
          }
        );
      },

      async notifications() {
        return request(
          '/notifications'
        );
      },

      async unreadCount() {
        return request(
          '/notifications/unread-count'
        );
      },

      async markRead(id) {
        return request(
          `/notifications/${id}/read`,
          {
            method: 'PATCH'
          }
        );
      },

      async markAllRead() {
        return request(
          '/notifications/read-all',
          {
            method: 'POST'
          }
        );
      },

      async dashboard() {
        return request('/dashboard');
      }
    },

    admin: {
      async getUsers() {
        return request('/admin/users');
      },

      async updateUserStatus(
        id,
        status
      ) {
        return {
          success: true,

          user: await request(
            `/admin/users/${id}/status`,
            {
              method: 'PATCH',
              body: { status }
            }
          )
        };
      },

      async getFeedback() {
        return request(
          '/admin/feedback'
        );
      },

      async updateFeedbackStatus(
        id,
        status
      ) {
        return {
          success: true,

          feedback:
            await request(
              `/admin/feedback/${id}`,
              {
                method: 'PATCH',
                body: { status }
              }
            )
        };
      },

      async getSettings() {
        return request(
          '/admin/settings'
        );
      },

      async saveSettings(
        settings
      ) {
        return {
          success: true,

          settings:
            await request(
              '/admin/settings',
              {
                method: 'PUT',
                body: settings
              }
            )
        };
      }
    }
  };

  window.MindCareAPI =
    MindCareAPI;

  window.MindCareAPI.request =
    request;

  window.addEventListener(
    'human-care:unauthorized',
    () => {
      if (
        !location.pathname.endsWith(
          'login.html'
        )
      ) {
        location.href =
          location.pathname.startsWith(
            '/patient/'
          ) ||
            location.pathname.startsWith(
              '/therapist/'
            ) ||
            location.pathname.startsWith(
              '/admin/'
            )
            ? '../login.html'
            : '/login.html';
      }
    }
  );
})();