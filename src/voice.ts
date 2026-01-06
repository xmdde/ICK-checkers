import { executeMove } from "./game.js";

// Słownik mapowania słów na cyfry
const NUMBER_MAP: { [key: string]: string } = {
    "jeden": "1", "raz": "1",
    "dwa": "2", 
    "trzy": "3", 
    "cztery": "4", 
    "pięć": "5", 
    "sześć": "6", 
    "siedem": "7", 
    "osiem": "8"
};

export function initVoiceControl() {
  const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
  const output = document.getElementById("output") as HTMLParagraphElement;

  const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output.textContent = "Brak obsługi Web Speech API.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "pl-PL";
  recognition.interimResults = false;
  recognition.continuous = false;

  startBtn.addEventListener("click", () => {
    output.textContent = "Słucham...";
    recognition.start();
  });

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    output.textContent = "Usłyszałem: " + transcript;

    const move = parseMoveCommand(transcript);
    
    if (move) {
      const success = executeMove(move.from, move.to);
      if (success) {
          output.textContent += ` ✅ Ruch: ${move.from} -> ${move.to}`;
      } else {
          output.textContent += ` ❌ Ruch niemożliwy`;
      }
    } else {
      output.textContent += " (Nie zrozumiałem ruchu)";
    }
  };

  recognition.onerror = (event: any) => {
    output.textContent = "Błąd: " + event.error;
  };
}

function parseMoveCommand(text: string) {
  text = text.toLowerCase();

  for (const [word, digit] of Object.entries(NUMBER_MAP)) {
    text = text.replace(new RegExp(word, 'g'), digit);
  }

  text = text.toUpperCase();
  text = text
    .replace(/NA|DO|Z|ZE|PRZESUŃ|PION|RUSZ|RUCH|POLE/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const matches = text.match(/([A-H])\s?([1-8])/g);

  if (matches && matches.length >= 2) {
    const from = matches[0].replace(/\s/g, "");
    const to = matches[1].replace(/\s/g, "");
    return { from, to };
  }

  return null;
}
