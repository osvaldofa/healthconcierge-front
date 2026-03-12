'use client';

import { useState } from 'react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

type VoiceState = 'idle' | 'recording' | 'processing';

interface VoiceButtonProps {
  onVoiceFile: (file: File) => void;
  disabled: boolean;
}

export function VoiceButton({ onVoiceFile, disabled }: VoiceButtonProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [error, setError] = useState('');
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();

  const handleClick = async () => {
    if (voiceState === 'processing' || disabled) return;

    if (!isRecording) {
      setError('');
      try {
        await startRecording();
        setVoiceState('recording');
      } catch (err) {
        const domErr = err as DOMException;
        if (domErr.name === 'NotAllowedError' || domErr.name === 'PermissionDeniedError') {
          setError('Permissão de microfone negada. Permita o acesso nas configurações do browser.');
        } else {
          setError('Não foi possível acessar o microfone.');
        }
      }
    } else {
      setVoiceState('processing');
      try {
        const wavFile = await stopRecording();
        onVoiceFile(wavFile);
      } catch {
        setError('Erro ao processar o áudio. Tente novamente.');
      } finally {
        setVoiceState('idle');
      }
    }
  };

  const isDisabled = disabled || voiceState === 'processing';

  const buttonStyles = {
    idle: 'bg-blue-700 hover:bg-blue-800 text-white',
    recording: 'bg-red-500 hover:bg-red-600 text-white animate-pulse',
    processing: 'bg-gray-400 text-white cursor-not-allowed',
  };

  const icons = {
    idle: '🎤',
    recording: '⏹',
    processing: '⏳',
  };

  const labels = {
    idle: 'Gravar voz',
    recording: 'Parar gravação',
    processing: 'Processando...',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={labels[voiceState]}
        title={labels[voiceState]}
        className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-colors disabled:opacity-50 ${
          buttonStyles[voiceState]
        }`}
      >
        {icons[voiceState]}
      </button>
      {error && (
        <p className="text-red-500 text-xs max-w-[120px] text-center leading-tight">{error}</p>
      )}
    </div>
  );
}
