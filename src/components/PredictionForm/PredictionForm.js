// src/app/page.js
'use client'

import React, { useState, useEffect } from 'react';
import PredictionForm from '@/components/PredictionForm/PredictionForm';
import LeaderboardTable from '@/components/LeaderboardTable/LeaderboardTable';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [races, setRaces] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    // Load data from JSON files in public/data
    const loadData = async () => {
      try {
        const [usersData, driversData, racesData, predictionsData, resultsData] = await Promise.all([
          fetch('/data/users.json'),
          fetch('/data/drivers.json'),
          fetch('/data/races.json'),
          fetch('/data/predictions.json'),
          fetch('/data/results.json'),
        ]);

        setUsers((await usersData.json()).users);
        setDrivers((await driversData.json()).drivers);
        setRaces((await racesData.json()).races);
        setPredictions((await predictionsData.json()).predictions);
        setResults((await resultsData.json()).results);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleSubmitPrediction = (prediction) => {
    setPredictions(prev => ({
      ...prev,
      [prediction.raceId]: {
        ...prev[prediction.raceId],
        [prediction.userId]: {
          p10: prediction.p10,
          dnf: prediction.dnf,
          sprintP8: prediction.sprintP8,
          timestamp: prediction.timestamp
        }
      }
    }));

    // Log the prediction to see what was submitted
    console.log('Submitted prediction:', prediction);
    console.log('Current predictions state:', predictions);
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        WSC F1 2024
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <PredictionForm
            users={users}
            drivers={drivers}
            races={races}
            onSubmit={handleSubmitPrediction}
          />
        </div>
        
        <div>
          <LeaderboardTable
            predictions={predictions}
            results={results}
          />
        </div>
      </div>
    </main>
  );
}
