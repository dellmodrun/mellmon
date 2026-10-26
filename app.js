(() => {
  const signals = {
    narrative: ['NARRATIVE COLLISION', 'LOW / 16%', 'The source narrative is distinct across the indexed launch window.'],
    distribution: ['KNOWN CONCENTRATION', 'MODERATE / 29%', 'The largest disclosed positions remain visible, but the entry structure can be improved.'],
    liquidity: ['CURVE PRESSURE', 'BALANCED / 78', 'The proposed range absorbs the modeled first wave without hiding the tradeoff.'],
    fees: ['INCENTIVE ROUTE', 'CLEAR / 92%', 'Builder and community shares are legible before deployment.']
  };
  const label = document.getElementById('readoutLabel');
  const value = document.getElementById('readoutValue');
  const copy = document.getElementById('readoutCopy');
  document.querySelectorAll('.signal').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.signal').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const next = signals[button.dataset.signal];
    label.textContent = next[0]; value.textContent = next[1]; copy.textContent = next[2];
  }));

  const ids = ['genesis', 'wallet', 'fee', 'similarity'];
  const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
  const out = Object.fromEntries(ids.map((id) => [id, document.getElementById(`${id}Out`)]));
  const states = Object.fromEntries(ids.map((id) => [id, document.getElementById(`${id}State`)]));
  const bars = Object.fromEntries(ids.map((id) => [id, document.getElementById(`${id}Bar`)]));
  const score = document.getElementById('modelScore');
  const ring = document.getElementById('scoreRing');
  const note = document.getElementById('modelNote');

  function updateModel() {
    const g = +el.genesis.value, w = +el.wallet.value, f = +el.fee.value, s = +el.similarity.value;
    ids.forEach((id) => out[id].textContent = `${el[id].value}%`);
    const gScore = Math.max(0, 100 - Math.abs(60 - g) * 1.45);
    const wScore = Math.max(0, 105 - w * 3);
    const fScore = Math.max(0, 100 - Math.abs(45 - f) * 1.1);
    const sScore = 100 - s;
    const total = Math.round(gScore * .28 + wScore * .32 + fScore * .18 + sScore * .22);
    score.textContent = total; ring.style.setProperty('--score', total);
    bars.genesis.style.width = `${gScore}%`; bars.wallet.style.width = `${wScore}%`; bars.fee.style.width = `${fScore}%`; bars.similarity.style.width = `${sScore}%`;
    states.genesis.textContent = g < 35 ? 'NARROW' : g > 78 ? 'DILUTIVE' : 'BALANCED';
    states.wallet.textContent = w < 10 ? 'LOW' : w < 20 ? 'MODERATE' : 'HIGH';
    states.fee.textContent = f < 20 ? 'WEAK BUILDER' : f > 75 ? 'EXTRACTIVE' : 'VISIBLE';
    states.similarity.textContent = s < 25 ? 'LOW' : s < 55 ? 'MODERATE' : 'HIGH';
    note.textContent = total >= 80 ? 'Strong baseline. Publish the creator position and keep the first allocation legible.' : total >= 60 ? 'The launch is workable, but at least one assumption needs a clearer public explanation.' : 'The current structure concentrates avoidable risk. Resolve the highlighted inputs before deployment.';
  }
  ids.forEach((id) => el[id].addEventListener('input', updateModel));
  updateModel();
})();
