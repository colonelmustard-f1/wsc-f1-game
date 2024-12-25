import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PredictionForm = ({ users, drivers, currentRace, onSubmit }) => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState('');
  const [predictions, setPredictions] = useState({
    p10: '',
    dnf: '',
    sprintP8: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get driver names for confirmation message
    const p10Driver = drivers.find(d => d.id === predictions.p10)?.name;
    const dnfDriver = drivers.find(d => d.id === predictions.dnf)?.name;
    const sprintDriver = drivers.find(d => d.id === predictions.sprintP8)?.name;
    
    onSubmit({
      userId: selectedUser,
      ...predictions,
      raceId: currentRace.id,
      timestamp: new Date().toISOString()
    });

    // Show confirmation toast
    toast({
      title: "Predictions Submitted!",
      description: `P10: ${p10Driver}
                   DNF: ${dnfDriver}
                   ${currentRace.isSprint ? `Sprint P8: ${sprintDriver}` : ''}`,
      duration: 5000
    });

    // Reset form
    setPredictions({ p10: '', dnf: '', sprintP8: '' });
    setSelectedUser('');
  };

  // If no current race, show message
  if (!currentRace) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No active race available for predictions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{currentRace.name} - Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <label className="font-medium">Select Your Name</label>
            <Select 
              value={selectedUser} 
              onValueChange={setSelectedUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose player..." />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* P10 Prediction */}
          <div className="space-y-2">
            <label className="font-medium">P10 Prediction</label>
            <Select 
              value={predictions.p10}
              onValueChange={(value) => setPredictions(prev => ({...prev, p10: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select driver..." />
              </SelectTrigger>
              <SelectContent>
                {drivers.map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name} ({driver.team})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DNF Prediction */}
          <div className="space-y-2">
            <label className="font-medium">First DNF Prediction</label>
            <Select 
              value={predictions.dnf}
              onValueChange={(value) => setPredictions(prev => ({...prev, dnf: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select driver..." />
              </SelectTrigger>
              <SelectContent>
                {drivers.map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name} ({driver.team})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sprint P8 Prediction (only for sprint weekends) */}
          {currentRace.isSprint && (
            <div className="space-y-2">
              <label className="font-medium">Sprint P8 Prediction</label>
              <Select 
                value={predictions.sprintP8}
                onValueChange={(value) => setPredictions(prev => ({...prev, sprintP8: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select driver..." />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map(driver => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} ({driver.team})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={!selectedUser || !predictions.p10 || !predictions.dnf || 
              (currentRace.isSprint && !predictions.sprintP8)}
          >
            Submit Predictions
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
