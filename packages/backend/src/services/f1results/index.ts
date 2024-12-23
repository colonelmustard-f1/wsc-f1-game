import { JSDOM } from 'jsdom';
import { ProcessedRaceResult, RawRaceResult } from '../../types';
import { driverMapping } from '../../utils/driverMapping';

export class F1ResultsService {
  private static instance: F1ResultsService;
  
  private constructor() {}

  static getInstance(): F1ResultsService {
    if (!F1ResultsService.instance) {
      F1ResultsService.instance = new F1ResultsService();
    }
    return F1ResultsService.instance;
  }

  async fetchResults(url: string): Promise<ProcessedRaceResult> {
    const html = await this.fetchRawHtml(url);
    const rawResults = this.parseHtml(html);
    return this.processResults(rawResults, url);
  }

  private async fetchRawHtml(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch results: ${response.status}`);
    }
    return response.text();
  }

  private parseHtml(html: string): RawRaceResult[] {
    const dom = new JSDOM(html);
    const rows = Array.from(dom.window.document.querySelectorAll('table.resultsarchive-table tbody tr'));
    
    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      return {
        position: parseInt(cells[0].textContent?.trim() || '0'),
        number: cells[1].textContent?.trim() || '',
        driver: cells[2].textContent?.trim() || '',
        team: cells[3].textContent?.trim() || '',
        laps: parseInt(cells[4].textContent?.trim() || '0'),
        timeOrRetired: cells[5].textContent?.trim() || '',
        points: parseInt(cells[6].textContent?.trim() || '0')
      };
    });
  }

  private processResults(rawResults: RawRaceResult[], url: string): ProcessedRaceResult {
    const isSprintRace = url.includes('sprint-results');
    const finalPositions: { [driverId: string]: number } = {};
    const dnfDrivers: {
      [driverId: string]: {
        lap: number;
        reason: string;
      };
    } = {};

    rawResults.forEach(result => {
      const driverId = driverMapping.getDriverId(result.driver);
      
      if (result.timeOrRetired.includes('DNF')) {
        dnfDrivers[driverId] = {
          lap: result.laps,
          reason: 'DNF'
        };
      } else {
        finalPositions[driverId] = result.position;
      }
    });

    return {
      raceId: this.extractRaceId(url),
      isSprintRace,
      finalPositions,
      dnfDrivers,
      manualAdjustments: []
    };
  }

  private extractRaceId(url: string): string {
    const matches = url.match(/races\/(\d+)\/([^/]+)/);
    if (!matches) throw new Error('Invalid race URL format');
    return `${matches[1]}-${matches[2]}`;
  }
}
