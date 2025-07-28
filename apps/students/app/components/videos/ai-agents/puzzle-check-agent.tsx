import BaseButton from '@/app/components/shared/base-button';
import Image from 'next/image';
import React, { MutableRefObject, useState } from 'react';
import { usePuzzleCheck } from '@/app/hooks/usePuzzleCheck';
import PageLoadingSpinner from '../../shared/page-loading-spinner';
import { toast } from 'react-toastify';

const QuizIntro = ({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) => (
  <div className="w-full  mx-auto bg-white  p-4">
    <div className="text-[#1D1D1D] text-sm font-medium mb-4">Ready to take a quiz?</div>
    <div className='flex flex-col gap-3 '>
      <BaseButton variant='solid' onClick={onStart}>
        Take Quiz
      </BaseButton>
      <BaseButton onClick={onSkip}>
        No Thanks
      </BaseButton>
    </div>
  </div>
);

const QuizResult = ({ score, total, onBack, passed, topic }: { score: number; total: number; onBack: () => void; passed: boolean; topic?: string }) => (
  <div className="w-full  mx-auto bg-white  p-4 mt-4">
    <div className="flex items-center gap-2 text-[#F24E1E] font-semibold text-lg mt-2 mb-1" style={{ display: passed ? 'none' : 'flex' }}>
      <span>{score}/{total}</span>
    </div>
    {!passed ? (
      <>
        <div className="text-[#F24E1E] text-sm mb-4">Let&apos;s Go Back to 2:40</div>
        <button onClick={onBack} className="w-full h-9 bg-[#1D1D1D] text-white rounded-md font-semibold text-sm">Back to 2:40</button>
      </>
    ) : (
      <>
        <div className="font-semibold text-[#1D1D1D] text-base mb-1">Congratulations</div>
        <div className="text-[#8A94A6] text-sm mb-4">Your score at least 80%, so go ahead and carry on<br />Continuing the video in 3</div>
        <button onClick={onBack} className="w-full h-9 bg-[#1D1D1D] text-white rounded-md font-semibold text-sm">Back to 2:40</button>
      </>
    )}
  </div>
);

const OptionRadio = ({
  label,
  checked,
  onClick,
  disabled,
  correct,
  incorrect,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  disabled: boolean;
  correct?: boolean;
  incorrect?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center w-full h-10 px-3 mb-2 rounded-md border text-sm font-medium transition-all
      ${checked ? 'border-[#00AFF0] bg-[#E6F7FF]' : 'border-[#E4E4E4] bg-white'}
      ${correct ? 'border-[#00C48C] bg-[#E6FFF6]' : ''}
      ${incorrect ? 'border-[#F24E1E] bg-[#FFF0ED]' : ''}
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-[#00AFF0]'}
    `}
  >
    <span className="flex-1 text-left">
      {label}
    </span>
    <span
      className={`w-5 h-5 mr-3 flex items-center justify-center rounded-full 
        ${!checked ? '' : 'bg-transparent'}
        ${correct ? ' bg-[#00C48C]' : ''}
        ${incorrect ? 'bg-[#F24E1E]' : ''}
      `}
    >
      {!checked && (
        <span className="w-4 h-4 bg-white rounded-full block border border-[#8A8A8A]" />
      )}
      {correct && (
        <Image src="/img/CheckMark.svg" alt="Correct" width={16} height={16} />
      )}
      {incorrect && (
        <Image src="/img/UnCheckMark.svg" alt="Incorrect" width={16} height={16} />
      )}
    </span>
  </button>
);

const QuizQuestion = ({
  questionIndex,
  question,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onPrev,
  onNext,
  showFeedback,
  isCorrect,
  correctIndex,
  feedbackType,
  feedbackText,
}: {
  questionIndex: number;
  question: any;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  showFeedback: boolean;
  isCorrect: boolean;
  correctIndex: number;
  feedbackType: 'correct' | 'incorrect' | null;
  feedbackText: string;
}) => (
  <div className="w-full max-w-[370px] mx-auto bg-white  p-4 mt-4">
    <div className="flex items-center justify-between text-xs text-[#8A94A6] mb-1">
      <span>Question {questionIndex + 1} of {totalQuestions}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={questionIndex === 0}
          className={`p-1 rounded-full transform rotate-[0deg] ${questionIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          <Image src="/img/left-arrow.svg" alt="Prev" width={24} height={24} />
        </button>
        <button
          onClick={onNext}
          disabled={questionIndex === totalQuestions - 1}
          className={`p-1 rounded-full ${questionIndex === totalQuestions - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          <Image src="/img/right-arrow.svg" alt="Next" width={24} height={24} />
        </button>
      </div>
    </div>
    <div className="font-semibold text-[#1D1D1D] text-sm mb-2">{question.question}</div>
    <div className="mb-2">
      {question.options.map((option: string, idx: number) => (
        <OptionRadio
          key={idx}
          label={option}
          checked={selectedOption === idx}
          onClick={() => onSelectOption(idx)}
          disabled={showFeedback}
          correct={showFeedback && idx === question.correctAnswer && feedbackType === 'correct'}
          incorrect={showFeedback && idx === selectedOption && feedbackType === 'incorrect'}
        />
      ))}
    </div>
    {showFeedback && (
      <>
        <div className={`flex items-center gap-2 text-xs font-medium mb-2 ${feedbackType === 'correct' ? 'text-[#00C48C]' : 'text-[#F24E1E]'}`}>
          {feedbackType === 'correct' ? (
            <>
              <Image src="/img/correct.svg" alt="Correct" width={16} height={16} /> Correct!
            </>
          ) : (
            <>
              <Image src="/img/incorrect.svg" alt="Incorrect" width={16} height={16} /> Incorrect
            </>
          )}
        </div>
        {question.explanation && (
          <div className="mt-2 p-2 rounded bg-[#F5F7FA] text-xs text-[#1D1D1D] border border-[#E4E4E4]">
            <span className="font-semibold">Explanation: </span>{question.explanation}
          </div>
        )}
      </>
    )}
  </div>
);

const PuzzleCheck = ({videoId, currentTimeSec}:{videoId:string, currentTimeSec:MutableRefObject<number>}) => {
  const {getCheck}=usePuzzleCheck(null);

  const [step, setStep] = useState<'intro' | 'quiz' | 'result' | 'skipped'>('intro');
  const [questions, setQuestions] = useState<any[]>([]);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [loading, setLoading] = useState(false);

  // Validation helper
  const isValidCheckRequest = () => {
    if (!videoId || typeof videoId !== 'string' || videoId.trim() === '') {
      toast.error('Video ID is missing.');
      return false;
    }
    if (typeof currentTimeSec.current !== 'number' || currentTimeSec.current <= 0) {
      toast.error('Current time must be greater than 0.');
      return false;
    }
    return true;
  };

  const handleStartQuiz = async () => {
    if (!isValidCheckRequest()) return;
    setLoading(true);
    try {
      const data = await getCheck({id:videoId,duration:currentTimeSec.current});
      
      if (!data || !Array.isArray(data.completion) || data.completion.length === 0) {
        toast.error('No quiz questions found.');
        setLoading(false);
        return;
      }
      // Map API response to expected format
      const mappedQuestions = data.completion.map((q: any) => {
        let correctAnswerIndex = q.choices.findIndex((c: any) => {
          // Handle boolean and string comparison
          if (typeof c === 'boolean' || typeof q.answer === 'boolean') {
            return String(c) === String(q.answer);
          }
          return c === q.answer;
        });
        return {
          question: q.question,
          options: q.choices,
          correctAnswer: correctAnswerIndex,
          explanation: q.explanation || '',
        };
      });
      setQuestions(mappedQuestions);
      setQuizTopic(data.topic || '');
      setSelectedOptions(Array(mappedQuestions.length).fill(null));
      setStep('quiz');
      setQuestionIndex(0);
      setShowFeedback(false);
      setIsCorrect(false);
      setScore(0);
      setFeedbackType(null);
    } catch (error) {
      toast.error('Failed to load quiz questions.');
      
    } finally {
      setLoading(false);
    }
  };

  const handleSkipQuiz = () => {
    setStep('skipped');
  };

  const handleSelectOption = (idx: number) => { 
    if (showFeedback) return;
    const correct = idx === questions[questionIndex].correctAnswer;
    setSelectedOptions((prev) => {
      const updated = [...prev];
      updated[questionIndex] = idx;
      return updated;
    });
    setShowFeedback(true);
    setIsCorrect(correct);
    setFeedbackType(correct ? 'correct' : 'incorrect');
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      setShowFeedback(false);
      setFeedbackType(null);
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
      setFeedbackType(null);
      setIsCorrect(false);
    }
  };

  const handleShowScore = () => {
    // Calculate score
    let correctCount = 0;
    selectedOptions.forEach((opt, idx) => {
      if (opt === questions[idx].correctAnswer) correctCount++;
    });
    setScore(correctCount);
    setStep('result');
  };

  const handleBackToVideo = () => {
    setStep('intro');
  };

  // Show result only if all questions have been answered
  React.useEffect(() => {
    if (
      step === 'quiz' &&
      questions.length > 0 &&
      selectedOptions.length === questions.length &&
      selectedOptions.every((opt) => opt !== null)
    ) {
      // Delay to allow user to see feedback before showing score
      const timeout = setTimeout(() => {
        handleShowScore();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [selectedOptions, step, questions.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <PageLoadingSpinner />
        <span className="text-sm text-gray-500 mt-2">Loading quiz questions...</span>
      </div>
    );
  }

  if (step === 'intro') {
    return <QuizIntro onStart={handleStartQuiz} onSkip={handleSkipQuiz} />;
  }
  if (step === 'skipped') {
    return null;
  }
  if (step === 'result') {
    const passed = score / (questions.length || 1) >= 0.8;
    return <QuizResult score={score} total={questions.length} onBack={handleBackToVideo} passed={passed} topic={quizTopic} />;
  }
  // Quiz step
  const currentQuestion = questions[questionIndex];
  const selectedOption = selectedOptions[questionIndex];
  return (
    <QuizQuestion
      questionIndex={questionIndex}
      question={currentQuestion}
      totalQuestions={questions.length}
      selectedOption={selectedOption}
      onSelectOption={handleSelectOption}
      onPrev={handlePrev}
      onNext={handleNext}
      showFeedback={showFeedback}
      isCorrect={isCorrect}
      correctIndex={currentQuestion.correctAnswer}
      feedbackType={feedbackType}
      feedbackText={isCorrect ? 'Correct!' : 'Incorrect'}
    />
  );
};

export default PuzzleCheck;
