import { useState, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle2, X, Info, Loader2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CIVIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the minimum age required to vote in India's General Elections?",
    options: ["16 Years", "18 Years", "21 Years", "25 Years"],
    correctAnswer: 1,
    explanation: "The 61st Amendment Act of 1988 lowered the voting age from 21 to 18 years."
  },
  {
    id: 2,
    question: "What does VVPAT stand for in the context of Indian Elections?",
    options: ["Voter Verified Paper Audit Trail", "Voter Validated Paper Account Task", "Verified Voter Paper Access Tool", "Virtual Voter Paper Audit Tracker"],
    correctAnswer: 0,
    explanation: "VVPAT allows voters to verify that their vote was cast correctly by viewing a paper slip for 7 seconds."
  },
  {
    id: 3,
    question: "Which electronic device is NOT connected to any network (Internet/WiFi) for security?",
    options: ["Aadhar Server", "EVM (Electronic Voting Machine)", "VVPAT", "Both EVM and VVPAT"],
    correctAnswer: 3,
    explanation: "EVMs and VVPATs are stand-alone machines, meaning they have no wired or wireless communication capabilities, making them un-hackable via remote networks."
  },
  {
    id: 4,
    question: "What color is the 'Top Secret' ink used for marking a voter's finger?",
    options: ["Black", "Blue/Purple", "Red", "Green"],
    correctAnswer: 1,
    explanation: "Indelible ink is typically purple/blue and contains silver nitrate, which reacts with skin to leave a semi-permanent stain."
  },
  {
    id: 5,
    question: "Who is the current head of the Election Commission of India?",
    options: ["Chief Justice of India", "Prime Minister", "Chief Election Commissioner", "President of India"],
    correctAnswer: 2,
    explanation: "The Chief Election Commissioner (CEC) heads the ECI, an autonomous constitutional authority."
  }
];

export const CivicQuiz = memo(() => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (quizComplete && auth.currentUser) {
      saveResults();
    }
  }, [quizComplete]);

  const saveResults = async () => {
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        const resultsRef = collection(db, 'users', auth.currentUser.uid, 'quiz_results');
        await addDoc(resultsRef, {
          userId: auth.currentUser.uid,
          score,
          total: CIVIC_QUIZ_QUESTIONS.length,
          timestamp: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser?.uid}/quiz_results`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === CIVIC_QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentQuestion < CIVIC_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-12">
        <div className="bg-cv-dark text-white rounded-[40px] p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-cv-yellow" />
          <Trophy className="w-20 h-20 text-cv-yellow mx-auto mb-8" />
          <h3 className="text-5xl font-black tracking-tighter uppercase font-display mb-4">Quiz <span className="text-cv-blue">Complete</span></h3>
          <p className="text-xl font-bold text-white/60 mb-12 uppercase tracking-widest">Digital Civic Literacy Score</p>
          
          <div className="text-8xl font-black font-display mb-12 text-cv-yellow">
            {score}/{CIVIC_QUIZ_QUESTIONS.length}
          </div>

          {isSaving && (
            <div className="flex items-center justify-center gap-3 text-white/40 mb-8 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Archiving Score...</span>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={resetQuiz}
              className="w-full bg-cv-blue text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Restart Discovery
            </button>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-8">Your results contribute to the national literacy index.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const q = CIVIC_QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / CIVIC_QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12 flex items-end justify-between border-b border-cv-dark/5 pb-8">
        <div role="header">
          <div className="cv-badge mb-3">Civic Literacy Assessment</div>
          <h3 className="text-5xl font-black tracking-tighter uppercase font-display">Power of <span className="text-cv-blue">Knowledge</span></h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-cv-dark/40 uppercase tracking-widest mb-1">Question {currentQuestion + 1} of {CIVIC_QUIZ_QUESTIONS.length}</p>
          <div className="w-48 h-2 bg-cv-dark/5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-cv-blue" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12">
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] p-12 shadow-sm border border-cv-dark/5"
          >
            <h4 className="text-2xl font-black tracking-tight mb-12 flex gap-4 items-start">
              <span className="w-10 h-10 bg-cv-light rounded-xl flex items-center justify-center shrink-0 text-cv-blue font-display text-lg" aria-hidden="true">Q</span>
              {q.question}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === q.correctAnswer;
                let bgClass = "bg-cv-light hover:bg-cv-blue/5 border-transparent";
                
                if (showFeedback) {
                  if (isCorrect) bgClass = "bg-green-500 text-white border-green-500";
                  else if (isSelected) bgClass = "bg-red-500 text-white border-red-500";
                  else bgClass = "bg-cv-light opacity-50 border-transparent text-cv-dark/30";
                }

                return (
                  <button 
                    key={i}
                    onClick={() => handleAnswerSelect(i)}
                    disabled={showFeedback}
                    className={`p-6 rounded-3xl text-left font-bold text-sm border-2 transition-all flex items-center justify-between ${bgClass}`}
                    aria-label={`Option ${i + 1}: ${opt}`}
                  >
                    {opt}
                    {showFeedback && i === q.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                    {showFeedback && isSelected && i !== q.correctAnswer && <X className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-8 bg-cv-blue/5 rounded-3xl border border-cv-blue/10 flex gap-6"
                >
                  <div className="w-12 h-12 bg-cv-blue text-white rounded-2xl flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-cv-blue uppercase tracking-widest mb-2">Contextual Knowledge</p>
                    <p className="text-lg font-bold italic text-cv-dark/80 leading-snug">{q.explanation}</p>
                  </div>
                  <button 
                    onClick={nextQuestion}
                    className="ml-auto bg-cv-dark text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl self-center"
                    aria-label={currentQuestion < CIVIC_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                  >
                    {currentQuestion < CIVIC_QUIZ_QUESTIONS.length - 1 ? 'Next Pulse' : 'View Results'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
});
