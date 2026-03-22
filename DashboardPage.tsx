import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/Badge';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, Zap, Trophy, Settings, LogOut } from 'lucide-react';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const { data: badgesData } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', user.id);

    const { data: progressData } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    setProfile(profileData);
    setBadges(badgesData || []);
    setProgress(progressData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Hikaye Bahçem</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Merhaba, {profile?.full_name}!</span>
            <Button variant="secondary" size="sm" onClick={() => signOut()}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <BookOpen size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Okuma Zamanı</h3>
            <p className="mb-4">Hikayeler arasında gezin</p>
            <div className="bg-white/20 rounded-lg p-2">
              <p className="text-sm">Seviye: {profile?.reading_level || 1}</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-green-500 to-green-600 text-white">
            <Zap size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Dikkat Oyunları</h3>
            <p className="mb-4">Isınma aktiviteleri</p>
            <div className="bg-white/20 rounded-lg p-2">
              <p className="text-sm">Bugün: 0/3</p>
            </div>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <Trophy size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Rozetlerim</h3>
            <p className="mb-4">Kazandığın ödüller</p>
            <div className="bg-white/20 rounded-lg p-2">
              <p className="text-sm">{badges.length} rozet</p>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Rozetlerim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((userBadge) => (
              <Badge
                key={userBadge.id}
                name={userBadge.badges.name}
                description={userBadge.badges.description}
                icon={userBadge.badges.icon}
                earned={true}
                size="md"
              />
            ))}
          </div>
          {badges.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Henüz rozet kazanmadın. Hadi okumaya başla!
            </p>
          )}
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Settings className="text-gray-600" />
            İlerlemem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                {progress?.total_sessions || 0}
              </p>
              <p className="text-gray-600">Toplam Oturum</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {progress?.total_words_read || 0}
              </p>
              <p className="text-gray-600">Okunan Kelime</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600">
                {progress?.current_streak_days || 0}
              </p>
              <p className="text-gray-600">Günlük Seri</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
