import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Zap, Eye, Gauge, BookOpen } from 'lucide-react';

interface Question {
  id: string;
  type: 'attention' | 'discrimination' | 'speed' | 'reading';
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit?: number;
}

const assessmentQuestions: Question[] = [
  {
    id: '1',
    type: 'attention',
    question: 'Hangi kelime farklı?',
    options: ['kedi', 'köpek', 'kuş', 'masa'],
    correctAnswer: 3,
  },
  {
    id: '2',
    type: 'discrimination',
    question: 'Hangi harf çifti farklı?',
    options: ['b-d', 'd-b', 'b-d', 'p-q'],
    correctAnswer: 3,
  },
  {
    id: '3',
    type: 'speed',
    question: 'Kaç tane "a" harfi var? → aardvark',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    timeLimit: 5,
  },
  {
    id: '4',
    type: 'reading',
    question: '"Kedi bahçede oynuyor" cümlesinde kaç kelime var?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
  },
  {
    id: '5',
    type: 'attention',
    question: 'Hangi sayı çifttir?',
    options: ['3', '5', '7', '8'],
    correctAnswer: 3,
  },
  {
    id: '6',
    type: 'discrimination',
    question: 'Hangi kelime doğru yazılmış?',
    options: ['okol', 'okul', 'oukl', 'oklul'],
    correctAnswer: 1,
  },
];

interface AssessmentTestProps {
  onComplete: (scores: {
    attention: number;
    discrimination: number;
    speed: number;
    reading: number;
  }) => void;
}

export function AssessmentTest({ onComplete }: AssessmentTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const question = assessmentQuestions[currentQuestion];

  useEffect(() => {
    if (isStarted && question.timeLimit && timeLeft === null) {
      setTimeLeft(question.timeLimit);
    }
  }, [currentQuestion, isStarted, question.timeLimit, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      handleNext(-1);
    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (answerIndex: number) => {
    setAnswers({ ...answers, [question.id]: answerIndex });
  };

  const handleNext = (selectedAnswer?: number) => {
    if (selectedAnswer !== undefined) {
      handleAnswer(selectedAnswer);
    }

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(null);
    } else {
      calculateScores();
    }
  };

  const calculateScores = () => {
    const scores = {
      attention: 0,
      discrimination: 0,
      speed: 0,
      reading: 0,
    };

    let typeCounts = {
      attention: 0,
      discrimination: 0,
      speed: 0,
      reading: 0,
    };

    assessmentQuestions.forEach((q) => {
      typeCounts[q.type]++;
      if (answers[q.id] === q.correctAnswer) {
        scores[q.type]++;
      }
    });

    const normalizedScores = {
      attention: Math.round((scores.attention / typeCounts.attention) * 100),
      discrimination: Math.round((scores.discrimination / typeCounts.discrimination) * 100),
      speed: Math.round((scores.speed / typeCounts.speed) * 100),
      reading: Math.round((scores.reading / typeCounts.reading) * 100),
    };

    onComplete(normalizedScores);
  };

  if (!isStarted) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Hikaye Bahçeme Hoş Geldin!
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Seni tanımak için kısa bir değerlendirme yapacağız. Bu sayede sana en uygun
            hikayeleri bulabiliriz.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
              <Zap className="text-blue-500 mb-2" size={32} />
              <span className="font-semibold">Dikkat</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
              <Eye className="text-green-500 mb-2" size={32} />
              <span className="font-semibold">Ayırt Etme</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl">
              <Gauge className="text-yellow-500 mb-2" size={32} />
              <span className="font-semibold">Hız</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl">
              <BookOpen className="text-orange-500 mb-2" size={32} />
              <span className="font-semibold">Okuma</span>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsStarted(true)} size="lg">
          Başlayalım
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Soru {currentQuestion + 1} / {assessmentQuestions.length}
          </span>
          {timeLeft !== null && (
            <span className={`text-sm font-bold ${timeLeft <= 2 ? 'text-red-500' : 'text-gray-600'}`}>
              Süre: {timeLeft}s
            </span>
          )}
        </div>
        <ProgressBar
          value={currentQuestion + 1}
          max={assessmentQuestions.length}
          color="blue"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">{question.question}</h3>
        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => handleNext(index)}
              className="text-xl py-6"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
