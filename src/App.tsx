import { useEffect, useRef, useState } from "react";
import "./App.css";
import { participantsList } from "./participant";

function App() {
  const [rep, setRep] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isBridge, setIsBridge] = useState<boolean>(true);

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

    setIsRunning(true);
    setHasRun(true);

    const totalIterations = 30;
    const startInterval = 80;
    const endInterval = 600;

    let currentIteration = 0;

    const runIteration = () => {
      if (currentIteration >= totalIterations) {
        setIsRunning(false);
        return;
      }

      const progress = currentIteration / totalIterations;
      const currentInterval =
        startInterval + (endInterval - startInterval) * Math.pow(progress, 2);

      setTimeout(() => {
        const participants = isBridge
          ? participantsList.bridge
          : participantsList.groom;
        const randomIndex = Math.floor(Math.random() * participants.length);
        playTickSound(); // 이 시점에 사운드 실행
        setRep(participants[randomIndex]);
        currentIteration++;
        runIteration();
      }, currentInterval);
    };

    runIteration();
    setIsBridge(!isBridge);
  };

  return (
    <div className="page-container">
      <div className="page-title">
        <h1>Escort Roulette</h1>
      </div>
      {rep && (
        <div className="name-display centered">
          {isBridge ? (
            <p className="subtitle">新郎のエスコートをお願いします！</p>
          ) : (
            <p className="subtitle">新婦のエスコートをお願いします！</p>
          )}
          <h1>{rep}</h1>
        </div>
      )}
      {!isRunning && !hasRun && (
        <button onClick={onClick} className="start-button centered-button">
          START
        </button>
      )}
      {!isRunning && hasRun && (
        <button onClick={onClick} className="start-button bottom-button">
          RESTART
        </button>
      )}
      <div className="button-container">
        <img src="/logo.svg" alt="logo" />
      </div>
    </div>
  );
}

export default App;
