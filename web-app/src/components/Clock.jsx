import React, { useState, useEffect } from 'react';

function Clock({ startTime = 0, countdown = false, isHidden=false, onTimerEnd }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(startTime);
    const intervalId = setInterval(() => {
        setTime(prevTime => {
            if (countdown) {
              const newTime = prevTime - 1;
              // Check if timer got to 0 or the timer should be hidden (when Repay is pressed)
              if (newTime === 0 && startTime != 0) {
                clearInterval(intervalId);
                // Call the timer end callback if defined
                onTimerEnd && onTimerEnd();
                return 0;
              }
              return newTime;
            }
            return prevTime + 1;
          });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [countdown, startTime]);

  const formatTime = seconds => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="clock-container">
      <div className="clock" hidden={isHidden}>
        {formatTime(time)}
      </div>
    </div>
  );
}

export default Clock;
