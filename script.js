let stats = JSON.parse(localStorage.getItem('mosych_stats')) || {
    totalGB: 1420.55,
    tunnels: 482,
    uplink: 98.2,
    currentSpeed: 2.55,
    logHistory: []
};

const tableBody = document.getElementById('traffic-body');
const totalEl = document.getElementById('total-data');
const speedEl = document.getElementById('current-speed');
const tunnelEl = document.getElementById('tunnels');
const uplinkEl = document.getElementById('uplink-val');

function saveStats() {
    localStorage.setItem('mosych_stats', JSON.stringify(stats));
}

async function runLoader() {
    const bar = document.getElementById('loader-bar');
    const loader = document.getElementById('terminal-loader');
    
    for (let i = 0; i <= 100; i += 5) {
        bar.style.width = i + '%';
        await new Promise(r => setTimeout(r, 40)); 
    }

    await new Promise(r => setTimeout(r, 200));
    loader.style.opacity = '0';
    
    setTimeout(() => {
        loader.style.display = 'none';
        revealApp();
    }, 700);
}

function revealApp() {
    const header = document.getElementById('h-main');
    const cards = document.querySelectorAll('.reveal');
    const table = document.getElementById('t-main');

    setTimeout(() => header.classList.add('show'), 100);
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('show');
        }, 400 + (index * 200)); 
    });

    setTimeout(() => {
        table.classList.add('show');
        startLiveUpdates();
    }, 1100);
}

function getRandomIP() {
    const dePrefixes = [80, 81, 82, 88, 91];
    return `${dePrefixes[Math.floor(Math.random() * dePrefixes.length)]}.${Math.floor(Math.random() * 255)}.x.x`;
}

function generateRowData() {
    const protocols = ['AES-GCM', 'TLS_1.3', 'UDP/DTLS', 'X25519'];
    const payloadTypes = ['CHUNK', 'BLOB', 'DATA', 'FRAG'];
    return {
        ip: getRandomIP(),
        proto: protocols[Math.floor(Math.random() * protocols.length)],
        id: (Math.random() * 10000).toFixed(0).padStart(5, '0'),
        type: payloadTypes[Math.floor(Math.random() * payloadTypes.length)]
    };
}

function renderRow(rowData) {
    const row = document.createElement('tr');
    row.className = "border-b-2 border-black hover:bg-gray-50 transition-colors font-mono";
    row.innerHTML = `
        <td class="p-4 border-r-2 border-black">${rowData.ip}</td>
        <td class="p-4 border-r-2 border-black text-blue-600">${rowData.proto}</td>
        <td class="p-4 border-r-2 border-black italic">${rowData.type}_${rowData.id}</td>
        <td class="p-4 text-green-600 font-bold uppercase text-[10px]">Relayed_DE_FRA</td>
    `;
    tableBody.prepend(row);
}

function updateMetrics() {
    stats.totalGB += Math.random() * 0.02;
    let speedDrift = (Math.random() * 0.04 - 0.02);
    stats.currentSpeed = Math.max(2.4, Math.min(2.8, stats.currentSpeed + speedDrift));
    let tunnelDrift = Math.floor(Math.random() * 3) - 1;
    stats.tunnels = Math.max(450, Math.min(520, stats.tunnels + tunnelDrift));
    saveStats();
    updateUI();
}

function addTrafficRow() {
    const newEntry = generateRowData();
    stats.logHistory.push(newEntry);
    if (stats.logHistory.length > 15) stats.logHistory.shift();
    renderRow(newEntry);
    if (tableBody.rows.length > 15) tableBody.deleteRow(15);
    saveStats();
}

function updateUI() {
    totalEl.innerText = (stats.totalGB / 1024).toFixed(4) + " TB";
    speedEl.innerText = stats.currentSpeed.toFixed(2) + " Gbps";
    tunnelEl.innerText = stats.tunnels;
    if (uplinkEl) uplinkEl.innerText = `↑ Uplink: ${stats.uplink}% capacity`;
}

function updateUplink() {
    stats.uplink = (Math.random() * (95.1 - 91.5) + 91.5).toFixed(1);
    saveStats();
    updateUI();
}

function startLiveUpdates() {
    setInterval(addTrafficRow, 2500);
    setInterval(updateMetrics, 3000);
    setInterval(updateUplink, 15000);
}

function init() {
    tableBody.innerHTML = '';
    if (stats.logHistory.length === 0) {
        for (let i = 0; i < 15; i++) {
            stats.logHistory.push(generateRowData());
        }
    }
    stats.logHistory.forEach(data => renderRow(data));
    updateUI();
    runLoader();
}

init();