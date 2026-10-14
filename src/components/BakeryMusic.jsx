import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Disc3, Radio } from 'lucide-react';

/**
 * BakeryMusic - Cozy Seaside Lo-Fi Bakery Radio
 * Uses Web Audio API for an instant, offline, zero-dependency soothing ambient piano & music box
 * inspired by Kiki's Bakery & coastal seaside afternoons.
 */
export default function BakeryMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35); // Gentle background level
  const audioCtxRef = useRef(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef(null);

  // Notes frequencies (Hz) for a warm, cozy Ghibli-style acoustic chord progression
  // Progression: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 -> Em7
  const chords = [
    // Cmaj7 (C4, E4, G4, B4)
    [261.63, 329.63, 392.00, 493.88],
    // Am9 (A3, C4, E4, B4)
    [220.00, 261.63, 329.63, 493.88],
    // Fmaj7 (F3, A3, C4, E4)
    [174.61, 220.00, 261.63, 329.63],
    // Gadd9 (G3, B3, D4, A4)
    [196.00, 246.94, 293.66, 440.00],
    // Em7 (E3, G3, B3, D4)
    [164.81, 196.00, 246.94, 293.66],
  ];

  const melodyNotes = [
    523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 493.88,
    440.00, 523.25, 659.25, 587.33, 523.25, 392.00, 440.00, 493.88
  ];

  let chordIndex = 0;
  let melodyIndex = 0;

  const playTone = (freq, startTime, duration, type = 'sine', gainVal = 0.08) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm soft bell / felt piano envelope
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainVal * volume, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  };

  const scheduleNextBeats = () => {
    if (!isPlayingRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Play chord harmony
    const chord = chords[chordIndex % chords.length];
    chord.forEach((freq, idx) => {
      // Gentle arpeggio stagger
      playTone(freq, now + idx * 0.12, 2.8, 'triangle', 0.05);
    });

    // Play sparkling melody note
    const melFreq = melodyNotes[melodyIndex % melodyNotes.length];
    playTone(melFreq, now + 0.25, 1.2, 'sine', 0.07);
    playTone(melodyNotes[(melodyIndex + 2) % melodyNotes.length], now + 0.8, 1.0, 'sine', 0.06);

    chordIndex++;
    melodyIndex = (melodyIndex + 2) % melodyNotes.length;

    // Schedule next bar (every 2.2 seconds)
    timerRef.current = setTimeout(scheduleNextBeats, 2200);
  };

  const togglePlay = async () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }

    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      scheduleNextBeats();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="bakery-music-player">
      <div className={`music-card card ${isPlaying ? 'playing' : ''}`}>
        <button
          className="music-toggle-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause background music' : 'Play cozy bakery background music'}
          title={isPlaying ? 'Pause Bakery Radio' : 'Play Cozy Bakery BGM (Seaside Lo-Fi)'}
        >
          <div className="music-disc-wrap">
            <Disc3 size={20} className={`music-disc-icon ${isPlaying ? 'spinning' : ''}`} />
          </div>
          <div className="music-info-text hide-sm">
            <span className="music-label">Bakery BGM</span>
            <span className="music-track-title">{isPlaying ? 'Seaside Afternoon 🎶' : 'Click to Play ☕'}</span>
          </div>
          <div className="music-action-icon">
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </div>
        </button>

        {isPlaying && (
          <div className="music-volume-slider-wrap hide-sm">
            <Volume2 size={14} className="muted" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume slider"
              className="volume-slider"
            />
          </div>
        )}
      </div>
    </div>
  );
}
