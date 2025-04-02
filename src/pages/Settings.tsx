
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { ApiKeys, User } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Settings = () => {
  const { apiKeys, setApiKeys, user, setUser } = useApp();
  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini || '');
  const [firebaseConfig, setFirebaseConfig] = useState(
    apiKeys.firebase ? JSON.stringify(apiKeys.firebase, null, 2) : ''
  );
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const { toast } = useToast();

  const saveApiKeys = () => {
    let parsedFirebaseConfig = null;
    
    if (firebaseConfig.trim()) {
      try {
        parsedFirebaseConfig = JSON.parse(firebaseConfig);
      } catch (error) {
        toast({
          title: 'Invalid JSON',
          description: 'Please check your Firebase configuration format.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setApiKeys({
      gemini: geminiKey,
      firebase: parsedFirebaseConfig,
    });
    
    toast({
      title: 'Settings saved',
      description: 'Your API keys have been updated.',
    });
  };

  const createGuestUser = () => {
    if (!name) {
      toast({
        title: 'Name required',
        description: 'Please enter your name to continue.',
        variant: 'destructive',
      });
      return;
    }
    
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      name,
      email: email || `guest-${Date.now()}@example.com`,
      isGuest: true,
    };
    
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
    
    toast({
      title: 'Guest account created',
      description: `Welcome, ${name}! You're now using Priority Panda as a guest.`,
    });
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                type="email"
              />
            </div>
            
            {user ? (
              <Button onClick={logoutUser} variant="destructive">
                Logout
              </Button>
            ) : (
              <Button onClick={createGuestUser}>
                Continue as Guest
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure API keys for AI features and backend integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="geminiKey">Gemini API Key</Label>
              <Input
                id="geminiKey"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                type="password"
              />
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="firebase">
                <AccordionTrigger>Firebase Configuration</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Enter your Firebase config JSON object:
                    </p>
                    <textarea
                      value={firebaseConfig}
                      onChange={(e) => setFirebaseConfig(e.target.value)}
                      placeholder='{ "apiKey": "...", "authDomain": "...", "projectId": "..." }'
                      rows={8}
                      className="w-full p-2 border rounded-md font-mono text-sm"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button onClick={saveApiKeys}>Save API Settings</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
