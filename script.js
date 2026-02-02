const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const appList = document.getElementById("appList");
const sectionTitle = document.getElementById("section-title");
const searchInput = document.getElementById("search");

// Initial capture of Android apps from the HTML
const allAndroidApps = Array.from(document.querySelectorAll(".app-card"));

// Windows Game Database
const windowsGamesData = [
    {
        name: "Unavailable",
        category: "WINDOWS • ----",
        img: "img/",
        link: "files/"
    },
    {
        name: "Unavailable",
        category: "WINDOWS • ----",
        img: "img/",
        link: "files/"
    },
];

function createWinCard(game) {
    const card = document.createElement("div");
    card.className = "app-card";
    card.innerHTML = `
        <div class="app-visual"><img src="${game.img}" alt="${game.name}"></div>
        <div class="app-details">
            <h3>${game.name}</h3>
            <span class="category">${game.category}</span>
            <div class="actions"><a href="${game.link}" class="download-btn" download>Download</a></div>
        </div>
    `;
    return card;
}

function resetAnimation(card, delay) {
    card.style.animation = "none";
    card.offsetHeight; 
    card.style.animation = "fadeSlideUp 0.5s ease forwards";
    card.style.animationDelay = `${delay * 0.05}s`;
}

// ================= NAVIGATION =================
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        searchInput.value = ""; 

        const text = item.innerText.trim().toLowerCase();
        if (text === "home") showHome();
        else if (text === "android") showAndroid();
        else if (text === "windows") showWindows();
        else if (text === "downloads") showDownloads();
        closeMenu();
    });
});

function showHome() {
    sectionTitle.innerText = "All Games&Apps";
    appList.innerHTML = "";
    allAndroidApps.forEach((app, i) => { app.style.display = "flex"; appList.appendChild(app); resetAnimation(app, i); });
    windowsGamesData.forEach((game, i) => {
        const card = createWinCard(game);
        appList.appendChild(card);
        resetAnimation(card, allAndroidApps.length + i);
    });
}

function showAndroid() {
    sectionTitle.innerText = "📱 Games&Apps";
    appList.innerHTML = "";
    allAndroidApps.forEach((app, i) => { app.style.display = "flex"; appList.appendChild(app); resetAnimation(app, i); });
}

function showWindows() {
    sectionTitle.innerText = "💻 Games&Apps";
    appList.innerHTML = "";
    windowsGamesData.forEach((game, i) => {
        const card = createWinCard(game);
        appList.appendChild(card);
        resetAnimation(card, i);
    });
}

function showDownloads() {
    sectionTitle.innerText = "Top Downloads";
    appList.innerHTML = "";

    // Header for Clear Button
    const header = document.createElement("div");
    header.style.cssText = "grid-column: 1/-1; display:flex; justify-content:flex-end; padding-bottom: 20px;";
    header.innerHTML = `<button class="badge" id="clearBtn" style="cursor:pointer; border:1px solid var(--accent); background:transparent;">Clear History</button>`;
    appList.appendChild(header);

    const clearBtn = document.getElementById("clearBtn");
    clearBtn.onclick = () => {
        // ADDED: TRIGGER SHAKE ANIMATION
        clearBtn.classList.add("clear-btn-active");
        setTimeout(() => {
            localStorage.removeItem("downloads");
            showDownloads();
        }, 400); // Wait for animation to finish
    };

    let downloads = JSON.parse(localStorage.getItem("downloads")) || [];
    if (downloads.length === 0) {
        appList.innerHTML += `<p style="grid-column:1/-1; text-align:center; color:var(--text-sub); padding:40px;">No history found.</p>`;
        return;
    }

    downloads.reverse().forEach((name, i) => {
        const match = allAndroidApps.find(c => c.querySelector("h3").innerText === name) || 
                      windowsGamesData.find(g => g.name === name);
        if (match) {
            const card = match.nodeType ? match.cloneNode(true) : createWinCard(match);
            card.style.display = "flex";
            appList.appendChild(card);
            resetAnimation(card, i);
        }
    });
}

// ================= SMART SEARCH =================
searchInput.addEventListener("input", function() {
    const query = this.value.toLowerCase().trim();
    const cards = appList.querySelectorAll(".app-card");
    let delay = 0;
    cards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = "flex";
            resetAnimation(card, delay++);
        } else {
            card.style.display = "none";
        }
    });
});

// ================= TRACKER =================
appList.addEventListener("click", (e) => {
    if (e.target.classList.contains("download-btn")) {
        const name = e.target.closest(".app-card").querySelector("h3").innerText;
        let downloads = JSON.parse(localStorage.getItem("downloads")) || [];
        if(!downloads.includes(name)) downloads.push(name);
        localStorage.setItem("downloads", JSON.stringify(downloads));
    }
});

function toggleMenu() { sideMenu.classList.add("active"); overlay.classList.add("active"); }
function closeMenu() { sideMenu.classList.remove("active"); overlay.classList.remove("active"); }

// Launch Home Tab by default
showHome();
