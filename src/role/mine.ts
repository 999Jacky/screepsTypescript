import { CreepUtil } from '../utils/CreepUtil';
import { Brain } from '../brain/brain';

export class Mine {
  public static bodyConfig: Record<number, BodyPartConstant[]> = {
    0: [WORK, MOVE],
    250: [WORK, WORK, MOVE],
    500: [WORK, WORK, WORK, MOVE]
  };

  public static Run(creep: Creep) {
    if (creep.memory.target) {
      CreepUtil.mimeTargetEnergy(creep, creep.memory.target);
    } else {
      const newTarget = Brain.getMineTarget(creep);
      CreepUtil.lockWorkTarget(creep, newTarget);
    }
  }

  public static Clear(memory: CreepMemory) {
    const targetId = memory.target;
    if (targetId) {
      const energyObj = Game.getObjectById(targetId);
      const energyStatus = Memory.energyPoint[energyObj.room.name].find((p) => p.id === targetId)!;
      energyStatus.isMining = false;
    }
  }
}
