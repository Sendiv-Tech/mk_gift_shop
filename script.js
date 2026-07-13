'use strict';

/* ==============================================================
   DATA STORE
   ============================================================== */
let products = [
  { id:1, code:'G101', name:'Luxury Rose Gift Box', price:1299, original:1599, cat:'Love & Romance', stock:'in', icon:'🌹', badge:'bestseller', bestseller:true, discount:19 },
  { id:2, code:'B204', name:'Birthday Surprise Hamper', price:1899, original:2199, cat:'Birthday', stock:'in', icon:'🎂', badge:'bestseller', bestseller:true, discount:14 },
  { id:3, code:'W305', name:'Wedding Elegance Set', price:3499, original:3999, cat:'Wedding', stock:'in', icon:'💍', badge:'new', bestseller:false, discount:0 },
  { id:4, code:'F406', name:'Friendship Bracelet Kit', price:799, original:799, cat:'Friendship', stock:'in', icon:'🤝', badge:'', bestseller:true, discount:0 },
  { id:5, code:'A512', name:'Anniversary Candle Set', price:1149, original:1399, cat:'Love & Romance', stock:'in', icon:'🕯️', badge:'discount', bestseller:false, discount:18 },
  { id:6, code:'K613', name:'Kids Rainbow Toy Box', price:899, original:899, cat:'Kids', stock:'out', icon:'🌈', badge:'', bestseller:false, discount:0 },
  { id:7, code:'C714', name:'Corporate Gift Hamper', price:2499, original:2999, cat:'Corporate', stock:'in', icon:'💼', badge:'combo', bestseller:false, discount:17 },
  { id:8, code:'S815', name:'Baby Shower Dream Bundle', price:1799, original:1799, cat:'Baby Shower', stock:'sold', icon:'🍼', badge:'new', bestseller:false, discount:0 },
  { id:9, code:'F916', name:'Festival Diwali Pack', price:1599, original:1999, cat:'Festival', stock:'in', icon:'🪔', badge:'discount', bestseller:true, discount:20 },
  { id:10, code:'G017', name:'Golden Scented Hamper', price:2199, original:2499, cat:'Birthday', stock:'in', icon:'🧴', badge:'', bestseller:false, discount:12 },
];

let offers = [
  { id:1, title:'Valentine\'s Special', desc:'Up to 30% off on all Love & Romance collections. Express your feelings beautifully.', discount:30, tag:'Love & Romance', start:'2025-02-01', end:'2025-02-14' },
  { id:2, title:'Summer Gifting Fiesta', desc:'Beat the heat with our cool combo packs — free gift wrapping on orders above ₹1000.', discount:20, tag:'All Categories', start:'2025-06-01', end:'2025-08-31' },
  { id:3, title:'Diwali Grand Sale', desc:'Celebrate the festival of lights with exclusive hampers at unbeatable prices.', discount:25, tag:'Festival', start:'2025-10-15', end:'2025-10-25' },
  { id:4, title:'Friendship Week Bonanza', desc:'Gift your best friend something special — flat 15% off on Friendship gifts.', discount:15, tag:'Friendship', start:'2025-08-01', end:'2025-08-07' },
];

let reviews = [
  { name:'Priya S.', product:'Rose Gift Box', rating:5, text:'Absolutely stunning packaging! My partner was moved to tears. Will definitely order again.', date:'Jun 2025', initial:'P' },
  { name:'Rahul M.', product:'Birthday Hamper', rating:5, text:'Premium quality, fast delivery. The hamper was even better than the photos suggest!', date:'May 2025', initial:'R' },
  { name:'Sneha K.', product:'Candle Set', rating:4, text:'Beautiful set, very romantic ambiance. Came well packed with a lovely handwritten note!', date:'Apr 2025', initial:'S' },
  { name:'Arjun T.', product:'Corporate Hamper', rating:5, text:'Ordered 20 pieces for our team — impeccable quality and on-time delivery. Highly recommended!', date:'Mar 2025', initial:'A' },
];

let categories = [
  { name:'Birthday', icon:'🎂', quote:'Make their day extraordinary', count:24 },
  { name:'Love & Romance', icon:'💝', quote:'A small gift, a big emotion', count:18 },
  { name:'Wedding', icon:'💍', quote:'Begin forever beautifully', count:15 },
  { name:'Friendship', icon:'🤝', quote:'Friends who gift, stay together', count:12 },
  { name:'Baby Shower', icon:'🍼', quote:'Celebrate the little miracle', count:9 },
  { name:'Festival', icon:'🪔', quote:'Light up the celebration', count:20 },
  { name:'Corporate', icon:'💼', quote:'Impress with elegance', count:11 },
  { name:'Kids', icon:'🌈', quote:'Joy in every colour', count:16 },
];

let cart = [];
let nextId = products.length + 1;
let isLoggedIn = false;

/* Feature-detect: skip decorative effects on touch devices or for users who prefer reduced motion */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==============================================================
   LIQUID BACKGROUND CANVAS
   ============================================================== */
