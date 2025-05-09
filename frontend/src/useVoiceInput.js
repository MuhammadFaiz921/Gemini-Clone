import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export const useVoiceInput = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });

  const stopListening = () => SpeechRecognition.stopListening();

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
  };
};
