import { useState } from 'react';
import { AssessmentTest } from '../components/assessment/AssessmentTest';
import { AssessmentResults } from '../components/assessment/AssessmentResults';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AssessmentPageProps {
  onComplete: () => void;
}

export function AssessmentPage({ onComplete }: AssessmentPageProps) {
  const { user } = useAuth();
  const [scores, setScores] = useState<{
    attention: number;
    discrimination: number;
    speed: number;
    reading: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleTestComplete = async (testScores: {
    attention: number;
    discrimination: number;
    speed: number;
    reading: number;
  }) => {
    setScores(testScores);

    if (!user) return;

    setSaving(true);

    try {
      const readingLevel = Math.max(
        1,
        Math.min(
          10,
          Math.ceil(
            (testScores.attention +
              testScores.discrimination +
              testScores.speed +
              testScores.reading) /
              40
          )
        )
      );

      await supabase.from('assessments').insert({
        user_id: user.id,
        attention_score: testScores.attention,
        discrimination_score: testScores.discrimination,
        processing_speed: testScores.speed,
        reading_level: readingLevel,
      });

      await supabase
        .from('profiles')
        .update({
          reading_level: readingLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      const { data: firstBadge } = await supabase
        .from('badges')
        .select('id')
        .eq('name', 'İlk Adım')
        .maybeSingle();

      if (firstBadge) {
        await supabase.from('user_badges').insert({
          user_id: user.id,
          badge_id: firstBadge.id,
        });
      }

      await supabase.from('reading_progress').insert({
        user_id: user.id,
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 py-8 px-4">
      {!scores ? (
        <AssessmentTest onComplete={handleTestComplete} />
      ) : (
        <AssessmentResults scores={scores} onContinue={onComplete} />
      )}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Kaydediliyor...
        </div>
      )}
    </div>
  );
}
