import { CreepUtil } from '../utils/CreepUtil';
import { StructureUtil } from '../utils/StructureUtil';

export class Harvester {
  public static bodyConfig: Record<number, BodyPartConstant[]> = {
    0: [WORK, CARRY, MOVE]
  };
  public static feedSpawn = (creep: Creep) => {
    const needEnergySpawn = StructureUtil.findNeedEnergySpawn(creep);
    if (needEnergySpawn) {
      return CreepUtil.transferEnergy(creep, needEnergySpawn);
    }
    return false;
  };
  public static feedStructures = (creep: Creep) => {
    const structure = StructureUtil.findClosestNeedEnergyStructure(creep);
    if (structure) {
      return CreepUtil.transferEnergy(creep, structure);
    }
    return false;
  };
  public static idle = (creep: Creep) => {
    const spawn = StructureUtil.findStructure(creep, [STRUCTURE_SPAWN]);
    if (spawn.length > 0) {
      creep.moveTo(spawn[0]);
    }
  };
  public static Run = (creep: Creep) => {
    const isCanWorking = !CreepUtil.checkIsNeedEnergy(creep);
    creep.memory.working = isCanWorking;
    if (isCanWorking) {
      if (this.feedSpawn(creep)) {
        return;
      }
      if (this.feedStructures(creep)) {
        return;
      }
      this.idle(creep);
    } else {
      CreepUtil.mineRandomEnergy(creep);
    }
  };

}








