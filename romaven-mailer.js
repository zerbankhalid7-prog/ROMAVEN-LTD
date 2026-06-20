/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           RomavenMailer — Custom Email Library v1.0             ║
 * ║         Built for ROMAVEN LTD | romaven.com                     ║
 * ║  Backend: Google Apps Script (free, unlimited, no 3rd party)    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * HOW TO USE:
 *   const mailer = new RomavenMailer({ endpoint: 'YOUR_GOOGLE_SCRIPT_URL' });
 *   mailer.send({ name, email, subject, message });
 */

(function (global) {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     TOAST NOTIFICATION ENGINE
  ───────────────────────────────────────────────────────────────── */
  const Toast = {
    _inject() {
      if (document.getElementById('rm-toast-styles')) return;
      const style = document.createElement('style');
      style.id = 'rm-toast-styles';
      style.textContent = `
        .rm-toast-wrap {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: .75rem;
          pointer-events: none;
        }
        .rm-toast {
          pointer-events: all;
          display: flex;
          align-items: flex-start;
          gap: .9rem;
          min-width: 320px;
          max-width: 460px;
          padding: 1rem 1.2rem;
          border-radius: 16px;
          background: rgba(10, 10, 20, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,.07);
          box-shadow: 0 16px 50px rgba(0,0,0,.35);
          color: #fff;
          font-family: 'Segoe UI', system-ui, sans-serif;
          transform: translateX(120%);
          opacity: 0;
          transition: transform .42s cubic-bezier(.34,1.56,.64,1),
                      opacity .35s ease;
        }
        .rm-toast.rm-show {
          transform: translateX(0);
          opacity: 1;
        }
        .rm-toast.rm-hide {
          transform: translateX(120%);
          opacity: 0;
        }
        .rm-toast--success { border-left: 4px solid #22d3a0; }
        .rm-toast--error   { border-left: 4px solid #f05252; }
        .rm-toast--loading { border-left: 4px solid #7c6fff; }
        .rm-toast__icon {
          font-size: 1.45rem;
          flex-shrink: 0;
          line-height: 1;
          margin-top: 2px;
        }
        .rm-toast--success .rm-toast__icon { color: #22d3a0; }
        .rm-toast--error   .rm-toast__icon { color: #f05252; }
        .rm-toast--loading .rm-toast__icon { color: #7c6fff; }
        .rm-toast__body { flex: 1; }
        .rm-toast__title {
          display: block;
          font-size: .92rem;
          font-weight: 700;
          margin-bottom: .2rem;
          color: #fff;
          letter-spacing: .01em;
        }
        .rm-toast__msg {
          margin: 0;
          font-size: .82rem;
          line-height: 1.55;
          color: rgba(255,255,255,.72);
        }
        .rm-toast__close {
          background: none;
          border: none;
          color: rgba(255,255,255,.4);
          cursor: pointer;
          font-size: .8rem;
          padding: 0;
          flex-shrink: 0;
          transition: color .2s;
          margin-top: 2px;
        }
        .rm-toast__close:hover { color: #fff; }
        /* Spinner */
        @keyframes rm-spin { to { transform: rotate(360deg); } }
        .rm-spinner {
          display: inline-block;
          width: 1.3rem;
          height: 1.3rem;
          border: 2.5px solid rgba(124,111,255,.3);
          border-top-color: #7c6fff;
          border-radius: 50%;
          animation: rm-spin .75s linear infinite;
          flex-shrink: 0;
          margin-top: 2px;
        }
        /* Progress bar */
        .rm-toast__progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px;
          border-radius: 0 0 16px 16px;
          background: currentColor;
          width: 100%;
          transform-origin: left;
          animation: rm-progress linear forwards;
        }
        @keyframes rm-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `;
      document.head.appendChild(style);

      const wrap = document.createElement('div');
      wrap.className = 'rm-toast-wrap';
      wrap.id = 'rm-toast-wrap';
      document.body.appendChild(wrap);
    },

    show(type, title, message, duration = 6000) {
      this._inject();
      const wrap = document.getElementById('rm-toast-wrap');

      const icons = {
        success: '✔',
        error:   '✖',
        loading: null   // uses spinner
      };

      const toast = document.createElement('div');
      toast.className = `rm-toast rm-toast--${type}`;
      toast.style.position = 'relative';

      const iconHTML = type === 'loading'
        ? `<div class="rm-spinner"></div>`
        : `<span class="rm-toast__icon">${icons[type]}</span>`;

      const progressHTML = (type !== 'loading' && duration)
        ? `<div class="rm-toast__progress" style="animation-duration:${duration}ms; color:${
            type === 'success' ? '#22d3a0' : '#f05252'
          }"></div>`
        : '';

      toast.innerHTML = `
        ${iconHTML}
        <div class="rm-toast__body">
          <strong class="rm-toast__title">${title}</strong>
          <p class="rm-toast__msg">${message}</p>
        </div>
        <button class="rm-toast__close" aria-label="Close">✕</button>
        ${progressHTML}
      `;

      wrap.appendChild(toast);

      // Trigger slide-in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('rm-show'));
      });

      // Auto dismiss
      let timer;
      if (type !== 'loading' && duration) {
        timer = setTimeout(() => this._dismiss(toast), duration);
      }

      toast.querySelector('.rm-toast__close').addEventListener('click', () => {
        clearTimeout(timer);
        this._dismiss(toast);
      });

      return toast;
    },

    _dismiss(toast) {
      toast.classList.add('rm-hide');
      toast.classList.remove('rm-show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    },

    dismiss(toast) {
      if (toast && toast.parentNode) this._dismiss(toast);
    }
  };


  /* ─────────────────────────────────────────────────────────────────
     VALIDATOR
  ───────────────────────────────────────────────────────────────── */
  const Validator = {
    isEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    validate(data) {
      const errors = [];
      if (!data.name || data.name.trim().length < 2)
        errors.push('Name must be at least 2 characters.');
      if (!data.email || !this.isEmail(data.email))
        errors.push('Please enter a valid email address.');
      if (!data.subject || data.subject.trim().length < 3)
        errors.push('Subject must be at least 3 characters.');
      if (!data.message || data.message.trim().length < 10)
        errors.push('Message must be at least 10 characters.');
      return errors;
    }
  };


  /* ─────────────────────────────────────────────────────────────────
     MAIN LIBRARY CLASS
  ───────────────────────────────────────────────────────────────── */
  class RomavenMailer {
    /**
     * @param {Object} config
     * @param {string} config.endpoint  - Google Apps Script Web App URL
     * @param {number} [config.retries] - Number of retry attempts (default: 2)
     * @param {number} [config.timeout] - Request timeout in ms (default: 10000)
     */
    constructor(config = {}) {
      if (!config.endpoint) {
        throw new Error('[RomavenMailer] Missing required config: endpoint');
      }
      this.endpoint = config.endpoint;
      this.retries  = config.retries ?? 2;
      this.timeout  = config.timeout ?? 10000;
    }

    /**
     * Send a message
     * @param {Object} data - { name, email, subject, message }
     * @param {HTMLElement} [submitBtn] - Optional button to disable during send
     * @returns {Promise<boolean>}
     */
    async send(data, submitBtn = null) {
      // 1. Validate
      const errors = Validator.validate(data);
      if (errors.length) {
        Toast.show('error', 'Please fix the following:', errors.join('<br>'));
        return false;
      }

      // 2. UI: loading state
      let originalHTML = null;
      if (submitBtn) {
        originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span style="display:flex;align-items:center;gap:.5rem;justify-content:center"><span class="rm-spinner" style="border-top-color:#fff;border-color:rgba(255,255,255,.3)"></span> Sending…</span>';
        submitBtn.disabled = true;
      }

      // Inject spinner styles early
      Toast._inject();

      const loadingToast = Toast.show('loading', 'Sending your message…', 'Please wait a moment.', 0);

      // 3. Send with retry
      let lastError = null;
      for (let attempt = 1; attempt <= this.retries + 1; attempt++) {
        try {
          const ok = await this._request(data);
          if (ok) {
            Toast.dismiss(loadingToast);
            Toast.show(
              'success',
              'Message Sent Successfully! ✔',
              `Thank you, ${data.name}! We received your message and will reply to <strong>${data.email}</strong> shortly.`
            );
            this._restoreBtn(submitBtn, originalHTML);
            return true;
          }
        } catch (err) {
          lastError = err;
          if (attempt <= this.retries) {
            await this._sleep(800 * attempt); // back-off
          }
        }
      }

      // All attempts failed
      Toast.dismiss(loadingToast);
      Toast.show(
        'error',
        'Failed to Send',
        lastError?.message || 'Network error. Please try again or email us directly at contact@romaven.com'
      );
      this._restoreBtn(submitBtn, originalHTML);
      return false;
    }

    async _request(data) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);

      try {
        // NOTE: No Content-Type header here intentionally.
        // Sending without it avoids the CORS preflight OPTIONS request
        // that Google Apps Script does not support. The body is still
        // valid JSON and Apps Script reads it via e.postData.contents.
        const response = await fetch(this.endpoint, {
          method: 'POST',
          body: JSON.stringify({
            name:    data.name.trim(),
            email:   data.email.trim(),
            subject: data.subject.trim(),
            message: data.message.trim(),
            _site:   window.location.hostname
          }),
          signal: controller.signal
        });

        clearTimeout(timer);

        // Google Apps Script always returns 200; check our own status field
        const result = await response.json();
        if (result.status !== 'success') {
          throw new Error(result.message || 'Server rejected the request.');
        }
        return true;

      } catch (err) {
        clearTimeout(timer);
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection.');
        }
        throw err;
      }
    }

    /* Restore submit button */
    _restoreBtn(btn, html) {
      if (btn && html !== null) {
        btn.innerHTML = html;
        btn.disabled  = false;
      }
    }

    /* Sleep helper */
    _sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* Expose Toast for external use */
    static get Toast() { return Toast; }
  }

  // Export to global scope
  global.RomavenMailer = RomavenMailer;

}(typeof window !== 'undefined' ? window : this));
