import { executeMove } from "./game.js";
import { setTheme } from "./board.js";
import { gameState } from "./game.js";

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

function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pl-PL";
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);

  const assistantText = document.getElementById("assistant-text");
  if (assistantText) {
    assistantText.textContent = text;
    assistantText.style.opacity = "0";
    setTimeout(() => assistantText.style.opacity = "1", 100);
  }
}

export function initVoiceControl() {
  const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
  const output = document.getElementById("output") as HTMLParagraphElement;
  const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  recognition.lang = "pl-PL";
  recognition.interimResults = false;
  recognition.continuous = false;

  startBtn.addEventListener("click", () => {
    output.textContent = "Słucham...";
    const assistantText = document.getElementById("assistant-text");
    if(assistantText) assistantText.textContent = "👂 Nasłuchuję..."; 
    
    recognition.start();
  });

  recognition.onresult = (event: any) => {
    const rawTranscript = event.results[0][0].transcript;
    const lowerTranscript = rawTranscript.toLowerCase();
    
    output.textContent = "Ty: " + rawTranscript;

    if (lowerTranscript.includes("motyw") || lowerTranscript.includes("kolor")) {
        if (lowerTranscript.includes("leśny")) { setTheme("las"); speak("Zmieniam motyw na leśny."); }
        else if (lowerTranscript.includes("ognisty")) { setTheme("ogien"); speak("Włączam motyw ognisty."); }
        else if (lowerTranscript.includes("kontrast")) { setTheme("kontrast"); speak("Włączam wysoki kontrast."); }
        else { setTheme("domyslny"); speak("Przywracam wygląd klasyczny."); }
        return;
    }

    if (lowerTranscript.includes("czyj ruch")) {
        const player = gameState.currentPlayer === "white" ? "białych" : "czarnych";
        speak(`Teraz jest ruch ${player}.`);
        return;
    }

    if (lowerTranscript.includes("zasady")) {
        speak("Pionki poruszają się o jedno pole po przekątnej. Bicie jest obowiązkowe.");
        return;
    }

    const move = parseMoveCommand(rawTranscript);
    if (move) {
      const success = executeMove(move.from, move.to);
      if (success) {
        speak(`Przesuwam z ${move.from} na ${move.to}.`);
      } else {
        speak("Ten ruch jest niemożliwy.");
      }
    } else {
      speak("Nie zrozumiałam komendy.");
    }
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
