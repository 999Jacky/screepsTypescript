import { CreepUtil } from '../utils/CreepUtil';

export class Upgrade {
  public static bodyConfig: Record<number, BodyPartConstant[]> = {
    0: [WORK, CARRY, MOVE],
    250: [WORK, CARRY, CARRY, MOVE],
    500: [WORK, WORK, CARRY, CARRY, MOVE]
  };

  public static Run(creep: Creep) {
    CreepUtil.setCreepCanWorking(creep);

    if (creep.memory.working) {
      const baseController = Game.rooms[Memory.baseRoomName].controller!
      if (creep.upgradeController(baseController) === ERR_NOT_IN_RANGE) {
        creep.moveTo(baseController);
      }
    } else {
      CreepUtil.carryOrMineEnergy(creep);
    }
  }
}
