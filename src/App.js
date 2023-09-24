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

  // Generating of the task number
  const getNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    const highPriority = Math.random() < 0.2;

    // Creates an object with 3 properties: the number itself, the duration
    // (equal to the num itself) and the highPriority (true/false)
    const newNum = {
      number: num,
      duration: num,
      highPriority: highPriority,
    };

    // Updates generatedNumber with the function taking
    // the prev value (if it exists). It adds a new number object to an existing list
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
        //If high priority, it gets added in the first queue 
        //regardless of the duration
        updatedQueue[0].push(generatedNum);
        updatedCountdown[0] = true;
      } else {
        //Creates a new array with the regular queues
        //Calculates the total duration for each queue
        const queueDurations = queue
          .slice(1, 4)
          .map((queueNumbers) =>
            queueNumbers.reduce(
              (totalDuration, numberObj) => totalDuration + numberObj.duration,
              0
            )
          );

        //Takes the index of the queue with the least total duration
        let shortestQueueIndex = queueDurations.indexOf(
          Math.min(...queueDurations)
        );

        //Sorts the number to the queue with the least duration
        updatedQueue[shortestQueueIndex + 1].push(generatedNum);

        //Sets the queue with the tasks needed to be processed
        //True means the queue has tasks, false means empty
        updatedCountdown[shortestQueueIndex + 1] = true;
      }

      //Removes the number from the "Task Queue" after admission
      updatedGeneratedNumber = updatedGeneratedNumber.slice(1);

      //Updates the respective variables
      setQueue(updatedQueue);
      setCountdown(updatedCountdown);
      setGeneratedNumber(updatedGeneratedNumber);
    }
  };

  
  //Responsible for updating the duration of tasks in the queues
  const numberDuration = () => {
    //Copies the arrays of queue and countdown for modification
    //without affecting the original
    let updatedQueue = [...queue];
    let updatedCountdown = [...countdown];

    for (let queueIndex = 0; queueIndex < queue.length; queueIndex++) {
      //Checks the queue through two conditions:
      //1) If queue is active and currently processing
      //2) If queue is empty or not
      if (countdown[queueIndex] && queue[queueIndex].length > 0) {
        //Takes the first number
        const firstNumber = queue[queueIndex][0];

        //Decreases the duration
        if (firstNumber.duration > 0) {
          firstNumber.duration--;
        }

        //Remove first item in array when duration runs out
        if (firstNumber.duration === 0) {
          updatedQueue[queueIndex].shift();
        }

        //Update the state if empty or not
        if (updatedQueue[queueIndex].length === 0) {
          updatedCountdown[queueIndex] = false;
        } else {
          updatedCountdown[queueIndex] = true;
        }
      }
    }

    //Update the arrays after processing
    setQueue(updatedQueue);
    setCountdown(updatedCountdown);
  };

  useEffect(() => {
    //Calls the numberDuration func every 50 milliseconds
    //when countdown changes
    const interval = setInterval(numberDuration, 50);

    //Clears interval when countdown changes 
    //(prevention of memory leaks)
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    //If all queues are empty, set the state to false for all queues.
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
            variant="outlined"
            aria-label="medium secondary button group">
            <Button 
              variant="contained" 
              style={{ 
                color: "#1a1423",
                fontWeight: "bold",
                backgroundColor: "#eacdc2"}}
              onClick={() => getNumber(1, 100)}>
              Get Task
            </Button>

            <Button
              variant="contained"
              style={{ 
                color: "#1a1423",
                fontWeight: "bold",
                backgroundColor: "white"}}
              onClick={admitNumberToQueue}>
              Admit Task
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
        {/* Iterate over the queue array.If it's the first queue, 
        it is labeled as the (high) Priority Queue. If not,
        it is a Regular Queue {x} */}
        {queue.map((queueNumbers, queueIndex) => (
          <div className="queue-box" key={queueIndex}>
            <h3>
              {queueIndex === 0
                ? "Priority Queue"
                : `Regular Queue ${queueIndex}`}
            </h3>
            {/* Value is calculated based on the total duration
            of tasks and dividing it by 1000 to convert into seconds
            then to percentage. */}
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
              {/* Iterate over the numbers objects in the
              queue. Display the individual tasks (numbers)
              in each queue */}
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