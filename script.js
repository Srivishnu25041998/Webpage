async function fetchEntries() {
    const res = await fetch('/api/entries');
    const entries = await res.json();
    const container = document.getElementById('entries');
    container.innerHTML = '';
    entries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `
            <div class="name">${entry.name}</div>
            <div class="message">${entry.message}</div>
            <div class="date">${new Date(entry.date).toLocaleString()}</div>
        `;
        container.appendChild(div);
    });
}

document.getElementById('guestbook-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !message) return;
    await fetch('/api/entries', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, message })
    });
    document.getElementById('guestbook-form').reset();
    fetchEntries();
});

fetchEntries();