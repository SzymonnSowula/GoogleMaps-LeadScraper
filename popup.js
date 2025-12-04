/**
 * Google Maps Lead Scraper Pro v3.0
 * 
 * Profesjonalny scraper firm z Google Maps
 * Features: Filtry, gwiazdki, godziny otwarcia, eksport CSV
 * 
 * @author Szymon Sowula
 * @version 3.0.0
 */

// ============================================================================
// GLOBALNE ZMIENNE
// ============================================================================

let scrapedData = [];

// ============================================================================
// EVENT LISTENERS - INICJALIZACJA
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
});

/**
 * Inicjalizacja wszystkich event listenerów
 */
function initializeEventListeners() {
  // Przyciski główne
  document.getElementById("scrapeBtn").addEventListener("click", handleScrapeClick);
  document.getElementById("exportBtn").addEventListener("click", handleExportClick);
  
  // Filtry
  document.getElementById("filterNoWebsite").addEventListener("change", applyFilters);
  document.getElementById("filterNoPhone").addEventListener("change", applyFilters);
  document.getElementById("filterOnlySocial").addEventListener("change", applyFilters);
  document.getElementById("filterOwnWebsite").addEventListener("change", applyFilters);
  document.getElementById("clearFilters").addEventListener("click", handleClearFilters);
}

// ============================================================================
// HANDLERS - OBSŁUGA ZDARZEŃ
// ============================================================================

/**
 * Obsługa kliknięcia przycisku "Pobierz dane"
 */
async function handleScrapeClick() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showError("Nie można znaleźć aktywnej karty.");
      return;
    }
    
    // Sprawdź czy to Google Maps
    if (!tab.url.includes('google.com/maps') && !tab.url.includes('google.pl/maps')) {
      showError("Otwórz Google Maps aby scrapować dane!");
      return;
    }
    
    updateStatus("Scrapowanie danych...");
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapeMapsData,
    }, (results) => {
      if (chrome.runtime.lastError) {
        showError("Błąd: " + chrome.runtime.lastError.message);
        return;
      }
      
      if (results && results[0] && results[0].result) {
        scrapedData = results[0].result;
        
        if (scrapedData.length === 0) {
          showError("Nie znaleziono danych. Przewiń listę firm na mapie!");
        } else {
          updateUI(scrapedData);
        }
      } else {
        showError("Nie znaleziono danych. Przewiń listę firm na mapie!");
      }
    });
  } catch (error) {
    showError("Wystąpił błąd: " + error.message);
    console.error("Scraping error:", error);
  }
}

/**
 * Obsługa kliknięcia przycisku "Eksportuj do Excela"
 */
function handleExportClick() {
  try {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
      showError("Brak danych do eksportu!");
      return;
    }
    
    exportToCSV(filteredData);
    updateStatus(`Wyeksportowano ${filteredData.length} firm do CSV.`);
  } catch (error) {
    showError("Błąd eksportu: " + error.message);
    console.error("Export error:", error);
  }
}

/**
 * Obsługa kliknięcia "Wyczyść filtry"
 */
function handleClearFilters() {
  document.getElementById("filterNoWebsite").checked = false;
  document.getElementById("filterNoPhone").checked = false;
  document.getElementById("filterOnlySocial").checked = false;
  document.getElementById("filterOwnWebsite").checked = false;
  applyFilters();
}

// ============================================================================
// UI - AKTUALIZACJA INTERFEJSU
// ============================================================================

/**
 * Aktualizacja interfejsu z pobranymi danymi
 * @param {Array} data - Tablica obiektów firm
 */
function updateUI(data) {
  if (!data || data.length === 0) {
    showError("Brak danych do wyświetlenia.");
    return;
  }
  
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  
  updateStatus(`Znaleziono: ${data.length} firm.`);
  document.getElementById("exportBtn").style.display = "block";
  document.getElementById("filtersContainer").style.display = "block";

  data.forEach((row, index) => {
    const tr = createTableRow(row, index);
    tbody.appendChild(tr);
  });
  
  applyFilters();
}

