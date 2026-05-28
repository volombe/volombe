/* ============================================================
   VOLOMBE — Cart System
   localStorage · Sidebar panel · Commander flow
   ============================================================ */

/* ---------- Storage helpers ---------- */
function cartGet() {
  try { return JSON.parse(localStorage.getItem('volombe_cart')) || []; }
  catch { return []; }
}
function cartSave(items) {
  localStorage.setItem('volombe_cart', JSON.stringify(items));
}
function cartAdd(item) {
  const items = cartGet();
  const existing = items.find(i => i.id === item.id && i.size === item.size);
  if (existing) {
    existing.qty += item.qty;
  } else {
    items.push(item);
  }
  cartSave(items);
  cartRefreshCount();
  cartRefreshPanel();
}
function cartRemove(id, size) {
  const items = cartGet().filter(i => !(i.id === id && i.size === size));
  cartSave(items);
  cartRefreshCount();
  cartRefreshPanel();
}
function cartClear() {
  cartSave([]);
  cartRefreshCount();
  cartRefreshPanel();
}

/* ---------- Badge counter (toutes les pages) ---------- */
function cartRefreshCount() {
  const items = cartGet();
  const total = items.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-dot, #cart-count').forEach(el => {
    el.textContent = total;
    el.classList.toggle('cart-dot--active', total > 0);
  });
}