(function initCanvas() {
  if (prefersReducedMotion) return; // skip animated background entirely
  const canvas = document.getElementById('liquid-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, blobs;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeBlob() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: 180 + Math.random() * 220,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      hue: [[123,30,58],[61,31,110],[230,18,122]][Math.floor(Math.random() * 3)],
      phase: Math.random() * Math.PI * 2,
    };
  }

  function init() { resize(); blobs = Array.from({length:5}, makeBlob); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.0008;
    blobs.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;
      const pulse = 1 + 0.15 * Math.sin(t + b.phase);
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * pulse);
      const [r,g,bv] = b.hue;
      grad.addColorStop(0, `rgba(${r},${g},${bv},0.18)`);
      grad.addColorStop(1, `rgba(${r},${g},${bv},0)`);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init(); draw();
})();

/* ==============================================================
   PARTICLES
   ============================================================== */
(function spawnParticles() {
  if (prefersReducedMotion) return;
  // Fewer particles on small screens to save battery/CPU
  const count = window.innerWidth < 768 ? 12 : 25;
  const colors = ['rgba(201,168,76,0.6)','rgba(192,69,107,0.5)','rgba(106,58,173,0.5)','rgba(201,168,76,0.4)'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${12+Math.random()*18}s;
      animation-delay:${-Math.random()*20}s;
    `;
    frag.appendChild(p);
  }
  document.body.appendChild(frag);
})();

/* ==============================================================
   SECTION SCROLLING (single continuous page)
   All content sections are visible at once; this just smooth-scrolls
   to the right one and closes the mobile menu if open.
   ============================================================== */
function scrollToSection(name) {
  const el = document.getElementById('page-' + name);
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  closeMenu();
}

// Highlights the nav link matching whichever section is currently in view.
const sectionNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const name = entry.target.id.replace('page-', '');
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === name);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

function initScrollSpy() {
  ['home','offerings','products','reviews','contact'].forEach(name => {
    const el = document.getElementById('page-' + name);
    if (el) sectionNavObserver.observe(el);
  });
}

function setNavbarHeightVar() {
  const nav = document.getElementById('navbar');
  if (nav) document.documentElement.style.setProperty('--navbar-h', nav.offsetHeight + 'px');
}

function toggleMenu() {
  setNavbarHeightVar();
  const links = document.getElementById('nav-links');
  const btn = document.getElementById('hamburger');
  const isOpen = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('nav-open', isOpen);
}

function closeMenu() {
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

// Dismiss the mobile menu on outside tap/click or Escape, like any standard app menu.
document.addEventListener('click', (e) => {
  const links = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  if (!links || !links.classList.contains('open')) return;
  if (links.contains(e.target) || hamburger.contains(e.target)) return;
  closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

window.addEventListener('resize', setNavbarHeightVar);

/* ==============================================================
   REVEAL ANIMATIONS
   ============================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

function observeReveals() {
  document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObserver.observe(el));
}
setTimeout(observeReveals, 100);

/* ==============================================================
   HOME REVIEWS
   ============================================================== */
function renderHomeReviews() {
  const container = document.getElementById('home-reviews');
  const sample = reviews.slice(0, 3);
  container.innerHTML = sample.map(reviewCardHTML).join('');
  setTimeout(observeReveals, 50);
}

function reviewCardHTML(r) {
  return `
    <div class="glass-card review-card reveal">
      <div class="review-stars" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <p class="review-text">"${escapeHTML(r.text)}"</p>
      <div class="review-author">
        <div class="review-avatar">${escapeHTML(r.initial)}</div>
        <div><div class="review-name">${escapeHTML(r.name)}</div><div class="review-date">${escapeHTML(r.product)} · ${escapeHTML(r.date)}</div></div>
      </div>
    </div>
  `;
}

/* ==============================================================
   OFFERS
   ============================================================== */
function isOfferActive(o) {
  const now = new Date(); const end = new Date(o.end);
  return end >= now;
}

// Rotating background tints for banners so consecutive slides don't look identical.
const OFFER_BANNER_GRADIENTS = [
  'linear-gradient(135deg, rgba(123,30,58,0.55), rgba(61,31,110,0.55))',
  'linear-gradient(135deg, rgba(61,31,110,0.55), rgba(201,168,76,0.35))',
  'linear-gradient(135deg, rgba(192,69,107,0.5), rgba(123,30,58,0.5))',
  'linear-gradient(135deg, rgba(106,58,173,0.5), rgba(192,69,107,0.4))',
];

let offerSlideTimer = null;
let offerSlideIndex = 0;

function offerBannerHTML(o, gradientIndex) {
  const active = isOfferActive(o);
  const startStr = new Date(o.start).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'});
  const endStr = new Date(o.end).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'});
  const gradient = OFFER_BANNER_GRADIENTS[gradientIndex % OFFER_BANNER_GRADIENTS.length];
  return `
    <div class="offer-banner ${active?'active-offer':''}" style="--offer-bg:${gradient}">
      <span class="offer-discount-tag">${o.discount}% OFF</span>
      <div class="offer-title">${escapeHTML(o.title)}</div>
      <p class="offer-desc">${escapeHTML(o.desc)}</p>
      <div class="offer-dates">
        <span>📅 ${startStr}</span>
        <span>→</span>
        <span>📅 ${endStr}</span>
      </div>
      <div class="offer-banner-footer">
        <span class="offer-badge ${active?'badge-active':'badge-over'}">${active?'✓ Available Now':'✕ OVER'}</span>
        ${o.tag ? `<span class="offer-tag-pill">${escapeHTML(o.tag)}</span>` : ''}
      </div>
    </div>
  `;
}

// Groups offers two-per-slide; if there's an odd one out, it gets its own slide.
function chunkOffersIntoPairs(list) {
  const pairs = [];
  for (let i = 0; i < list.length; i += 2) {
    pairs.push(list.slice(i, i + 2));
  }
  return pairs;
}

function renderOffers() {
  const track = document.getElementById('offer-slider-track');
  const dotsWrap = document.getElementById('offer-slider-dots');
  if (!track || !dotsWrap) return;

  if (!offers.length) {
    track.innerHTML = '<div class="offer-slide is-active" style="display:flex;align-items:center;justify-content:center"><p style="color:var(--text-muted);font-style:italic">No offers available right now. Check back soon!</p></div>';
    dotsWrap.innerHTML = '';
    return;
  }

  const slides = chunkOffersIntoPairs(offers);
  let gradientCursor = 0;

  track.innerHTML = slides.map((pair, i) => `
    <div class="offer-slide ${i === 0 ? 'is-active' : ''}" data-slide="${i}">
      ${pair.map(o => offerBannerHTML(o, gradientCursor++)).join('')}
    </div>
  `).join('');

  dotsWrap.innerHTML = slides.map((_, i) =>
    `<button type="button" class="offer-slider-dot ${i === 0 ? 'is-active' : ''}" data-dot="${i}" role="tab" aria-label="Go to slide ${i+1}" aria-selected="${i===0}" onclick="goToOfferSlide(${i})"></button>`
  ).join('');

  offerSlideIndex = 0;
  startOfferAutoplay();
}

function goToOfferSlide(index) {
  const slideEls = document.querySelectorAll('#offer-slider-track .offer-slide');
  const dotEls = document.querySelectorAll('#offer-slider-dots .offer-slider-dot');
  if (!slideEls.length) return;
  const total = slideEls.length;
  const next = ((index % total) + total) % total; // wrap both directions

  slideEls.forEach((el, i) => {
    if (i === offerSlideIndex && i !== next) {
      el.classList.add('is-leaving');
      el.classList.remove('is-active');
      setTimeout(() => el.classList.remove('is-leaving'), 600);
    } else if (i === next) {
      el.classList.add('is-active');
      el.classList.remove('is-leaving');
    } else {
      el.classList.remove('is-active', 'is-leaving');
    }
  });
  dotEls.forEach((d, i) => {
    d.classList.toggle('is-active', i === next);
    d.setAttribute('aria-selected', String(i === next));
  });

  offerSlideIndex = next;
  restartOfferAutoplay();
}

function nextOfferSlide() { goToOfferSlide(offerSlideIndex + 1); }
function prevOfferSlide() { goToOfferSlide(offerSlideIndex - 1); }

function startOfferAutoplay() {
  stopOfferAutoplay();
  if (prefersReducedMotion) return; // don't force motion on users who've asked to avoid it
  const slideCount = document.querySelectorAll('#offer-slider-track .offer-slide').length;
  if (slideCount <= 1) return;
  offerSlideTimer = setInterval(nextOfferSlide, 5000);
}

function stopOfferAutoplay() {
  if (offerSlideTimer) { clearInterval(offerSlideTimer); offerSlideTimer = null; }
}

function restartOfferAutoplay() {
  stopOfferAutoplay();
  startOfferAutoplay();
}

// Wire up arrows once (the buttons are static, not re-rendered each time).
function bindOfferSliderControls() {
  const prevBtn = document.getElementById('offer-prev');
  const nextBtn = document.getElementById('offer-next');
  const slider = document.getElementById('offer-slider');
  if (prevBtn) prevBtn.addEventListener('click', prevOfferSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextOfferSlide);
  // Pause autoplay while the user is interacting with the slider, resume after.
  if (slider) {
    slider.addEventListener('mouseenter', stopOfferAutoplay);
    slider.addEventListener('mouseleave', startOfferAutoplay);
    slider.addEventListener('focusin', stopOfferAutoplay);
    slider.addEventListener('focusout', startOfferAutoplay);
  }
}

/* ==============================================================
   PRODUCTS
   ============================================================== */
let activeCategory = 'All';

function renderProducts() {
  renderBestSellers();
  renderCategoryPills();
  renderProductGrid(getFilteredProducts());
}

function getFilteredProducts() {
  return activeCategory === 'All' ? products : products.filter(p => p.cat === activeCategory);
}

function renderCategoryPills() {
  const container = document.getElementById('category-pill-row');
  if (!container) return;
  const names = ['All', ...categories.map(c => c.name)];
  container.innerHTML = names.map(name => `
    <button type="button"
      class="category-pill${name === activeCategory ? ' active' : ''}"
      onclick="filterByCategory('${escapeAttr(name)}')"
      aria-pressed="${name === activeCategory}">
      ${escapeHTML(name)}
    </button>
  `).join('');
}

function filterByCategory(cat) {
  if (cat === activeCategory) return;
  activeCategory = cat;
  renderCategoryPills();

  const grid = document.getElementById('products-grid');
  if (grid && !prefersReducedMotion) {
    grid.classList.add('grid-fade-out');
    setTimeout(() => {
      renderProductGrid(getFilteredProducts());
      grid.classList.remove('grid-fade-out');
    }, 180);
  } else {
    renderProductGrid(getFilteredProducts());
  }
}

function renderBestSellers() {
  const container = document.getElementById('best-sellers');
  const bs = products.filter(p => p.bestseller);
  container.innerHTML = bs.map(p => productCardHTML(p, true)).join('');
}

function renderProductGrid(list) {
  document.getElementById('products-count').textContent = `Showing ${list.length} products`;
  document.getElementById('products-grid').innerHTML = list.length
    ? list.map(p => productCardHTML(p)).join('')
    : '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);font-style:italic">No products match your filters.</div>';
}

function productCardHTML(p, compact=false) {
  const badgeMap = { bestseller:'badge-bestseller', discount:'badge-discount', new:'badge-new', combo:'badge-discount' };
  const stockClass = { in:'in-stock', out:'out-stock', sold:'sold-out' }[p.stock];
  const stockLabel = { in:'In Stock', out:'Out of Stock', sold:'Sold Out' }[p.stock];
  const w = compact ? 'min-width:180px' : '';
  return `
    <div class="glass-card product-card" style="${w}">
      <div class="product-img-wrap">
        <div class="product-img" aria-hidden="true">${p.icon || '🎁'}</div>
        ${p.badge ? `<div class="product-badge ${badgeMap[p.badge]||'badge-new'}">${p.badge==='bestseller'?'⭐ Best':p.badge==='discount'?`${p.discount}% OFF`:p.badge==='combo'?'Combo':'New'}</div>` : ''}
      </div>
      <div class="product-code"># ${escapeHTML(p.code)}</div>
      <div class="product-name">${escapeHTML(p.name)}</div>
      <div>
        <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
        ${p.original && p.original > p.price ? `<span class="product-price-old">₹${p.original.toLocaleString('en-IN')}</span>` : ''}
      </div>
      <div class="product-footer">
        <span class="stock-status ${stockClass}">${stockLabel}</span>
        ${p.stock === 'in' ? `<button class="add-cart-btn" onclick="addToCart(${p.id})" aria-label="Add ${escapeAttr(p.name)} to cart">+</button>` : ''}
      </div>
    </div>
  `;
}

/* ==============================================================
   CART
   ============================================================== */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty = (existing.qty || 1) + 1; }
  else { cart.push({ ...product, qty: 1 }); }
  updateCartUI();
  notify(`${product.name} added to cart!`, 'success');
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('open');
}

function updateCartUI() {
  const count = cart.reduce((s,c) => s + (c.qty||1), 0);
  document.getElementById('cart-count').textContent = count;
  const container = document.getElementById('cart-items');
  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty">Your selection is empty.<br>Browse products and add gifts!</div>';
    document.getElementById('cart-footer').style.display = 'none';
    return;
  }
  container.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-icon" aria-hidden="true">${c.icon||'🎁'}</div>
      <div>
        <div class="cart-item-name">${escapeHTML(c.name)}</div>
        <div class="cart-item-code">${escapeHTML(c.code)} × ${c.qty||1}</div>
        <div class="cart-item-price">₹${(c.price*(c.qty||1)).toLocaleString('en-IN')}</div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${c.id})" aria-label="Remove ${escapeAttr(c.name)} from cart">✕</button>
    </div>
  `).join('');
  const total = cart.reduce((s,c) => s + c.price*(c.qty||1), 0);
  document.getElementById('cart-total').textContent = '₹' + total.toLocaleString('en-IN');
  document.getElementById('cart-footer').style.display = 'block';
}

const WHATSAPP_NUMBER = '916383204742';

function sendWhatsAppOrder() {
  if (!cart.length) return;
  const lines = cart.map(c => `• ${c.name} (${c.code}) × ${c.qty||1} — ₹${(c.price*(c.qty||1)).toLocaleString('en-IN')}`).join('\n');
  const total = cart.reduce((s,c) => s + c.price*(c.qty||1), 0);
  const msg = encodeURIComponent(`Hi MK Gift Shop! 👋\n\nI'd like to order the following:\n\n${lines}\n\nTotal: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm availability and delivery details. Thank you!`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener');
}

function openWhatsApp(msg) {
  const text = encodeURIComponent(msg || 'Hi MK Gift Shop! I have a query about your products. 🎁');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
}

/* ==============================================================
   REVIEWS
   ============================================================== */
let currentRatingVal = 0;
function setRating(n) {
  currentRatingVal = n;
  document.querySelectorAll('.star-picker button').forEach((s, i) => {
    const filled = i < n;
    s.textContent = filled ? '★' : '☆';
    s.classList.toggle('filled', filled);
    s.setAttribute('aria-pressed', String(filled));
  });
}

function submitReview() {
  const name = document.getElementById('rev-name').value.trim();
  const product = document.getElementById('rev-product').value.trim();
  const text = document.getElementById('rev-text').value.trim();
  if (!name || !text || !currentRatingVal) { notify('Please fill in all fields and select a rating.', 'error'); return; }
  reviews.unshift({
    name, product: product || 'MK Gift Shop', rating: currentRatingVal,
    text, date: 'Just now', initial: name[0].toUpperCase()
  });
  document.getElementById('rev-name').value = '';
  document.getElementById('rev-product').value = '';
  document.getElementById('rev-text').value = '';
  setRating(0);
  renderReviews();
  notify('Thank you for your review!', 'success');
}

function renderReviews() {
  document.getElementById('reviews-list').innerHTML = reviews.map(reviewCardHTML).join('');
  setTimeout(observeReveals, 50);
}

/* ==============================================================
   CONTACT
   ============================================================== */
function submitContact() {
  const name = document.getElementById('ct-name').value.trim();
  const msg = document.getElementById('ct-msg').value.trim();
  if (!name || !msg) { notify('Please fill in your name and message.', 'error'); return; }
  document.getElementById('ct-name').value = '';
  document.getElementById('ct-email').value = '';
  document.getElementById('ct-phone').value = '';
  document.getElementById('ct-subject').value = '';
  document.getElementById('ct-msg').value = '';
  notify('Message sent! We\'ll get back to you within 24 hours.', 'success');
}

/* ==============================================================
   FOOTER NEWSLETTER
   ============================================================== */
function subscribeNewsletter() {
  const input = document.getElementById('footer-newsletter-email');
  const email = input.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) { notify('Please enter a valid email address.', 'error'); return; }
  input.value = '';
  notify('Subscribed! Watch your inbox for gift ideas & offers.', 'success');
}

/* ==============================================================
   ADMIN AUTH
   ============================================================== */
const ADMIN_CREDS = { user: 'admin', pass: 'mk2025', otp: '123456' };

function openAdminLogin() { document.getElementById('admin-login-overlay').classList.add('active'); }
function closeAdminLogin() { document.getElementById('admin-login-overlay').classList.remove('active'); }

function adminLogin() {
  const u = document.getElementById('admin-user').value;
  const p = document.getElementById('admin-pass').value;
  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    document.getElementById('admin-login-step1').style.display = 'none';
    document.getElementById('admin-login-step2').style.display = 'block';
    notify('OTP sent to your registered mobile & email.', 'success');
  } else {
    notify('Invalid credentials. Try admin / mk2025', 'error');
  }
}