/**
 * Tworzenie wiersza tabeli dla pojedynczej firmy
 * @param {Object} row - Dane firmy
 * @param {number} index - Indeks w tablicy
 * @returns {HTMLElement} Element TR
 */
function createTableRow(row, index) {
  const tr = document.createElement("tr");
  
  // Atrybuty data-* dla filtrowania
  tr.setAttribute("data-index", index);
  tr.setAttribute("data-has-website", row.website ? "true" : "false");
  tr.setAttribute("data-has-phone", (row.phone && row.phone !== "Brak w liście") ? "true" : "false");
  tr.setAttribute("data-is-social", (row.isFacebook || row.isInstagram) ? "true" : "false");
  tr.setAttribute("data-is-own-website", (row.website && !row.isFacebook && !row.isInstagram) ? "true" : "false");
  
  // Formatowanie danych
  const { webDisplay, socialDisplay, webClass } = formatWebsiteData(row);
  const stars = generateStars(row.rating);
  const hoursDisplay = formatHours(row.hours);
  
  tr.innerHTML = `
    <td class="col-name">
      <span class="business-name">${escapeHtml(row.name)}</span>
    </td>
    <td class="col-rating">
      <div class="rating-container">
        <span class="stars">${stars}</span>
        <span class="rating-number">${escapeHtml(row.rating)}</span>
      </div>
      <div class="review-count">(${escapeHtml(row.reviews)})</div>
    </td>
    <td class="col-phone">
      <span class="phone-number">${escapeHtml(row.phone)}</span>
    </td>
    <td class="col-website">
      <span class="${webClass}">
        ${row.website ? `<a href="${escapeHtml(row.website)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit;">${webDisplay}</a>` : webDisplay}
      </span>
    </td>
    <td class="col-social">
      <span class="${(row.isFacebook || row.isInstagram) ? 'tag-fb' : ''}">${socialDisplay}</span>
    </td>
    <td class="col-hours">
      ${hoursDisplay}
    </td>
    <td class="col-address">
      <span class="address-text">${escapeHtml(row.address)}</span>
    </td>
  `;
  
  return tr;
}

/**
 * Aktualizacja statusu
 * @param {string} message - Wiadomość do wyświetlenia
 */
function updateStatus(message) {
  document.getElementById("status").innerText = message;
}

/**
 * Wyświetlenie błędu
 * @param {string} message - Wiadomość błędu
 */
function showError(message) {
  updateStatus("❌ " + message);
  console.error(message);
}

// ============================================================================
// FORMATOWANIE DANYCH
// ============================================================================

/**
 * Formatowanie danych strony internetowej
 * @param {Object} row - Dane firmy
 * @returns {Object} Obiekt z webDisplay, socialDisplay, webClass
 */
function formatWebsiteData(row) {
  let webDisplay = row.website;
  let socialDisplay = "—";
  let webClass = "";

  if (!row.website) {
    webDisplay = "BRAK";
    webClass = "tag-no-web";
  } else if (row.isFacebook) {
    webDisplay = "FB LINK";
    socialDisplay = "Facebook";
    webClass = "tag-fb";
  } else if (row.isInstagram) {
    webDisplay = "IG LINK";
    socialDisplay = "Instagram";
    webClass = "tag-fb";
  } else {
    webDisplay = "Własna domena";
    socialDisplay = "—";
    webClass = "tag-www";
  }
  
  return { webDisplay, socialDisplay, webClass };
}

/**
 * Generowanie gwiazdek na podstawie oceny
 * @param {string} rating - Ocena (np. "4.5")
 * @returns {string} String z gwiazdkami
 */
function generateStars(rating) {
  if (!rating || rating === "Brak") return "—";
  
  const ratingNum = parseFloat(rating.replace(',', '.'));
  
  if (isNaN(ratingNum)) return "—";
  
  const fullStars = Math.floor(ratingNum);
  const hasHalfStar = ratingNum % 1 >= 0.5;
  
  let stars = "";
  for (let i = 0; i < fullStars && i < 5; i++) {
    stars += "★";
  }
  if (hasHalfStar && fullStars < 5) {
    stars += "☆";
  }
  
  return stars || "—";
}

