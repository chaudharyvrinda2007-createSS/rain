const navbar = document.querySelector(".navbar");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const countryCodeSelect = document.getElementById("countryCode");
const languageSelect = document.querySelector(".language-select");
const counters = document.querySelectorAll(".counter");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (year) {
  year.textContent = new Date().getFullYear();
}

const countryCodes = [
  ["AF", "Afghanistan", "+93"], ["AL", "Albania", "+355"], ["DZ", "Algeria", "+213"], ["AD", "Andorra", "+376"],
  ["AO", "Angola", "+244"], ["AG", "Antigua & Barbuda", "+1-268"], ["AR", "Argentina", "+54"], ["AM", "Armenia", "+374"],
  ["AU", "Australia", "+61"], ["AT", "Austria", "+43"], ["AZ", "Azerbaijan", "+994"], ["BS", "Bahamas", "+1-242"],
  ["BH", "Bahrain", "+973"], ["BD", "Bangladesh", "+880"], ["BB", "Barbados", "+1-246"], ["BY", "Belarus", "+375"],
  ["BE", "Belgium", "+32"], ["BZ", "Belize", "+501"], ["BJ", "Benin", "+229"], ["BT", "Bhutan", "+975"],
  ["BO", "Bolivia", "+591"], ["BA", "Bosnia & Herzegovina", "+387"], ["BW", "Botswana", "+267"], ["BR", "Brazil", "+55"],
  ["BN", "Brunei", "+673"], ["BG", "Bulgaria", "+359"], ["BF", "Burkina Faso", "+226"], ["BI", "Burundi", "+257"],
  ["KH", "Cambodia", "+855"], ["CM", "Cameroon", "+237"], ["CA", "Canada", "+1"], ["CV", "Cape Verde", "+238"],
  ["CF", "Central African Republic", "+236"], ["TD", "Chad", "+235"], ["CL", "Chile", "+56"], ["CN", "China", "+86"],
  ["CO", "Colombia", "+57"], ["KM", "Comoros", "+269"], ["CG", "Congo", "+242"], ["CD", "DR Congo", "+243"],
  ["CK", "Cook Islands", "+682"], ["CR", "Costa Rica", "+506"], ["HR", "Croatia", "+385"], ["CU", "Cuba", "+53"],
  ["CY", "Cyprus", "+357"], ["CZ", "Czech Republic", "+420"], ["DK", "Denmark", "+45"], ["DJ", "Djibouti", "+253"],
  ["DM", "Dominica", "+1-767"], ["DO", "Dominican Republic", "+1-809"], ["EC", "Ecuador", "+593"], ["EG", "Egypt", "+20"],
  ["SV", "El Salvador", "+503"], ["GQ", "Equatorial Guinea", "+240"], ["ER", "Eritrea", "+291"], ["EE", "Estonia", "+372"],
  ["SZ", "Eswatini", "+268"], ["ET", "Ethiopia", "+251"], ["FJ", "Fiji", "+679"], ["FI", "Finland", "+358"],
  ["FR", "France", "+33"], ["GA", "Gabon", "+241"], ["GM", "Gambia", "+220"], ["GE", "Georgia", "+995"],
  ["DE", "Germany", "+49"], ["GH", "Ghana", "+233"], ["GI", "Gibraltar", "+350"], ["GR", "Greece", "+30"],
  ["GL", "Greenland", "+299"], ["GD", "Grenada", "+1-473"], ["GT", "Guatemala", "+502"], ["GN", "Guinea", "+224"],
  ["GW", "Guinea-Bissau", "+245"], ["GY", "Guyana", "+592"], ["HT", "Haiti", "+509"], ["HN", "Honduras", "+504"],
  ["HK", "Hong Kong", "+852"], ["HU", "Hungary", "+36"], ["IS", "Iceland", "+354"], ["IN", "India", "+91"],
  ["ID", "Indonesia", "+62"], ["IR", "Iran", "+98"], ["IQ", "Iraq", "+964"], ["IE", "Ireland", "+353"],
  ["IM", "Isle of Man", "+44-1624"], ["IL", "Israel", "+972"], ["IT", "Italy", "+39"], ["JM", "Jamaica", "+1-876"],
  ["JP", "Japan", "+81"], ["JE", "Jersey", "+44-1534"], ["JO", "Jordan", "+962"], ["KZ", "Kazakhstan", "+7"],
  ["KE", "Kenya", "+254"], ["KI", "Kiribati", "+686"], ["KW", "Kuwait", "+965"], ["KG", "Kyrgyzstan", "+996"],
  ["LA", "Laos", "+856"], ["LV", "Latvia", "+371"], ["LB", "Lebanon", "+961"], ["LS", "Lesotho", "+266"],
  ["LR", "Liberia", "+231"], ["LY", "Libya", "+218"], ["LI", "Liechtenstein", "+423"], ["LT", "Lithuania", "+370"],
  ["LU", "Luxembourg", "+352"], ["MO", "Macao", "+853"], ["MG", "Madagascar", "+261"], ["MW", "Malawi", "+265"],
  ["MY", "Malaysia", "+60"], ["MV", "Maldives", "+960"], ["ML", "Mali", "+223"], ["MT", "Malta", "+356"],
  ["MH", "Marshall Islands", "+692"], ["MR", "Mauritania", "+222"], ["MU", "Mauritius", "+230"], ["MX", "Mexico", "+52"],
  ["FM", "Micronesia", "+691"], ["MD", "Moldova", "+373"], ["MC", "Monaco", "+377"], ["MN", "Mongolia", "+976"],
  ["ME", "Montenegro", "+382"], ["MA", "Morocco", "+212"], ["MZ", "Mozambique", "+258"], ["MM", "Myanmar", "+95"],
  ["NA", "Namibia", "+264"], ["NR", "Nauru", "+674"], ["NP", "Nepal", "+977"], ["NL", "Netherlands", "+31"],
  ["NZ", "New Zealand", "+64"], ["NI", "Nicaragua", "+505"], ["NE", "Niger", "+227"], ["NG", "Nigeria", "+234"],
  ["KP", "North Korea", "+850"], ["MK", "North Macedonia", "+389"], ["NO", "Norway", "+47"], ["OM", "Oman", "+968"],
  ["PK", "Pakistan", "+92"], ["PW", "Palau", "+680"], ["PS", "Palestine", "+970"], ["PA", "Panama", "+507"],
  ["PG", "Papua New Guinea", "+675"], ["PY", "Paraguay", "+595"], ["PE", "Peru", "+51"], ["PH", "Philippines", "+63"],
  ["PL", "Poland", "+48"], ["PT", "Portugal", "+351"], ["PR", "Puerto Rico", "+1-787"], ["QA", "Qatar", "+974"],
  ["RO", "Romania", "+40"], ["RU", "Russia", "+7"], ["RW", "Rwanda", "+250"], ["KN", "Saint Kitts & Nevis", "+1-869"],
  ["LC", "Saint Lucia", "+1-758"], ["VC", "Saint Vincent", "+1-784"], ["WS", "Samoa", "+685"], ["SM", "San Marino", "+378"],
  ["ST", "Sao Tome & Principe", "+239"], ["SA", "Saudi Arabia", "+966"], ["SN", "Senegal", "+221"], ["RS", "Serbia", "+381"],
  ["SC", "Seychelles", "+248"], ["SL", "Sierra Leone", "+232"], ["SG", "Singapore", "+65"], ["SK", "Slovakia", "+421"],
  ["SI", "Slovenia", "+386"], ["SB", "Solomon Islands", "+677"], ["SO", "Somalia", "+252"], ["ZA", "South Africa", "+27"],
  ["KR", "South Korea", "+82"], ["SS", "South Sudan", "+211"], ["ES", "Spain", "+34"], ["LK", "Sri Lanka", "+94"],
  ["SD", "Sudan", "+249"], ["SR", "Suriname", "+597"], ["SE", "Sweden", "+46"], ["CH", "Switzerland", "+41"],
  ["SY", "Syria", "+963"], ["TW", "Taiwan", "+886"], ["TJ", "Tajikistan", "+992"], ["TZ", "Tanzania", "+255"],
  ["TH", "Thailand", "+66"], ["TL", "Timor-Leste", "+670"], ["TG", "Togo", "+228"], ["TO", "Tonga", "+676"],
  ["TT", "Trinidad & Tobago", "+1-868"], ["TN", "Tunisia", "+216"], ["TR", "Turkey", "+90"], ["TM", "Turkmenistan", "+993"],
  ["TV", "Tuvalu", "+688"], ["UG", "Uganda", "+256"], ["UA", "Ukraine", "+380"], ["AE", "UAE", "+971"],
  ["GB", "United Kingdom", "+44"], ["US", "United States", "+1"], ["UY", "Uruguay", "+598"], ["UZ", "Uzbekistan", "+998"],
  ["VU", "Vanuatu", "+678"], ["VA", "Vatican City", "+379"], ["VE", "Venezuela", "+58"], ["VN", "Vietnam", "+84"],
  ["YE", "Yemen", "+967"], ["ZM", "Zambia", "+260"], ["ZW", "Zimbabwe", "+263"],
];

