import { RoomName } from '../main';

export interface EnergyPoint {
  id: Id<Source>;
  room: RoomName,
  isMining: boolean;
  dropEnergyRemain: number;
}

export interface roomStatus {
  name: string;
  isReserve: boolean;
  energyAvailable: number;
}
