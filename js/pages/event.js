// File: js/pages/event.js

// Pastikan eventsData dari calendar.js sudah dimuat
if (typeof eventsData === "undefined") {
  console.error("eventsData belum dimuat. Pastikan calendar.js di-load sebelum event.js.");
}

/**
 * Fungsi untuk mengubah YYYY-MM-DD menjadi format cantik
 */
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString.replace(/-/g, "/"));
  return date.toLocaleDateString("id-ID", options);
}

// === FUNGSI REUSABLE: POSTER CARD MARKUP ===
function createEventCardHTML(event) {
  const detailLink = `event-detail.html?id=${event.id}`;
  let imagePath = event.imgSrc ? `../../${event.imgSrc.replace("../../", "")}` : "../../img/logohmte.png";
  const formattedDate = formatDate(event.date);

  const actionButtonHTML = event.registrationLink
    ? `
        <button onclick="event.stopPropagation(); window.open('${event.registrationLink}', '_blank')" 
                class="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm shadow-lg hover:shadow-green-500/50">
            <i class="fas fa-user-plus mr-2"></i>Daftar Sekarang
        </button>
        `
    : `
        <button onclick="window.location.href='${detailLink}'" 
                class="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 text-sm shadow-lg hover:shadow-cyan-500/50">
            <i class="fas fa-info-circle mr-2"></i>Lihat Detail
        </button>
        `;

  const borderColorClass =
    event.color === "green"
      ? "border-emerald-500 hover:border-emerald-400 hover:shadow-emerald-500/40"
      : event.color === "blue"
      ? "border-cyan-500 hover:border-cyan-400 hover:shadow-cyan-500/40"
      : "border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-500/40";

  return `
      <div class="group flex flex-col rounded-xl overflow-hidden border-2 ${borderColorClass}
                  transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                  cursor-pointer bg-gradient-to-b from-gray-900 to-gray-800 w-full max-w-sm mx-auto"
           onclick="window.location.href='${detailLink}'">

          <!-- Image Container dengan Aspect Ratio 3:4 untuk poster -->
          <div class="relative w-full bg-gray-950 overflow-hidden" style="aspect-ratio: 3/4;">
              <img src="${imagePath}" 
                   alt="${event.title}" 
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                   onerror="this.onerror=null;this.src='../../img/logohmte.png';" />
              
              <!-- Overlay Gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- Card Content -->
          <div class="p-4 flex flex-col flex-1 space-y-3">
              <!-- Title -->
              <h3 class="text-base font-bold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                  ${event.title}
              </h3>
              
              <!-- Event Details -->
              <div class="text-gray-300 text-xs space-y-2 flex-1">
                  <div class="flex items-start gap-2">
                      <i class="far fa-calendar-alt mt-0.5 text-cyan-400 flex-shrink-0"></i>
                      <span class="line-clamp-1">${formattedDate}</span>
                  </div>
                  <div class="flex items-start gap-2">
                      <i class="fas fa-clock mt-0.5 text-cyan-400 flex-shrink-0"></i>
                      <span class="line-clamp-1">${event.time}</span>
                  </div>
                  <div class="flex items-start gap-2">
                      <i class="fas fa-map-marker-alt mt-0.5 text-cyan-400 flex-shrink-0"></i>
                      <span class="line-clamp-2">${event.location}</span>
                  </div>
              </div>
              
              <!-- Action Button -->
              <div class="pt-2">
                  ${actionButtonHTML}
              </div>
          </div>
      </div>
    `;
}
// === END FUNGSI REUSABLE ===

/**
 * Logika untuk Halaman Daftar Event (event.html)
 */