/**
 * Formatowanie godzin otwarcia
 * @param {string} hours - Godziny otwarcia
 * @returns {string} HTML z sformatowanymi godzinami
 */
function formatHours(hours) {
  if (!hours || hours === "Brak") {
    return '<span class="hours-unknown">Brak danych</span>';
  }
  
  const hoursLower = hours.toLowerCase();
  
  if (hoursLower.includes("otwarte") || hoursLower.includes("open")) {
    return `<span class="hours-open">🟢 ${escapeHtml(hours)}</span>`;
  } else if (hoursLower.includes("zamknięte") || hoursLower.includes("closed")) {
    return `<span class="hours-closed">🔴 ${escapeHtml(hours)}</span>`;
  } else {
    return `<span class="hours-unknown">${escapeHtml(hours)}</span>`;
  }
}

/**
 * Escape HTML dla bezpieczeństwa
 * @param {string} text - Tekst do escape
 * @returns {string} Bezpieczny tekst
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// FILTRY
// ============================================================================

/**
 * Zastosowanie filtrów do tabeli
 */
function applyFilters() {
  const filters = {
    noWebsite: document.getElementById("filterNoWebsite").checked,
    noPhone: document.getElementById("filterNoPhone").checked,
    onlySocial: document.getElementById("filterOnlySocial").checked,
    ownWebsite: document.getElementById("filterOwnWebsite").checked
  };
  
  const rows = document.querySelectorAll("#dataTable tbody tr");
  let visibleCount = 0;
  
  rows.forEach(row => {
    const shouldShow = shouldShowRow(row, filters);
    
    if (shouldShow) {
      row.classList.remove("filtered-out");
      visibleCount++;
    } else {
      row.classList.add("filtered-out");
    }
  });
  
  updateFilterStatus(visibleCount, scrapedData.length);
}

/**
 * Sprawdzenie czy wiersz powinien być widoczny
 * @param {HTMLElement} row - Wiersz tabeli
 * @param {Object} filters - Obiekt z filtrami
 * @returns {boolean} Czy wiersz powinien być widoczny
 */
function shouldShowRow(row, filters) {
  if (filters.noWebsite && row.getAttribute("data-has-website") === "true") {
    return false;
  }
  
  if (filters.noPhone && row.getAttribute("data-has-phone") === "true") {
    return false;
  }
  
  if (filters.onlySocial && row.getAttribute("data-is-social") === "false") {
    return false;
  }
  
  if (filters.ownWebsite && row.getAttribute("data-is-own-website") === "false") {
    return false;
  }
  
  return true;
}

/**
 * Aktualizacja statusu filtrów
 * @param {number} visibleCount - Liczba widocznych firm
 * @param {number} totalCount - Całkowita liczba firm
 */
function updateFilterStatus(visibleCount, totalCount) {
  if (visibleCount < totalCount) {
    updateStatus(`Wyświetlane: ${visibleCount} z ${totalCount} firm (filtry aktywne)`);
  } else {
    updateStatus(`Znaleziono: ${totalCount} firm.`);
  }
}

/**
 * Pobranie przefiltrowanych danych
 * @returns {Array} Tablica przefiltrowanych firm
 */
function getFilteredData() {
  const visibleRows = document.querySelectorAll("#dataTable tbody tr:not(.filtered-out)");
  const filteredData = [];
  
  visibleRows.forEach(row => {
    const index = parseInt(row.getAttribute("data-index"));
    if (!isNaN(index) && scrapedData[index]) {
      filteredData.push(scrapedData[index]);
    }
  });
  
  return filteredData.length > 0 ? filteredData : scrapedData;
}

// ============================================================================
// EKSPORT CSV
// ============================================================================

/**
 * Eksport danych do pliku CSV
 * @param {Array} data - Tablica firm do eksportu
 */
