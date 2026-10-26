const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px" });
$$('.reveal').forEach((element) => revealObserver.observe(element));

const mapSteps = ["OUTCOME LOCKED", "TREASURY BOUNDED", "CAPABILITY ASSEMBLED", "DELIVERY VERIFIED", "AUTHORITY EXPIRED"];
let mapStep = 0;
const mapState = $('#mapState');
const mapNodes = $$('[data-step]');
setInterval(() => {
  mapStep = (mapStep + 1) % mapSteps.length;
  mapState.textContent = mapSteps[mapStep];
  mapNodes.forEach((node) => node.classList.toggle('active', Number(node.dataset.step) === mapStep));
}, 2200);

const capabilities = [
  { name: "ORCHESTRATION", role: "MACHINE_01", share: 18, color: "#ff7426" },
  { name: "RESEARCH", role: "SIGNAL_04", share: 19, color: "#ff0878" },
  { name: "PRODUCTION", role: "BUILD_12", share: 31, color: "#4a00ff" },
  { name: "VERIFICATION", role: "AUDIT_03", share: 22, color: "#095cff" },
  { name: "HUMAN REVIEW", role: "REVIEWER", share: 10, color: "#00d7ed" }
];

function money(value) {
  return Math.round(value).toLocaleString('en-US');
}

function renderPlan() {
  const budget = Math.max(100, Number($('#budgetInput').value) || 12000);
  const hours = Number($('#deadlineInput').value);
  const outcome = $('#outcomeInput').value.trim();
  const reserve = budget * 0.1;
  const deployable = budget - reserve;
  $('#planNodes').innerHTML = capabilities.map((item, index) => `
    <div class="plan-node" style="--node:${item.color}">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <div><b>${item.name}</b><small>${item.role}</small></div>
      <em>${money(deployable * item.share / 100)} USDC</em>
    </div>`).join('');
  $('#reserveValue').textContent = `${money(reserve)} USDC`;
  $('#expiryValue').textContent = `${hours}H`;
  $('.plan-top span').textContent = `FORMATION / MMN-${String((outcome.length * 47 + budget) % 9000 + 1000).slice(0, 4)}`;
}

$('#formationForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const button = $('.compile-button');
  button.classList.add('working');
  button.querySelector('span').textContent = 'COMPILING GRAPH';
  setTimeout(() => {
    renderPlan();
    $('#plan').classList.remove('refreshed');
    void $('#plan').offsetWidth;
    $('#plan').classList.add('refreshed');
    button.classList.remove('working');
    button.querySelector('span').textContent = 'RECOMPILE FORMATION';
  }, 520);
});
renderPlan();

$$('details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    $$('details').forEach((other) => { if (other !== detail) other.open = false; });
  });
});

const header = $('.site-head');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('compact', y > 24);
  header.classList.toggle('hidden', y > lastY && y > 320);
  lastY = y;
}, { passive: true });
