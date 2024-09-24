import { useEffect, useRef, useState } from "react";
import timerSvg from "../../assets/timer.svg";

export default function Timer({ isFirstClick, stopTimer }) {
  let interval = useRef();
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    if (!isFirstClick) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 999) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    if (stopTimer) {
      clearInterval(interval);
      setTimer(0);
    }
    return () => {
      setTimer(0);
      clearInterval(interval);
    };
  }, [isFirstClick, stopTimer]);
  return (
    <div className="flex items-center mr-4">
      <img src={timerSvg} className="icon mr-2" />
      {timer}
    </div>
  );
}