function exportToCSV(data) {
  if (!data || data.length === 0) {
    showError("Brak danych do eksportu!");
    return;
  }
  
  const csvContent = generateCSVContent(data);
  const filename = generateFilename();
  
  downloadCSV(csvContent, filename);
}

/**
 * Generowanie zawartości CSV
 * @param {Array} data - Tablica firm
 * @returns {string} Zawartość CSV
 */
function generateCSVContent(data) {
  const headers = "Nazwa;Telefon;Ocena;Liczba opinii;Link do strony;Social Media;Godziny otwarcia;Adres\n";
  
  const rows = data.map(row => {
    const safeName = `"${(row.name || '').replace(/"/g, '""')}"`;
    const safeAddress = `"${(row.address || '').replace(/"/g, '""')}"`;
    const safePhone = `"${row.phone || ''}"`;
    const safeHours = `"${(row.hours || 'Brak').replace(/"/g, '""')}"`;
    const safeWebsite = row.website || '';
    
    let socialMedia = "—";
    if (row.isFacebook) socialMedia = "Facebook";
    else if (row.isInstagram) socialMedia = "Instagram";
    
    return `${safeName};${safePhone};${row.rating};${row.reviews};${safeWebsite};${socialMedia};${safeHours};${safeAddress}`;
  });
  
  return "\uFEFF" + headers + rows.join("\n");
}

/**
 * Generowanie nazwy pliku z datą
 * @returns {string} Nazwa pliku
 */
function generateFilename() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `google_maps_leady_${dateStr}.csv`;
}

/**
 * Pobranie pliku CSV
 * @param {string} content - Zawartość CSV
 * @param {string} filename - Nazwa pliku
 */
function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// ============================================================================
// SCRAPING - FUNKCJA WYKONYWANA NA STRONIE GOOGLE MAPS
// ============================================================================

/**
 * Główna funkcja scrapująca dane z Google Maps
 * UWAGA: Ta funkcja jest wykonywana w kontekście strony Google Maps
 * @returns {Array} Tablica obiektów firm
 */
