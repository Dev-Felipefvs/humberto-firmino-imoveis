const whatsapp = 'https://wa.me/5582987416312';
const nav = document.querySelector('#nav');
const menu = document.querySelector('.burger');

document.documentElement.classList.add('js');

for (const link of document.querySelectorAll('a[data-msg]')) {
  link.href = whatsapp + '?text=' + encodeURIComponent(link.dataset.msg);
}

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

menu.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', event => {
  if (!event.target.closest('a') || !nav.classList.contains('is-open')) return;
  setMenu(false);
  menu.focus({ preventScroll: true });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !nav.classList.contains('is-open')) return;
  setMenu(false);
  menu.focus();
});
matchMedia('(min-width: 1000px)').addEventListener('change', () => setMenu(false));

const filters = document.querySelector('.filters');
const chips = [...filters.querySelectorAll('.chip')];
const grid = document.querySelector('#grid');
const cards = [...grid.querySelectorAll('.card')];
const filterStatus = document.querySelector('#filter-status');

function applyFilter() {
  const selected = new URL(location.href).searchParams.get('tipo');
  const chip = chips.find(item => item.dataset.f === selected) ?? chips[0];
  const type = chip.dataset.f;
  for (const item of chips) {
    item.classList.toggle('is-on', item === chip);
    item.setAttribute('aria-pressed', String(item === chip));
  }
  grid.classList.toggle('is-filtered', type !== 'todos');
  for (const card of cards) {
    card.hidden = type !== 'todos' && card.dataset.t !== type;
  }
  const count = cards.filter(card => !card.hidden).length;
  filterStatus.textContent = count === 1 ? '1 imóvel exibido' : count + ' imóveis exibidos';
}

filters.hidden = false;
applyFilter();
filters.addEventListener('click', event => {
  const chip = event.target.closest('button');
  if (!chip) return;
  const url = new URL(location.href);
  if (chip.dataset.f === 'todos') {
    url.searchParams.delete('tipo');
  } else {
    url.searchParams.set('tipo', chip.dataset.f);
  }
  history.replaceState(null, '', url);
  applyFilter();
});
window.addEventListener('popstate', applyFilter);

const form = document.querySelector('#form');
const nameInput = form.elements.nome;
const errorMessage = document.querySelector('#f-err');
form.hidden = false;

function showNameError(show) {
  errorMessage.hidden = !show;
  if (show) {
    nameInput.setAttribute('aria-invalid', 'true');
  } else {
    nameInput.removeAttribute('aria-invalid');
  }
}

nameInput.addEventListener('input', () => {
  if (nameInput.value.trim()) showNameError(false);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    showNameError(true);
    nameInput.focus();
    return;
  }
  const intent = form.elements.quero.value;
  const details = form.elements.msg.value.trim();
  const message = ['Olá, Humberto! Meu nome é ' + name + ' e quero ' + intent + '.', details]
    .filter(Boolean).join('\n\n');
  window.open(whatsapp + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
});
