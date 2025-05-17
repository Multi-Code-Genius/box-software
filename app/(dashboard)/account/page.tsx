"use client";

import React, { useState } from "react";

const sampleFlashcards = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: "What is 2 + 2?", answer: "4" },
  { id: 3, question: "What color is the sky?", answer: "Blue" },
];

export default function FlashcardApp() {
  const [cards, setCards] = useState(sampleFlashcards);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState([]);

  const handleResponse = (known) => {
    const newStat = {
      id: cards[current].id,
      known,
      timestamp: new Date().toISOString(),
    };
    setStats([...stats, newStat]);
    setShowAnswer(false);
    setCurrent((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Flashcard Review</h2>
        <div className="mb-4">
          <p className="text-lg">
            {showAnswer ? cards[current].answer : cards[current].question}
          </p>
        </div>
        <div className="space-x-2">
          {!showAnswer ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAnswer(true)}
            >
              Show Answer
            </button>
          ) : (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleResponse(true)}
              >
                I knew this
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleResponse(false)}
              >
                I didn’t know
              </button>
            </>
          )}
        </div>
        <div className="mt-6 text-left text-sm text-gray-600">
          <h3 className="font-medium mb-2">Review Stats:</h3>
          <ul>
            {stats.map((s, idx) => (
              <li key={idx}>
                Card {s.id}: {s.known ? "✅ Known" : "❌ Unknown"} at{" "}
                {new Date(s.timestamp).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
