/* Chaos to Clarity | shared: mobile menu and the consult form */
(() => {
  // Mobile menu
  const btn = document.querySelector('.menu');
  const nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    }));
  }

  // Consult form, sent through EmailJS.
  // Fill these three in from the EmailJS dashboard before launch.
  const EMAILJS = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
  };
  const configured = !Object.values(EMAILJS).some(v => v.startsWith('YOUR_'));
  const FALLBACK = 'brookebloker@chaostoclarityllc.com';

  document.querySelectorAll('form.consult').forEach(form => {
    const status = form.querySelector('.form-status');
    const send = form.querySelector('button.send');
    const say = (msg, kind) => { status.textContent = msg; status.className = 'form-status ' + (kind || ''); };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.website && form.website.value) return; // honeypot: bots fill it, people never see it
      if (!form.reportValidity()) return;

      if (!configured) {
        say('This form isn’t connected yet. Email ' + FALLBACK + ' instead.', 'err');
        return;
      }
      const data = Object.fromEntries(new FormData(form).entries());
      delete data.website;
      send.disabled = true;
      say('Sending…');
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAILJS.serviceId,
            template_id: EMAILJS.templateId,
            user_id: EMAILJS.publicKey,
            template_params: data
          })
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say('Thanks. Brooke will be in touch within two business days.', 'ok');
      } catch (err) {
        say('That didn’t go through. Try again, or email ' + FALLBACK + '.', 'err');
      } finally {
        send.disabled = false;
      }
    });
  });
})();
