(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const S = JSON.parse(($('#i18n') || {}).textContent || '{}');
  const fill = (str, vars) => String(str || '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  const isDesktop = () => window.matchMedia('(min-width: 721px)').matches;

  /* ───────── Mobile menu ───────── */
  const nav = $('[data-nav]');
  const toggle = $('[data-menu-toggle]');
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav?.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', (e) => {
    if (nav?.classList.contains('is-open') && !e.target.closest('[data-nav], [data-menu-toggle]')) setMenu(false);
  });

  /* ───────── Language switch keeps the current section ───────── */
  $$('[data-lang-link]').forEach((a) =>
    a.addEventListener('click', () => {
      if (location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash;
    })
  );

  /* ───────── Active nav link on scroll ───────── */
  const navLinks = $$('.nav-list > li > a');
  if ('IntersectionObserver' in window && navLinks.length) {
    const map = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const link = map.get(en.target.id);
          if (!link) return;
          navLinks.forEach((l) => l.classList.toggle('is-active', l === link));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    map.forEach((_, id) => {
      const s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  /* ───────── Dialogs ───────── */
  const openDialog = (dlg) => {
    if (!dlg) return;
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
    document.body.classList.add('no-scroll');
  };
  const closeDialog = (dlg) => {
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  };
  $$('dialog.modal').forEach((dlg) => {
    dlg.addEventListener('close', () => {
      if (!$$('dialog.modal').some((d) => d.open)) document.body.classList.remove('no-scroll');
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) closeDialog(dlg); // click on backdrop
      if (e.target.closest('[data-close]')) closeDialog(dlg);
    });
  });

  const contactModal = $('#contact-modal');
  const newsModal = $('#news-modal');

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-contact]');
    if (!opener) return;
    e.preventDefault();
    if (newsModal?.open) closeDialog(newsModal);
    const wrap = $('[data-form-wrap]', contactModal);
    if (wrap && wrap.classList.contains('is-done')) resetForm(wrap);
    const mod = opener.getAttribute('data-module');
    if (mod) {
      const cb = $(`input[name="solutions"][value="${CSS.escape(mod)}"]`, contactModal);
      if (cb) cb.checked = true;
    }
    openDialog(contactModal);
    if (isDesktop()) setTimeout(() => $('input[name="name"]', contactModal)?.focus(), 30);
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-news]');
    if (!btn || !newsModal) return;
    const tpl = document.getElementById(`news-${btn.getAttribute('data-news')}`);
    const holder = $('[data-news-content]', newsModal);
    if (!tpl || !holder) return;
    holder.replaceChildren(tpl.content.cloneNode(true));
    openDialog(newsModal);
    $('.modal-card', newsModal).scrollTop = 0;
  });

  /* ───────── Contact forms ───────── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[+()\d\s.-]{6,30}$/;

  function readForm(form) {
    const fd = new FormData(form);
    return {
      name: (fd.get('name') || '').trim(),
      position: (fd.get('position') || '').trim(),
      email: (fd.get('email') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      company: (fd.get('company') || '').trim(),
      industry: fd.get('industry') || '',
      companySize: fd.get('companySize') || '',
      location: (fd.get('location') || '').trim(),
      solutions: fd.getAll('solutions'),
      contactPreference: fd.get('contactPreference') || 'email',
      message: (fd.get('message') || '').trim(),
      consent: fd.get('consent') === 'yes',
      website: fd.get('website') || '',
      lang: fd.get('lang') || 'es',
      source: fd.get('source') || '',
      startedAt: Number(form.dataset.startedAt || 0) || undefined,
    };
  }

  function validate(d) {
    const err = {};
    if (d.name.length < 2) err.name = 'required';
    if (!d.email) err.email = 'required';
    else if (!EMAIL_RE.test(d.email)) err.email = 'email';
    if (!d.phone) err.phone = 'required';
    else if (!PHONE_RE.test(d.phone) || d.phone.replace(/\D/g, '').length < 7) err.phone = 'phone';
    if (!d.company) err.company = 'required';
    if (!d.industry) err.industry = 'required';
    if (!d.message) err.message = 'required';
    else if (d.message.length < 10) err.message = 'too_short';
    if (!d.consent) err.consent = 'consent';
    return err;
  }

  function showErrors(form, errors) {
    $$('.field', form).forEach((f) => {
      const name = f.getAttribute('data-field');
      const code = errors[name];
      const msgEl = $('.field-error', f);
      const ctl = $(`[name="${name}"]`, f);
      f.classList.toggle('has-error', !!code);
      if (msgEl) msgEl.textContent = code ? S[`err_${code}`] || S.err_invalid : '';
      if (ctl) {
        if (code) ctl.setAttribute('aria-invalid', 'true');
        else ctl.removeAttribute('aria-invalid');
      }
    });
    const first = Object.keys(errors)[0];
    if (first) {
      const ctl = $(`[name="${first}"]`, form);
      ctl?.focus({ preventScroll: true });
      ctl?.closest('.field')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function setAlert(form, msg) {
    const box = $('.form-alert', form);
    if (!box) return;
    box.textContent = msg || '';
    box.hidden = !msg;
  }

  function setLoading(form, on) {
    const btn = $('[data-submit]', form);
    if (!btn) return;
    btn.disabled = on;
    btn.classList.toggle('is-loading', on);
    $('.btn-label', btn).textContent = on ? S.f_sending : S.f_submit;
  }

  function resetForm(wrap) {
    const form = $('[data-contact-form]', wrap);
    const ok = $('[data-form-success]', wrap);
    form.reset();
    showErrors(form, {});
    setAlert(form, '');
    delete form.dataset.startedAt;
    wrap.classList.remove('is-done');
    wrap.closest('.modal-card')?.classList.remove('is-done');
    ok.hidden = true;
    form.hidden = false;
  }

  $$('[data-form-wrap]').forEach((wrap) => {
    const form = $('[data-contact-form]', wrap);
    const ok = $('[data-form-success]', wrap);

    form.addEventListener('focusin', () => {
      if (!form.dataset.startedAt) form.dataset.startedAt = String(Date.now());
    });

    // Clear a field's error as soon as the user fixes it
    form.addEventListener('input', (e) => {
      const f = e.target.closest('.field');
      if (f && f.classList.contains('has-error')) {
        f.classList.remove('has-error');
        e.target.removeAttribute('aria-invalid');
      }
    });

    $('[data-form-reset]', wrap)?.addEventListener('click', () => {
      resetForm(wrap);
      $('input[name="name"]', form)?.focus();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setAlert(form, '');
      const data = readForm(form);
      const errors = validate(data);
      showErrors(form, errors);
      if (Object.keys(errors).length) {
        setAlert(form, S.err_fix);
        return;
      }

      setLoading(form, true);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const body = await res.json().catch(() => ({}));

        if (res.ok && body.ok) {
          $('[data-success-title]', ok).textContent = fill(S.ok_title, { name: data.name.split(/\s+/)[0] });
          $('[data-success-copy]', ok).textContent = body.confirmationSent === false ? '' : fill(S.ok_copy, { email: data.email });
          form.hidden = true;
          ok.hidden = false;
          wrap.classList.add('is-done');
          wrap.closest('.modal-card')?.classList.add('is-done');
          ok.focus();
          const scroller = wrap.closest('.modal-card');
          if (scroller) scroller.scrollTop = 0;
          else ok.scrollIntoView({ block: 'center', behavior: 'smooth' });
          return;
        }
        if (res.status === 400 && body.errors) {
          showErrors(form, body.errors);
          setAlert(form, S.err_fix);
        } else if (res.status === 429) {
          setAlert(form, S.err_rate);
        } else {
          setAlert(form, S.err_generic);
        }
      } catch (err) {
        setAlert(form, S.err_generic);
      } finally {
        setLoading(form, false);
      }
    });
  });
})();
