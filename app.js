const HYPIXEL_API = 'https://api.hypixel.net/skyblock/bazaar';
const ITEM = 'BOOSTER_COOKIE';
const GEMS_PER_COOKIE = 325;
const CREATOR_CODE = true;
const PACKAGES = [
    { "name": "675 SkyBlock Gems", "price": 4.99, "gems": 675 },
    { "name": "1,350 SkyBlock Gems", "price": 9.99, "gems": 1390 },
    { "name": "3,375 SkyBlock Gems", "price": 24.99, "gems": 3600 },
    { "name": "6,750 SkyBlock Gems", "price": 49.99, "gems": 7300 },
    { "name": "13,500 SkyBlock Gems", "price": 99.99, "gems": 16400 }
];

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toFixed(2);
}

function createPackageElements() {
    const packagesContainer = document.getElementById('packages');
    PACKAGES.forEach((pkg, index) => {
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        packageElement.innerHTML = `
                    <h3>${pkg.name}</h3>
                    <p>$${pkg.price}</p>
                `;
        packageElement.addEventListener('click', () => selectPackage(index));
        packagesContainer.appendChild(packageElement);
    });
}

function selectPackage(index) {
    document.querySelectorAll('.package').forEach(pkg => pkg.classList.remove('selected'));
    document.querySelectorAll('.package')[index].classList.add('selected');
    calculateResults(index);
}

function calculateResults(packageIndex) {
    fetch(HYPIXEL_API)
        .then(response => response.json())
        .then(data => {
            const status = data.products[ITEM].quick_status;
            const package = PACKAGES[packageIndex];
            const cookies = Math.floor(package.gems / GEMS_PER_COOKIE);
            const leftover = package.gems % GEMS_PER_COOKIE;
            const sellOrder = status.buyPrice * cookies;
            const instantSell = status.sellPrice * cookies;

            updateResults('sellOrderResults', package, cookies, leftover, sellOrder, status.buyPrice);
            updateResults('instantSellResults', package, cookies, leftover, instantSell, status.sellPrice);
        });
}

function updateResults(elementId, package, cookies, leftover, coins, cookiePrice) {
    const resultsElement = document.getElementById(elementId);
    const gems = package.gems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    resultsElement.innerHTML = `
                <div class="result-item"><i class="fas fa-box"></i> Package w/ bonus: ${gems}</div>
                <div class="result-item"><i class="fas fa-gem"></i> Gems per cookie: ${GEMS_PER_COOKIE}</div>
                <div class="result-item"><i class="fas fa-cookie"></i> Booster cookies: ${cookies}</div>
                <div class="result-item"><i class="fas fa-gem"></i> Leftover gems: ${leftover}</div>
                <div class="result-item"><i class="fas fa-cookie-bite"></i> Cookie value: ${formatNumber(cookiePrice)} coins</div>
                <div class="result-item"><i class="fas fa-coins"></i> Coins: ${formatNumber(coins)}</div>
                <div class="result-item"><i class="fas fa-dollar-sign"></i> Coins per USD: ${formatNumber(coins / package.price)}</div>
            `;
}

createPackageElements();
selectPackage(0);