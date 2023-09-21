import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";

function App() {
  const [generatedNumber, setGeneratedNumber] = useState([]);
  const [queue, setQueue] = useState([[], [], [], []]);
  const [currentQueue, setCurrentQueue] = useState(1);

  /* Getting of task number */
  const getNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    const highPriority = Math.random() < 0.25;

    const newNum = { number: num, duration: num, highPriority: highPriority };
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
    }
  };

  return (
    <div className="App">
      <div className="generate-task">
        <h2>Task Queue</h2>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button variant="contained" onClick={() => getNumber(1, 100)}>
            Get Task
          </Button>
          <Button variant="outlined" onClick={admitNumberToQueue}>
            Admit Number
          </Button>
        </ButtonGroup>

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
