// File: js/load-global.js (Final & Bersih)

// Hapus logika if/else loadComponent di sini. Kita anggap loadComponent sudah ada dari loader.js

function loadHeaderFooter() {
  // Muat komponen yang paling penting untuk halaman manapun
  const loadPromises = [
    // Jalur ABSOLUT yang AMAN dan BENAR
    loadComponent("header-placeholder", "/components/header.html"),
    loadComponent("footer-placeholder", "/components/footer.html"),
  ]; // Tunggu komponen utama selesai dimuat

  return Promise.all(loadPromises);
}
