const scenes = [...document.querySelectorAll('.scene')];
const navLinks = [...document.querySelectorAll('.rail a')];
const progressBar = document.getElementById('progressBar');
const sectionCounter = document.getElementById('sectionCounter');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    const index = scenes.indexOf(entry.target);
    sectionCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
    const chapter = entry.target.dataset.chapter;
    navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === chapter));
  });
}, { threshold: 0.46 });

scenes.forEach((scene) => observer.observe(scene));
scenes[0]?.classList.add('is-visible');

function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const progress = available > 0 ? window.scrollY / available : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const interactiveCards = [...document.querySelectorAll('.interactive-card')];

function toggleCard(card) {
  const isOpen = card.classList.toggle('is-open');
  card.setAttribute('aria-expanded', String(isOpen));
}

interactiveCards.forEach((card) => {
  card.addEventListener('click', () => toggleCard(card));
  card.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    toggleCard(card);
  });
});

document.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) return;
  const currentIndex = scenes.findIndex((scene) => {
    const rect = scene.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
  });
  if (currentIndex < 0) return;
  const direction = event.key === 'ArrowDown' || event.key === 'PageDown' ? 1 : -1;
  const target = scenes[Math.min(scenes.length - 1, Math.max(0, currentIndex + direction))];
  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
});