const countryFlag = (isoCode) => isoCode
  .toUpperCase()
  .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

if (countryCodeSelect) {
  countryCodeSelect.innerHTML = countryCodes
    .map(([isoCode, country, code]) => {
      return `<option value="${code}" title="${country}"${code === "+91" ? " selected" : ""}>${countryFlag(isoCode)} ${code}</option>`;
    })
    .join("");
}

const i18n = {
  defaultLanguage: "en",
  storageKey: "hbcPreferredLanguage",
  dictionaries: {},
  textNodes: [],
  attributes: [],
  originalTitle: document.title,
};

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const getTranslation = (source, dictionary = i18n.dictionaries.en) => {
  const key = normalizeText(source);
  if (!key) return source;
  return dictionary?.text?.[key] || i18n.dictionaries.en?.text?.[key] || source;
};

const getUiTranslation = (key, fallback = key) => {
  const language = languageSelect?.value || localStorage.getItem(i18n.storageKey) || i18n.defaultLanguage;
  const dictionary = i18n.dictionaries[language] || i18n.dictionaries.en;
  return dictionary?.ui?.[key] || i18n.dictionaries.en?.ui?.[key] || fallback;
};

const collectTranslatableContent = () => {
  const ignoredTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH"]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ignoredTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-i18n-ignore]")) return NodeFilter.FILTER_REJECT;
      return normalizeText(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  i18n.textNodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    i18n.textNodes.push({
      node,
      source: normalizeText(node.nodeValue),
    });
  }

  const attributeNames = ["aria-label", "alt", "title", "placeholder"];
  i18n.attributes = [];
  document.querySelectorAll(attributeNames.map((name) => `[${name}]`).join(",")).forEach((element) => {
    attributeNames.forEach((name) => {
      const value = element.getAttribute(name);
      if (!normalizeText(value)) return;
      i18n.attributes.push({ element, name, source: normalizeText(value) });
    });
  });
};

