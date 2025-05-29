import { useState } from "react";
import "./App.css";
import { participants } from "./participant";

function App() {
  const [rep, setRep] = useState<string>(participants[0]);
  const onClick = () => {
    const totalIterations = 50;
    const startInterval = 100;
    const endInterval = 1000;

    let currentIteration = 0;

    const runIteration = () => {
      if (currentIteration >= totalIterations) return;

      const progress = currentIteration / totalIterations;
      const currentInterval =
        startInterval + (endInterval - startInterval) * Math.pow(progress, 2);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
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
    </div>
  );
}

export default App;
