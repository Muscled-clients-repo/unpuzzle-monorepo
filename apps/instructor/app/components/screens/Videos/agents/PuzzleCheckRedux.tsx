import SharedButton from '@/app/components/shared/SharedButton';
import Image from 'next/image';
import React, { MutableRefObject, useState, useEffect } from 'react';
import { useGetPuzzleChecksByVideoIdQuery, useCreatePuzzleCheckMutation } from '@/app/redux/hooks';
import LoadingSpinner from '../../Loading';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

const QuizIntro = ({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) => (
  <div className="w-full  mx-auto bg-white  p-4">
    <div className="text-[#1D1D1D] text-sm font-medium mb-4">Ready to take a quiz?</div>
    <div className='flex flex-col gap-3 '>
      <SharedButton variant='solid' onClick={onStart}>
        Take Quiz
      </SharedButton>
      <SharedButton onClick={onSkip}>
        No Thanks
      </SharedButton>
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
        <div className="text-[#F24E1E] text-sm mb-4">Let's Go Back to 2:40</div>
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
  correct: boolean;
  incorrect: boolean;
}) => (
  <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border ${
    correct ? 'border-green-500 bg-green-50' : 
    incorrect ? 'border-red-500 bg-red-50' : 
    'border-gray-300 hover:bg-gray-50'
  }`}>
    <input
      type="radio"
      checked={checked}
      onChange={onClick}
      disabled={disabled}
      className="w-4 h-4 text-blue-600"
    />
    <span className={`text-sm ${
      correct ? 'text-green-700' : 
      incorrect ? 'text-red-700' : 
      'text-gray-700'
    }`}>
      {label}
    </span>
  </label>
);

interface PuzzleCheckProps {
  videoId: string;
  currentTimeSec: MutableRefObject<number>;
  onSeek: (time: number) => void;
}

const PuzzleCheckRedux: React.FC<PuzzleCheckProps> = ({ videoId, currentTimeSec, onSeek }) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result' | 'skipped'>('intro');
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [quizTopic, setQuizTopic] = useState('');
  const [loading, setLoading] = useState(false);

  // Redux hooks
  const { data: puzzleChecks, refetch } = useGetPuzzleChecksByVideoIdQuery(
    { videoId },
    { skip: !videoId }
  );
  
  const [createPuzzleCheck] = useCreatePuzzleCheckMutation();

  const isValidCheckRequest = (): boolean => {
    if (!videoId) {
      toast.error('Video ID is required');
      return false;
    }
    return true;
  };

  const handleStartQuiz = async () => {
    if (!isValidCheckRequest()) return;
    setLoading(true);
    
    try {
      // Create a new puzzle check request
      const payload = {
        video_id: videoId,
        timestamp: currentTimeSec.current,
        request_type: 'generate_quiz'
      };
      
      const response = await createPuzzleCheck(payload).unwrap();
      
      if (!response || !Array.isArray(response.completion) || response.completion.length === 0) {
        toast.error('No quiz questions found.');
        setLoading(false);
        return;
      }
      
      // Map API response to expected format
      const mappedQuestions = response.completion.map((q: any) => {
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
      setQuizTopic(response.topic || '');
      setSelectedOptions(Array(mappedQuestions.length).fill(null));
      setStep('quiz');
      setQuestionIndex(0);
      setShowFeedback(false);
      setIsCorrect(false);
      setScore(0);
      setFeedbackType(null);
      
      // Refetch puzzle checks to update the count
      refetch();
      
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load quiz questions.');
      console.error('Quiz generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipQuiz = () => {
    setStep('skipped');
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return;
    
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
    
    const currentQuestion = questions[questionIndex];
    const isAnswerCorrect = optionIndex === currentQuestion.correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    setFeedbackType(isAnswerCorrect ? 'correct' : 'incorrect');
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setShowFeedback(false);
      setFeedbackType(null);
    } else {
      // Quiz completed
      const finalScore = score + (isCorrect ? 1 : 0);
      const passed = (finalScore / questions.length) >= 0.8;
      setStep('result');
    }
  };

  const handleBackToVideo = () => {
    // Go back to the timestamp where the quiz was triggered
    onSeek(currentTimeSec.current);
    setStep('intro');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (step === 'intro') {
    return <QuizIntro onStart={handleStartQuiz} onSkip={handleSkipQuiz} />;
  }

  if (step === 'skipped') {
    return (
      <div className="w-full mx-auto bg-white p-4">
        <div className="text-[#8A94A6] text-sm">Quiz skipped. Continue watching the video.</div>
      </div>
    );
  }

  if (step === 'result') {
    const finalScore = score;
    const passed = (finalScore / questions.length) >= 0.8;
    return (
      <QuizResult 
        score={finalScore} 
        total={questions.length} 
        onBack={handleBackToVideo} 
        passed={passed}
        topic={quizTopic}
      />
    );
  }

  if (step === 'quiz' && questions.length > 0) {
    const currentQuestion = questions[questionIndex];
    
    return (
      <div className="w-full mx-auto bg-white p-4">
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            Question {questionIndex + 1} of {questions.length}
          </div>
          <div className="text-[#1D1D1D] text-base font-medium mb-4">
            {currentQuestion.question}
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option: string, index: number) => (
            <OptionRadio
              key={index}
              label={option}
              checked={selectedOptions[questionIndex] === index}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
              correct={showFeedback && index === currentQuestion.correctAnswer}
              incorrect={showFeedback && selectedOptions[questionIndex] === index && index !== currentQuestion.correctAnswer}
            />
          ))}
        </div>
        
        {showFeedback && (
          <div className="mb-4">
            <div className={`text-sm mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            {currentQuestion.explanation && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {currentQuestion.explanation}
              </div>
            )}
          </div>
        )}
        
        {showFeedback && (
          <button
            onClick={handleNextQuestion}
            className="w-full h-9 bg-[#1D1D1D] text-white rounded-md font-semibold text-sm"
          >
            {questionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default PuzzleCheckRedux;