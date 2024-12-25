// src/components/PredictionForm/PredictionForm.js
'use client'

import React, { useState } from 'react';

const PredictionForm = ({ users, drivers, races, onSubmit }) => {  // Changed to accept races prop
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRace, setSelectedRace] = useState('');  // New state for race selection
  const [predictions, setPredictions] = useState({
    p10: '',
    dnf: '',
    sprintP8: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const race = races.find(r => r.id === selectedRace);
    onSubmit({
      userId: selectedUser,
      ...predictions,
      raceId: selectedRace,
      timestamp: new Date().toISOString()
    });
    // Reset form
    setPredictions({ p10: '', dnf: '', sprintP8: '' });
    setSelectedUser('');
    setSelectedRace('');
  };

  // Get selected race details
  const selectedRaceDetails = races.find(r => r.id === selectedRace);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Predictions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Race Selection */}
        <div>
          <label className="block font-medium mb-1">Select Race</label>
          <select 
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose race...</option>
            {races.map(race => (
              <option key={race.id} value={race.id}>
                {race.name}
              </option>
            ))}
          </select>
        </div>

        {/* User Selection */}
        <div>
          <label className="block font-medium mb-1">Select Your Name</label>
          <select 
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose player...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRace && (  // Only show prediction fields if a race is selected
          <>
            {/* P10 Prediction */}
            <div>
              <label className="block font-medium mb-1">P10 Prediction</label>
              <select 
                value={predictions.p10}
                onChange={(e) => setPredictions(prev => ({...prev, p10: e.target.value}))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select driver...</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.team})
                  </option>
                ))}
              </select>
            </div>

            {/* DNF Prediction */}
            <div>
              <label className="block font-medium mb-1">First DNF Prediction</label>
              <select 
                value={predictions.dnf}
                onChange={(e) => setPredictions(prev => ({...prev, dnf: e.target.value}))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select driver...</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.team})
                  </option>
                ))}
              </select>
            </div>

            {/* Sprint P8 Prediction (only for sprint weekends) */}
            {selectedRaceDetails?.isSprint && (
              <div>
                <label className="block font-medium mb-1">Sprint P8 Prediction</label>
                <select 
                  value={predictions.sprintP8}
                  onChange={(e) => setPredictions(prev => ({...prev, sprintP8: e.target.value}))}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select driver...</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.team})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
          disabled={!selectedUser || !selectedRace || !predictions.p10 || !predictions.dnf || 
            (selectedRaceDetails?.isSprint && !predictions.sprintP8)}
        >
          Submit Predictions
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
