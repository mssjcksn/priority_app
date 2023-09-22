import "./App.css";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";

function App() {
  const [generatedNumber, setGeneratedNumber] = useState([]);
  const [queue, setQueue] = useState([[], [], [], []]);
  const [currentQueue, setCurrentQueue] = useState(1);
  const [countdown, setCountdown] = useState(false);

  /* Getting of task number */
  const getNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    const highPriority = Math.random() < 0.25;

    const newNum = {
      number: num,
      duration: num,
      highPriority: highPriority,
    };
    setGeneratedNumber((previousNum) => [...previousNum, newNum]);
  };

  /* Admitting number to queue */
  const admitNumberToQueue = () => {
    const generatedNum = generatedNumber[0];

    if (generatedNum) {
      if (generatedNum.highPriority) {
        setQueue((previousQueue) => {
          const newQueue = [...previousQueue];
          newQueue[0].push(generatedNum);
          return newQueue;
        });
      } else {
        setQueue((previousQueue) => {
          const newQueue = [...previousQueue];
          newQueue[currentQueue].push(generatedNum);
          return newQueue;
        });
        setCurrentQueue((prevQueue) => (prevQueue % 3) + 1);
      }

      setGeneratedNumber((previousNum) => previousNum.slice(1));
      setCountdown(true);
    }
  };

  const numberDuration = () => {
    if (countdown) {
      setQueue((previousQueue) => {
        const newQueue = previousQueue.map((queueNumbers) =>
          queueNumbers.map((numberObj) => {
            if (numberObj.duration > 0) {
              return { ...numberObj, duration: numberObj.duration - 1 };
            }
            return numberObj;
          })
        );

        return newQueue.map((queueNumbers) =>
          queueNumbers.filter((numberObj) => numberObj.duration > 0)
        );
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(numberDuration, 100);
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="App">
      <div className="generate-task">
        <h2>Task Queue</h2>
        <div className="center-button">
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button variant="contained" onClick={() => getNumber(1, 100)}>
              Get Task
            </Button>
            <Button
              variant="outlined"
              style={{ backgroundColor: "white" }}
              onClick={admitNumberToQueue}
            >
              Admit Number
            </Button>
          </ButtonGroup>
        </div>
        {generatedNumber.length > 0 && (
          <div>
            {generatedNumber.map((generatedNumber, index) => (
              <div
                key={index}
                className="number-box"
                style={{
                  width: `${generatedNumber.number.toString().length * 15}px`,
                  color: generatedNumber.highPriority ? "red" : "black",
                }}
              >
                {generatedNumber.number}
              </div>
            ))}
          </div>
        )}
      </div>

      <Container fixed>
        {queue.map((queueNumbers, queueIndex) => (
          <div className="queue-box" key={queueIndex}>
            <h3>
              {queueIndex === 0
                ? "Priority Queue"
                : `Regular Queue ${queueIndex}`}
            </h3>
            <LinearProgress
              variant="determinate"
              value={
                (queueNumbers.reduce(
                  (totalDuration, numberObj) =>
                    totalDuration + numberObj.duration,
                  0
                ) /
                  1000) *
                100
              }
              sx={{ marginTop: 1, height: "10px" }}
            />
            <div>
              {queueNumbers.map((numberObj, index) => (
                <div
                  key={index}
                  className="number-box"
                  style={{
                    width: `${numberObj.number.toString().length * 15}px`,
                  }}
                >
                  {numberObj.number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}

export default App;
