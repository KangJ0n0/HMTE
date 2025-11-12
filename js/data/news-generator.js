// File: js/news-generator.js

function generateLatestNews() {
  const newsContainer = document.getElementById("latest-news-container");

  // Cek container dan data. Jika tidak ada, ya sudah, batalin.
  if (!newsContainer || typeof newsData === "undefined" || !Array.isArray(newsData) || newsData.length === 0) {
    return;
  }

  const latestNews = newsData.slice(0, 3);
  let newsCardsHTML = "";

  latestNews.forEach((news) => {
    const detailLink = `page/news/news-detail.html?id=${news.id}`;

    // (Template HTML yang panjang dan menjengkelkan itu diletakkan di sini)
    const newsCard = `
        <div class="flex flex-col rounded-xl overflow-hidden border border-transparent transition-all duration-500 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/40 cursor-pointer"
          onclick="window.location.href='${detailLink}'" style="max-width: 300px;">
          <div class="overflow-hidden rounded-xl shadow-lg flex items-center justify-center bg-black" style="width: 100%; height: 220px; flex-shrink: 0">
            <img src="${news.imgSrc}" alt="${news.title}" style="width: 100%; height: 100%; object-fit: cover" class="transition-transform duration-500 hover:scale-105" />
          </div>
          <div class="mt-4 flex flex-col flex-1 p-4">
            <p class="text-xs font-semibold text-cyan-400 mb-1">${news.date} • ${news.category}</p>
            <h3 class="font-bold text-white text-lg mb-2">${news.title}</h3>
            <p class="text-gray-300 text-sm leading-relaxed">${news.preview}</p>
          </div>
        </div>
      `;
    newsCardsHTML += newsCard;
  });

  newsContainer.innerHTML = newsCardsHTML;
}