function verifyOTP() {
  const otp = document.getElementById('admin-otp').value;
  if (otp === ADMIN_CREDS.otp) {
    isLoggedIn = true;
    closeAdminLogin();
    document.getElementById('admin-login-step1').style.display = 'block';
    document.getElementById('admin-login-step2').style.display = 'none';
    document.getElementById('admin-user').value = '';
    document.getElementById('admin-pass').value = '';
    document.getElementById('admin-otp').value = '';
    document.getElementById('page-admin').classList.add('active');
    notify('Welcome back, Admin!', 'success');
    renderAdminProducts();
    renderAdminOffers();
    renderAdminReviews();
    renderCharts();
    updateAdminStats();
  } else {
    notify('Invalid OTP. Demo OTP: 123456', 'error');
  }
}

function resendOTP() { notify('OTP resent!', 'success'); }

function logoutAdmin() {
  isLoggedIn = false;
  document.getElementById('page-admin').classList.remove('active');
  notify('Logged out successfully.', 'success');
}

/* ==============================================================
   ADMIN PANEL NAVIGATION
   ============================================================== */
function switchAdmin(panel) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('admin-' + panel).classList.add('active');
  document.querySelectorAll('.admin-tab').forEach(n => {
    n.classList.toggle('active', n.dataset.admin === panel);
  });
  if (panel === 'analytics') renderCharts();
  if (panel === 'finance') renderFinanceChart();
}

