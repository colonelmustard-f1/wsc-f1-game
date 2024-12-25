// src/components/LeaderboardTable/LeaderboardTable.js
'use client'

import React, { useState } from 'react';
import { calculateStandings } from '../../lib/utils/scoring';

const LeaderboardTable = ({ predictions, results }) => {
  const [expandedUser, setExpandedUser] = useState(null);
  const standings = calculateStandings(predictions, results);

  return (
    <div className="bg-white rounded shadow">
      <h2 className="text-xl font-bold p-4">WSC F1 2024 Standings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4">Position</th>
              <th className="p-4">Name</th>
              <th className="p-4 text-right">Points</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <React.Fragment key={standing.userId}>
                <tr className="border-t">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{standing.userId}</td>
                  <td className="p-4 text-right font-bold">{standing.totalPoints}</td>
                  <td className="p-4 text-right">
                    <button
                      className="px-2 py-1 text-blue-500 hover:text-blue-700"
                      onClick={() => setExpandedUser(expandedUser === standing.userId ? null : standing.userId)}
                    >
                      {expandedUser === standing.userId ? '▼' : '▶'}
                    </button>
                  </td>
                </tr>
                {expandedUser === standing.userId && (
                  <tr>
                    <td colSpan={4} className="bg-gray-50 p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="p-2 text-left">Race</th>
                            <th className="p-2 text-right">P10 Points</th>
                            <th className="p-2 text-right">DNF Points</th>
                            <th className="p-2 text-right">Sprint Points</th>
                            <th className="p-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(standing.races).map(([raceId, points]) => (
                            <tr key={raceId} className="border-t border-gray-200">
                              <td className="p-2">{raceId}</td>
                              <td className="p-2 text-right">{points.racePoints || 0}</td>
                              <td className="p-2 text-right">{points.dnfPoints || 0}</td>
                              <td className="p-2 text-right">{points.sprintPoints || 0}</td>
                              <td className="p-2 text-right font-bold">{points.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
