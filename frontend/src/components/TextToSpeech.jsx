import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

export const TextToSpeech = () => {
  const [text, setText] = useState("");
  const { speak } = useSpeechSynthesis();

  return (
    <div>
      <textarea onChange={(e) => setText(e.target.value)} value={text} />
      <button onClick={() => speak({ text })}>Mów</button>
    </div>
  );
};
