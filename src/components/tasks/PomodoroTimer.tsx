
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

enum TimerMode {
  WORK = 'work',
  BREAK = 'break',
}

const PomodoroTimer: React.FC<{ taskTitle?: string }> = ({ taskTitle }) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.WORK);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [progress, setProgress] = useState(100);
  const { toast } = useToast();

  // Timer durations in seconds
  const workDuration = 25 * 60; // 25 minutes
  const breakDuration = 5 * 60; // 5 minutes

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          const totalDuration = mode === TimerMode.WORK ? workDuration : breakDuration;
          const newProgress = (newTimeLeft / totalDuration) * 100;
          setProgress(newProgress);
          return newTimeLeft;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      const newMode = mode === TimerMode.WORK ? TimerMode.BREAK : TimerMode.WORK;
      const newDuration = newMode === TimerMode.WORK ? workDuration : breakDuration;
      
      setMode(newMode);
      setTimeLeft(newDuration);
      setProgress(100);
      
      toast({
        title: newMode === TimerMode.WORK ? 'Break Time Over!' : 'Work Time Complete!',
        description: newMode === TimerMode.WORK 
          ? 'Time to focus again.' 
          : taskTitle 
            ? `Well done on working on "${taskTitle}"! Take a short break.`
            : "Well done! Take a short break.",
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, toast, taskTitle]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode(TimerMode.WORK);
    setTimeLeft(workDuration);
    setProgress(100);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-center">
          {mode === TimerMode.WORK ? 'Focus Time' : 'Break Time'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {taskTitle && <p className="text-center text-gray-500">{taskTitle}</p>}
        
        <div className="text-4xl font-bold text-center">{formatTime(timeLeft)}</div>
        
        <Progress 
          value={progress} 
          className={`h-2 ${mode === TimerMode.WORK ? 'bg-primary-light' : 'bg-green-200'}`}
          indicatorClassName={`${mode === TimerMode.WORK ? 'bg-primary' : 'bg-green-500'}`}
        />
        
        <div className="flex justify-center space-x-4 mt-4">
          <Button 
            onClick={toggleTimer} 
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button 
            onClick={resetTimer} 
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
