document.getElementById('summaryForm').onsubmit = async (e) => {
  e.preventDefault();
  const topic = document.getElementById('topic').value;
  const type = document.getElementById('type').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Loading...';

  try {
    const res = await fetch('/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, type })
    });
    if (!res.ok) {
      let errorDetails = '';
      try {
        const errorData = await res.json();
        errorDetails = errorData.error ? errorData.error : JSON.stringify(errorData);
      } catch {
        errorDetails = await res.text();
      }
      resultDiv.innerHTML = `<span style="color: red; font-weight: bold;">Error: ${res.status} - ${errorDetails}</span>`;
      return;
    }
    const data = await res.json();
    renderResult(data);
  } catch (err) {
    resultDiv.innerHTML = `<span style="color: red; font-weight: bold;">Fetch Error: ${err.message}</span>`;
    console.error('Fetch error:', err);
  }
};

function renderResult({ title, verdict, summary, liked, disliked, bestFor }) {
  document.getElementById('result').innerHTML = `
    <h2>${title}</h2>
    <div class="verdict">${verdict}</div>
    <div class="summary">${summary}</div>
    <div class="section liked">
      <h3>Positives:</h3>
      <ul>${liked.map(x => `<li>${x}</li>`).join('')}</ul>
    </div>
    <div class="section disliked">
      <h3>Negatives:</h3>
      <ul>${disliked.map(x => `<li>${x}</li>`).join('')}</ul>
    </div>
    <div class="section bestfor">
      <h3>Best suited for:</h3>
      <ul>${bestFor.map(x => `<li>${x}</li>`).join('')}</ul>
    </div>
  `;
}





















































