/* ==============================================================
   ADMIN STATS
   ============================================================== */
function updateAdminStats() {
  document.getElementById('stat-products').textContent = products.length;
  document.getElementById('stat-offers').textContent = offers.filter(o => isOfferActive(o)).length;
  document.getElementById('stat-reviews').textContent = reviews.length;
  document.getElementById('stat-instock').textContent = products.filter(p => p.stock === 'in').length;

  const alerts = products.filter(p => p.stock !== 'in');
  document.getElementById('stock-alerts').innerHTML = alerts.length
    ? alerts.map(p => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <span style="font-size:1.3rem" aria-hidden="true">${p.icon||'🎁'}</span>
          <div><div style="font-size:0.88rem;font-weight:600">${escapeHTML(p.name)}</div><div style="font-size:0.72rem;color:var(--text-muted)">${escapeHTML(p.code)}</div></div>
          <span class="stock-status ${p.stock==='out'?'out-stock':'sold-out'}" style="margin-left:auto">${p.stock==='out'?'Out of Stock':'Sold Out'}</span>
        </div>`)
        .join('')
    : '<div style="color:var(--text-muted);font-size:0.88rem;font-style:italic">All products are well stocked ✓</div>';
}

/* ==============================================================
   ADMIN PRODUCTS TABLE
   ============================================================== */
function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-table');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><code style="color:var(--gold);font-size:0.85rem">${escapeHTML(p.code)}</code></td>
      <td><span style="font-size:1.1rem;margin-right:8px" aria-hidden="true">${p.icon||'🎁'}</span>${escapeHTML(p.name)}</td>
      <td>${escapeHTML(p.cat)}</td>
      <td style="color:var(--gold)">₹${p.price.toLocaleString('en-IN')}</td>
      <td><span class="stock-status ${p.stock==='in'?'in-stock':p.stock==='out'?'out-stock':'sold-out'}">${p.stock==='in'?'In Stock':p.stock==='out'?'Out of Stock':'Sold Out'}</span></td>
      <td>
        <button class="admin-action-btn btn-edit" onclick="openProductModal(${p.id})">Edit</button>
        <button class="admin-action-btn btn-delete" onclick="deleteProduct(${p.id})" style="margin-left:6px">Delete</button>
      </td>
    </tr>
  `).join('');
}

