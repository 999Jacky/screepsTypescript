import { EnergyPoint } from './interface';
import { StructureUtil } from '../utils/StructureUtil';
import _ from 'lodash';

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
    const target = allPoints.sort((a, b) => b.dropEnergyRemain - b.dropEnergyRemain)[0];
    target.dropEnergyRemain -= creep.store.getFreeCapacity();
    return target.id;
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
      const isReserve = room.controller?.reservation?.username === Memory.userName || room.controller?.owner?.username === Memory.userName;
      Memory.energyRoom.push({
        name: roomName,
        energyAvailable: room.energyAvailable,
        isReserve: isReserve
      });

      const newEnergyRecord: EnergyPoint[] = [];
      const roomEnergy = room.find(FIND_SOURCES_ACTIVE);
      for (const energy of roomEnergy) {
        newEnergyCount += 1;
        const existRoom = Memory?.energyPoint[roomName];
        const existRecord = existRoom?.find((p) => p.id === energy.id) ?? null;
        const dropEnergy = energy.pos.findInRange(FIND_DROPPED_RESOURCES, 3) ?? [];
        if (existRecord) {
          existRecord.isMining = false;
          existRecord.dropEnergyRemain = this.sumEnergyAmount(dropEnergy);
          newEnergyRecord.push(existRecord);
        } else {
          newEnergyRecord.push({
            id: energy.id,
            room: roomName,
            isMining: false,
            dropEnergyRemain: this.sumEnergyAmount(dropEnergy)
          });
        }
      }
      Memory.energyPoint[roomName] = newEnergyRecord;
      Memory.energyPointCount = newEnergyCount;
    }

    const claimFlag = Game.flags['claim'];
    if (claimFlag) {
      Memory.nextRoom = claimFlag.room?.name!;
    }
  }

  private static sumEnergyAmount(res: Resource[]) {
    let sum = 0;
    for (const r of res) {
      sum += r.amount;
    }
    return sum;
  }

  public static Init() {
    Memory.userName = '999';
    if (!Memory.nextRoom) {
      Memory.nextRoom = null;
    }
    const spawns = Object.keys(Game.spawns);
    Memory.baseRoomName = Game.spawns[spawns[0]].room.name;
    Memory.energyPoint = {};
    this.refreshStatus();
    Memory.isInit = true;
  }
}