/* ---------- Sidebar HTML ---------- */
function cartInjectSidebar() {
  if (document.getElementById('cart-sidebar')) return;

  const overlay = document.createElement('div');
  overlay.id = 'cart-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.addEventListener('click', cartClose);

  const sidebar = document.createElement('aside');
  sidebar.id = 'cart-sidebar';
  sidebar.setAttribute('role', 'dialog');
  sidebar.setAttribute('aria-label', 'Votre panier');
  sidebar.setAttribute('aria-hidden', 'true');
  sidebar.innerHTML = `
    <div class="cart-header">
      <span class="cart-header__title">Votre panier</span>
      <button class="cart-close" id="cart-close-btn" aria-label="Fermer le panier">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="cart-items" id="cart-items"></div>
    <div class="cart-footer" id="cart-footer"></div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  document.getElementById('cart-close-btn').addEventListener('click', cartClose);

  // Esc key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cartClose();
  });
}

/* ---------- Open / Close ---------- */
function cartOpen() {
  cartRefreshPanel();
  document.getElementById('cart-sidebar').setAttribute('aria-hidden', 'false');
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function cartClose() {
  const s = document.getElementById('cart-sidebar');
  const o = document.getElementById('cart-overlay');
  if (!s) return;
  s.classList.remove('open');
  s.setAttribute('aria-hidden', 'true');
  o.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- Render panel ---------- */
function cartRefreshPanel() {
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  if (!itemsEl) return;

  const items = cartGet();

  if (items.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p>Votre panier est vide.</p>
        <a href="collection.html" class="btn btn--gold" style="margin-top:20px;text-decoration:none;display:inline-block" onclick="cartClose()">Voir la collection →</a>
      </div>`;
    footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = '';
  items.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id   = item.id;
    cartItem.dataset.size = item.size;

    // .cart-item__img
    const imgWrap = document.createElement('div');
    imgWrap.className = 'cart-item__img';
    const img = document.createElement('img');
    img.src = item.img || '';
    img.alt = item.name;           // textContent équivalent pour alt
    imgWrap.appendChild(img);

    // .cart-item__info
    const info    = document.createElement('div');
    info.className = 'cart-item__info';

    const nameEl  = document.createElement('p');
    nameEl.className  = 'cart-item__name';
    nameEl.textContent = item.name;

    const metaEl  = document.createElement('p');
    metaEl.className  = 'cart-item__meta';
    metaEl.textContent = 'Taille ' + item.size + ' · ' + item.price + ' €';

    const qtyDiv  = document.createElement('div');
    qtyDiv.className = 'cart-item__qty';

    const btnDown = document.createElement('button');
    btnDown.className    = 'cart-qty-btn cart-qty-down';
    btnDown.dataset.id   = item.id;
    btnDown.dataset.size = item.size;
    btnDown.textContent  = '−';

    const qtySpan = document.createElement('span');
    qtySpan.className   = 'cart-qty-val';
    qtySpan.textContent = String(item.qty);

    const btnUp   = document.createElement('button');
    btnUp.className    = 'cart-qty-btn cart-qty-up';
    btnUp.dataset.id   = item.id;
    btnUp.dataset.size = item.size;
    btnUp.textContent  = '+';

    qtyDiv.appendChild(btnDown);
    qtyDiv.appendChild(qtySpan);
    qtyDiv.appendChild(btnUp);
    info.appendChild(nameEl);
    info.appendChild(metaEl);
    info.appendChild(qtyDiv);

    // .cart-item__right
    const right     = document.createElement('div');
    right.className = 'cart-item__right';

    const totalSpan     = document.createElement('span');
    totalSpan.className = 'cart-item__total';
    totalSpan.textContent = (item.price * item.qty).toFixed(2).replace('.', ',') + ' €';

    const btnRemove     = document.createElement('button');
    btnRemove.className = 'cart-item__remove';
    btnRemove.dataset.id   = item.id;
    btnRemove.dataset.size = item.size;
    btnRemove.setAttribute('aria-label', 'Supprimer');
    // SVG statique littéral — aucune variable, innerHTML sûr ici
    btnRemove.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    right.appendChild(totalSpan);
    right.appendChild(btnRemove);

    cartItem.appendChild(imgWrap);
    cartItem.appendChild(info);
    cartItem.appendChild(right);
    itemsEl.appendChild(cartItem);
  });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  footerEl.innerHTML = `
    <div class="cart-total">
      <span class="cart-total__label">Total</span>
      <span class="cart-total__val">${total.toFixed(2).replace('.', ',')} €</span>
    </div>
    <p class="cart-total__note">TVA incluse · Livraison calculée à l'étape suivante</p>
    <button class="btn-commander" id="btn-commander">
      Commander (${count} article${count > 1 ? 's' : ''})
    </button>
  `;

  /* Events — qty +/- */
  itemsEl.querySelectorAll('.cart-qty-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const items2 = cartGet();
      const it = items2.find(i => i.id === btn.dataset.id && i.size === btn.dataset.size);
      if (!it) return;
      if (it.qty <= 1) {
        cartRemove(it.id, it.size);
      } else {
        it.qty--;
        cartSave(items2);
        cartRefreshCount();
        cartRefreshPanel();
      }
    });
  });
  itemsEl.querySelectorAll('.cart-qty-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const items2 = cartGet();
      const it = items2.find(i => i.id === btn.dataset.id && i.size === btn.dataset.size);
      if (!it) return;
      it.qty++;
      cartSave(items2);
      cartRefreshCount();
      cartRefreshPanel();
    });
  });

  /* Events — remove */
  itemsEl.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => cartRemove(btn.dataset.id, btn.dataset.size));
  });

  /* Commander */
  document.getElementById('btn-commander').addEventListener('click', () => {
    // NE PAS fermer le panier avant — il reste ouvert pour afficher les erreurs
    // cartClose() est appelé dans showCheckout() juste avant la redirection
    showCheckout();
  });
}

/* ---------- Checkout — redirect vers la page intégrée ---------- */
function showCheckout() {
  const items = cartGet();
  if (!items || items.length === 0) {
    alert('Votre panier est vide. Ajoutez un produit avant de commander.');
    return;
  }
  window.location.href = '/checkout';
}

/* ---------- Wire cart icon on all pages ---------- */
function cartWireIcon() {
  document.querySelectorAll('[aria-label="Panier"], .nav__icon[aria-label="Panier"]').forEach(el => {
    el.removeAttribute('href');
    el.style.cursor = 'pointer';
    el.addEventListener('click', e => {
      e.preventDefault();
      cartOpen();
    });
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  cartInjectSidebar();
  cartWireIcon();
  cartRefreshCount();
});