const buildFallbackDictionary = () => {
  // Built directly from the page's own current (English) markup, so the
  // site can still switch language cleanly even if translations/en.json
  // itself fails to load for some reason (offline, blocked request, etc).
  const text = {};
  i18n.textNodes.forEach(({ source }) => {
    if (source) text[source] = source;
  });
  i18n.attributes.forEach(({ source }) => {
    if (source) text[source] = source;
  });
  return { lang: "en", dir: "ltr", title: i18n.originalTitle, text, ui: {} };
};

const loadLanguage = async (language) => {
  if (i18n.dictionaries[language]) return i18n.dictionaries[language];
  try {
    const response = await fetch(`translations/${language}.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Could not load language: ${language} (HTTP ${response.status})`);
    const dictionary = await response.json();
    i18n.dictionaries[language] = dictionary;
    return dictionary;
  } catch (error) {
    console.warn(`[i18n] Failed to load "${language}":`, error.message);
    if (language === i18n.defaultLanguage) {
      // Last resort so the switcher never fully breaks: build an
      // English dictionary straight from the live DOM.
      const fallback = buildFallbackDictionary();
      i18n.dictionaries[language] = fallback;
      return fallback;
    }
    throw error;
  }
};

const applyLanguage = async (language) => {
  const selectedLanguage = language || i18n.defaultLanguage;
  const dictionary = await loadLanguage(selectedLanguage).catch(async () => loadLanguage(i18n.defaultLanguage));

  document.documentElement.lang = dictionary.lang || selectedLanguage;
  document.documentElement.dir = dictionary.dir || "ltr";
  document.title = dictionary.title || getTranslation(i18n.originalTitle, dictionary);

  i18n.textNodes.forEach(({ node, source }) => {
    node.nodeValue = getTranslation(source, dictionary);
  });

  i18n.attributes.forEach(({ element, name, source }) => {
    element.setAttribute(name, getTranslation(source, dictionary));
  });

  if (languageSelect) languageSelect.value = selectedLanguage;
  localStorage.setItem(i18n.storageKey, selectedLanguage);
  window.dispatchEvent(new CustomEvent("hbc:languagechange", { detail: { language: selectedLanguage } }));
};

