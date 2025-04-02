
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TaskForm from '@/components/tasks/TaskForm';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AddTask = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSuccess = () => {
    navigate('/tasks');
  };

  const handleAIAssist = (type: 'voice' | 'image' | 'text') => {
    toast({
      title: "Coming Soon!",
      description: `AI ${type} recognition will be available in the next update.`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Add New Task</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Task Capture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleAIAssist('voice')}
              >
                <Mic className="h-8 w-8 mb-2" />
                <span>Voice</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleAIAssist('image')}
              >
                <Camera className="h-8 w-8 mb-2" />
                <span>Image</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => handleAIAssist('text')}
              >
                <FileText className="h-8 w-8 mb-2" />
                <span>Text</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AddTask;
