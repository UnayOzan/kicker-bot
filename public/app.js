let gameState = null;
let timerInterval = null;
let lastTurnNumber = 0;
let actionHistory = {};
const previousHp = {};
const icons = { hp: '❤️', atk: '⚔️', def: '🛡️' };

function showDamage(username, amount) {
  const popup = document.getElementById(`damage-${username}`);
  if (!popup) return;
  popup.textContent = `-${amount}`;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
    popup.textContent = "";
  }, 800);
}

function renderTutorial() {
  return `
    <div class="tutorial-panel bg-gray-800 p-6 rounded shadow text-center">
      <h2 class="text-2xl font-bold mb-4">Nasıl Oynanır?</h2>
      <ul class="mb-4 text-lg text-left mx-auto max-w-xl">
        <li>1. Oyun başlamasını bekleyin.</li>
        <li>2. Lobby açıldığında, <span class="font-mono bg-gray-700 px-2 py-1 rounded">!join &lt;class&gt;</span> (archer, healer, defender) komutuyla katılın.</li>
        <li>3. Oyun başladığında aşağıdaki komutları kullanarak oynayın:</li>
        <ul class="ml-6 list-disc">
          <li><span class="font-mono bg-gray-700 px-2 py-1 rounded">!attack</span> - Saldırı yapar</li>
          <li><span class="font-mono bg-gray-700 px-2 py-1 rounded">!defend</span> - Savunma yapar</li>
          <li><span class="font-mono bg-gray-700 px-2 py-1 rounded">!heal</span> - Kendini veya birini iyileştirir</li>
        </ul>
        <li>Komutları yazarken emote (ör: ⚔️, 🛡️, ❤️) kullanabilirsiniz. Örnek: <span class="font-mono bg-gray-700 px-2 py-1 rounded">!attack ⚔️</span></li>
        <li><span class="font-mono bg-gray-700 px-2 py-1 rounded">!stats</span> ile kendi istatistiklerinizi görebilirsiniz.</li>
        <li><span class="font-mono bg-gray-700 px-2 py-1 rounded">!players</span> ile tüm oyuncuları görebilirsiniz.</li>
        <li>Tüm komutlar için <span class="font-mono bg-gray-700 px-2 py-1 rounded">!help</span> yazabilirsiniz.</li>
      </ul>
      <div class="text-yellow-300 text-lg">Oyun başlamasını bekliyor...</div>
    </div>
  `;
}

function renderLobby(lobby) {
  const players = lobby?.players || {};
  return `
    <div class="lobby-panel bg-gray-800 p-6 rounded shadow">
      <h2 class="text-2xl font-bold mb-4">Lobby - Waiting for Players</h2>
      <div class="mb-2 text-gray-400">Game will start in <span class="font-mono text-yellow-300">${lobby.waitTime ?? "?"}</span> seconds</div>
      <div class="grid grid-cols-2 gap-4">
        ${Object.values(players).length === 0 ? `<div class="col-span-2 text-center text-gray-500">No players joined yet.</div>` :
          Object.values(players).map(p => `
            <div class="lobby-player bg-gray-700 rounded p-3 flex items-center gap-3">
              <span class="text-2xl">${p.stats.icon || "👤"}</span>
              <span class="font-bold">${p.name}</span>
              <span class="ml-auto px-2 py-1 rounded bg-gray-900 text-sm">${p.class}</span>
            </div>
          `).join("")
        }
      </div>
    </div>
  `;
}

function renderGame(gameState) {
  const currentRound = getCurrentRound(gameState);
  return `
    <section class="mb-6">
      <h2 class="text-2xl font-semibold mb-3">Players vs Enemies</h2>
      <div id="playerGrid"></div>
    </section>
    <section>
      <h2 class="text-2xl font-semibold mb-3">Action Log</h2>
      <div id="log" class="bg-gray-800 p-4 h-48 overflow-y-auto font-mono rounded shadow"></div>
    </section>
  `;
}

function renderGameOver() {
  return `
    <div class="gameover-panel bg-gray-800 p-6 rounded shadow text-center">
      <h2 class="text-3xl font-bold mb-4 text-red-400">Game Over</h2>
      <div id="log" class="bg-gray-900 p-4 h-64 overflow-y-auto font-mono rounded shadow mx-auto max-w-2xl"></div>
    </div>
  `;
}

function getCurrentRound(state) {
  if (state && state.rounds && state.rounds.length > 0) {
    return state.rounds[state.rounds.length - 1];
  }
  return null;
}

function updateMainContent(state) {
  const main = document.getElementById("mainContent");
  if (!main) return;
  if (!state || state.status === "Idle") {
    main.innerHTML = renderTutorial();
  } else if (state.status === "Lobby") {
    main.innerHTML = renderLobby(state.lobby);
  } else if (["InTurn", "Processing"].includes(state.status)) {
    main.innerHTML = renderGame(state);
  } else if (state.status === "Finished") {
    main.innerHTML = renderGameOver();
  }
}

