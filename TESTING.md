# 🧪 Przewodnik testowania - Google Maps Scraper v3

## Szybki test (5 minut)

### Krok 1: Załaduj rozszerzenie
1. Otwórz Chrome
2. Wejdź na `chrome://extensions/`
3. Włącz **Tryb dewelopera** (prawy górny róg)
4. Kliknij **Załaduj rozpakowane**
5. Wybierz folder `c:\Users\SXY\extensionapp`
6. Sprawdź czy rozszerzenie jest aktywne (niebieski przełącznik)

### Krok 2: Otwórz Google Maps
1. Wejdź na https://www.google.com/maps
2. Wyszukaj: **"restauracje Warszawa"** (lub dowolne miasto)

### Krok 3: Załaduj wyniki
⚠️ **WAŻNE:** Przewiń listę firm w dół!
- Google Maps ładuje wyniki dynamicznie
- Im więcej przewiniesz, tym więcej firm zobaczysz
- Zalecane: przewiń 20-30 firm

### Krok 4: Uruchom scraper
1. Kliknij ikonę rozszerzenia (puzzle icon w prawym górnym rogu)
2. Znajdź "Google Maps Lead Scraper"
3. Kliknij **Pobierz dane**
4. Poczekaj 1-2 sekundy

### Krok 5: Sprawdź wyniki
Powinieneś zobaczyć tabelę z danymi:
- ✅ Nazwy firm
- ✅ Numery telefonów (część może być "Brak w liście")
- ✅ Strony WWW (część może być "BRAK")
- ✅ Social Media (Facebook/Instagram/NIE)
- ✅ Adresy

### Krok 5a: Przetestuj filtry (NOWOŚĆ!)
Po pobraniu danych pojawi się sekcja "🔍 Filtry wyników":

1. **Test filtra "Bez strony WWW":**
   - Zaznacz checkbox "❌ Bez strony WWW"
   - Powinny zostać tylko firmy z czerwonym "BRAK" w kolumnie "Strona WWW"
   - Status pokaże: "Wyświetlane: X z Y firm (filtry aktywne)"

2. **Test filtra "Bez telefonu":**
   - Wyczyść poprzedni filtr (kliknij "Wyczyść filtry")
   - Zaznacz checkbox "📵 Bez telefonu"
   - Powinny zostać tylko firmy z "Brak w liście" w kolumnie "Telefon"

3. **Test filtra "Tylko social media":**
   - Wyczyść filtry
   - Zaznacz checkbox "📱 Tylko social media"
   - Powinny zostać tylko firmy z "Facebook" lub "Instagram" w kolumnie "Social Media"

4. **Test filtra "Własna strona WWW":**
   - Wyczyść filtry
   - Zaznacz checkbox "🌐 Własna strona WWW"
   - Powinny zostać tylko firmy z zielonym "Własna domena" w kolumnie "Strona WWW"

5. **Test łączenia filtrów:**
   - Zaznacz "Bez strony WWW" + "Bez telefonu"
   - Powinny zostać tylko firmy bez strony I bez telefonu (potencjalne super leady!)

6. **Test przycisku "Wyczyść filtry":**
   - Kliknij "Wyczyść filtry"
   - Wszystkie checkboxy powinny się odznaczyć
   - Wszystkie firmy powinny być znów widoczne

### Krok 6: Eksportuj dane
1. Kliknij **Eksportuj do Excela**
2. Plik `leady_google_maps_v3.csv` zostanie pobrany
3. Otwórz w Excel lub Google Sheets
4. Sprawdź czy dane są poprawne

**WAŻNE - Eksport z filtrami:**
- Jeśli masz aktywne filtry, CSV będzie zawierał **tylko przefiltrowane dane**
- Przykład: Jeśli zaznaczysz "Bez strony WWW", eksport będzie zawierał tylko firmy bez strony
- To świetne do tworzenia list leadów! (np. tylko firmy bez strony do kontaktu)
- Jeśli chcesz eksportować wszystkie dane, kliknij "Wyczyść filtry" przed eksportem

---

## Test zaawansowany - Porównanie z v2

### Scenariusz testowy

**Wyszukanie:** "fryzjer Kraków"  
**Cel:** Porównać ile danych wyciąga v2 vs v3

### Metryki do sprawdzenia:

1. **Strony internetowe**
   - Ile firm ma wykrytą stronę?
   - Ile to Facebook/Instagram?
   - Ile to własne domeny?

2. **Numery telefonów**
   - Ile firm ma wykryty telefon?
   - Czy numery są znormalizowane (+48...)?
   - Czy różne formaty są wykrywane?

3. **Jakość danych**
   - Czy są fałszywe linki Google Maps?
   - Czy adresy są kompletne?
   - Czy oceny są poprawne?

### Przykładowe wyniki (30 firm):

