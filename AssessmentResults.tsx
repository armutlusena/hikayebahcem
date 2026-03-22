import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Trophy, ArrowRight } from 'lucide-react';

interface AssessmentResultsProps {
  scores: {
    attention: number;
    discrimination: number;
    speed: number;
    reading: number;
  };
  onContinue: () => void;
}

export function AssessmentResults({ scores, onContinue }: AssessmentResultsProps) {
  const averageScore = Math.round(
    (scores.attention + scores.discrimination + scores.speed + scores.reading) / 4
  );

  const readingLevel = Math.max(1, Math.min(10, Math.ceil(averageScore / 10)));

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-6">
            <Trophy className="text-yellow-500" size={64} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Harika İş Çıkardın!
        </h2>
        <p className="text-lg text-gray-600">
          İşte senin süper yeteneklerin:
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Dikkat</span>
            <span className="text-blue-600 font-bold">{scores.attention}/100</span>
          </div>
          <ProgressBar value={scores.attention} color="blue" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Ayırt Etme</span>
            <span className="text-green-600 font-bold">{scores.discrimination}/100</span>
          </div>
          <ProgressBar value={scores.discrimination} color="green" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Hız</span>
            <span className="text-yellow-600 font-bold">{scores.speed}/100</span>
          </div>
          <ProgressBar value={scores.speed} color="yellow" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Okuma</span>
            <span className="text-blue-600 font-bold">{scores.reading}/100</span>
          </div>
          <ProgressBar value={scores.reading} color="blue" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Senin Okuma Seviyeni: {readingLevel}/10
        </h3>
        <p className="text-gray-600">
          Sana özel hazırladığımız hikayeleri okumaya hazır mısın?
        </p>
      </div>

      <Button onClick={onContinue} size="lg" fullWidth>
        Hikaye Bahçeme Git
        <ArrowRight className="ml-2" size={20} />
      </Button>
    </Card>
  );
}
