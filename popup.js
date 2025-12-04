/**
 * Google Maps Lead Scraper Pro v3.0
 * Minimalist & Professional Edition
 */

let scrapedData = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
});

function initializeEventListeners() {
  document.getElementById("scrapeBtn").addEventListener("click", handleScrapeClick);
  document.getElementById("exportBtn").addEventListener("click", handleExportClick);
  
  const filters = ["filterNoWebsite", "filterNoPhone", "filterOnlySocial", "filterOwnWebsite"];
  filters.forEach(id => document.getElementById(id).addEventListener("change", applyFilters));
  
  document.getElementById("clearFilters").addEventListener("click", handleClearFilters);
}

async function handleScrapeClick() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || (!tab.url.includes('google.com/maps') && !tab.url.includes('google.pl/maps'))) {
      updateStatus("Otwórz Google Maps aby pobrać dane");
      return;
    }
    
    updateStatus("Pobieranie danych...");
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapeMapsData,
    }, (results) => {
      if (chrome.runtime.lastError) {
        updateStatus("Błąd: " + chrome.runtime.lastError.message);
        return;
      }
      
      if (results && results[0] && results[0].result) {
        scrapedData = results[0].result;
        if (scrapedData.length === 0) {
          updateStatus("Brak wyników. Przewiń listę na mapie.");
        } else {
          updateUI(scrapedData);
        }
      } else {
        updateStatus("Brak wyników. Przewiń listę na mapie.");
      }
    });
  } catch (error) {
    updateStatus("Błąd: " + error.message);
  }
}

function handleExportClick() {
  const filteredData = getFilteredData();
  if (filteredData.length === 0) {
    updateStatus("Brak danych do eksportu");
    return;
  }
  exportToCSV(filteredData);
  updateStatus(`Wyeksportowano ${filteredData.length} pozycji`);
}

function handleClearFilters() {
  const filters = ["filterNoWebsite", "filterNoPhone", "filterOnlySocial", "filterOwnWebsite"];
  filters.forEach(id => document.getElementById(id).checked = false);
  applyFilters();
}

function updateUI(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  
  updateStatus(`Znaleziono: ${data.length}`);
  document.getElementById("exportBtn").style.display = "flex";
  document.getElementById("filtersContainer").style.display = "block";

  data.forEach((row, index) => {
    const tr = createTableRow(row, index);
    tbody.appendChild(tr);
  });
  
  applyFilters();
}

function createTableRow(row, index) {
  const tr = document.createElement("tr");
  
  tr.setAttribute("data-index", index);
  tr.setAttribute("data-has-website", row.website ? "true" : "false");
  tr.setAttribute("data-has-phone", (row.phone && row.phone !== "Brak w liście") ? "true" : "false");
  tr.setAttribute("data-is-social", (row.isFacebook || row.isInstagram) ? "true" : "false");
  tr.setAttribute("data-is-own-website", (row.website && !row.isFacebook && !row.isInstagram) ? "true" : "false");
  
  const ratingHtml = formatRating(row.rating, row.reviews);
  const contactHtml = formatContact(row);
  const statusHtml = formatHours(row.hours);
  
  tr.innerHTML = `
    <td class="col-name">
      <span class="business-name">${escapeHtml(row.name)}</span>
      <div class="contact-item" style="margin-top:4px;">
        ${row.website ? formatWebsiteBadge(row) : '<span class="tag tag-missing">Brak www</span>'}
      </div>
    </td>
    <td class="col-rating">
      ${ratingHtml}
    </td>
    <td class="col-contact">
      ${contactHtml}
    </td>
    <td class="col-status">
      ${statusHtml}
    </td>
    <td class="col-address">
      <span style="font-size:12px; color:#5f6368;">${escapeHtml(row.address)}</span>
    </td>
  `;
  
  return tr;
}

function formatRating(rating, reviews) {
  if (!rating || rating === "Brak") return '<span style="color:#9aa0a6; font-size:12px;">—</span>';
  
  return `
    <div class="rating-badge">
      <span>${rating}</span>
      <svg class="star-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
    </div>
    <div class="reviews-count">(${reviews})</div>
  `;
}

function formatContact(row) {
  let html = '';
  
  // Phone
  if (row.phone && row.phone !== "Brak w liście") {
    html += `
      <div class="contact-item">
        <svg class="icon" style="width:12px;height:12px;margin-right:4px;" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 1.23 0 2.44.2 3.57.57.35.13.75.03 1.02-.24l2.2-2.2z"/></svg>
        ${escapeHtml(row.phone)}
      </div>
    `;
  } else {
    html += `<div class="contact-item" style="color:#9aa0a6;">Brak telefonu</div>`;
  }
  
  return html;
}

function formatWebsiteBadge(row) {
  let text = "Strona";
  let className = "tag-web";
  
  if (row.isFacebook) { text = "Facebook"; className = "tag-social"; }
  else if (row.isInstagram) { text = "Instagram"; className = "tag-social"; }
  
  return `<a href="${row.website}" target="_blank" class="tag ${className}">${text}</a>`;
}

function formatHours(hours) {
  if (!hours || hours === "Brak") {
    return '<span class="status-badge status-none">Nieznane</span>';
  }
  
  const lower = hours.toLowerCase();
  if (lower.includes("otwarte") || lower.includes("open")) {
    return `<span class="status-badge status-open">Otwarte</span><div style="font-size:11px;color:#5f6368;margin-top:2px;">${escapeHtml(hours.replace(/Otwarte|Open/gi, '').trim())}</div>`;
  } else if (lower.includes("zamknięte") || lower.includes("closed")) {
    return `<span class="status-badge status-closed">Zamknięte</span>`;
  }
  
  return `<span class="status-badge status-none">${escapeHtml(hours)}</span>`;
}

