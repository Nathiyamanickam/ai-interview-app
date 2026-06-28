import { useEffect, useRef } from "react";

const VoiceRecorder = ({
  onResult,
  isRecording,
  setIsRecording,
}) => {
  const recognitionRef = useRef(null);

  const supported =
    "webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window;

  useEffect(() => {
    if (!supported) return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const rec = new SpeechRecognition();

    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = "en-US";

    rec.onstart = () => {
  console.log("Recording started");
};

rec.onspeechstart = () => {
  console.log("Speech detected");
};

rec.onresult = (event) => {
  console.log("Result received");

  const transcript = Array.from(event.results)
    .map(result => result[0].transcript)
    .join(" ");

  console.log("Transcript:", transcript);

  onResult(transcript);
};

rec.onerror = (event) => {
  console.log("Speech error:", event.error);
  setIsRecording(false);
};

rec.onend = () => {
  console.log("Recording ended");
  setIsRecording(false);
};

    recognitionRef.current = rec;

    return () => {
      rec.abort();
    };
  }, [onResult, setIsRecording, supported]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        console.log("Please speak now...");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (!supported) {
    return (
      <p className="text-yellow-400 text-sm">
        Voice recognition is not supported. Please use Google Chrome.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
        isRecording
          ? "bg-red-500/20 border border-red-500 text-red-400 animate-pulse"
          : "bg-indigo-500/20 border border-indigo-500 text-indigo-400 hover:bg-indigo-500/30"
      }`}
    >
      <span
        className={`w-3 h-3 rounded-full ${
          isRecording
            ? "bg-red-500 animate-ping"
            : "bg-indigo-500"
        }`}
      ></span>

      {isRecording ? "Stop Recording" : "Start Voice"}
    </button>
  );
};

export default VoiceRecorder;