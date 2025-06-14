// Smart Wallet Tracker
let wallets = [];
let nextId = 1;

// Sample data
const sampleWallets = [
  {
    id: 1,
    name: "Alpha Trader",
    address: "0x742d35Cc6634C0532925a3b8D52EFa6332312e24d",
    chain: "ETH",
    pnl: 45230.5,
    winRate: 78.5,
    totalTrades: 127,
    avgHoldTime: "2.3 days",
    lastTrade: "2 hours ago",
    status: "active",
    notes: "Early PEPE entries, quick exits",
  },
  {
    id: 2,
    name: "Degen Master",
    address: "0x8Ba1f109551bD432803012645Hac136c22C23C0",
    chain: "BSC",
    pnl: -2340.2,
    winRate: 45.2,
    totalTrades: 89,
    avgHoldTime: "1.1 days",
    lastTrade: "1 day ago",
    status: "inactive",
    notes: "High risk, low consistency",
  },
  {
    id: 3,
    name: "Solana Sniper",
    address: "DRiP2Gufk4ztztMEp7NLDV3jKJZEJ2X5nJqCPEZ8AQhY",
    chain: "SOL",
    pnl: 89450.75,
    winRate: 82.1,
    totalTrades: 203,
    avgHoldTime: "3.7 days",
    lastTrade: "30 min ago",
    status: "active",
    notes: "Excellent timing, SOL ecosystem expert",
  },
];

// Initialize with sample data
wallets = [...sampleWallets];
nextId = Math.max(...wallets.map((w) => w.id)) + 1;

function renderTable() {
  const tbody = document.getElementById("walletTableBody");
  tbody.innerHTML = "";

  wallets.forEach((wallet) => {
    const row = document.createElement("tr");

    const winRateClass =
      wallet.winRate >= 70 ? "high" : wallet.winRate >= 50 ? "medium" : "low";
    const pnlClass = wallet.pnl >= 0 ? "profit-positive" : "profit-negative";

    row.innerHTML = `
                    <td><strong>${wallet.name}</strong></td>
                    <td><div class="wallet-address" title="${wallet.address}">${
      wallet.address
    }</div></td>
                    <td><span class="chain-badge chain-${wallet.chain.toLowerCase()}">${
      wallet.chain
    }</span></td>
                    <td class="${pnlClass}">$${wallet.pnl.toLocaleString()}</td>
                    <td class="win-rate ${winRateClass}">${wallet.winRate}%</td>
                    <td>${wallet.totalTrades}</td>
                    <td>${wallet.avgHoldTime}</td>
                    <td>${wallet.lastTrade}</td>
                    <td><span class="status ${wallet.status}">${
      wallet.status
    }</span></td>
                    <td>${wallet.notes}</td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;" onclick="removeWallet(${
                          wallet.id
                        })">Remove</button>
                    </td>
                `;
    tbody.appendChild(row);
  });

  updateStats();
}

function updateStats() {
  const totalWallets = wallets.length;
  const activeWallets = wallets.filter((w) => w.status === "active").length;
  const avgWinRate =
    totalWallets > 0
      ? (wallets.reduce((sum, w) => sum + w.winRate, 0) / totalWallets).toFixed(
          1
        )
      : 0;
  const totalProfit = wallets.reduce((sum, w) => sum + w.pnl, 0);

  document.getElementById("totalWallets").textContent = totalWallets;
  document.getElementById("avgWinRate").textContent = avgWinRate + "%";
  document.getElementById("totalProfit").textContent =
    "$" + totalProfit.toLocaleString();
  document.getElementById("activeWallets").textContent = activeWallets;

  // Color total profit
  const profitEl = document.getElementById("totalProfit");
  profitEl.className =
    totalProfit >= 0
      ? "stat-value profit-positive"
      : "stat-value profit-negative";
}

function showAddWalletForm() {
  document.getElementById("addWalletForm").style.display = "flex";
}

function hideAddWalletForm() {
  document.getElementById("addWalletForm").style.display = "none";
  document.querySelector("form").reset();
}

function addWallet(event) {
  event.preventDefault();

  const newWallet = {
    id: nextId++,
    name: document.getElementById("walletName").value,
    address: document.getElementById("walletAddress").value,
    chain: document.getElementById("walletChain").value,
    pnl: parseFloat(document.getElementById("walletPnl").value) || 0,
    winRate: parseFloat(document.getElementById("walletWinRate").value) || 0,
    totalTrades: parseInt(document.getElementById("walletTrades").value) || 0,
    avgHoldTime: "N/A",
    lastTrade: "Just added",
    status: "active",
    notes: document.getElementById("walletNotes").value || "",
  };

  wallets.push(newWallet);
  renderTable();
  hideAddWalletForm();
}

function removeWallet(id) {
  if (confirm("Are you sure you want to remove this wallet?")) {
    wallets = wallets.filter((w) => w.id !== id);
    renderTable();
  }
}

function filterTable(searchTerm) {
  const rows = document.querySelectorAll("#walletTableBody tr");
  const term = searchTerm.toLowerCase();

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? "" : "none";
  });
}

function exportData() {
  const headers = [
    "Name",
    "Address",
    "Chain",
    "P&L",
    "Win Rate",
    "Total Trades",
    "Avg Hold Time",
    "Last Trade",
    "Status",
    "Notes",
  ];
  const csvContent = [
    headers.join(","),
    ...wallets.map((w) =>
      [
        w.name,
        w.address,
        w.chain,
        w.pnl,
        w.winRate,
        w.totalTrades,
        w.avgHoldTime,
        w.lastTrade,
        w.status,
        w.notes,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smart_wallets.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

// Initialize table
renderTable();
