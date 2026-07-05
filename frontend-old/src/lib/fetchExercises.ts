type Exercise = {
  question: string;
  translation: string;
  correctAnswer: string;
  options: string[];
};

export async function fetchExercise(
  randomVerb: string[],
  setExercise: (ex: Exercise) => void
): Promise<void> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`, //  Użyj zmiennych środowiskowych!
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: `Stwórz 1 unikalne hiszpańskie zadanie z luką i polskim słowem w nawiasie. Użytkownik ma podać słowo zeby wypełnić lukę. Poprawna odpowiedź którą użytkownik musi byc w czasie terazniejszym.
Poprawna odzpowieź to: "${randomVerb[0]}".
Bez wyjaśnień, tylko jedno zdanie. Podaj JSON w formacie:
{
  "question": "Twoje pytanie",
  "translation": "Tłumaczenie pytania",
  "correctAnswer": "${randomVerb[0]}",
  "options": ["opcja1", "opcja2", "opcja3", "opcja4"]
}`,
        },
      ],
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  try {
    const chatResponse = data.choices[0].message.content.trim();
    const exercise: Exercise = JSON.parse(chatResponse);
    setExercise(exercise);
  } catch (error) {
    console.error("Błąd parsowania JSON:", error);
  }
}
