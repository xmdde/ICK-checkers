# Voice-Controlled Checkers System | Warcaby z Interfejsem Głosowym

An interactive software solution combining classic board game logic with a Voice User Interface (VUI).
System interaktywnej rozgrywki łączący logikę klasycznej gry planszowej z głosowym interfejsem użytkownika (VUI).

---

### Opis Projektu
Celem projektu było stworzenie interaktywnej gry w warcaby, która pozwala na pełną obsługę bez użycia tradycyjnych urządzeń wskazujących. Aplikacja wykorzystuje zaawansowane przetwarzanie mowy w czasie rzeczywistym do interpretacji komend gracza.

### Struktura Plików
* `index.html` – Główny kontener aplikacji i interfejs asystenta głosowego.
* `style.css` – Arkusze stylów definiujące układ siatki oraz dynamiczne motywy wizualne.
* `src/board.ts` – Moduł widoku: odpowiada za renderowanie planszy, pionków oraz manipulację drzewem DOM.
* `src/game.ts` – Silnik logiczny.
* `src/voice.ts` – Kontroler głosowy: obsługa Web Speech API (STT), parser wyrażeń regularnych oraz synteza mowy (TTS).


### Instrukcja Uruchomienia
1.  **Instalacja środowiska:** Wymagane jest posiadanie zainstalowanego środowiska [Node.js](https://nodejs.org/).
2.  **Pobranie zależności:** W terminalu wewnątrz folderu projektu wpisz:
    ```bash
    npm install
    ```
3.  **Kompilacja TypeScript:** Przetwórz pliki źródłowe do formatu JS:
    ```bash
    npx tsc
    ```
4.  **Uruchomienie serwera:** Ze względu na restrykcje bezpieczeństwa przeglądarek (mikrofon), projekt musi być serwowany przez HTTP:
    ```bash
    npx http-server .
    ```
5.  **Dostęp:** Otwórz przeglądarkę Chrome pod adresem `http://localhost:8080`.

---

## 🇬🇧 Technical Documentation (EN)

### Project Overview
The project is a professional implementation of a checkers game integrated with a Voice User Interface. It focuses on accessibility and natural language processing to allow hands-free gameplay.

### File Structure (Project Layout)
* `index.html` – Core application structure and assistant UI.
* `style.css` – CSS Grid layouts and dynamic theme definitions.
* `src/board.ts` – View module: handles board rendering, piece placement, and DOM manipulation.
* `src/game.ts` – Game engine: manages move validation, capture mechanics, "flying king" logic, and win conditions.
* `src/voice.ts` – Voice controller: manages Speech-to-Text (STT), RegEx command parsing, and Text-to-Speech (TTS).
* `dist/` – Directory containing transpiled JavaScript files.


### Execution Guide
1.  **Environment Setup:** [Node.js](https://nodejs.org/) must be installed on the system.
2.  **Install Dependencies:** Run the following in the project root:
    ```bash
    npm install
    ```
3.  **Compile TypeScript:** Transpile source files to JavaScript:
    ```bash
    npx tsc
    ```
4.  **Launch Server:** A local HTTP server is required for microphone access:
    ```bash
    npx http-server .
    ```
5.  **Access:** Open your browser (Chrome) at `http://localhost:8080`.

---

## 🛠 Tech Stack | Technologie
* **Language:** TypeScript
* **Speech Processing:** Web Speech API
* **Frontend:** HTML5, CSS3 (Custom Properties)
* **Tooling:** NPM, TSC Compiler