const ctx = document.getElementById('realtimeChart').getContext('2d');
const memCtx = document.getElementById('memoryChart').getContext('2d');

let dataValues = Array(10).fill(0);
let memoryValues = Array(10).fill(0);
let labels = Array.from({ length: 10 }, () => new Date().toLocaleTimeString());

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'CPU Usage (%)',
            data: dataValues,
            borderColor: 'cyan',
            backgroundColor: 'rgba(0,255,255,0.2)',
            borderWidth: 2,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});

const memoryChart = new Chart(memCtx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Memory Usage (%)',
            data: memoryValues,
            borderColor: 'limegreen',
            backgroundColor: 'rgba(50,205,50,0.2)',
            borderWidth: 2,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});

function updateChart() {
    let cpuUsage = Math.floor(Math.random() * 100);
    let memoryUsage = Math.floor(Math.random() * 100);
    let networkActivity = Math.floor(Math.random() * 200);

    document.getElementById('cpu').textContent = `${cpuUsage}%`;
    document.getElementById('memory').textContent = `${memoryUsage}%`;
    document.getElementById('network').textContent = `${networkActivity} kbps`;

    dataValues.shift();
    memoryValues.shift();
    labels.shift();

    dataValues.push(cpuUsage);
    memoryValues.push(memoryUsage);
    labels.push(new Date().toLocaleTimeString());

    chart.data.labels = labels;
    memoryChart.data.labels = labels;

    chart.update();
    memoryChart.update();

    updateSummary(cpuUsage, memoryUsage);
}

function updateSummary(cpu, memory) {
    document.getElementById("avgCpu").textContent = `${(dataValues.reduce((a, b) => a + b, 0) / dataValues.length).toFixed(1)}%`;
    document.getElementById("avgMemory").textContent = `${(memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length).toFixed(1)}%`;

    // Simulate top process
    const topProcesses = ["chrome.exe", "vscode", "spotify", "edge.exe"];
    document.getElementById("topProcess").textContent = topProcesses[Math.floor(Math.random() * topProcesses.length)];
}

setInterval(updateChart, 1000);

// Process Table Initialization
const processData = [
    { pid: 101, name: "Files Manager", cpu: 25, memory: 35, status: "Running" },
    { pid: 102, name: "Whatsapp", cpu: 18, memory: 20, status: "Sleeping" },
    { pid: 103, name: "Chrome", cpu: 32, memory: 40, status: "Running" },
    { pid: 104, name: "Vscode", cpu: 45, memory: 70, status: "High" },
];

const tbody = document.getElementById("process-table-body");

processData.forEach(proc => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${proc.pid}</td>
      <td>${proc.name}</td>
      <td>${proc.cpu}%</td>
      <td>${proc.memory}%</td>
      <td>${proc.status}</td>
      <td><button class="kill-btn">Kill</button></td>
    `;
    row.querySelector(".kill-btn").addEventListener("click", () => {
        tbody.removeChild(row);
    });
    tbody.appendChild(row);
});

function fetchProcessDetails() {
    const input = document.getElementById("processInput").value.trim().toLowerCase();
    const pidElem = document.getElementById("pid");
    const memoryElem = document.getElementById("memoryUsage");
    const statusElem = document.getElementById("status");

    const processDatabase = {
        "whatsapp": { pid: 1423, memory: "150 MB", status: "Sleeping" },
        "vscode": { pid: 2345, memory: "480 MB", status: "Running" },
        "chrome": { pid: 1987, memory: "300 MB", status: "Running" },
        "file manager": { pid: 1927, memory: "563 MB", status: "Running" }
    };

    const processInfo = processDatabase[input];

    if (processInfo) {
        pidElem.textContent = processInfo.pid;
        memoryElem.textContent = processInfo.memory;
        statusElem.textContent = processInfo.status;
    } else {
        const pid = Math.floor(Math.random() * 10000);
        const memory = (Math.random() * 500).toFixed(2) + " MB";
        const statuses = ["Sleeping", "Stopped"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        pidElem.textContent = pid;
        memoryElem.textContent = memory;
        statusElem.textContent = status;
    }
}
