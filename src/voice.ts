const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const output = document.getElementById("output") as HTMLParagraphElement;

interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

if (!SpeechRecognition) {
  output.textContent = "Twoja przeglądarka nie obsługuje rozpoznawania mowy 😢";
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "pl-PL";
  recognition.interimResults = false;
  recognition.continuous = false;

  startBtn.addEventListener("click", () => {
    output.textContent = "Nasłuchiwanie...";
    recognition.start();
  });

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    output.textContent = "Usłyszałem: " + transcript;

    const move = parseMoveCommand(transcript);
        if (move) {
        console.log("Ruch z:", move.from, "na:", move.to);
    } else {
        console.log("Nie rozpoznano ruchu");
    }
};

  recognition.onerror = (event: any) => {
    output.textContent = "Błąd: " + event.error;
  };
}

function parseMoveCommand(text: string) {
  text = text.toUpperCase();

  text = text
    .replace(/NA|DO|Z|ZE|PRZESUŃ|PION|RUSZ|RUCH/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const matches = text.match(/[A-H][1-8]/g);

  if (matches && matches.length >= 2) {
    return {
      from: matches[0],
      to: matches[1],
    };
  }
  return null;
}
