// js/emagz.js

/**
 * Data Edisi Emagz: Menentukan data untuk kartu di homepage dan rentang halaman untuk reader.
 */
const emagzData = [
  {
    id: 1,
    title: "Arti Kemerdekaan",
    description: "Komik 2.0 karya Salsabila Miftahusy Syifa – Kimia",
    coverSrc: "https://apps.bem-unsoed.com/wp-content/uploads/2023/08/IMG_1799.png",
    startPage: 1,
    endPage: 4,
  },
  {
    id: 2,
    title: "Riset Teknologi Terbaru",
    description: "Deskripsi singkat artikel 2 tentang riset.",
    coverSrc: "img/emagz/page2.webp",
    startPage: 5,
    endPage: 7,
  },
  {
    id: 3,
    title: "Profil Alumni Sukses",
    description: "Deskripsi singkat artikel 3.",
    coverSrc: "img/emagz/page3.webp",
    startPage: 8,
    endPage: 10,
  },
  {
    id: 4,
    title: "Edisi Khusus Wisuda",
    description: "Perayaan kelulusan angkatan 2020.",
    coverSrc: "img/emagz/page4.webp",
    startPage: 1,
    endPage: 1,
  },
];

// === CARD RENDERING LOGIC (Untuk sections/emagz.html di Homepage) ===

function createEmagzCardHTML(edition) {
  const readerLink = `page/emagz/emagz-reader.html?id=${edition.id}`;
  const imagePath = edition.coverSrc;

  return `
        <div class="border-2 border-green-800 w-[260px] md:w-[280px] rounded-lg overflow-hidden shadow-lg bg-black hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-shadow duration-300 flex flex-col">
          <div class="p-3 bg-gray-800 flex justify-center items-center"> 
            <img src="${imagePath}" 
                 alt="${edition.title}" 
                 class="w-full h-auto object-contain"
                 onerror="this.onerror=null;this.src='img/logohmte.png';" />
          </div>

          <div class="p-4 bg-gray-800 flex-1 flex flex-col">
            <h3 class="text-white font-semibold text-lg mb-1">${edition.title}</h3>
            <p class="text-gray-300 text-sm mb-4">${edition.description}</p>
            <a href="${readerLink}" class="mt-auto px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition text-center font-semibold"> Baca </a>
          </div>
        </div>
    `;
}

/**
 * Render section Emagz di Homepage, menampilkan 3 edisi terbaru.
 */
function renderEmagzSection() {
  const container = document.getElementById("emagz-cards-container");
  const moreLink = document.getElementById("emagz-more-link");

  if (!container) return;

  const latestEditions = emagzData.slice(0, 3);

  if (latestEditions.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400">Belum ada edisi E-Magazine yang tersedia.</p>';
    if (moreLink) moreLink.classList.add("hidden");
    return;
  }

  const cardsHTML = latestEditions.map(createEmagzCardHTML).join("");
  container.innerHTML = cardsHTML;

  if (moreLink && emagzData.length > 3) {
    moreLink.classList.remove("hidden");
  }
}

// === FUNGSI CHECK BERULANG (FIX TIMING) ===
function checkAndRenderEmagzSection() {
  const container = document.getElementById("emagz-cards-container");
  if (container) {
    renderEmagzSection();
  } else {
    setTimeout(checkAndRenderEmagzSection, 50);
  }
}

// === READER LOGIC (Untuk halaman emagz-reader.html) ===

function loadEmagzReader() {
  const readerContainer = document.getElementById("emagz-reader-container");
  if (!readerContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const editionId = parseInt(urlParams.get("id"));

  const edition = emagzData.find((e) => e.id === editionId);

  if (!edition || !edition.startPage || !edition.endPage) {
    readerContainer.innerHTML = '<p class="text-center text-red-400">Error: Edisi Emagz tidak ditemukan atau data halaman tidak lengkap.</p>';
    return;
  }

  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = `Baca Emagz HMTE - Edisi ${editionId}: ${edition.title}`;

  const mainTitle = document.querySelector("main h1");
  if (mainTitle) mainTitle.textContent = `E-Magazine HMTE Edisi ${editionId}`;
  const subTitle = document.querySelector("main p.text-center");
  if (subTitle) subTitle.textContent = `Membaca: ${edition.title}`;

  const totalPagesInEdition = edition.endPage - edition.startPage + 1;

  let pagesHTML = "";
  let currentPageIndex = 1;

  for (let i = edition.startPage; i <= edition.endPage; i++) {
    const imagePath = `../../img/emagz/page${i}.webp`;

    pagesHTML += `
            <div class="emagz-page mb-4 rounded-lg shadow-2xl border-2 border-gray-700 overflow-hidden">
                <img 
                    src="${imagePath}" 
                    alt="Emagz Page ${i}" 
                    class="w-full h-auto object-contain" 
                    onerror="this.onerror=null;this.src='../../img/logohmte.png';">
                <div class="text-center py-2 text-gray-500 text-sm">Halaman ${currentPageIndex} dari ${totalPagesInEdition}</div>
            </div>
        `;
    currentPageIndex++;
  }

  readerContainer.innerHTML = pagesHTML;
}

// === EKSEKUSI DI HOMEPAGE DAN READER ===

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Check jika berada di homepage
  if (path === "/" || path.includes("index.html")) {
    checkAndRenderEmagzSection();
  }

  // Check jika berada di halaman reader
  if (path.includes("emagz-reader.html")) {
    setTimeout(loadEmagzReader, 100);
  }
});
