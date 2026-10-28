import { useState } from "react";
import { getQuizForCategory } from "../data/quizData.js";

export default function MiniQuizCard({ category }) {
  const questions = getQuizForCategory(category);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];
  const isAnswered = selectedOption !== null;

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="mt-5 rounded-2xl parchment-sheet p-5 text-left relative overflow-hidden">
      {/* Tape accent */}
      <div className="washi-tape tape-top" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-kraft-border mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🧠</span>
          <div>
            <h3 className="text-charcoal text-base font-serif font-bold tracking-tight">
              Science Day Field Quiz
            </h3>
            <p className="text-charcoal/60 text-xs font-sans">
              Test your knowledge on {category} disposal & hazards
            </p>
          </div>
        </div>

        {!quizCompleted && (
          <span className="rubber-stamp stamp-green text-[11px] font-bold">
            Question {currentIndex + 1} of {questions.length}
          </span>
        )}
      </div>

      {/* Active Quiz View */}
      {!quizCompleted ? (
        <div>
          {/* Question Title */}
          <div className="p-3.5 rounded-xl bg-paper border border-kraft-border mb-3.5 shadow-paper">
            <p className="text-charcoal font-serif font-bold text-sm leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-2 mb-3.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = "bg-parchment border-kraft-border text-charcoal hover:bg-paper";

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-[#EAF3EB] border-forest text-forest font-semibold shadow-sm";
                } else if (isSelected) {
                  btnStyle = "bg-[#FAEDE8] border-terracotta text-terracotta";
                } else {
                  btnStyle = "bg-paper/50 border-kraft-border/50 text-charcoal/40 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 shadow-paper ${btnStyle}`}
                >
                  <span className="font-stamp text-[11px] px-2 py-0.5 rounded bg-paper border border-kraft-border shrink-0 font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed font-sans">{opt}</span>
                  {isAnswered && isCorrect && <span className="text-forest font-bold text-base shrink-0">✓</span>}
                  {isAnswered && isSelected && !isCorrect && <span className="text-terracotta font-bold text-base shrink-0">✕</span>}
                </button>
              );
            })}
          </div>

          {/* Immediate Educational Explanation */}
          {isAnswered && (
            <div className="p-3.5 rounded-xl bg-paper border border-kraft-border mb-3.5 animate-fadeIn shadow-paper">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold mb-1.5">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-forest flex items-center gap-1">
                    <span>🎉</span> Correct!
                  </span>
                ) : (
                  <span className="text-terracotta flex items-center gap-1">
                    <span>ℹ️</span> Field Guide Note:
                  </span>
                )}
              </div>
              <p className="text-charcoal/85 text-xs leading-relaxed font-sans">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-forest text-parchment font-serif font-bold text-xs hover:bg-forest-light transition-all active:scale-95 shadow-md"
              >
                {currentIndex < questions.length - 1 ? "Next Question →" : "See Final Score 🏆"}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div className="p-5 rounded-xl bg-paper border border-kraft-border text-center animate-fadeIn shadow-paper">
          <div className="text-4xl mb-2">
            {score === questions.length ? "🏆" : score >= 2 ? "🌟" : "🌱"}
          </div>

          <h4 className="text-charcoal font-serif font-bold text-base mb-1">
            {score === questions.length
              ? "Eco Master! Perfect Field Score!"
              : score >= 2
              ? "Great Work! Environmental Champion!"
              : "Good Effort! Keep Observing!"}
          </h4>

          <p className="text-forest font-stamp font-bold text-sm mb-3">
            You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>

          <div className="p-3.5 bg-parchment rounded-xl border border-kraft-border text-left text-xs text-charcoal/85 leading-relaxed mb-4">
            <strong className="text-charcoal font-serif block mb-1">💡 Key Science Day Takeaway:</strong>
            Correct segregation prevents hazardous contamination, saves up to 95% of virgin manufacturing energy, and intercepts potent greenhouse gases before they reach landfills!
          </div>

          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl bg-forest text-parchment font-serif font-semibold text-xs hover:bg-forest-light transition-all active:scale-95 shadow-md"
          >
            🔄 Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
