export interface Driver {
    id: string;
    name: string;
    number: number;
    team: string;
    isActive: boolean;
}

export interface RawRaceResult {
    position: number;
    number: string;
    driver: string;
    team: string;
    laps: number;
    timeOrRetired: string;
    points: number;
}

export interface ProcessedRaceResult {
    raceId: string;
    isSprintRace: boolean;
    finalPositions: { [driverId: string]: number };
    dnfDrivers: {
        [driverId: string]: {
            lap: number;
            reason: string;
        };
    };
    manualAdjustments?: {
        timestamp: number;
        adminId: string;
        type: 'DISQUALIFICATION' | 'POSITION_CHANGE' | 'RACE_CANCELLATION';
        description: string;
        originalValue: any;
        newValue: any;
    }[];
}
