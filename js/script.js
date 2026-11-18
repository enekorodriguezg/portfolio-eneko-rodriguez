/* ==========================================================================
   script.js · Selector de idioma ES / EN y visor de capturas
   --------------------------------------------------------------------------
   Único script del proyecto, y está justificado: HTML y CSS no pueden
   cambiar el texto de la página ni recordar la elección del usuario. El
   visor de capturas es una mejora progresiva: sin JavaScript, cada captura
   es un enlace normal que abre la imagen.

   Cómo funciona
   - El HTML contiene el texto en ESPAÑOL (idioma por defecto). Así la web es
     completamente legible aunque JavaScript no esté disponible.
   - Los elementos traducibles llevan data-i18n="clave".
   - Los atributos traducibles (aria-label, content, alt...) usan
     data-i18n-attr="atributo:clave; otroAtributo:otraClave".
   - El texto en español se lee del propio HTML la primera vez, así no hay
     que mantenerlo duplicado. Solo existe el diccionario EN de abajo.
   - La elección se guarda en localStorage y se aplica en todas las páginas.

   Para añadir un texto nuevo:
   1) escríbelo en español en el HTML con data-i18n="mi.clave"
   2) añade "mi.clave" al diccionario EN
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-lang';
  var DEFAULT_LANG = 'es';
  var SUPPORTED = ['es', 'en'];

  /* Diccionario en inglés */
  var EN = {
    /* Comunes */
    'skip': 'Skip to content',
    'nav.label': 'Main navigation',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'lang.label': 'Language',
    'lang.es': 'Switch to Spanish',
    'lang.en': 'Switch to English',
    'foot.top': 'Back to top',
    'term.caption': 'Decoration only: none of these commands actually run.',

    /* Metadatos */
    'meta.index.title': 'Home · Portfolio',
    'meta.index.desc': 'Personal software development portfolio: introduction, skills, experience and education.',
    'meta.projects.title': 'Projects · Portfolio',
    'meta.projects.desc': 'Developed projects: descriptions, technologies, repositories and demos.',
    'meta.contact.title': 'Contact · Portfolio',
    'meta.contact.desc': 'Ways to get in touch: email, social media and other channels.',

    /* Landing */
    'home.hello': 'hi, I am',
    'home.name': 'Eneko Rodríguez García',
    'home.role': 'Computer Engineering student (Management and Information Systems)',
    'home.intro': 'Computer Engineering student at the University of the Basque Country (UPV/EHU), focused on backend development, systems automation and cybersecurity. I build data pipelines, Python web applications and infrastructure that deploys itself.',
    'home.photo.alt': 'Photo of Eneko Rodríguez García',
    'home.cta.projects': 'View projects',
    'home.cta.contact': 'Get in touch',
    'home.cta.cv': 'Download CV (PDF)',
    'home.cta.cv.href': 'assets/docs/cv-eneko-rodriguez-en.pdf',
    'home.cta.cv.file': 'CV - Eneko Rodriguez (EN).pdf',
    'spec.location': 'Location',
    'spec.location.value': 'Bilbao, Spain',
    'spec.status': 'Availability',
    'spec.status.value': 'Open to work',
    'about.title': 'About me',
    'about.hint': 'background and interests',
    'about.p1': 'I completed the Technology Baccalaureate at Salesianos Deusto and since 2023 I have been studying Computer Engineering in Management and Information Systems at the Bilbao School of Engineering (UPV/EHU).',
    'about.p2': 'I am interested in everything that happens behind the interface: Python backends, Linux system administration, Bash automation, and application security and auditing. I also work with data science and Machine Learning, making sure models are production-ready.',
    'about.p3': 'I speak Spanish (native), English (C1, Cambridge) and Basque (C1).',
    'skills.title': 'Skills',
    'skills.hint': 'grouped by area',
    'skills.lang': 'Languages',
    'skills.data': 'Data & ML',
    'skills.infra': 'Infrastructure',
    'skills.sec': 'Security',
    'skills.spoken': 'Spoken languages',
    'skills.spoken.list': 'Spanish (native), English (C1), Basque (C1)',
    'exp.title': 'Experience',
    'exp.hint': 'personal and academic projects',
    'exp.1.period': 'Now',
    'exp.1.desc': 'Password manager in Rust · personal project in progress',
    'exp.2.period': '2023 – present',
    'exp.2.desc': 'Academic projects at UPV/EHU: B2B order API with FastAPI, NLP and Machine Learning analytics, Flask web application and server automation with Bash',
    'edu.title': 'Education',
    'edu.hint': 'degree, institution and years',
    'edu.1.period': '2023 – present',
    'edu.1.desc': 'BSc in Computer Engineering in Management and Information Systems · Bilbao School of Engineering (UPV/EHU)',
    'edu.2.desc': 'Technology Baccalaureate · Salesianos Deusto',
    'term.lang': 'en_US.UTF-8',
    'term.ls': 'ls ./projects',
    'term.motd': 'No templates, no frameworks: HTML, CSS and a little JS.',

    /* Proyectos */
    'proj.title': 'Projects',
    'proj.intro': 'A selection of backend, data and infrastructure projects: from a B2B order API deployed with Docker to natural language analytics and servers configured with a single script.',
    'proj.1.desc': 'Transactional backend for B2B order and sales management. REST API with JWT authentication and role-based access control (admin, sales and warehouse), PDF and RTF invoice generation, and a full Docker Compose deployment: MySQL database and Apache as a reverse proxy in front of FastAPI. Work in progress.',
    'proj.1.repo.href': 'https://github.com/enekorodriguezg/NexSale-B2B',
    'proj.2.title': 'NLP analytics: WhatsApp vs Telegram',
    'proj.2.desc': 'Natural language processing and Machine Learning pipeline that analyses user reviews to understand why people stay with or leave each app. It covers text cleaning and lemmatisation, LDA topic modelling, a comparison between classic classifiers and an LLM (Gemma 2) with few-shot prompting, and Tableau dashboards. Team project of four people.',
    'proj.3.title': 'Full stack web app: Pokédex API',
    'proj.3.desc': 'Flask platform that consumes external REST APIs and presents them in a dynamic Jinja2 interface. The architecture is organised into Blueprints so it scales and keeps routing and business logic cleanly separated.',
    'lightbox.label': 'Enlarged screenshot',
    'lightbox.close': 'Close',
    'proj.1.alt':'Swagger documentation for the NexSale-B2B API: order and product endpoints protected by authentication',
    'proj.2.alt': 'Tableau dashboard showing the monthly trend of positive and negative reviews from 2010 to 2025, with filters by gender and app',
    'proj.3.alt': 'Pikachu entry in the Pokédex: description, types, abilities and base stats',
    'proj.4.alt': 'Terminal running the provisioning script: project details and a menu of steps, from cloning the repository to installing MySQL and starting the service',
    'proj.3.stack': 'Python, Flask, Jinja2, Blueprints, REST APIs',
    'proj.access': 'Demo access',
    'proj.user': 'username',
    'proj.pass': 'password',
    'proj.3.access.hint': 'admin role: you can approve new accounts. Data is reset on every restart.',
    'proj.4.title': 'Systems and server automation (IaC)',
    'proj.4.desc': 'Infrastructure as Code tools in Bash that automate web server deployment and Nginx configuration, including automated database management and system service orchestration with Systemd.',
    'proj.shot': 'click to enlarge',
    'proj.stack': 'Technologies',
    'proj.repo': 'Repository',
    'proj.demo': 'Live demo',

    /* Contacto */
    'contact.title': 'Contact',
    'contact.lead': 'If you want to talk about a project, a job offer or just say hello, this is the place to reach me.',
    'contact.email': 'Email',
    'contact.email.hint': 'email address',
    'contact.other.title': 'Other channels',
    'term.mail': 'mail -s "Hello"',
    'term.queued': 'Message queued. Waiting for a reply…'
  };

  /* Texto original (español) leído del HTML */
  var ES = {};

  function parseAttrPairs(value) {
    /* "aria-label:nav.label; content:meta.desc" -> [["aria-label","nav.label"], ...] */
    return value.split(';').map(function (pair) {
      var i = pair.indexOf(':');
      return [pair.slice(0, i).trim(), pair.slice(i + 1).trim()];
    }).filter(function (p) { return p[0] && p[1]; });
  }

  function captureSpanish() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!(key in ES)) ES[key] = el.textContent;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      parseAttrPairs(el.getAttribute('data-i18n-attr')).forEach(function (p) {
        if (!(p[1] in ES)) ES[p[1]] = el.getAttribute(p[0]);
      });
    });
  }

  function lookup(lang, key) {
    var dict = lang === 'es' ? ES : EN;
    if (dict[key] === undefined) {
      console.warn('[i18n] Falta la traducción "' + lang + '" para la clave: ' + key);
      return ES[key];
    }
    return dict[key];
  }

  function apply(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = lookup(lang, el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      parseAttrPairs(el.getAttribute('data-i18n-attr')).forEach(function (p) {
        el.setAttribute(p[0], lookup(lang, p[1]));
      });
    });
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
  }

  function readStored() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(value) !== -1 ? value : null;
    } catch (e) {
      return null; /* localStorage bloqueado: se usa el idioma por defecto */
    }
  }

  function store(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* sin persistencia */ }
  }

  /* Visor de capturas: los enlaces .zoom abren su imagen en el <dialog id="lightbox">.
     Si no hay visor o el navegador no soporta <dialog>, el enlace abre la imagen sin más.
     Se cierra con Esc, con el botón × o pulsando en cualquier parte. */
  function initLightbox() {
    var dialog = document.getElementById('lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    var big = dialog.querySelector('img');

    document.querySelectorAll('a.zoom').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = link.querySelector('img');
        big.src = link.href;
        big.alt = thumb ? thumb.alt : '';
        dialog.showModal();
      });
    });

    dialog.addEventListener('click', function () { dialog.close(); });
  }

  function init() {
    captureSpanish();

    var lang = readStored() || DEFAULT_LANG;
    if (lang !== DEFAULT_LANG) apply(lang);

    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var chosen = btn.getAttribute('data-lang');
        apply(chosen);
        store(chosen);
      });
    });

    initLightbox();

    /* Easter egg para quien abra la consola */
    console.log('// ¿Mirando el código? Buena señal. / Reading the source? Good sign.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
