import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserSettingsProvider } from './contexts/UserSettingsContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { AssessmentPage } from './pages/AssessmentPage';
import { DashboardPage } from './pages/DashboardPage';
import { supabase } from './lib/supabase';
import { BookOpen } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [hasAssessment, setHasAssessment] = useState(false);
  const [checkingAssessment, setCheckingAssessment] = useState(true);

  useEffect(() => {
    if (user) {
      checkAssessment();
    } else {
      setCheckingAssessment(false);
    }
  }, [user]);

  const checkAssessment = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('assessments')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    setHasAssessment(!!data);
    setCheckingAssessment(false);
  };

  if (loading || checkingAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-6 shadow-xl">
                <BookOpen size={64} className="text-blue-500" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Hikaye Bahçem
            </h1>
            <p className="text-xl text-gray-600">
              Okuma Yolculuğuna Hoş Geldin
            </p>
          </div>

          {authMode === 'login' ? (
            <LoginForm onToggleMode={() => setAuthMode('signup')} />
          ) : (
            <SignupForm onToggleMode={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  if (!hasAssessment) {
    return <AssessmentPage onComplete={() => setHasAssessment(true)} />;
  }

  return <DashboardPage />;
}

function App() {
  return (
    <AuthProvider>
      <UserSettingsProvider>
        <AppContent />
      </UserSettingsProvider>
    </AuthProvider>
  );
}

export default App;
