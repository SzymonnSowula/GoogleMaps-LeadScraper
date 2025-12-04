# 🗺️ Google Maps Lead Scraper Pro v3.0

> Profesjonalny scraper firm z Google Maps z zaawansowanymi filtrami, gwiazdkami, godzinami otwarcia i eksportem do CSV.

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/yourusername/google-maps-scraper)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/chrome-extension-orange.svg)](https://chrome.google.com/webstore)

---

## 📋 Spis treści

- [Funkcje](#-funkcje)
- [Instalacja](#-instalacja)
- [Użycie](#-użycie)
- [Filtry](#-filtry)
- [Eksportowane dane](#-eksportowane-dane)
- [Technologie](#-technologie)
- [Ograniczenia](#%EF%B8%8F-ograniczenia)
- [FAQ](#-faq)
- [Licencja](#-licencja)

---

## ✨ Funkcje

### 🎨 Nowoczesny Design
- Material Design zgodny z wytycznymi Google
- Gradienty, animacje i smooth transitions
- Responsywny interfejs 800px
- Custom scrollbar i profesjonalne kolory

### 📊 Zaawansowane Scrapowanie
- **Gwiazdki ocen** - wizualna reprezentacja (★★★★☆)
- **Godziny otwarcia** - status 🟢 Otwarte / 🔴 Zamknięte
- **Numery telefonów** - 8+ formatów polskich numerów
- **Strony WWW** - wykrywanie własnych domen i social media
- **Social Media** - Facebook i Instagram
- **Adresy** - pełne adresy firm

### 🔍 Inteligentne Filtry
- ❌ **Bez strony WWW** - znajdź potencjalne leady
- 📵 **Bez telefonu** - firmy z niepełnymi danymi
- 📱 **Tylko social media** - firmy z FB/IG bez własnej strony
- 🌐 **Własna strona WWW** - profesjonalne firmy

### 📥 Smart Eksport
- Eksport do CSV z kodowaniem UTF-8
- Automatyczna nazwa pliku z datą
- Eksport tylko przefiltrowanych danych
- 8 kolumn danych

---

## 🚀 Instalacja

### Metoda 1: Z Chrome Web Store (Wkrótce)
1. Wejdź na [Chrome Web Store](#)
2. Kliknij "Dodaj do Chrome"
3. Gotowe!

### Metoda 2: Ręczna instalacja (Developer Mode)

1. **Pobierz rozszerzenie:**
   ```bash
   git clone https://github.com/yourusername/google-maps-scraper.git
   cd google-maps-scraper
   ```

2. **Otwórz Chrome Extensions:**
   - Wejdź na `chrome://extensions/`
   - Włącz **Tryb dewelopera** (prawy górny róg)

3. **Załaduj rozszerzenie:**
   - Kliknij **Załaduj rozpakowane**
   - Wybierz folder z rozszerzeniem
   - Gotowe! Ikona pojawi się w pasku narzędzi

---

## 📖 Użycie

### Krok 1: Otwórz Google Maps
```
https://www.google.com/maps
```

### Krok 2: Wyszukaj firmy
Przykłady wyszukań:
- "restauracje Warszawa"
- "fryzjer Kraków"
- "kawiarnia Gdańsk"
- "hotel Poznań"

### Krok 3: Przewiń listę
⚠️ **WAŻNE:** Przewiń listę firm w dół aby załadować więcej wyników (Google Maps ładuje dynamicznie)

### Krok 4: Uruchom scraper
1. Kliknij ikonę rozszerzenia
2. Kliknij **📥 Pobierz dane**
3. Poczekaj 1-2 sekundy

### Krok 5: Użyj filtrów (opcjonalnie)
- Zaznacz checkboxy aby filtrować wyniki
- Możesz łączyć wiele filtrów jednocześnie

### Krok 6: Eksportuj dane
1. Kliknij **📊 Eksportuj do Excela**
2. Plik CSV zostanie pobrany
3. Otwórz w Excel lub Google Sheets

---

## 🔍 Filtry

### ❌ Bez strony WWW
**Zastosowanie:** Znajdź firmy bez strony internetowej
- Idealne dla agencji webowych
- Potencjalne leady do sprzedaży stron
- Firmy z brakami w obecności online

### 📵 Bez telefonu
**Zastosowanie:** Firmy z niepełnymi danymi kontaktowymi
- Identyfikacja firm z brakami w profilu
- Możliwość zaoferowania pomocy w uzupełnieniu danych

### 📱 Tylko social media
**Zastosowanie:** Firmy z samym Facebook/Instagram
- Brak własnej strony WWW
- Potencjalni klienci dla agencji SEO/webowych
- Firmy polegające tylko na social media

### 🌐 Własna strona WWW
**Zastosowanie:** Profesjonalne firmy z własną domeną
- Analiza konkurencji
- Firmy do współpracy B2B
- Potencjalni klienci dla usług SEO

### 💡 Łączenie filtrów
Możesz zaznaczać wiele filtrów jednocześnie:
- "Bez strony" + "Bez telefonu" = Super leady z największymi brakami
- "Tylko social media" + ręczna analiza = Aktywne firmy bez strony

---

## 📊 Eksportowane dane

Plik CSV zawiera **8 kolumn**:

| Kolumna | Opis | Przykład |
|---------|------|----------|
| **Nazwa** | Nazwa firmy | "Restauracja Pod Aniołami" |
| **Telefon** | Numer telefonu (znormalizowany) | "+48123456789" |
| **Ocena** | Średnia ocena | "4.5" |
| **Liczba opinii** | Liczba recenzji | "127" |
| **Link do strony** | URL strony internetowej | "https://example.com" |
| **Social Media** | Facebook/Instagram/— | "Facebook" |
| **Godziny otwarcia** | Status i godziny | "Otwarte do 22:00" |
| **Adres** | Pełny adres | "ul. Floriańska 1, Kraków" |

### Format pliku
- **Kodowanie:** UTF-8 z BOM
- **Separator:** Średnik (;)
- **Nazwa pliku:** `google_maps_leady_YYYY-MM-DD.csv`
- **Kompatybilność:** Excel, Google Sheets, LibreOffice

---

## 🛠️ Technologie

### Frontend
- **HTML5** - Semantyczny markup
- **CSS3** - Material Design, Flexbox, Grid
- **JavaScript (ES6+)** - Vanilla JS, bez frameworków

### Chrome Extension API
- **Manifest V3** - Najnowsza wersja
- **Scripting API** - Wykonywanie kodu na stronie
- **Tabs API** - Zarządzanie kartami

### Scraping
- **DOM Selectors** - `querySelectorAll`, `aria-label`
- **Regex** - Wykrywanie telefonów i godzin
- **URL Parsing** - Dekodowanie linków Google

---

## ⚠️ Ograniczenia

### 1. Telefony w widoku listy
**Problem:** Google Maps często ukrywa pełne numery telefonów w widoku listy.

**Rozwiązanie:** Scraper wyciąga tylko to co jest widoczne. Dla pełnych danych trzeba kliknąć w firmę (wymaga automatyzacji - planowane w v4).

**Skuteczność:** ~65% firm ma wykryty telefon

### 2. Godziny otwarcia
**Problem:** Często ukryte w widoku listy.

**Rozwiązanie:** Wykrywane tylko jeśli widoczne w tekście lub aria-label.

**Skuteczność:** ~50% firm ma wykryte godziny

### 3. Rate Limiting
**Problem:** Google może zablokować IP przy zbyt częstym scrapowaniu.

**Rozwiązanie:** 
- Rób pauzy między scrapowaniem
- Nie scrapuj więcej niż 100 firm naraz
- Używaj w celach osobistych/biznesowych, nie komercyjnych na masową skalę

### 4. Dynamiczne ładowanie
**Problem:** Google Maps ładuje dane dynamicznie.

**Rozwiązanie:** Przewiń listę w dół przed scrapowaniem.

---

## ❓ FAQ

### Czy to jest legalne?
Tak, scrapowanie publicznie dostępnych danych jest legalne w większości krajów (w tym USA i UE). Jednak przestrzegaj regulaminu Google Maps i nie nadużywaj.

### Czy mogę scrapować więcej niż 50 firm?
Tak, ale musisz przewinąć listę aby Google załadował więcej wyników. Scraper pobiera tylko to co jest widoczne w DOM.

### Dlaczego niektóre firmy nie mają telefonu?
Google Maps często ukrywa telefony w widoku listy. Trzeba kliknąć w firmę aby zobaczyć pełny numer. Planujemy automatyzację w v4.

### Czy działa na innych krajach?
Tak! Scraper działa na Google Maps w dowolnym kraju. Regex dla telefonów jest zoptymalizowany dla Polski, ale wykrywa też inne formaty.

### Czy mogę eksportować do Excel?
Tak, plik CSV jest kompatybilny z Excel. Otwórz plik w Excel i dane zostaną automatycznie sformatowane.

### Czy filtry działają z eksportem?
Tak! Jeśli masz aktywne filtry, CSV będzie zawierał **tylko przefiltrowane dane**. To świetne do tworzenia list leadów.

---

## 🔜 Roadmap (v4.0)

- [ ] Automatyczne klikanie w firmy dla pełnych danych
- [ ] Scraping emaili z podstron
- [ ] Wykrywanie kategorii firm
- [ ] Pełne godziny otwarcia (wszystkie dni)
- [ ] Zdjęcia firm
- [ ] Eksport do JSON/XLSX
- [ ] Dodatkowe filtry (ocena >4.0, otwarte teraz)
- [ ] Dark mode
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Licencja

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Autor

**Your Name**
- GitHub: [@SzymonnSowula](https://github.com/SzymonnSowula)




**Made with ❤️ for lead generation professionals**

**⭐ Jeśli podoba Ci się ten projekt, zostaw gwiazdkę na GitHub!**