function generateCode(cat) {
  const prefix = cat ? cat[0].toUpperCase() : 'G';
  const num = String(Math.floor(Math.random()*900)+100);
  return prefix + num;
}

// Bound once at load time instead of being re-attached every time the modal opens
// (the original code added a fresh 'change' listener on every openProductModal call,
// which stacked duplicate listeners and fired generateCode() multiple times per change).
function bindProductCategoryPreview() {
  const catSelect = document.getElementById('p-cat');
  if (!catSelect) return;
  catSelect.addEventListener('change', function() {
    // Only auto-update the code preview when adding a new product, not when editing one.
    const editing = document.getElementById('p-edit-id').value;
    if (!editing) {
      document.getElementById('p-code-preview').textContent = generateCode(this.value);
    }
  });
}

function openProductModal(id) {
  switchAdmin('add');
  if (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('product-modal-title').textContent = 'Edit Product';
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-cat').value = p.cat;
    document.getElementById('p-stock').value = p.stock;
    document.getElementById('p-icon').value = p.icon || '';
    document.getElementById('p-discount').value = p.discount || 0;
    document.getElementById('p-original').value = p.original || '';
    document.getElementById('p-badge').value = p.badge || '';
    document.getElementById('p-bestseller').checked = p.bestseller || false;
    document.getElementById('p-edit-id').value = id;
    document.getElementById('p-code-preview').textContent = p.code;
  } else {
    document.getElementById('product-modal-title').textContent = 'Add New Product';
    document.getElementById('p-name').value = '';
    document.getElementById('p-price').value = '';
    document.getElementById('p-cat').value = 'Birthday';
    document.getElementById('p-stock').value = 'in';
    document.getElementById('p-icon').value = '🎁';
    document.getElementById('p-discount').value = 0;
    document.getElementById('p-original').value = '';
    document.getElementById('p-badge').value = '';
    document.getElementById('p-bestseller').checked = false;
    document.getElementById('p-edit-id').value = '';
    document.getElementById('p-code-preview').textContent = generateCode('B');
  }
}

