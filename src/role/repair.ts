import { CreepUtil } from '../utils/CreepUtil';
import { Brain } from '../brain/brain';

export class Repair {
  public static bodyConfig: Record<number, BodyPartConstant[]> = {
    0: [WORK, CARRY, MOVE],
    250: [WORK, CARRY, CARRY, MOVE, MOVE]
  };

  private static repair(creep: Creep) {
    const targetId = Brain.getRepairTarget();
    if (targetId) {
      CreepUtil.lockWorkTarget(creep, targetId);
      const targetObj = Game.getObjectById(targetId)!;
      creep.say(`r:${targetObj.hits}`);
      if (creep.repair(targetObj) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targetObj, { visualizePathStyle: { stroke: '#ffffff' } });
        return true;
      }
    }
    return false;
  }

  public static Run(creep: Creep) {
    const isCanWorking = !CreepUtil.checkIsNeedEnergy(creep);
    creep.memory.working = isCanWorking;
    if (isCanWorking) {
      this.repair(creep);
    } else {
      CreepUtil.freeCreepWork(creep);
      CreepUtil.carryOrMineEnergy(creep);
    }
  }
}
