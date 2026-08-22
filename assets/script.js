// ---------- Backend connection ----------
// Paste your deployed Google Apps Script Web App URL here (see Code.gs setup instructions).
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwM2JdBSAmPrtKJI-Hkz84EfJFRtDgcyZEkKTbxOf316cedmxY4JnmWIyTuJArKsIzcKA/exec";

// ---------- Mobile nav ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('is-open');
      toggle.textContent = links.classList.contains('is-open') ? '✕' : '☰';
    });
  }

  // ---------- Article filters (articles.html) ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;
        cards.forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ---------- File drop label ----------
  const fileInput = document.getElementById('cv-file');
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const label = document.querySelector('.file-drop .fname');
      if (fileInput.files.length && label) {
        label.textContent = '✓ ' + fileInput.files[0].name;
      }
    });
  }

  // ---------- Application form ----------
  const form = document.getElementById('apply-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(input => {
<<<<<<< HEAD
        const field = input.closest('.field') || input.closest('.checkline');
        const missing = input.type === 'checkbox' ? !input.checked : !String(input.value || '').trim();
        if (missing) {
=======
        const field = input.closest('.field');
        if (!input.value.trim()) {
>>>>>>> de1f87d630660a834398ac81df0983fc5bdf0761
          valid = false;
          field && field.classList.add('has-error');
        } else {
          field && field.classList.remove('has-error');
        }
      });

      if (!valid) {
        const firstError = form.querySelector('.has-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '...'; }

      // Build payload
      const payload = {
        lang: document.documentElement.lang || '',
        fullname: form.fullname.value,
        birthdate: form.birthdate.value,
        email: form.email.value,
        phone: form.phone.value,
        country_res: form.country_res.value,
        nationality: form.nationality.value,
        education: form.education.value,
        field: form.field.value,
        experience: form.experience.value,
        languages: form.languages.value,
        target_country: form.target_country.value,
        job_field: form.job_field.value,
        message: form.message.value,
        cv_filename: '',
        cv_base64: '',
      };

      const showSuccess = (ref) => {
        const refEl = document.getElementById('ref-code');
        if (refEl) refEl.textContent = ref;
        form.style.display = 'none';
        const successPanel = document.getElementById('success-panel');
        if (successPanel) {
          successPanel.classList.add('is-visible');
          successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

<<<<<<< HEAD
      const showError = (message) => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
        alert(message || 'Something went wrong sending your application. Please try again, or email us directly.');
=======
      const showError = () => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
        alert('Something went wrong sending your application. Please try again, or email us directly.');
>>>>>>> de1f87d630660a834398ac81df0983fc5bdf0761
      };

      const doSubmit = () => {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.indexOf('PASTE_') === 0) {
          // Backend not configured yet — fall back to a local-only confirmation.
          const ref = 'EU-' + Math.random().toString(36).slice(2, 8).toUpperCase();
          showSuccess(ref);
          return;
        }
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight on Apps Script
          body: JSON.stringify(payload),
        })
          .then(r => r.json())
          .then(res => {
            if (res && res.ok) {
              showSuccess(res.ref);
            } else {
              showError();
            }
          })
          .catch(showError);
      };

      const fileInput = document.getElementById('cv-file');
      if (fileInput && fileInput.files.length) {
        const file = fileInput.files[0];
<<<<<<< HEAD
        const maxCvBytes = Number(fileInput.dataset.maxSize || 5242880);
        const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
        if (!isPdf) {
          showError('Please upload your CV as a PDF file.');
          return;
        }
        if (file.size > maxCvBytes) {
          showError('Your CV must be 5 MB or smaller.');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          payload.cv_filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 160);
          payload.cv_base64 = reader.result; // data URL, includes base64 + mime prefix
          doSubmit();
        };
        reader.onerror = () => showError('We could not read the CV file. Please try again or submit without it.');