function closeProductModal() { switchAdmin('products'); }

function saveProduct() {
  const name = document.getElementById('p-name').value.trim();
  const price = parseInt(document.getElementById('p-price').value);
  const cat = document.getElementById('p-cat').value;
  const stock = document.getElementById('p-stock').value;
  const icon = document.getElementById('p-icon').value || '🎁';
  const discount = parseInt(document.getElementById('p-discount').value) || 0;
  const original = parseInt(document.getElementById('p-original').value) || price;
  const badge = document.getElementById('p-badge').value;
  const bestseller = document.getElementById('p-bestseller').checked;
  if (!name || !price) { notify('Product name and price are required.', 'error'); return; }
  const editId = Number(document.getElementById('p-edit-id').value) || null;
  if (editId) {
    const idx = products.findIndex(p => p.id === editId);
    if (idx > -1) Object.assign(products[idx], { name, price, cat, stock, icon, discount, original, badge, bestseller });
    notify('Product updated!', 'success');
  } else {
    const code = document.getElementById('p-code-preview').textContent;
    products.push({ id: nextId++, code, name, price, cat, stock, icon, discount, original, badge, bestseller });
    notify('Product added!', 'success');
  }
  closeProductModal();
  renderAdminProducts();
  updateAdminStats();
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  products = products.filter(p => p.id !== id);
  renderAdminProducts();
  updateAdminStats();
  notify('Product deleted.', 'success');
}

