import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { calculateStandings } from '@/lib/utils/scoring';

const LeaderboardTable = ({ predictions, results }) => {
  const [expandedUser, setExpandedUser] = useState(null);
  const standings = calculateStandings(predictions, results);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>WSC F1 2024 Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((standing, index) => (
              <React.Fragment key={standing.userId}>
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{standing.userId}</TableCell>
                  <TableCell className="text-right font-bold">{standing.totalPoints}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedUser(expandedUser === standing.userId ? null : standing.userId)}
                    >
                      {expandedUser === standing.userId ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedUser === standing.userId && (
                  <TableRow>
                    <TableCell colSpan={4} className="bg-muted">
                      <div className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Race</TableHead>
                              <TableHead>P10 Points</TableHead>
                              <TableHead>DNF Points</TableHead>
                              <TableHead>Sprint Points</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(standing.races).map(([raceId, points]) => (
                              <TableRow key={raceId}>
                                <TableCell>{raceId}</TableCell>
                                <TableCell>{points.racePoints || 0}</TableCell>
                                <TableCell>{points.dnfPoints || 0}</TableCell>
                                <TableCell>{points.sprintPoints || 0}</TableCell>
                                <TableCell className="text-right">{points.total}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
