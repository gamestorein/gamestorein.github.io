// ================= MENU CONTROLS =================
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
}

function closeMenu() {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
}

// ================= APP DATA =================
const appList = document.getElementById("appList");
const allApps = Array.from(document.querySelectorAll(".app-card"));

// ================= MENU FILTER =================
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const text = item.innerText.trim().toLowerCase();
        if (text === "android") showAndroid();
        else if (text === "windows") showWindows();
        else if (text === "top downloads") showDownloads();

        closeMenu();
    });
});

function showAndroid() { renderApps(allApps); }

function showWindows() {
    appList.innerHTML = `
        <div style="padding:40px;text-align:center;color:#64748b;">
            <h3>No Windows games yet</h3>
            <p>but soon......!</p>
        </div>
    `;
}

// ================= DOWNLOAD TRACKING =================
let downloadedApps = JSON.parse(localStorage.getItem("downloads")) || [];

document.querySelectorAll(".download-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".app-card");
        const name = card.querySelector("h3").innerText;
        downloadedApps = downloadedApps.filter(item => item !== name);
        downloadedApps.push(name);
        localStorage.setItem("downloads", JSON.stringify(downloadedApps));
    });
});

// ================= DOWNLOADS TAB (ANIMATED) =================
function showDownloads() {
    appList.innerHTML = "";
    const header = document.createElement("div");
    header.style.cssText = "width:100%; display:flex; justify-content:flex-end; padding:0 10px 20px;";

    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear History";
    clearBtn.className = "badge"; 
    clearBtn.style.cssText = "border:1px solid var(--accent); cursor:pointer; background:transparent;";
    
    header.appendChild(clearBtn);
    appList.appendChild(header);

    clearBtn.addEventListener("click", () => {
        clearBtn.classList.add("clear-btn-active");
        setTimeout(() => {
            downloadedApps = [];
            localStorage.removeItem("downloads");
            showDownloads();
        }, 400);
    });

    if (downloadedApps.length === 0) {
        const emptyDiv = document.createElement("div");
        emptyDiv.style.cssText = "grid-column: 1/-1; padding: 40px; text-align: center; color: #64748b;";
        emptyDiv.innerHTML = `<h3>No downloads yet</h3><p>Your recent downloads will appear here.</p>`;
        appList.appendChild(emptyDiv);
        return;
    }

    [...downloadedApps].reverse().forEach((name, index) => {
        const originalCard = allApps.find(card => card.querySelector("h3").innerText === name);
        if (originalCard) {
            const clone = originalCard.cloneNode(true);
            clone.style.display = "flex";
            resetAnimation(clone, index);
            appList.appendChild(clone);
        }
    });
}

// ================= APPROXIMATE SEARCH =================
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase().trim(); // Trim to avoid issues with extra spaces
    let delay = 0;

    allApps.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        // Uses .includes() so typing just "mini" finds "Mini Militia"
        if (title.includes(value)) {
            card.style.display = "flex";
            resetAnimation(card, delay++);
        } else {
            card.style.display = "none";
        }
    });
});

function renderApps(apps) {
    appList.innerHTML = "";
    apps.forEach((app, index) => {
        app.style.display = "flex";
        resetAnimation(app, index);
        appList.appendChild(app);
    });
}

function resetAnimation(card, delay) {
    card.style.animation = "none";
    card.offsetHeight; 
    card.style.animation = "fadeSlideUp 0.5s ease forwards";
    card.style.animationDelay = `${delay * 0.07}s`;
}
