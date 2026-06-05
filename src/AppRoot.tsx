import React, {useEffect, useState} from 'react';
import {AppNavigator} from './navigation/AppNavigator';
import {OnboardingScreen} from './screens/OnboardingScreen';
import {SplashScreen} from './screens/SplashScreen';
import {loadOnboardingComplete, saveOnboardingComplete} from './storage/persistence';

type Stage = 'splash' | 'onboarding' | 'app';

export function AppRoot(): React.JSX.Element {
  const [stage, setStage] = useState<Stage>('splash');
  const [loaded, setLoaded] = useState(false);
  const [splashElapsed, setSplashElapsed] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let alive = true;

    loadOnboardingComplete().then(value => {
      if (alive) {
        setOnboardingComplete(value);
        setLoaded(true);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSplashElapsed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded && splashElapsed && stage === 'splash') {
      setStage(onboardingComplete ? 'app' : 'onboarding');
    }
  }, [loaded, onboardingComplete, splashElapsed, stage]);

  async function finishOnboarding() {
    await saveOnboardingComplete();
    setOnboardingComplete(true);
    setStage('app');
  }

  if (stage === 'splash') {
    return <SplashScreen />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen onComplete={finishOnboarding} />;
  }

  return <AppNavigator />;
}
