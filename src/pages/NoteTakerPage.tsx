import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

function NoteTakerPage() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log("webkitSpeechRecognition is not available");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setTranscript(prevTranscript => prevTranscript + event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  return (
    <div className="p-8 max-w-3xl"> {/* Removed mx-auto */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">AI Notetaker</h1>
      <button
        onClick={toggleListening}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 ${isListening ? 'bg-red-500 hover:bg-red-700' : ''}`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-700 whitespace-pre-line">{transcript}</p>
      </div>
    </div>
  );
}

export default NoteTakerPage;