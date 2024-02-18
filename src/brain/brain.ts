import { EnergyPoint } from './interface';
import { StructureUtil } from '../utils/StructureUtil';

export class Brain {

  public static getMineTarget(creep: Creep) {
    // 優先去沒有挖礦仔的
    const nonMinerPoint: EnergyPoint[] = [];
    for (const point of Object.values(Memory.energyPoint)) {
      for (const energyPoint of point) {
        if (!energyPoint.isMining) {
          nonMinerPoint.push(energyPoint);
        }
      }
    }
    if (nonMinerPoint.length > 0) {
      return nonMinerPoint[0].id;
    }

    const mineObj = creep.room.find(FIND_SOURCES_ACTIVE);
    return mineObj[0].id;
  }

  public static getEnergyTarget(creep: Creep) {
    const allPoints: EnergyPoint[] = [];
    for (const point of Object.values(Memory.energyPoint)) {
      for (const energyPoint of point) {
        allPoints.push(energyPoint);
      }
    }
    const nonCarryPoint = allPoints.find((p) => p.carryCount === 0);
    if (nonCarryPoint) {
      return nonCarryPoint.id;
    }

    return allPoints.sort((a, b) => a.carryCount - b.carryCount)[0].id;
  }

  public static getBuildTarget(creep: Creep) {
    const baseNeedBuild = Game.rooms[Memory.baseRoomName].find(FIND_CONSTRUCTION_SITES);
    if (baseNeedBuild.length > 0) {
      return baseNeedBuild[0].id;
    }
    const allNeedBuild = Object.values(Game.constructionSites);
    if (allNeedBuild.length > 0) {
      return allNeedBuild[0].id;
    }
    return null;
  }

  public static getRepairTarget() {
    const baseNeedRepair = StructureUtil.findRoomAnyNeedRepair(Game.rooms[Memory.baseRoomName]);
    if (baseNeedRepair.length > 0) {
      return baseNeedRepair[0].id;
    }

    for (const room of Object.values(Game.rooms)) {
      if (room.name === Memory.baseRoomName) {
        continue;
      }
      const needRepair = StructureUtil.findRoomAnyNeedRepair(room);
      if (needRepair.length > 0) {
        return needRepair[0].id;
      }
    }
    return null;
  }

  public static refreshStatus() {
    const rooms = Object.keys(Game.rooms);
    Memory.controlRoom = rooms;
    Memory.energyRoom = [];
    let newEnergyCount = 0;
    for (const roomName of rooms) {
      const room = Game.rooms[roomName];
      Memory.energyRoom.push({
        name: roomName,
        energyAvailable: room.energyAvailable,
        isReserve: room.controller?.reservation?.username === Memory.userName
      });

      const newEnergyRecord: EnergyPoint[] = [];
      const roomEnergy = room.find(FIND_SOURCES_ACTIVE);
      for (const energy of roomEnergy) {
        newEnergyCount += 1;
        const existRecord = Memory.energyPoint[roomName].find((p) => p.id === energy.id);
        if (existRecord) {
          newEnergyRecord.push(existRecord);
        } else {
          newEnergyRecord.push({
            id: energy.id,
            isMining: false,
            carryCount: 0
          });
        }
      }
      Memory.energyPoint[roomName] = newEnergyRecord;
      Memory.energyPointCount = newEnergyCount;
    }

  }

  public static Init() {
    Memory.userName = '999';
    if (!Memory.nextRoom) {
      Memory.nextRoom = null;
    }
    Memory.baseRoomName = Game.spawns[0].room.name;
    this.refreshStatus();
    Memory.isInit = true;
  }
}