/* ==============================================================
   ADMIN OFFERS TABLE
   ============================================================== */
function renderAdminOffers() {
  const tbody = document.getElementById('admin-offers-table');
  tbody.innerHTML = offers.map(o => {
    const active = isOfferActive(o);
    return `
      <tr>
        <td style="font-weight:600">${escapeHTML(o.title)}</td>
        <td style="color:var(--gold)">${o.discount}%</td>
        <td style="font-size:0.8rem">${new Date(o.start).toLocaleDateString('en-IN')}</td>
        <td style="font-size:0.8rem">${new Date(o.end).toLocaleDateString('en-IN')}</td>
        <td><span class="offer-badge ${active?'badge-active':'badge-over'}" style="font-size:0.7rem">${active?'Active':'Over'}</span></td>
        <td>
          <button class="admin-action-btn btn-edit" onclick="openOfferModal(${o.id})">Edit</button>
          <button class="admin-action-btn btn-delete" onclick="deleteOffer(${o.id})" style="margin-left:6px">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openOfferModal(id) {
  if (id) {
    const o = offers.find(x => x.id === id);
    if (!o) return;
    document.getElementById('offer-modal-title').textContent = 'Edit Offer';
    document.getElementById('o-title').value = o.title;
    document.getElementById('o-desc').value = o.desc;
    document.getElementById('o-discount').value = o.discount;
    document.getElementById('o-tag').value = o.tag || '';
    document.getElementById('o-start').value = o.start;
    document.getElementById('o-end').value = o.end;
    document.getElementById('o-edit-id').value = id;
    document.getElementById('o-title').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  } else {
    closeOfferModal();
  }
}

function closeOfferModal() {
  document.getElementById('offer-modal-title').textContent = 'Add New Offer';
  document.getElementById('o-title').value = '';
  document.getElementById('o-desc').value = '';
  document.getElementById('o-discount').value = '';
  document.getElementById('o-tag').value = '';
  document.getElementById('o-start').value = '';
  document.getElementById('o-end').value = '';
  document.getElementById('o-edit-id').value = '';
}

function saveOffer() {
  const title = document.getElementById('o-title').value.trim();
  const desc = document.getElementById('o-desc').value.trim();
  const discount = parseInt(document.getElementById('o-discount').value) || 0;
  const tag = document.getElementById('o-tag').value.trim();
  const start = document.getElementById('o-start').value;
  const end = document.getElementById('o-end').value;
  if (!title || !start || !end) { notify('Title, start date, and end date are required.', 'error'); return; }
  const editId = Number(document.getElementById('o-edit-id').value) || null;
  if (editId) {
    const idx = offers.findIndex(o => o.id === editId);
    if (idx > -1) Object.assign(offers[idx], { title, desc, discount, tag, start, end });
    notify('Offer updated!', 'success');
  } else {
    offers.push({ id: offers.length + 1, title, desc, discount, tag, start, end });
    notify('Offer added!', 'success');
  }
  closeOfferModal();
  renderAdminOffers();
  updateAdminStats();
}

function deleteOffer(id) {
  if (!confirm('Delete this offer?')) return;
  offers = offers.filter(o => o.id !== id);
  renderAdminOffers();
  updateAdminStats();
  notify('Offer deleted.', 'success');
}

/* ==============================================================
   ADMIN REVIEWS TABLE
   ============================================================== */
function renderAdminReviews() {
  const tbody = document.getElementById('admin-reviews-table');
  tbody.innerHTML = reviews.map((r, i) => `
    <tr>
      <td style="font-weight:600">${escapeHTML(r.name)}</td>
      <td>${escapeHTML(r.product)}</td>
      <td style="color:var(--gold)">${'★'.repeat(r.rating)}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(r.text)}</td>
      <td style="font-size:0.78rem;color:var(--text-muted)">${escapeHTML(r.date)}</td>
      <td><button class="admin-action-btn btn-delete" onclick="deleteReview(${i})">Delete</button></td>
    </tr>
  `).join('');
}

function deleteReview(i) {
  if (!confirm('Delete this review?')) return;
  reviews.splice(i, 1);
  renderAdminReviews();
  updateAdminStats();
  notify('Review deleted.', 'success');
}

/* ==============================================================
   CHARTS (pure CSS/JS bar charts)
   ============================================================== */
function renderCharts() {
  renderBarChart('top-products-chart', [
    { label:'Rose Box', val:89, color:'linear-gradient(180deg,#c9a84c,#7b3a2c)' },
    { label:'B.Hamper', val:74, color:'linear-gradient(180deg,#9c2a4a,#3d1f6e)' },
    { label:'Candle Set', val:61, color:'linear-gradient(180deg,#6a3aad,#3d1f6e)' },
    { label:'Diwali Pack', val:55, color:'linear-gradient(180deg,#c9a84c,#3d1f6e)' },
    { label:'F.Bracelet', val:48, color:'linear-gradient(180deg,#c0456b,#3d1f6e)' },
  ]);
  renderBarChart('cat-performance-chart', [
    { label:'Love', val:92, color:'linear-gradient(180deg,#c0456b,#7b1e3a)' },
    { label:'Birthday', val:81, color:'linear-gradient(180deg,#c9a84c,#7b3a2c)' },
    { label:'Festival', val:70, color:'linear-gradient(180deg,#e8c96e,#c9a84c)' },
    { label:'Wedding', val:58, color:'linear-gradient(180deg,#6a3aad,#3d1f6e)' },
    { label:'Kids', val:45, color:'linear-gradient(180deg,#3d8ef0,#1e3f8f)' },
    { label:'Corp.', val:38, color:'linear-gradient(180deg,#c0456b,#3d1f6e)' },
  ]);
  renderBarChart('monthly-chart', [
    {label:'Jan',val:40},{label:'Feb',val:75},{label:'Mar',val:52},{label:'Apr',val:61},
    {label:'May',val:83},{label:'Jun',val:70},{label:'Jul',val:65},{label:'Aug',val:90},
    {label:'Sep',val:55},{label:'Oct',val:95},{label:'Nov',val:88},{label:'Dec',val:100},
  ]);
}

function renderBarChart(containerId, data) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const maxVal = Math.max(...data.map(d => d.val));
  c.innerHTML = `<div class="bar-chart">${data.map(d => `
    <div class="bar-wrap">
      <div style="color:var(--gold);font-size:0.68rem;margin-bottom:4px">${d.val}%</div>
      <div class="bar" style="height:${(d.val/maxVal)*85}%;background:${d.color||'linear-gradient(180deg,var(--gold),var(--wine))'}"></div>
      <div class="bar-label">${escapeHTML(d.label)}</div>
    </div>`).join('')}
  </div>`;
}

function renderFinanceChart() {
  const c = document.getElementById('finance-chart');
  if (!c) return;
  const data = [
    {label:'Jan',income:70,expense:30},{label:'Feb',income:90,expense:35},
    {label:'Mar',income:65,expense:28},{label:'Apr',income:80,expense:32},
    {label:'May',income:95,expense:38},{label:'Jun',income:85,expense:30},
  ];
  c.innerHTML = `<div class="bar-chart">${data.map(d => `
    <div class="bar-wrap" style="gap:2px">
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;width:100%;height:100%;justify-content:flex-end">
        <div class="bar" style="height:${d.income}%;background:linear-gradient(180deg,#4cd27c,#2a8a50);width:45%;display:inline-block"></div>
        <div class="bar" style="height:${d.expense}%;background:linear-gradient(180deg,#f07080,#8a2030);width:45%;display:inline-block;margin-left:2px"></div>
      </div>
      <div class="bar-label">${escapeHTML(d.label)}</div>
    </div>`).join('')}
  </div>
  <div style="display:flex;gap:20px;margin-top:10px;justify-content:center">
    <span style="font-size:0.75rem;color:#4cd27c">■ Income</span>
    <span style="font-size:0.75rem;color:#f07080">■ Expense</span>
  </div>`;
}

function renderOverviewChart() {
  const catCounts = {};
  products.forEach(p => { catCounts[p.cat] = (catCounts[p.cat] || 0) + 1; });
  const data = Object.entries(catCounts).map(([k,v]) => ({ label: k.split(' ')[0], val: v * 10 }));
  renderBarChart('overview-chart', data);
}

/* ==============================================================
   NOTIFICATION
   ============================================================== */
function notify(msg, type='') {
  const el = document.getElementById('notification');
  el.textContent = (type==='success'?'✓ ':type==='error'?'✕ ':'') + msg;
  el.className = 'show' + (type ? ' '+type : '');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = ''; }, 3500);
}

/* ==============================================================
   UTILITIES
   ============================================================== */
// Minimal HTML escaping for user-supplied or data-driven text injected via innerHTML.
function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}
// For values placed inside an HTML attribute within a template string (e.g. onclick="...('value')").
function escapeAttr(str) {
  return String(str ?? '').replace(/['\\]/g, ch => '\\' + ch);
}

/* ==============================================================
   INIT
   ============================================================== */
window.addEventListener('DOMContentLoaded', () => {
  setNavbarHeightVar();
  renderHomeReviews();
  renderOffers();
  renderProducts();
  renderReviews();
  updateCartUI();
  renderOverviewChart();
  bindProductCategoryPreview();
  bindOfferSliderControls();
  initScrollSpy();

  // Animate hero elements in (skipped for reduced-motion users)
  if (!prefersReducedMotion) {
    setTimeout(() => {
      document.querySelectorAll('.hero-content > *').forEach((el, i) => {
        el.style.opacity = '0'; el.style.transform = 'translateY(30px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.8s, transform 0.8s';
          el.style.opacity = '1'; el.style.transform = 'translateY(0)';
        }, i * 150);
      });
    }, 100);
  }
});

/* ==============================================================
   APP INSTALLABILITY (Add to Home Screen / offline shell)
   ============================================================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // Registration can fail on file:// or unsupported browsers — fine to ignore,
      // the site still works normally, it just won't cache for offline use.
    });
  });
}
