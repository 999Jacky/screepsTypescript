export interface EnergyPoint {
  id: Id<Source>;
  isMining: boolean;
  carryCount: number;
}

export interface roomStatus {
  name: string;
  isReserve: boolean;
  energyAvailable: number;
}
