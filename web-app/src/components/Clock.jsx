import React, { useState, useEffect } from 'react';

function Clock({ startTime = 0, isHidden=false, onTimerEnd }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(startTime);
    console.log(time);
    const intervalId = setInterval(() => {
        setTime(prevTime => {
            const newTime = prevTime - 1;
            // Check if timer got to 0 or the timer should be hidden (when Repay is pressed)
            if ((newTime === 0 && startTime != 0) && !isHidden) {
              clearInterval(intervalId);
              // Call the timer end callback if defined
              onTimerEnd && onTimerEnd();
              return 0;
            } else if (isHidden) {
              clearInterval(intervalId);
            }
            return newTime;
          });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [startTime, isHidden]);

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
