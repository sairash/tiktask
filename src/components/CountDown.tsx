import useTimeStore from "@/store/timeStore";
import { useEffect, useRef } from "react";

const formatTime = (time: number) => {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);

  return (
    <div className="flex gap-4">
      <div className="countdown-value">
        {minutes.toString().padStart(2, "0")}
      </div>
      <div className="seperator">:</div>
      <div className="countdown-value">
        {seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

const CountDownTimer = () => {
  const { timeStamp, ticking, changeState, setTimeStamp } = useTimeStore();
  const countdownTimer = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  function clearCountdown() {
    if (countdownTimer.current !== null) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
  }

  useEffect(() => {
    if (ticking) {
      lastUpdateRef.current = Date.now();
      clearCountdown();

      countdownTimer.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastUpdateRef.current;
        lastUpdateRef.current = now;

        const currentTime = useTimeStore.getState().timeStamp;
        const newTime = currentTime - elapsed;

        if (newTime <= 0) {
          lastUpdateRef.current = Date.now();
          changeState();
        } else {
          setTimeStamp(newTime);
        }
      }, 1000);
    } else {
      clearCountdown();
    }

    return () => {
      clearCountdown();
    };
  }, [ticking, changeState, setTimeStamp]);

  return <div className="">{formatTime(timeStamp)}</div>;
};

export default CountDownTimer;