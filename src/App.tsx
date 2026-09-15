import React, { useState } from 'react';
import { AppStage } from './types';
import { SecretIntroModal } from './components/SecretIntroModal';
import { Envelope3DScene } from './components/Envelope3DScene';
import { Letter3DBookViewer } from './components/Letter3DBookViewer';
import { EndingScene } from './components/EndingScene';
import { ParticleCanvas } from './components/ParticleCanvas';
import { AudioPlayer } from './components/AudioPlayer';

export default function App() {
  const [stage, setStage] = useState<AppStage>('intro');

  return (
    <div className="relative min-h-screen w-full bg-stone-950 text-stone-100 overflow-x-hidden font-sans select-none">
      {/* Persistent Floating Particles & Ambient Rose Petals */}
      <ParticleCanvas />

      {/* Floating Audio Music Toggle */}
      <AudioPlayer />

      {/* FLOW STAGES */}
      {stage === 'intro' && (
        <SecretIntroModal
          onStartSecret={() => setStage('envelope_3d')}
        />
      )}

      {stage === 'envelope_3d' && (
        <Envelope3DScene
          onEnvelopeOpened={() => setStage('letter_viewer')}
        />
      )}

      {stage === 'letter_viewer' && (
        <Letter3DBookViewer
          onCompleteLetter={() => setStage('ending')}
          onReturnToEnvelope={() => setStage('envelope_3d')}
        />
      )}

      {stage === 'ending' && (
        <EndingScene
          onRestart={() => setStage('letter_viewer')}
        />
      )}
    </div>
  );
}