=======
        const reader = new FileReader();
        reader.onload = () => {
          payload.cv_filename = file.name;
          payload.cv_base64 = reader.result; // data URL, includes base64 + mime prefix
          doSubmit();
        };
        reader.onerror = () => doSubmit(); // send without CV rather than block submission
>>>>>>> de1f87d630660a834398ac81df0983fc5bdf0761
        reader.readAsDataURL(file);
      } else {
        doSubmit();
      }
    });
  }
});

// =========================================================
// Support Assistant Widget (FAQ-based, no external API needed)
// =========================================================
(function () {
  const LANG = (document.documentElement.lang || 'en').slice(0, 2);
  const DIR = document.documentElement.dir || 'ltr';
  const inArticles = window.location.pathname.includes('/articles/');
  const base = inArticles ? '../' : '';

  const STRINGS = {
    en: {
      title: 'JobsEuro Assistant', subtitle: 'Usually replies instantly',
      greeting: "Hi! I'm here to help you learn more about JobsEuro. Ask me anything, or pick a topic below.",
      placeholder: 'Type your question…',
      quick: [
        { label: 'How do I apply?', key: 'apply' },
        { label: 'What is JobsEuro?', key: 'about' },
        { label: 'Is it free?', key: 'free' },
        { label: 'Visa & work permits', key: 'visa' },
        { label: 'Contact us', key: 'contact' },
      ],
      fallback: "I don't have an exact answer for that yet, but our team can help — reach out via the Contact page, or browse our Articles for detailed guides on working in Europe.",
      answers: {
        apply: 'Go to the "Apply" page, fill in your details and upload your CV — submissions are reviewed and you\'ll be contacted using the email you provide. You can also read our Europass CV guide first to make your application stronger.',
        about: 'JobsEuro is a free resource to help you find and apply for jobs across Europe. We publish in-depth guides (visas, EURES, country-specific job markets, interviews, diploma recognition, and more) plus a simple application form.',
        free: "Yes — reading the articles and submitting an application through JobsEuro is completely free.",
        visa: 'Every EU country has different rules. Start with our "Types of Visas & Work Permits" article, then check the country-specific guide for where you want to work.',
        contact: 'You can reach us anytime from the Contact page — we usually reply within a day or two.',
        articles: 'We have 20+ in-depth articles covering visas, EURES, CVs, language certificates, diploma recognition, cost of living, and country guides (Germany, France, Sweden, Italy and more) — check the Articles page.',
        languages: 'The site is available in English, French, German and Arabic — use the language switcher in the navigation bar.',
      },
<<<<<<< HEAD
      links: { apply: 'apply', articles: 'articles', contact: 'contact' },
=======
      links: { apply: 'apply.html', articles: 'articles.html', contact: 'contact.html' },
>>>>>>> de1f87d630660a834398ac81df0983fc5bdf0761
    },
    fr: {
      title: 'Assistant JobsEuro', subtitle: 'Réponse généralement instantanée',
      greeting: "Bonjour ! Je suis là pour vous aider à en savoir plus sur JobsEuro. Posez-moi une question ou choisissez un sujet ci-dessous.",
      placeholder: 'Écrivez votre question…',
      quick: [
        { label: 'Comment postuler ?', key: 'apply' },
        { label: "Qu'est-ce que JobsEuro ?", key: 'about' },
        { label: 'Est-ce gratuit ?', key: 'free' },
        { label: 'Visa et permis de travail', key: 'visa' },
        { label: 'Nous contacter', key: 'contact' },
      ],
      fallback: "Je n'ai pas de réponse exacte pour cela pour le moment, mais notre équipe peut vous aider — contactez-nous via la page Contact, ou consultez nos Articles pour des guides détaillés sur le travail en Europe.",
      answers: {
        apply: 'Rendez-vous sur la page "Postuler", renseignez vos informations et téléchargez votre CV — les candidatures sont examinées et vous serez contacté à l\'adresse indiquée. Consultez d\'abord notre guide du CV Europass pour renforcer votre candidature.',
        about: "JobsEuro est une ressource gratuite pour vous aider à trouver et postuler à des emplois en Europe. Nous publions des guides détaillés (visas, EURES, marchés du travail par pays, entretiens, reconnaissance des diplômes, etc.) ainsi qu'un formulaire de candidature simple.",
        free: 'Oui — la lecture des articles et l\'envoi d\'une candidature via JobsEuro sont entièrement gratuits.',
        visa: 'Chaque pays de l\'UE a des règles différentes. Commencez par notre article "Types de visas et permis de travail", puis consultez le guide du pays qui vous intéresse.',
        contact: 'Vous pouvez nous contacter à tout moment depuis la page Contact — nous répondons généralement sous un à deux jours.',
        articles: 'Nous avons plus de 20 articles détaillés sur les visas, EURES, le CV, les certificats de langue, la reconnaissance des diplômes, le coût de la vie et des guides par pays — consultez la page Articles.',
        languages: 'Le site est disponible en anglais, français, allemand et arabe — utilisez le sélecteur de langue dans le menu.',
      },
<<<<<<< HEAD
      links: { apply: 'apply', articles: 'articles', contact: 'contact' },
=======
      links: { apply: 'apply.html', articles: 'articles.html', contact: 'contact.html' },
>>>>>>> de1f87d630660a834398ac81df0983fc5bdf0761
    },
    de: {
      title: 'JobsEuro-Assistent', subtitle: 'Antwortet meist sofort',
      greeting: 'Hallo! Ich helfe dir gerne, mehr über JobsEuro zu erfahren. Stell mir eine Frage oder wähle unten ein Thema.',
      placeholder: 'Deine Frage eingeben…',
      quick: [
        { label: 'Wie bewerbe ich mich?', key: 'apply' },
        { label: 'Was ist JobsEuro?', key: 'about' },
        { label: 'Ist es kostenlos?', key: 'free' },
        { label: 'Visum & Arbeitserlaubnis', key: 'visa' },
        { label: 'Kontakt', key: 'contact' },
      ],
      fallback: 'Dazu habe ich noch keine genaue Antwort, aber unser Team hilft dir gerne weiter — über die Kontaktseite, oder stöbere in unseren Artikeln für ausführliche Ratgeber zum Arbeiten in Europa.',
      answers: {
        apply: 'Gehe zur Seite "Bewerben", trage deine Daten ein und lade deinen Lebenslauf hoch — Bewerbungen werden geprüft und du wirst über die angegebene E-Mail kontaktiert. Lies vorher gerne unseren Europass-Lebenslauf-Ratgeber.',
        about: 'JobsEuro ist eine kostenlose Anlaufstelle, um Jobs in ganz Europa zu finden und sich zu bewerben. Wir veröffentlichen ausführliche Ratgeber (Visa, EURES, länderspezifische Arbeitsmärkte, Vorstellungsgespräche, Anerkennung von Abschlüssen u. v. m.) sowie ein einfaches Bewerbungsformular.',
        free: 'Ja — das Lesen der Artikel und das Einreichen einer Bewerbung über JobsEuro sind komplett kostenlos.',
        visa: 'Jedes EU-Land hat eigene Regeln. Starte mit unserem Artikel "Visumarten & Arbeitserlaubnisse" und schau dir dann den Länderguide für dein Wunschland an.',
        contact: 'Du erreichst uns jederzeit über die Kontaktseite — wir antworten in der Regel innerhalb von ein bis zwei Tagen.',
        articles: 'Wir haben über 20 ausführliche Artikel zu Visa, EURES, Lebenslauf, Sprachzertifikaten, Anerkennung von Abschlüssen, Lebenshaltungskosten und Länderguides — schau auf der Artikel-Seite vorbei.',
        languages: 'Die Website gibt es auf Englisch, Französisch, Deutsch und Arabisch — nutze den Sprachumschalter im Menü.',
      },
<<<<<<< HEAD
      links: { apply: 'apply', articles: 'articles', contact: 'contact' },
=======
      links: { apply: 'apply.html', articles: 'articles.html', contact: 'contact.html' },
>>>>>>> de1f87d630660a834398ac81df0983fc5bdf0761
    },
    ar: {
      title: 'مساعد JobsEuro', subtitle: 'يرد عادة بشكل فوري',
      greeting: 'مرحبًا! أنا هنا لمساعدتك على معرفة المزيد عن JobsEuro. اسألني أي شيء أو اختر موضوعًا من الأسفل.',
      placeholder: 'اكتب سؤالك…',
      quick: [
        { label: 'كيف أقدّم؟', key: 'apply' },
        { label: 'ما هو JobsEuro؟', key: 'about' },
        { label: 'هل الخدمة مجانية؟', key: 'free' },
        { label: 'التأشيرات وتصاريح العمل', key: 'visa' },
        { label: 'تواصل معنا', key: 'contact' },
      ],
      fallback: 'ليس لدي إجابة دقيقة عن هذا حاليًا، لكن فريقنا يسعده مساعدتك — تواصل معنا عبر صفحة "تواصل معنا"، أو تصفّح المقالات للحصول على أدلة تفصيلية عن العمل في أوروبا.',
      answers: {
        apply: 'اذهب إلى صفحة "التقديم"، واملأ بياناتك وارفع سيرتك الذاتية — سيتم مراجعة الطلبات والتواصل معك عبر البريد الإلكتروني الذي تدخله. يمكنك أولًا قراءة دليل السيرة الذاتية Europass لتقوية طلبك.',
        about: 'JobsEuro مصدر مجاني يساعدك على إيجاد فرص عمل في أوروبا والتقديم عليها. ننشر مقالات تفصيلية (التأشيرات، EURES، أسواق العمل حسب الدولة، مقابلات العمل، معادلة الشهادات، وغيرها) بالإضافة إلى نموذج تقديم بسيط.',
        free: 'نعم — قراءة المقالات وتقديم طلب عبر JobsEuro مجاني بالكامل.',
        visa: 'لكل دولة أوروبية قوانينها الخاصة. ابدأ بمقالة "أنواع التأشيرات وتصاريح العمل"، ثم راجع دليل الدولة التي تريد العمل فيها.',
        contact: 'يمكنك التواصل معنا في أي وقت عبر صفحة "تواصل معنا" — نرد عادة خلال يوم أو يومين.',
        articles: 'لدينا أكثر من 20 مقالة تفصيلية تغطي التأشيرات وEURES والسيرة الذاتية وشهادات اللغة ومعادلة الشهادات وتكلفة المعيشة وأدلة الدول (ألمانيا، فرنسا، السويد، إيطاليا وغيرها) — راجع صفحة المقالات.',
        languages: 'الموقع متوفر بالإنجليزية والفرنسية والألمانية والعربية — استخدم مبدّل اللغة في القائمة العلوية.',
      },
<<<<<<< HEAD
      links: { apply: 'apply', articles: 'articles', contact: 'contact' },
=======
      links: { apply: 'apply.html', articles: 'articles.html', contact: 'contact.html' },
>>>>>>> de1f87d630660a834398ac81df0983fc5bdf0761
    },
  };

  const T = STRINGS[LANG] || STRINGS.en;

  // Keyword rules (checked in order) — matched against lowercased user input, language-aware.
  const RULES = {
    en: [
      [['apply', 'application', 'cv', 'resume', 'submit'], 'apply'],
      [['free', 'cost', 'price', 'pay', 'fee'], 'free'],
      [['visa', 'permit', 'work permit'], 'visa'],
      [['article', 'guide', 'blog'], 'articles'],
      [['language', 'french', 'german', 'arabic', 'english'], 'languages'],
      [['contact', 'email', 'reach', 'support'], 'contact'],
      [['what is', 'about', 'jobseuro'], 'about'],
    ],
    fr: [
      [['postul', 'candidat', 'cv'], 'apply'],
      [['gratuit', 'coût', 'prix', 'payer'], 'free'],
      [['visa', 'permis'], 'visa'],
      [['article', 'guide', 'blog'], 'articles'],
      [['langue', 'français', 'allemand', 'arabe', 'anglais'], 'languages'],
      [['contact', 'email', 'joindre'], 'contact'],
      [['qu\'est', 'jobseuro', 'quoi'], 'about'],
    ],
    de: [
      [['bewerb', 'lebenslauf', 'cv'], 'apply'],
      [['kostenlos', 'kosten', 'preis', 'gebühr'], 'free'],
      [['visum', 'erlaubnis', 'permit'], 'visa'],
      [['artikel', 'ratgeber', 'blog'], 'articles'],
      [['sprache', 'französisch', 'deutsch', 'arabisch', 'englisch'], 'languages'],
      [['kontakt', 'email', 'erreichen'], 'contact'],
      [['was ist', 'jobseuro'], 'about'],
    ],
    ar: [
      [['قدم', 'تقديم', 'سيرة', 'طلب'], 'apply'],
      [['مجان', 'تكلفة', 'سعر', 'دفع'], 'free'],
      [['تأشير', 'تصريح', 'فيزا'], 'visa'],
      [['مقال', 'دليل'], 'articles'],
      [['لغة', 'فرنسية', 'ألمانية', 'عربية', 'انجليزية', 'إنجليزية'], 'languages'],
      [['تواصل', 'ايميل', 'بريد'], 'contact'],
      [['ما هو', 'jobseuro', 'الموقع'], 'about'],
    ],
  };

  function matchAnswer(text) {
    const q = text.toLowerCase();
    const rules = RULES[LANG] || RULES.en;
    for (const [keywords, key] of rules) {
      if (keywords.some(k => q.includes(k))) return T.answers[key];
    }
    return T.fallback;
  }

  function buildWidget() {
    const root = document.createElement('div');
    root.className = 'support-widget';
    root.setAttribute('dir', DIR);

    root.innerHTML = `
      <div class="support-panel" role="dialog" aria-label="${T.title}">
        <div class="support-header">
          <div class="support-avatar">JE</div>
          <div>
            <div class="support-title">${T.title}</div>
            <div class="support-subtitle">${T.subtitle}</div>
          </div>
        </div>
        <div class="support-body" id="support-body"></div>
        <div class="support-quick" id="support-quick"></div>
        <form class="support-form" id="support-form">
          <input type="text" id="support-input" placeholder="${T.placeholder}" autocomplete="off" />
          <button type="submit" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
      <button class="support-fab" aria-label="${T.title}" aria-expanded="false">
        <span class="fab-dot"></span>
        <svg class="fab-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        <svg class="fab-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    document.body.appendChild(root);

    const fab = root.querySelector('.support-fab');
    const body = root.querySelector('#support-body');
    const quick = root.querySelector('#support-quick');
    const form = root.querySelector('#support-form');
    const input = root.querySelector('#support-input');

    function addMsg(text, who) {
      const div = document.createElement('div');
      div.className = 'support-msg ' + who;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function addLinkedMsg(text, who) {
      addMsg(text, who);
    }

    function respond(userText) {
      addMsg(userText, 'user');
      window.setTimeout(() => addLinkedMsg(matchAnswer(userText), 'bot'), 350);
    }

    let started = false;
    function openPanel() {
      root.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      if (!started) {
        started = true;
        addMsg(T.greeting, 'bot');
      }
      input.focus();
    }
    function closePanel() {
      root.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
    }

    fab.addEventListener('click', () => {
      root.classList.contains('is-open') ? closePanel() : openPanel();
    });

    T.quick.forEach(q => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = q.label;
      btn.addEventListener('click', () => respond(q.label, q.key));
      quick.appendChild(btn);
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      respond(val);
      input.value = '';
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
