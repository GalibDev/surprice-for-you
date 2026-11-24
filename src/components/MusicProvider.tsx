'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { content } from '@/data/content';

const SONG_START_SECONDS = 45;

const MusicContext = createContext({ playing: false, mediaError: '', volume: 0.5, setVolume: (_value: number) => {}, toggleMusic: () => {}, pauseMusic: () => {} });
export const useMusic = () => useContext(MusicContext);

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const autoStartAllowed = useRef(true);
  const pauseMusic = () => { autoStartAllowed.current = false; audio.current?.pause(); setNeedsTap(false); };
  const [playing, setPlaying] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [needsTap, setNeedsTap] = useState(false);
  const [volume, updateVolume] = useState(0.5);
  const setVolume = (value: number) => {
    updateVolume(value);
    try { localStorage.setItem('love-volume', JSON.stringify(value)); } catch {}
  };

  useEffect(() => {
    const player = audio.current!;
    try {
      const saved = JSON.parse(localStorage.getItem('love-volume') || '0.5');
      if (typeof saved === 'number' && Number.isFinite(saved)) {
        player.volume = Math.min(1, Math.max(0, saved));
        updateVolume(player.volume);
      }
    } catch {}
    let waitingForGesture = true;
    const removeListeners = () => {
      document.removeEventListener('click', retry);
      document.removeEventListener('keydown', retry);
    };
    const attempt = () => {
      if (!autoStartAllowed.current) return;
      void player.play().then(() => {
        waitingForGesture = false;
        setMediaError('');
        setNeedsTap(false);
        removeListeners();
      }).catch(() => setNeedsTap(true));
    };
    const retry = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('[data-music-control]')) return;
      if (waitingForGesture) attempt();
    };
    document.addEventListener('click', retry);
    document.addEventListener('keydown', retry);
    player.addEventListener('playing', removeListeners);
    attempt();
    return () => { removeListeners(); player.removeEventListener('playing', removeListeners); };
  }, []);

  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume]);

  const toggleMusic = () => {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) player.pause();
    else {
      if (player.volume === 0) { player.volume = 0.5; setVolume(0.5); }
      void player.play().then(() => { setMediaError(''); setNeedsTap(false); }).catch(() => { setNeedsTap(true); setMediaError('Tap Play our song to try again.'); });
    }
  };

  return <MusicContext.Provider value={{ playing, mediaError, volume, setVolume, toggleMusic, pauseMusic }}>
    <audio ref={audio} src={`${content.music.src}#t=${SONG_START_SECONDS}`} autoPlay preload="auto"
      onLoadedMetadata={event => { event.currentTarget.currentTime = SONG_START_SECONDS; }}
      onPlay={event => {
        if (event.currentTarget.currentTime < SONG_START_SECONDS) event.currentTarget.currentTime = SONG_START_SECONDS;
        setPlaying(true); setNeedsTap(false);
      }}
      onEnded={event => {
        const player = event.currentTarget;
        player.currentTime = SONG_START_SECONDS;
        void player.play().catch(() => { setPlaying(false); setNeedsTap(true); });
      }}
      onPause={() => setPlaying(false)} onError={() => setMediaError('Our song could not load. Please try again.')} />
    {needsTap && !playing && <button className="music-start-banner" data-music-control onClick={toggleMusic}>♫ Play our song <span>Tere Sang Yaara · Tap to turn on music</span></button>}
    {children}
  </MusicContext.Provider>;
}
