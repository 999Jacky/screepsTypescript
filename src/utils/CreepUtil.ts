import { Role } from '../role/role';
import _ from 'lodash';
import { RoomName } from '../main';

export class CreepUtil {

  public static findTargetCreeper = (role: Role) => _.filter(Game.creeps, (c) => c.memory.role === role);

  public static getRoomNowEnergy = (room: RoomName) => Game.rooms[room].energyAvailable;

  public static getCreepBodyPart = (config: Record<number, BodyPartConstant[]>, energyCount: number) => {
    let bodyPart: BodyPartConstant[] = [WORK, CARRY, MOVE];
    let level = 0;
    for (let i = 0; i < Object.entries(config).length; i++) {
      const [count, body] = Object.entries(config)[i];
      if (energyCount >= Number(count)) {
        level = i;
        bodyPart = body;
      } else {
        break;
      }
    }
    return { bodyPart, level };
  };

  public static newCreepMem = (role: Role, level: number): CreepMemory => ({
    role: role,
    level: level,
    target: null,
    working: false
  });

  public static carryEnergyTarget = (creep: Creep, target?: Resource) => {
    let sources = target ? [target] : creep.room.find(FIND_DROPPED_RESOURCES);
    // sources = _.sortBy(sources, (s) => s.amount)
    sources = sources.sort((a, b) => b.amount - a.amount);
    if (sources.length > 0) {
      if (creep.pickup(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
        return true;
      }
    }
    return false;
  };

  public static gotToRandomEnergy(creep: Creep) {
    const sources = creep.room.find(FIND_SOURCES_ACTIVE);
    creep.memory.energySourceId = sources[0].id;
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
    }
    return sources[0].id;
  }

  public static mineRandomEnergy = (creep: Creep) => {
    if (creep.memory.energySourceId) {
      const energyObj = Game.getObjectById(creep.memory.energySourceId);
      if (!energyObj || energyObj.energy === 0) {
        creep.memory.energySourceId = this.gotToRandomEnergy(creep);
        return creep.memory.energySourceId;
      }
      if (creep.harvest(energyObj) === ERR_NOT_IN_RANGE) {
        creep.moveTo(energyObj, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return energyObj.id;
    } else {
      return this.gotToRandomEnergy(creep);
    }
  };

  public static setCreepCanWorking = (creep: Creep) => {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.energySourceId = null;
      creep.memory.working = false;
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
    }
  };

  public static lockWorkTarget(creep: Creep, targetId?: Id<any> | null) {
    if (targetId) {
      creep.memory.target = targetId;
      const obj = Game.getObjectById(targetId);
      creep.memory.targetRoom = obj?.room?.name;
    } else {
      this.freeCreepWork(creep);
    }
  }

  public static freeCreepWork(creep: Creep) {
    creep.memory.target = null;
    creep.memory.targetRoom = null;
  }

  public static transferEnergy(creep: Creep, target: AnyCreep | Structure) {
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } }) === OK;
    }
    return false;
  }

  public static mimeTargetEnergy(creep: Creep, targetId: Id<Source>) {
    const energyObj = Game.getObjectById(targetId);
    if (!energyObj) {
      return this.mineRandomEnergy(creep);
    }
    if (energyObj.energy === 0) {
      const energyStatus = Memory.energyPoint[energyObj.room.name].find((p) => p.id === targetId)!;
      energyStatus.isMining = false;
      return this.mineRandomEnergy(creep);

    }
    const energyStatus = Memory.energyPoint[energyObj.room.name].find((p) => p.id === targetId)!;
    energyStatus.isMining = true;
    if (creep.harvest(energyObj) === ERR_NOT_IN_RANGE) {
      creep.moveTo(energyObj, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
    return energyObj.id;
  }

  public static carryOrMineEnergy(creep: Creep) {
    const targetId = creep.memory.energySourceId;
    if (targetId) {
      creep.memory.energySourceId = targetId;
      const sourceObj = Game.getObjectById(targetId);
      const dropEnergy = sourceObj?.pos.findInRange(FIND_DROPPED_RESOURCES, 3) ?? [];
      if (dropEnergy.length > 0) {
        if (this.carryEnergyTarget(creep, dropEnergy[0])) {
          return targetId;
        }
      }
      return this.mimeTargetEnergy(creep, targetId);
    } else {
      return this.mineRandomEnergy(creep);
    }
  }

  public static carrySourceNearbyEnergy(creep: Creep, targetId: Id<Source>) {
    creep.memory.energySourceId = targetId;
    const sourceObj = Game.getObjectById(targetId);
    if (!sourceObj) {
      creep.memory.energySourceId = null;
      return null;
    }
    const dropEnergy = sourceObj?.pos.findInRange(FIND_DROPPED_RESOURCES, 3) ?? [];
    if (dropEnergy.length > 0) {
      if (this.carryEnergyTarget(creep, dropEnergy[0])) {
        return targetId;
      }
    }
    return null;
  }

}