| Metryka | Oczekiwane |
|---------|------------|
| Firmy z telefonem | 18-22 (~65%) |
| Firmy ze stroną | 24-27 (~85%) |
| Z czego Facebook | 8-12 |
| Z czego Instagram | 4-8 |
| Z czego własna strona | 10-15 |
| Fałszywe linki | 0-1 (~2%) |

---

## Testowanie konkretnych funkcji

### Test 1: Wykrywanie różnych formatów telefonów

Szukaj firm, które mogą mieć różne formaty:
- Restauracje (często +48 123 456 789)
- Fryzjerzy (często 123-456-789)
- Warsztaty (często (12) 345 67 89)

**Sprawdź:**
- Czy wszystkie formaty są wykrywane?
- Czy są znormalizowane do +48...?

### Test 2: Wykrywanie Instagram

Szukaj branż popularnych na Instagramie:
- Kawiarnie
- Salony kosmetyczne
- Sklepy z ubraniami
- Studia tatuażu

**Sprawdź:**
- Czy Instagram jest wykrywany?
- Czy kolumna "Social Media" pokazuje "Instagram"?

### Test 3: Wykrywanie stron WWW

Szukaj firm z różnymi typami stron:
- Duże sieci (własne domeny)
- Małe firmy (często tylko Facebook)
- Lokale (mix)

**Sprawdź:**
- Czy przyciski "Strona internetowa" są wykrywane?
- Czy linki są poprawnie dekodowane?
- Czy nie ma fałszywych linków Google Maps?

---

## Debugowanie problemów

### Problem: "Nie znaleziono danych"

**Rozwiązania:**
1. Sprawdź czy przewinąłeś listę firm
2. Odśwież stronę Google Maps
3. Sprawdź konsolę deweloperską (F12)
4. Upewnij się, że jesteś na liście wyników (nie na mapie)

### Problem: Brak telefonów

**Wyjaśnienie:**
- Google Maps często ukrywa telefony w widoku listy
- Trzeba kliknąć w firmę, aby zobaczyć pełny numer
- Scraper wyciąga tylko to, co jest widoczne

**Rozwiązanie:**
- To jest normalne ograniczenie
- Dla pełnych danych potrzebna automatyzacja kliknięć (v4)

### Problem: Brak stron WWW

**Możliwe przyczyny:**
1. Firma rzeczywiście nie ma strony
2. Strona jest ukryta (trzeba kliknąć w firmę)
3. Strona jest tylko na Facebook/Instagram (sprawdź kolumnę Social Media)

### Problem: Fałszywe linki

**Sprawdź:**
- Czy link zawiera `google.com/maps`?
- Jeśli tak, to jest błąd - zgłoś!

**Debugowanie:**
1. Otwórz konsolę (F12)
2. Uruchom scraper
3. Sprawdź czy są błędy w konsoli
4. Skopiuj błędy i zgłoś

---

## Konsola deweloperska - Zaawansowane

### Ręczne uruchomienie scrapera

1. Otwórz Google Maps z wynikami
2. Naciśnij F12 (konsola)
3. Wklej kod z `popup.js` (funkcja `scrapeMapsData`)
4. Uruchom: `scrapeMapsData()`
5. Sprawdź wyniki w konsoli

### Sprawdzenie selektorów

```javascript
// Sprawdź ile firm jest na stronie
document.querySelectorAll('div[role="article"]').length

// Sprawdź pierwszy kafelek
const first = document.querySelector('div[role="article"]');
console.log(first.innerText);

// Sprawdź linki w pierwszym kafelku
first.querySelectorAll('a').forEach(a => console.log(a.href));

// Sprawdź aria-labels
first.querySelectorAll('[aria-label]').forEach(el => 
  console.log(el.getAttribute('aria-label'))
);
```

---

## Checklist przed zgłoszeniem błędu

- [ ] Sprawdziłem czy rozszerzenie jest załadowane
- [ ] Przewinąłem listę firm na Google Maps
- [ ] Odświeżyłem stronę i spróbowałem ponownie
- [ ] Sprawdziłem konsolę deweloperską (F12)
- [ ] Przetestowałem na różnych wyszukaniach
- [ ] Mam screenshoty/logi błędów

---

## Przykładowe wyszukania do testów

### Dobre do testowania telefonów:
- "pizza [miasto]"
- "taxi [miasto]"
- "hydraulik [miasto]"

### Dobre do testowania stron WWW:
- "hotel [miasto]"
- "restauracja [miasto]"
- "sklep [miasto]"

### Dobre do testowania Instagram:
- "kawiarnia [miasto]"
- "salon kosmetyczny [miasto]"
- "fryzjer [miasto]"
- "tatuaż [miasto]"

### Dobre do testowania Facebook:
- "bar [miasto]"
- "pub [miasto]"
- "klub fitness [miasto]"

---

## Wsparcie

Jeśli masz problemy:
1. Sprawdź README.md
2. Sprawdź CHANGELOG.md
3. Sprawdź konsolę deweloperską
4. Zgłoś błąd z logami

**Powodzenia w testowaniu! 🚀**