function loadEventListPage() {
  const featuredListContainer = document.getElementById("featured-events-list");
  const currentEventContainer = document.getElementById("current-event-register");

  if (!featuredListContainer || !currentEventContainer || typeof eventsData === "undefined") return;

  // 1. Filter Event yang Sesuai Kriteria
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFeaturedEvents = eventsData.filter((event) => new Date(event.date).setHours(0, 0, 0, 0) >= today.getTime() && event.isFeatured).sort((a, b) => new Date(a.date) - new Date(b.date));

  currentEventContainer.innerHTML = "";
  featuredListContainer.innerHTML = "";

  if (upcomingFeaturedEvents.length === 0) {
    currentEventContainer.innerHTML = '<p class="text-gray-400 text-center">Saat ini tidak ada event utama yang akan datang.</p>';
    featuredListContainer.innerHTML = '<p class="text-gray-400 col-span-full text-center py-8">Tidak ada event utama tambahan yang akan datang.</p>';
    return;
  }

  // 2. Tentukan Event Paling Utama (DIV 2: Kolom Kanan Register)
  const currentEvent = upcomingFeaturedEvents[0];

  // 3. Render Div 2 (Kolom Kanan: Event Saat Ini & Register)
  currentEventContainer.innerHTML = renderCurrentEvent(currentEvent);

  // 4. Render Div 1 (Featured Events Lainnya)
  const otherFeaturedEvents = upcomingFeaturedEvents.slice(1);
  featuredListContainer.innerHTML = otherFeaturedEvents.map(createEventCardHTML).join("");

  if (otherFeaturedEvents.length === 0) {
    featuredListContainer.innerHTML = '<p class="text-gray-400 col-span-full text-center py-8">Tidak ada event utama tambahan yang akan datang.</p>';
  }
}

/**
 * Render markup untuk Event yang Sedang Berlangsung (Div 2 di event.html)
 */
function renderCurrentEvent(event) {
  const formattedDate = formatDate(event.date);
  const detailLink = `event-detail.html?id=${event.id}`;
  const imagePath = event.imgSrc || "../../img/logohmte.png";

  // Tombol aksi utama (Daftar atau Lihat Detail)
  const primaryButtonHTML = `
        <a href="${event.registrationLink || detailLink}" target="_blank" 
           class="inline-block w-full text-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-500/50">
            <i class="fas fa-${event.registrationLink ? "user-plus" : "info-circle"} mr-2"></i> 
            ${event.registrationLink ? "DAFTAR SEKARANG" : "LIHAT DETAIL"}
        </a>
    `;

  // Tombol sekunder (Hanya ditampilkan jika tombol utama adalah 'Daftar Sekarang')
  const secondaryButtonHTML = event.registrationLink
    ? `
    <a href="${detailLink}" 
       class="inline-block w-full text-center mt-3 px-6 py-2.5 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm border border-gray-600">
        <i class="fas fa-book-open mr-2"></i>Baca Selengkapnya
    </a>
  `
    : "";

  return `
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-2xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300">
            ${
              event.imgSrc
                ? `
                <div class="relative overflow-hidden rounded-lg mb-5 group">
                    <img src="${imagePath}" 
                         alt="${event.title}" 
                         class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                         onerror="this.onerror=null;this.src='../../img/logohmte.png';">
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                </div>
            `
                : ""
            }
            
            <h3 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-3">
                ${event.title}
            </h3>
            <p class="text-gray-300 mb-5 leading-relaxed">${event.description}</p>
            
            <div class="text-sm space-y-3 mb-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div class="flex items-center gap-3">
                    <i class="far fa-calendar-alt text-cyan-400 text-lg w-5"></i>
                    <span class="text-white font-medium">${formattedDate}</span>
                </div>
                <div class="flex items-center gap-3">
                    <i class="fas fa-clock text-cyan-400 text-lg w-5"></i>
                    <span class="text-white font-medium">${event.time}</span>
                </div>
                <div class="flex items-start gap-3">
                    <i class="fas fa-map-marker-alt text-cyan-400 text-lg w-5 mt-0.5"></i>
                    <a href="${event.locationLink}" target="_blank" 
                       class="text-white font-medium ${event.locationLink ? "hover:text-cyan-300 underline" : ""}">
                        ${event.location}
                    </a>
                </div>
            </div>
            
            ${primaryButtonHTML}
            ${secondaryButtonHTML}
        </div>
    `;
}

// === EKSEKUSI BERDASARKAN LOKASI FILE ===
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("event.html") && !path.includes("event-detail.html")) {
    setTimeout(() => {
      loadEventListPage();
    }, 100);
  } else if (path.includes("event-detail.html")) {
    loadEventDetailPage();
  }
});

// Expose functions jika diperlukan oleh loader lain
window.loadEventListPage = loadEventListPage;
