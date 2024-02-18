import { CreepUtil } from '../utils/CreepUtil';
import { Brain } from '../brain/brain';

export class Repair {
  public static bodyConfig: Record<number, BodyPartConstant[]> = {
    0: [WORK, CARRY, MOVE],
    250: [WORK, CARRY, CARRY, MOVE, MOVE]
  };

  private static repair(creep: Creep) {
    let targetId = creep.memory.target;
    if (!creep.memory.target) {
      targetId = Brain.getRepairTarget();
      CreepUtil.lockWorkTarget(creep, targetId);
    }
    if (targetId) {
      const targetObj = Game.getObjectById<Structure>(targetId)!;
      if (targetObj.hits > targetObj.hitsMax / 2) {
        CreepUtil.freeCreepWork(creep);
        creep.say('change');
        return;
      }
      creep.say(`r:${targetObj.hits}`);
      if (creep.repair(targetObj) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targetObj, { visualizePathStyle: { stroke: '#ffffff' } });
        return true;
      }
    }
    return false;
  }

  public static Run(creep: Creep) {
    CreepUtil.setCreepCanWorking(creep);
    if (creep.memory.working) {
      this.repair(creep);
    } else {
      CreepUtil.freeCreepWork(creep);
      CreepUtil.carryOrMineEnergy(creep);
    }
  }
}
