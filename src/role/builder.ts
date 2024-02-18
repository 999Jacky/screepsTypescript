import { CreepUtil } from '../utils/CreepUtil';
import { Brain } from '../brain/brain';

export class Builder {
  public static bodyConfig: Record<number, BodyPartConstant[]> = {
    0: [WORK, CARRY, MOVE],
    250: [WORK, CARRY, CARRY, MOVE],
    500: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
  };

  private static repairOnMove(creep: Creep) {
    const structures = creep.pos.lookFor(LOOK_STRUCTURES);
    if (structures.length > 0) {
      for (const structure of structures) {
        if ((structure.structureType === STRUCTURE_ROAD) && (structure.hits < structure.hitsMax)) {
          creep.repair(structure);
        }
      }
    }
  }

  private static buildTarget(creep: Creep) {
    if (creep.memory.target) {
      const buildObj = Game.getObjectById(creep.memory.target);
      if (buildObj && buildObj instanceof ConstructionSite) {
        if (creep.build(buildObj) === ERR_NOT_IN_RANGE) {
          creep.moveTo(buildObj, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        const newTarget = Brain.getBuildTarget(creep);
        CreepUtil.lockWorkTarget(creep, newTarget);
      }
    }
  }

  public static Run(creep: Creep) {
    CreepUtil.setCreepCanWorking(creep);

    if (creep.memory.working) {
      this.repairOnMove(creep);
      this.buildTarget(creep);
    } else {
      CreepUtil.carryOrMineEnergy(creep);
    }
  }
}
