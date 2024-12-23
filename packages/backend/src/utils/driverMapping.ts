import { Driver } from '../types';

class DriverMapping {
  private static instance: DriverMapping;
  private readonly drivers: Map<string, Driver>;

  private constructor() {
    this.drivers = new Map();
    this.initializeDrivers();
  }

  static getInstance(): DriverMapping {
    if (!DriverMapping.instance) {
      DriverMapping.instance = new DriverMapping();
    }
    return DriverMapping.instance;
  }

  private initializeDrivers() {
    const driversList: Driver[] = [
      { id: 'max-verstappen', name: 'Max Verstappen', number: 1, team: 'Red Bull Racing Honda RBPT', isActive: true },
      { id: 'sergio-perez', name: 'Sergio Perez', number: 11, team: 'Red Bull Racing Honda RBPT', isActive: true },
      { id: 'charles-leclerc', name: 'Charles Leclerc', number: 16, team: 'Ferrari', isActive: true },
      { id: 'carlos-sainz', name: 'Carlos Sainz', number: 55, team: 'Ferrari', isActive: true },
      // Add all other drivers...
    ];

    driversList.forEach(driver => {
      this.drivers.set(driver.name, driver);
    });
  }

  getDriverId(fullName: string): string {
    const driver = this.drivers.get(fullName);
    if (!driver) throw new Error(`Unknown driver: ${fullName}`);
    return driver.id;
  }

  getDriver(fullName: string): Driver {
    const driver = this.drivers.get(fullName);
    if (!driver) throw new Error(`Unknown driver: ${fullName}`);
    return driver;
  }

  getAllDrivers(): Driver[] {
    return Array.from(this.drivers.values());
  }

  getActiveDrivers(): Driver[] {
    return Array.from(this.drivers.values()).filter(driver => driver.isActive);
  }
}

export const driverMapping = DriverMapping.getInstance();
