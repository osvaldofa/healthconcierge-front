import { useRef, useState } from 'react';
import audioBufferToWav from 'audiobuffer-to-wav';

async function convertToWav(blob: Blob): Promise<File> {
  const audioCtx = new AudioContext();
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const wavBuffer = audioBufferToWav(audioBuffer);
  await audioCtx.close();
  return new File([wavBuffer], 'audio.wav', { type: 'audio/wav' });
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';
    const recorder = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        reject(new Error('Nenhuma gravação em andamento'));
        return;
      }

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
          const wavFile = await convertToWav(blob);
          recorder.stream.getTracks().forEach((t) => t.stop());
          resolve(wavFile);
        } catch (err) {
          reject(err);
        }
      };

      recorder.stop();
      setIsRecording(false);
    });
  };

  return { isRecording, startRecording, stopRecording };
}
