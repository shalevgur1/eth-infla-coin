import React, { useState, useEffect } from 'react';

function Clock({ startTime = 0, countdown = false, isHidden=false }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(startTime);
    const intervalId = setInterval(() => {
        setTime(prevTime => {
            // For countdown, ensure it doesn't go below zero
            if (countdown) {
              return Math.max(prevTime - 1, 0); // Don't go below 0
            } else {
              return prevTime + 1; // Increment time
            }
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