function renderPlayers(players, pairs) {
  const grid = document.getElementById("playerGrid");
  if (!grid) return;
  grid.innerHTML = "";
  for (const username in actionHistory) {
    if (!players[username]) delete actionHistory[username];
  }
  for (const username in previousHp) {
    if (!players[username]) delete previousHp[username];
  }
  Object.entries(players).forEach(([username, player]) => {
    const pair = pairs?.[username];
    const enemy = pair?.enemy;
    const cell = document.createElement("div");
    cell.className = "playerCell";
    cell.classList.remove("attack", "defense", "heal");
    switch ((player.lastAction || "").toLowerCase()) {
      case "attack": cell.classList.add("attack"); break;
      case "defend": cell.classList.add("defense"); break;
      case "heal": cell.classList.add("heal"); break;
    }
    cell.style.position = "relative";
    const playerDiv = document.createElement("div");
    playerDiv.className = "playerInfo";
    playerDiv.innerHTML = `
  <div class="font-semibold text-lg mb-1">${username}</div>
  <div class="stats">
    <div class="text-3xl mb-1">${player.stats.icon || "👹"}</div>
    <div class="font-mono text-lg">${player.class}</div>
    <div class="text-sm mt-1">${icons.hp} ${player.stats.hp} | ${icons.atk} ${player.stats.atk} | ${icons.def} ${player.stats.def}</div>
  </div>
  <div class="mt-2 text-yellow-300 italic text-xs">Action: ${player.lastAction || "Idle"}</div>
  <div class="scroll-text text-xs text-yellow-400 mt-1">
    <span>${player.combatLog || "Waiting for action..."}</span>
  </div>
`;
    const enemyDiv = document.createElement("div");
    enemyDiv.className = "enemyInfo text-right";
    if (enemy) {
      enemyDiv.innerHTML = `
    <div class="text-3xl mb-1">${enemy.icon || "👹"}</div>
    <div class="font-mono text-lg">${enemy.name}</div>
    <div class="text-sm mt-1">${icons.hp} ${enemy.hp} | ${icons.atk} ${enemy.atk} | ${icons.def} ${enemy.def}</div>
  `;
    } else {
      enemyDiv.innerHTML = `<div class="italic text-gray-400">No Enemy</div>`;
    }
    cell.appendChild(playerDiv);
    cell.appendChild(enemyDiv);
    const popup = document.createElement("div");
    popup.className = "damage-popup";
    popup.id = `damage-${username}`;
    cell.appendChild(popup);
    grid.appendChild(cell);
    const prevHp = previousHp[username] ?? player.stats.hp;
    if (player.stats.hp < prevHp) {
      showDamage(username, prevHp - player.stats.hp);
    }
    previousHp[username] = player.stats.hp;
  });
}

function addLog(message, type = "info") {
  const logEl = document.getElementById("log");
  if (!logEl) return;
  const line = document.createElement("div");
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  if (type === "error") line.classList.add("text-red-400");
  if (type === "help") line.classList.add("text-green-300");
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

function updateActionLog(players) {
  const logEl = document.getElementById("log");
  if (!logEl) return;
  Object.entries(players).forEach(([username, player]) => {
    if (player.lastAction && actionHistory[username] !== player.lastAction) {
      actionHistory[username] = player.lastAction;
      addLog(`${username} → ${player.lastAction.toUpperCase()}`);
    }
  });
}

// --- EventSource Setup ---
const evtSource = new EventSource("/players-stream");
evtSource.onopen = () => {
  addLog("Bağlantı kuruldu.");
};
evtSource.onerror = (err) => {
  addLog("Bağlantı hatası! Yeniden bağlanmaya çalışılıyor...", "error");
};
evtSource.onmessage = (event) => {
  if (!event.data) return;
  let data;
  try {
    data = JSON.parse(event.data);
  } catch (e) {
    addLog("Gelen veri çözümlenemedi!", "error");
    return;
  }
  if (data.type === undefined || data.type === "gameState") {
    gameState = data.gameState || data;
    updateMainContent(gameState);
    if (["InTurn", "Processing"].includes(gameState.status)) {
      const currentRound = getCurrentRound(gameState);
      renderPlayers(gameState.lobby?.players || {}, currentRound?.pairs || {});
      updateActionLog(gameState.lobby?.players || {});
    }
    if (gameState.status === "Finished") {
      // Show logs only
    }
    if (data.systemMessage) addLog(data.systemMessage);
  } else if (data.type === "stats") {
    addLog(`Stats: ${data.username} - HP: ${data.stats.hp}, ATK: ${data.stats.atk}, DEF: ${data.stats.def}`);
  } else if (data.type === "players") {
    addLog(`Oyuncular: ${(data.players || []).join(", ")}`);
  } else if (data.type === "help") {
    addLog(`Komutlar: ${(data.commands || []).join(", ")}`, "help");
  } else if (data.type === "error") {
    addLog(`Hata: ${data.message}`, "error");
  } else {
    addLog(`Bilinmeyen tipte mesaj: ${data.type}`);
  }
}; 