const safeStorage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("[i18n] localStorage unavailable:", error.message);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("[i18n] Could not persist language preference:", error.message);
    }
  },
};

const initLanguageSwitcher = async () => {
  if (!languageSelect) return;

  // Attach the change handler FIRST and unconditionally, so a switch
  // still works even if the very first language load below has a
  // problem. Every language load already has its own fallback, but
  // this is a second safety net so the dropdown is never dead weight.
  languageSelect.addEventListener("change", () => {
    applyLanguage(languageSelect.value).catch((error) => {
      console.warn("[i18n] Failed to apply language, reverting to default:", error.message);
      applyLanguage(i18n.defaultLanguage).catch(() => {});
    });
  });

  try {
    collectTranslatableContent();
    await loadLanguage(i18n.defaultLanguage);
    const savedLanguage = safeStorage.get(i18n.storageKey) || i18n.defaultLanguage;
    await applyLanguage(savedLanguage);
  } catch (error) {
    console.warn("[i18n] Language switcher failed to initialize fully:", error.message);
  }
};

initLanguageSwitcher();

const createZoomViewer = () => {
  const viewer = document.createElement("div");
  viewer.className = "image-zoom-viewer";
  viewer.hidden = true;
  viewer.innerHTML = `
    <button class="image-zoom-close" type="button" aria-label="${getUiTranslation("closeImagePreview", "Close image preview")}">${getUiTranslation("close", "Close")}</button>
    <figure>
      <img src="" alt="">
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(viewer);

  const image = viewer.querySelector("img");
  const caption = viewer.querySelector("figcaption");
  const closeButton = viewer.querySelector("button");

  const updateViewerLanguage = () => {
    closeButton.textContent = getUiTranslation("close", "Close");
    closeButton.setAttribute("aria-label", getUiTranslation("closeImagePreview", "Close image preview"));
  };
  window.addEventListener("hbc:languagechange", updateViewerLanguage);
  updateViewerLanguage();

  const close = () => {
    viewer.hidden = true;
    document.body.classList.remove("zoom-open");
    image.src = "";
  };

  closeButton.addEventListener("click", close);
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !viewer.hidden) close();
  });

  return {
    open(src, alt) {
      image.src = src;
      image.alt = alt;
      caption.textContent = alt;
      viewer.hidden = false;
      document.body.classList.add("zoom-open");
      closeButton.focus();
    },
  };
};

const zoomViewer = createZoomViewer();


document.addEventListener("click", (event) => {
  const jppCard = event.target.closest(".jpp-gallery-card");
  if (jppCard) {
    zoomViewer.open(jppCard.dataset.zoomSrc, jppCard.dataset.zoomAlt);
    return;
  }

  const galleryCard = event.target.closest(".gallery-product-card");
  if (galleryCard) {
    const galleryImage = galleryCard.querySelector("img");
    const zoomSrc = galleryCard.dataset.zoomSrc || galleryImage?.currentSrc || galleryImage?.src;
    const zoomAlt = galleryCard.dataset.zoomAlt || galleryImage?.alt || "Product image";
    if (zoomSrc) zoomViewer.open(zoomSrc, zoomAlt);
    return;
  }

  const zoomImage = event.target.closest(".store-product-media img, .gallery-product-card img");
  if (zoomImage) {
    zoomViewer.open(zoomImage.currentSrc || zoomImage.src, zoomImage.alt || "Product image");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const interactiveCard = event.target.closest(".jpp-gallery-card, .gallery-product-card");
  if (!interactiveCard) return;
  event.preventDefault();
  const galleryImage = interactiveCard.querySelector("img");
  const zoomSrc = interactiveCard.dataset.zoomSrc || galleryImage?.currentSrc || galleryImage?.src;
  const zoomAlt = interactiveCard.dataset.zoomAlt || galleryImage?.alt || "Product image";
  if (zoomSrc) zoomViewer.open(zoomSrc, zoomAlt);
});

const updateNavbar = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 30);
};

const initHeroScrollStory = () => {
  if (prefersReducedMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const hero = document.querySelector(".hero");
  if (!hero) return;

  gsap.registerPlugin(ScrollTrigger);

  // Pins the hero in place for a short scroll distance, then releases it
  // quickly so the next section glides up fast and smoothly. Nothing in
  // the hero fades or zooms - the headline, tagline, and buttons stay
  // fully visible the whole time.
  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "+=250",
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
};

updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });
initHeroScrollStory();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .btn, .footer-list a").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("mainNavbar");
    if (!menu || !menu.classList.contains("show")) return;
    if (typeof bootstrap === "undefined") return;
    const collapse = bootstrap.Collapse.getOrCreateInstance(menu);
    collapse.hide();
  });
});

const animateCounter = (counter) => {
  if (counter.dataset.animated === "true") return;
  counter.dataset.animated = "true";
  const target = Number(counter.dataset.count || 0);
  if (prefersReducedMotion) {
    counter.textContent = target;
    return;
  }

  const duration = 1300;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
} else {
  counters.forEach(animateCounter);
}

const setActiveNavLink = () => {
  const scrollPosition = window.scrollY + 130;
  let currentId = "home";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
};

setActiveNavLink();
window.addEventListener("scroll", setActiveNavLink, { passive: true });

if (contactForm && formStatus) {
  const notificationEndpoint = window.HBC_NOTIFICATION_ENDPOINT || "/.netlify/functions/enquiry-notification";
  const web3formsAccessKey = (window.HBC_WEB3FORMS_ACCESS_KEY || "").trim();
  const recaptchaSiteKey = (window.HBC_RECAPTCHA_SITE_KEY || "").trim();
  let enquirySubmitting = false;

  const RECAPTCHA_LOAD_TIMEOUT_MS = 8000;
  const RECAPTCHA_LOAD_RETRIES = 1;

  const loadRecaptchaScriptOnce = () => new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(resolve);
      return;
    }

    const existing = document.querySelector('script[data-recaptcha-loader="hbc"]');
    if (existing) {
      existing.addEventListener("load", () => window.grecaptcha && window.grecaptcha.ready(resolve));
      existing.addEventListener("error", () => reject(Object.assign(new Error("reCAPTCHA could not load"), { code: "load-failed" })));
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(Object.assign(new Error("reCAPTCHA timed out"), { code: "load-failed" }));
    }, RECAPTCHA_LOAD_TIMEOUT_MS);

    const script = document.createElement("script");
    script.dataset.recaptchaLoader = "hbc";
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      clearTimeout(timeoutId);
      window.grecaptcha ? window.grecaptcha.ready(resolve) : reject(Object.assign(new Error("reCAPTCHA did not initialize"), { code: "load-failed" }));
    };
    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(Object.assign(new Error("reCAPTCHA could not load"), { code: "load-failed" }));
    };
    document.head.appendChild(script);
  });

  const loadRecaptcha = async () => {
    let lastError;
    for (let attempt = 0; attempt <= RECAPTCHA_LOAD_RETRIES; attempt += 1) {
      try {
        return await loadRecaptchaScriptOnce();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };

  const getRecaptchaToken = async () => {
    await loadRecaptcha();
    try {
      return await window.grecaptcha.execute(recaptchaSiteKey, { action: "submit_enquiry" });
    } catch (error) {
      throw Object.assign(new Error("reCAPTCHA execute failed"), { code: "verify-failed", cause: error });
    }
  };

  // Primary path: Web3Forms. Works directly from static hosting like
  // GitHub Pages with no backend of any kind — just a free access key.
  const submitViaWeb3Forms = async (enquiry) => {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3formsAccessKey,
        subject: "New Website Enquiry - HBC Exports",
        from_name: "HBC Exports Website",
        name: enquiry.name,
        email: enquiry.email,
        mobile: enquiry.mobile,
        country: enquiry.country,
        message: enquiry.message,
        "Date & Time": enquiry.dateTime,
        botcheck: enquiry.website, // honeypot: must arrive empty
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Web3Forms submission failed");
    }
  };

  // Optional advanced path: only used if a reCAPTCHA site key has been
  // configured, meaning the site owner has followed NOTIFICATION_SETUP.md
  // to deploy the Netlify function (adds DB save + WhatsApp + SMS).
  const submitViaNetlify = async (enquiry) => {
    enquiry.recaptchaToken = await getRecaptchaToken();
    const response = await fetch(notificationEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
    });
    const result = await response.json().catch(() => ({}));
    if (response.status === 409) {
      const error = new Error("Duplicate submission");
      error.code = "duplicate";
      throw error;
    }
    if (!response.ok) throw new Error(result.error || "Notification request failed");
  };

  const validateEnquiryForm = () => {
    const email = contactForm.email?.value.trim() || "";
    const phone = contactForm.phone?.value.trim() || "";
    const message = contactForm.message?.value.trim() || "";
    if (!contactForm.checkValidity()) return getUiTranslation("completeRequired", "Please complete all required fields correctly.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return getUiTranslation("invalidEmail", "Please enter a valid email address.");
    if (!/^[0-9\s().-]{7,22}$/.test(phone)) return getUiTranslation("invalidMobile", "Please enter a valid mobile number.");
    if (message.length < 10) return getUiTranslation("shortMessage", "Please write a message with at least 10 characters.");
    return "";
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (enquirySubmitting) return;

    const validationError = validateEnquiryForm();
    if (validationError) {
      formStatus.hidden = false;
      formStatus.textContent = validationError;
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const selectedCountryCode = countryCodeSelect?.selectedOptions?.[0];
    const duplicateKey = [
      formData.get("email"),
      formData.get("countryCode"),
      formData.get("phone"),
      formData.get("message"),
    ].map((value) => String(value || "").trim().toLowerCase()).join("|");

    if (sessionStorage.getItem("hbcLastEnquiry") === duplicateKey) {
      formStatus.hidden = false;
      formStatus.textContent = getUiTranslation("duplicate", "This enquiry has already been submitted. HBC Exports will contact you shortly.");
      return;
    }

    const enquiry = {
      name: String(formData.get("name") || "").trim(),
      mobile: `${formData.get("countryCode") || ""} ${formData.get("phone") || ""}`.trim(),
      email: String(formData.get("email") || "").trim(),
      country: String(selectedCountryCode?.title || "").trim(),
      message: String(formData.get("message") || "").trim(),
      dateTime: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      website: String(formData.get("website") || "").trim(),
    };

    formStatus.hidden = false;
    formStatus.textContent = getUiTranslation("sending", "Sending your enquiry...");
    enquirySubmitting = true;
    if (submitButton) submitButton.disabled = true;

    try {
      if (web3formsAccessKey) {
        await submitViaWeb3Forms(enquiry);
      } else if (recaptchaSiteKey) {
        await submitViaNetlify(enquiry);
      } else {
        throw Object.assign(new Error("No enquiry backend is configured"), { code: "not-configured" });
      }

      sessionStorage.setItem("hbcLastEnquiry", duplicateKey);
      formStatus.textContent = getUiTranslation("success", "Thank you, {name}. Your enquiry has been sent successfully. HBC Exports will contact you shortly.")
        .replace("{name}", enquiry.name || getUiTranslation("there", "there"));
      contactForm.reset();
    } catch (error) {
      if (error.code === "duplicate") {
        sessionStorage.setItem("hbcLastEnquiry", duplicateKey);
        formStatus.textContent = getUiTranslation("duplicate", "This enquiry has already been submitted. HBC Exports will contact you shortly.");
      } else if (error.code === "not-configured") {
        console.error(
          "[enquiry-form] No enquiry backend is configured. Set window.HBC_WEB3FORMS_ACCESS_KEY in index.html (see the instructions right above it) to start receiving enquiries by email."
        );
        formStatus.textContent = getUiTranslation(
          "recaptchaMissing",
          "Our enquiry system isn't fully set up yet. Please email us or message us on WhatsApp directly so we don't miss your enquiry."
        );
      } else if (error.code === "load-failed") {
        console.warn("[enquiry-form] reCAPTCHA script failed to load:", error);
        formStatus.textContent = getUiTranslation(
          "recaptchaLoadFailed",
          "Spam protection could not load, possibly due to your connection or an ad blocker. Please refresh and try again."
        );
      } else if (error.code === "verify-failed") {
        console.warn("[enquiry-form] reCAPTCHA verification failed:", error.cause || error);
        formStatus.textContent = getUiTranslation(
          "recaptchaFailed",
          "Spam protection could not be verified. Please refresh and try again."
        );
      } else {
        console.warn("[enquiry-form] Enquiry submission failed:", error);
        formStatus.textContent = getUiTranslation("sendFailed", "Sorry, your enquiry could not be sent right now. Please contact us on WhatsApp or email.");
      }
    } finally {
      enquirySubmitting = false;
      if (submitButton) submitButton.disabled = false;
    }
  });
}
