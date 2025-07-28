import React, { useState, useEffect } from 'react';

type Quiz = {
  title: string;
  questions: Question[];
};

type Question = {
  questionText: string;
  choices: string[];
  correctAnswer: number;
};

type QuizContainerProps = {
  quizzes: Quiz[];
  onComplete: () => void;
};

const QuizContainer: React.FC<QuizContainerProps> = ({ quizzes, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuizVisible, setIsQuizVisible] = useState<boolean>(true); // To show/hide the quiz
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null); // For answer feedback
  const [countdown, setCountdown] = useState<number>(3); // For pass/fail countdown

  const currentQuiz = quizzes[0]; // Assuming the first quiz for now
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  const handleAnswerClick = (choiceIndex: number) => {
    setSelectedOption(choiceIndex);

    // Check if the answer is correct
    const isCorrect = choiceIndex === currentQuestion.correctAnswer;
    if (isCorrect) setCorrectAnswers((prev) => prev + 1);

    // Proceed to the next question after a short delay
    setTimeout(() => {
      setSelectedOption(null); // Reset the selected option

      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setIsQuizVisible(false); // End the quiz
      }
    }, 1000);
  };

  useEffect(() => {
    if (!isQuizVisible && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear the timer on cleanup
    }
  }, [isQuizVisible, countdown]);

  useEffect(() => {
    if (countdown === 0) {
      onComplete(); // Resume the video when countdown reaches zero
    }
  }, [countdown, onComplete]);

  if (!isQuizVisible) {
    // Calculate the quiz result
    const totalQuestions = currentQuiz.questions.length;
    const score = (correctAnswers / totalQuestions) * 100;
    const hasPassed = score >= 60;

    // Hide the screen after the countdown ends
    if (countdown === 0) return null;

    return (
      <div
        className="w-full h-full top-0 absolute z-50 flex flex-col items-center justify-center"
        style={{ backgroundColor: 'rgba(29, 29, 29, 0.95)' }}
      >
        {hasPassed ? (
          // If user passes the Quiz
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Fantastic Work! You Passed the Quiz!
            </h2>
            <h3 className="text-lg text-center font-normal text-white max-w-[60%] mx-auto">
              Your hard work has paid off – you've proven your knowledge and aced the quiz!
            </h3>
            <span className="text-[#00AFF0] font-bold text-[60px]">{countdown}</span>
          </div>
        ) : (
          // If user fails the Quiz
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Better Luck Next Time
            </h2>
            <h3 className="text-lg text-center font-normal text-white max-w-[80%] mx-auto">
              Rewatch the video and give it another shot for even better results!
            </h3>
            <span className="text-[#00AFF0] font-bold text-[60px]">{countdown}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full h-full top-0 absolute z-50 flex flex-col items-start justify-center pl-20"
      style={{ backgroundColor: 'rgba(29, 29, 29, 0.95)' }}
    >
      {/* Quiz Title */}
      <div className="text-white font-inter text-3xl font-bold mb-6">
        <p>{currentQuiz.title.toUpperCase()}</p>
      </div>

      <div className="flex flex-col">
        {/* Quiz Info */}
        <div className="text-white text-2xl font-medium mb-2">
          <p>Video paused at 1:20 to check your understanding</p>
        </div>

        {/* Quiz rules */}
        <div className="text-white text-[16px] font-normal mb-4">
          <p>
            Answer all the questions under 5 min. Every question carries equal
            points which is 1. Submit your quiz after selecting all the answers.
          </p>
        </div>
      </div>

      {/* Question Indicators */}
      <div className="flex items-center gap-3 mt-6 mb-10">
        {currentQuiz.questions.map((_, index) => (
          <div
            key={index}
            className={`w-[26px] h-[26px] flex items-center justify-center rounded-full mx-1 ${
              index === currentQuestionIndex
                ? 'ring-2 ring-[#00AFF0] text-[#00AFF0]'
                : 'ring-2 ring-[white] text-[white]'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Question */}
      <div className="text-white text-xl mb-4">
        <p>{currentQuestion.questionText}</p>
      </div>

      {/* Choices */}
      <div className="flex flex-col space-y-4">
        {currentQuestion.choices.map((choice, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 ${
              selectedOption === index
                ? index === currentQuestion.correctAnswer
                  ? 'text-blue-500'
                  : 'text-red-500'
                : 'text-white'
            }`}
            onClick={() => handleAnswerClick(index)}
            style={{ cursor: 'pointer' }}
          >
            {/* Index */}
            <div
              className={`w-[26px] h-[26px] flex items-center justify-center rounded-full border-[2px] ${
                selectedOption === index
                  ? index === currentQuestion.correctAnswer
                    ? 'bg-[#00AFF0] text-white'
                    : 'bg-red-500 text-white'
                  : 'border-[white] text-[white]'
              }`}
            >
              <p className="text-[14px]">{String.fromCharCode(65 + index)}</p> {/* A, B, C, D */}
            </div>
            {/* Choice Text */}
            <span className="text-white text-[18px]">{choice}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizContainer;
