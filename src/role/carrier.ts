import { CreepUtil } from '../utils/CreepUtil';
import { Brain } from '../brain/brain';
import { StructureUtil } from '../utils/StructureUtil';

export class Carrier {
  public static bodyConfig: Record<number, BodyPartConstant[]> = {
    0: [WORK, CARRY, MOVE],
    250: [CARRY, CARRY, MOVE, MOVE],
    500: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  };

  private static fillSpawn(creep: Creep) {
    const spawns = Object.values(Game.spawns);
    for (const spawn of spawns) {
      if (spawn.store.getFreeCapacity()! > 0) {
        if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
        }
        return true;
      }
    }
    return false;
  }

  private static fillEnergy(creep: Creep) {
    const baseRoom = Game.rooms[Memory.baseRoomName];
    const struct = baseRoom.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_CONTAINER) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });
    if (struct.length > 0) {
      if (creep.transfer(struct[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(struct[0], { visualizePathStyle: { stroke: '#ffffff' } });
      }
      return true;
    }
    return false;
  }

  private static idle(creep: Creep) {
    const s = StructureUtil.findRoomStructure(Game.rooms[Memory.baseRoomName], [STRUCTURE_EXTENSION, STRUCTURE_SPAWN]);
    if (s.length > 0) {
      creep.moveTo(s[0], { visualizePathStyle: { stroke: '#ffffff' } });
      return true;
    }
    return false;
  }


  public static Run(creep: Creep) {
    const isCanWorking = !CreepUtil.checkIsNeedEnergy(creep);
    creep.memory.working = isCanWorking;
    if (isCanWorking) {
      if (this.fillSpawn(creep)) {
        return;
      }

      if (this.fillEnergy(creep)) {
        return;
      }
      this.idle(creep);
    } else {
      const targetId = Brain.getEnergyTarget(creep);
      CreepUtil.carrySourceNearbyEnergy(creep, targetId);
    }
  }
}
