// src/components/PredictionForm/PredictionForm.js
'use client'

import React, { useState } from 'react';

const PredictionForm = ({ users, drivers, currentRace, onSubmit }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [predictions, setPredictions] = useState({
    p10: '',
    dnf: '',
    sprintP8: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      userId: selectedUser,
      ...predictions,
      raceId: currentRace.id,
      timestamp: new Date().toISOString()
    });
    // Reset form
    setPredictions({ p10: '', dnf: '', sprintP8: '' });
    setSelectedUser('');
  };

  // If no current race, show message
  if (!currentRace) {
    return (
      <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
        <p className="text-center text-gray-500">No active race available for predictions</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{currentRace.name} - Predictions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {currentRace.isSprint && (
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

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={!selectedUser || !predictions.p10 || !predictions.dnf || 
            (currentRace.isSprint && !predictions.sprintP8)}
        >
          Submit Predictions
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