function updateStatus(message) {
  document.getElementById("status").innerText = message;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

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
    let show = true;
    if (filters.noWebsite && row.getAttribute("data-has-website") === "true") show = false;
    if (filters.noPhone && row.getAttribute("data-has-phone") === "true") show = false;
    if (filters.onlySocial && row.getAttribute("data-is-social") === "false") show = false;
    if (filters.ownWebsite && row.getAttribute("data-is-own-website") === "false") show = false;
    
    if (show) {
      row.classList.remove("filtered-out");
      visibleCount++;
    } else {
      row.classList.add("filtered-out");
    }
  });
  
  const total = scrapedData.length;
  if (visibleCount < total) {
    updateStatus(`Wyświetlanie: ${visibleCount} z ${total}`);
  } else {
    updateStatus(`Znaleziono: ${total}`);
  }
}

function getFilteredData() {
  const visibleRows = document.querySelectorAll("#dataTable tbody tr:not(.filtered-out)");
  const filteredData = [];
  visibleRows.forEach(row => {
    const index = parseInt(row.getAttribute("data-index"));
    if (!isNaN(index) && scrapedData[index]) filteredData.push(scrapedData[index]);
  });
  return filteredData.length > 0 ? filteredData : scrapedData;
}

function exportToCSV(data) {
  const headers = "Nazwa;Telefon;Ocena;Liczba opinii;Strona WWW;Typ strony;Godziny;Adres\n";
  const rows = data.map(row => {
    const safeName = `"${(row.name || '').replace(/"/g, '""')}"`;
    const safeAddress = `"${(row.address || '').replace(/"/g, '""')}"`;
    const safePhone = `"${row.phone || ''}"`;
    const safeHours = `"${(row.hours || '').replace(/"/g, '""')}"`;
    
    let type = "Własna";
    if (!row.website) type = "Brak";
    else if (row.isFacebook) type = "Facebook";
    else if (row.isInstagram) type = "Instagram";
    
    return `${safeName};${safePhone};${row.rating};${row.reviews};${row.website || ''};${type};${safeHours};${safeAddress}`;
  });
  
  const blob = new Blob(["\uFEFF" + headers + rows.join("\n")], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `google_maps_data_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// === SCRAPING FUNCTION ===
function scrapeMapsData() {
  const items = [];
  
  const extractRealUrl = (url) => {
    try {
      if (url.includes("google.com/url")) {
        return new URLSearchParams(new URL(url).search).get("q") || url;
      }
      return url;
    } catch (e) { return url; }
  };

  const normalizePhone = (phone) => {
    let normalized = phone.replace(/[^\d+]/g, '');
    if (normalized.startsWith('48') && !normalized.startsWith('+')) normalized = '+' + normalized;
    return normalized;
  };

  document.querySelectorAll('div[role="article"]').forEach(article => {
    try {
      const link = article.querySelector('a[href*="/maps/place/"]');
      if (!link) return;
      
      const name = link.getAttribute('aria-label') || article.innerText.split('\n')[0];
      const text = article.innerText;
      
      // Rating
      const ratingMatch = text.match(/(\d[,.]?\d)\s*\(/);
      const rating = ratingMatch ? ratingMatch[1] : "Brak";
      const reviewsMatch = text.match(/\(([\d\s]+)\)/);
      const reviews = reviewsMatch ? reviewsMatch[1].replace(/\s/g, '') : "0";

      // Address
      let address = "";
      const spans = article.querySelectorAll('div.fontBodyMedium');
      if (spans.length > 0) address = spans[0].innerText;

      // Hours
      let hours = "Brak";
      const hoursPatterns = [/(?:Otwarte|Open).*?(?:\d{1,2}:\d{2}|\d{1,2}\s?[AP]M)/i, /(?:Zamknięte|Closed).*?(?:\d{1,2}:\d{2}|\d{1,2}\s?[AP]M)/i, /(?:Otwarte|Open)/i, /(?:Zamknięte|Closed)/i];
      for (const p of hoursPatterns) {
        const m = text.match(p);
        if (m) { hours = m[0].trim(); break; }
      }
      if (hours === "Brak") {
        const ariaHours = article.querySelector('[aria-label*="godzin"], [aria-label*="hours"], [aria-label*="Otwarte"]');
        if (ariaHours) hours = ariaHours.getAttribute('aria-label');
      }

      // Website
      let website = "";
      let isFacebook = false, isInstagram = false;
      
      const webBtn = article.querySelector('a[aria-label*="Strona"], a[aria-label*="Website"]');
      if (webBtn) website = extractRealUrl(webBtn.href);
      else {
        const links = article.querySelectorAll('a');
        for (const l of links) {
          const url = extractRealUrl(l.href);
          if (!url.includes("google.com/maps") && !url.includes("search?")) {
            website = url;
            break;
          }
        }
      }
      
      if (website) {
        if (website.includes("facebook.com")) isFacebook = true;
        else if (website.includes("instagram.com")) isInstagram = true;
      }

      // Phone
      let phone = "Brak w liście";
      const phonePatterns = [/\+48\s?\d{3}\s?\d{3}\s?\d{3}/, /(?<!\d)\d{3}[\s-]?\d{3}[\s-]?\d{3}(?!\d)/];
      for (const p of phonePatterns) {
        const m = text.match(p);
        if (m) { phone = normalizePhone(m[0]); break; }
      }

      if (!items.find(i => i.name === name)) {
        items.push({ name, rating, reviews, address: address.replace(/[\n\r]+/g, " "), website, isFacebook, isInstagram, phone, hours });
      }
    } catch (e) { console.error(e); }
  });

  return items;
}