function scrapeMapsData() {
  const items = [];
  
  // Pomocnicze funkcje
  const extractRealUrl = (url) => {
    try {
      if (url.includes("google.com/url")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get("q") || urlParams.get("url") || url;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const normalizePhone = (phone) => {
    let normalized = phone.replace(/[^\d+]/g, '');
    if (normalized.startsWith('48') && !normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }
    return normalized;
  };

  // Szukamy kontenerów firm
  const elements = document.querySelectorAll('div[role="article"]');

  elements.forEach(article => {
    try {
      // 1. NAZWA
      let name = "Brak nazwy";
      const linkElement = article.querySelector('a[href*="/maps/place/"]');
      if (linkElement) {
        name = linkElement.getAttribute('aria-label') || article.innerText.split('\n')[0];
      } else {
        return;
      }

      // 2. TEKST WIZYTÓWKI
      const textContent = article.innerText;
      
      // 3. OCENA I OPINIE
      const ratingMatch = textContent.match(/(\d[,.]?\d)\s*\(/);
      const rating = ratingMatch ? ratingMatch[1] : "Brak";
      
      const reviewsMatch = textContent.match(/\(([\d\s]+)\)/);
      const reviews = reviewsMatch ? reviewsMatch[1].replace(/\s/g, '') : "0";

      // 4. ADRES
      let address = "";
      const spans = article.querySelectorAll('div.fontBodyMedium');
      if (spans.length > 0) address = spans[0].innerText;

      // 5. GODZINY OTWARCIA
      let hours = "Brak";
      const hoursPatterns = [
        /(?:Otwarte|Open).*?(?:\d{1,2}:\d{2}|\d{1,2}\s?[AP]M)/i,
        /(?:Zamknięte|Closed).*?(?:\d{1,2}:\d{2}|\d{1,2}\s?[AP]M)/i,
        /(?:Otwarte|Open)/i,
        /(?:Zamknięte|Closed)/i,
      ];
      
      for (const pattern of hoursPatterns) {
        const match = textContent.match(pattern);
        if (match) {
          hours = match[0].trim();
          break;
        }
      }
      
      if (hours === "Brak") {
        const hoursElements = article.querySelectorAll('[aria-label*="godzin"], [aria-label*="hours"], [aria-label*="Otwarte"], [aria-label*="Open"]');
        for (const elem of hoursElements) {
          const ariaLabel = elem.getAttribute('aria-label') || '';
          if (ariaLabel.includes('Otwarte') || ariaLabel.includes('Open') || ariaLabel.includes('Zamknięte') || ariaLabel.includes('Closed')) {
            hours = ariaLabel;
            break;
          }
        }
      }

      // 6. STRONA WWW I SOCIAL MEDIA
      let website = "";
      let isFacebook = false;
      let isInstagram = false;

      const websiteButtons = article.querySelectorAll('a[aria-label*="Strona"], a[aria-label*="Website"], a[aria-label*="strona"], button[aria-label*="Strona"]');
      
      for (const btn of websiteButtons) {
        let href = btn.href || btn.getAttribute('data-value') || btn.getAttribute('data-item-id');
        if (href && !href.includes('google.com/maps')) {
          website = extractRealUrl(href);
          break;
        }
      }

      if (!website) {
        const links = article.querySelectorAll('a');
        
        for (const link of links) {
          let href = link.href;
          if (!href) continue;

          const ariaLabel = link.getAttribute('aria-label') || '';
          let realUrl = extractRealUrl(href);

          if (realUrl.includes("/maps/place/") || 
              realUrl.includes("google.com/maps") || 
              realUrl.includes("google.pl/maps") ||
              realUrl.includes("search?") ||
              ariaLabel.includes("Wskazówki dojazdu") ||
              ariaLabel.includes("Directions")) {
            continue;
          }

          website = realUrl;
          break;
        }
      }

      if (website) {
        if (website.includes("facebook.com") || website.includes("fb.com")) {
          isFacebook = true;
        } else if (website.includes("instagram.com")) {
          isInstagram = true;
        }
      }

      // 7. TELEFON
      let phone = "Brak w liście";
      const phonePatterns = [
        /\+48\s?\d{3}\s?\d{3}\s?\d{3}/,
        /\+48\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/,
        /\+48\s?\(\d{2}\)\s?\d{3}\s?\d{2}\s?\d{2}/,
        /(?<!\d)48\s?\d{3}\s?\d{3}\s?\d{3}/,
        /(?<!\d)48\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/,
        /(?<!\d)\d{3}[\s-]?\d{3}[\s-]?\d{3}(?!\d)/,
        /(?<!\d)\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}(?!\d)/,
        /\(\d{2}\)\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}/,
      ];
      
      for (const pattern of phonePatterns) {
        const match = textContent.match(pattern);
        if (match) {
          phone = normalizePhone(match[0]);
          break;
        }
      }

      if (phone === "Brak w liście") {
        const phoneElements = article.querySelectorAll('[aria-label*="Telefon"], [aria-label*="Phone"], [aria-label*="telefon"], [data-tooltip*="Telefon"]');
        for (const elem of phoneElements) {
          const ariaLabel = elem.getAttribute('aria-label') || elem.getAttribute('data-tooltip') || '';
          for (const pattern of phonePatterns) {
            const match = ariaLabel.match(pattern);
            if (match) {
              phone = normalizePhone(match[0]);
              break;
            }
          }
          if (phone !== "Brak w liście") break;
        }
      }

      // Dodaj do wyników (unikaj duplikatów)
      if (!items.find(i => i.name === name)) {
        items.push({
          name: name,
          rating: rating,
          reviews: reviews,
          address: address.replace(/[\n\r]+/g, " "),
          website: website,
          isFacebook: isFacebook,
          isInstagram: isInstagram,
          phone: phone,
          hours: hours
        });
      }
    } catch (error) {
      console.error("Error scraping article:", error);
    }
  });

  return items;
}