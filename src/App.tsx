import { useEffect, useRef, useState } from "react";
import "./App.css";
import { participants } from "./participant";

function App() {
  const [rep, setRep] = useState<string>(participants[0]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }
  }, []);

  const playTickSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime); // 더 작게 조정
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  };

  const onClick = () => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    const totalIterations = 30;
    const startInterval = 80;
    const endInterval = 600;

    let currentIteration = 0;

    const runIteration = () => {
      if (currentIteration >= totalIterations) return;

      const progress = currentIteration / totalIterations;
      const currentInterval =
        startInterval + (endInterval - startInterval) * Math.pow(progress, 2);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        playTickSound(); // 이 시점에 사운드 실행
        setRep(participants[randomIndex]);
        currentIteration++;
        runIteration();
      }, currentInterval);
    };

    runIteration();
  };

  return (
    <div className="page-container">
      <button onClick={onClick} className="rep-container">
        <h1>{rep}</h1>
      </button>
      <div className="button-container">
        <img src="/logo.svg" alt="logo" />
      </div>
    </div>
  );
}

export default App;
