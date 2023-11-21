import { useState, useEffect } from 'react';
import AlarmSound from "./assets/AlarmSound.mp3";
import './App.css';
import { DisplayState } from './helpers';
import TimeSetter from './TimeSetter';
import Display from './Display';

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setbreakTime] = useState(defaultBreakTime);
  const [sessionTime, setsessionTime] = useState(defaultSessionTime);
  const [displayState, setdisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  });

  useEffect(() =>  {
    let timerID: number;
    if (!displayState.timerRunning) return;

    if (displayState.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerID);
    };
  }, [displayState.timerRunning]);

  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2;
      audio.play().catch((err) => console.log(err));
      setdisplayState((prev) => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime,
      }));
    }
  }, [displayState, breakTime, sessionTime]);

  const reset = () => {
    setbreakTime(defaultBreakTime);
    setsessionTime(defaultSessionTime);
    setdisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timerRunning: false,
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  };

  const startStop = () => {
    setdisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning,
    }));
  };

  const changeBreakTime = (time: number) => {
    if (displayState.timerRunning) return;
    setbreakTime(time);
  };

  const decrementDisplay = () => {
    setdisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  };

  const changeSessionTime = (time: number) => {
    if (displayState.timerRunning) return;
    setsessionTime(time);
    setdisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false,
    });
  }

  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Break Length</h4>
          <TimeSetter 
            time = {breakTime}
            setTime = {changeBreakTime}
            min = {min}
            max = {max}
            interval = {interval}
            type = "break"
          />
        </div>
        <div className="session">
          <h4 id="session-label">Session Length</h4>
          <TimeSetter 
            time = {sessionTime}
            setTime = {changeSessionTime}
            min = {min}
            max = {max}
            interval = {interval}
            type = "session"
          />
        </div>
      </div>
      <Display 
        displayState={displayState}
        reset={reset}
        startStop={startStop}
      />
      <audio id="beep" src={AlarmSound} />
    </div>
  )
}

export default App
