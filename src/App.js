import "./App.css";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";

function App() {
  const [generatedNumber, setGeneratedNumber] = useState([]);
  const [queue, setQueue] = useState([[], [], [], []]);
  const [countdown, setCountdown] = useState([false, false, false, false]);

  // Getting of task number
  const getNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    // Generates a random number with in the min-max range
    const num = Math.floor(Math.random() * (max - min + 1)) + min;

    // Generates a boolean value of "high priority" to a number with 20% chance.
    // True -> High priority
    // False -> Regular priority
    const highPriority = Math.random() < 0.2;

    // Creates an object with 3 properties: the number itself, the duration
    // (equal to the num itself) and the highPriority (true/false)
    const newNum = {
      number: num,
      duration: num,
      highPriority: highPriority,
    };

    // Updates generatedNumber with the function taking
    // the prev value. It adds a new number object to an existing list
    setGeneratedNumber((previousNum) => [...previousNum, newNum]);
  };

  // Admitting number to queue
  const admitNumberToQueue = () => {
    //Takes the first number of the list
    const generatedNum = generatedNumber[0];

    //Checks if it is empty or not
    if (generatedNum) {
      let updatedGeneratedNumber = [...generatedNumber];
      let updatedQueue = [...queue];
      let updatedCountdown = [...countdown];

      if (generatedNum.highPriority) {
        updatedQueue[0].push(generatedNum);
        updatedCountdown[0] = true;
      } else {
        const queueDurations = queue
          .slice(1, 4)
          .map((queueNumbers) =>
            queueNumbers.reduce(
              (totalDuration, numberObj) => totalDuration + numberObj.duration,
              0
            )
          );

        let shortestQueueIndex = queueDurations.indexOf(
          Math.min(...queueDurations)
        );

        updatedQueue[shortestQueueIndex + 1].push(generatedNum);
        updatedCountdown[shortestQueueIndex + 1] = true;
      }

      updatedGeneratedNumber = updatedGeneratedNumber.slice(1);

      setQueue(updatedQueue);
      setCountdown(updatedCountdown);
      setGeneratedNumber(updatedGeneratedNumber);
    }
  };

  const numberDuration = () => {
    let updatedQueue = [...queue];
    let updatedCountdown = [...countdown];

    for (let queueIndex = 0; queueIndex < queue.length; queueIndex++) {
      if (countdown[queueIndex] && queue[queueIndex].length > 0) {
        const firstNumber = queue[queueIndex][0];

        if (firstNumber.duration > 0) {
          firstNumber.duration--;
        }

        if (firstNumber.duration === 0) {
          updatedQueue[queueIndex].shift();
        }

        if (updatedQueue[queueIndex].length === 0) {
          updatedCountdown[queueIndex] = false;
        } else {
          updatedCountdown[queueIndex] = true;
        }
      }
    }

    setQueue(updatedQueue);
    setCountdown(updatedCountdown);
  };

  useEffect(() => {
    const interval = setInterval(numberDuration, 50);
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    if (queue.every((queueNumbers) => queueNumbers.length === 0)) {
      setCountdown([false, false, false, false]);
    }
  }, [queue]);

  return (
    <div className="App">
      <div className="generate-task">
        <h2>Task Queue</h2>
        <div className="center-button">
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button variant="contained" onClick={() => getNumber(1, 200)}>
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
              style={{
                backgroundColor: "white",
                marginTop: "1px",
              }}
              classes={{
                bar: "progress-bar-fill",
              }}
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
