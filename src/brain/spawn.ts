import { Role } from '../role/role';
import { CreepUtil } from '../utils/CreepUtil';
import { Harvester } from '../role/harvester';
import { Mine } from '../role/mine';
import { Builder } from '../role/builder';
import { Carrier } from '../role/carrier';
import { Upgrade } from '../role/upgrade';
import { Repair } from '../role/repair';

export class Spawn {
  private static spawnNewCreep = (structureSpawn: StructureSpawn, bodyConfig: Record<number, BodyPartConstant[]>, role: Role) => {
    if (!structureSpawn) {
      return false;
    }
    const energy = CreepUtil.getRoomNowEnergy(structureSpawn.room.name);
    const { bodyPart, level } = CreepUtil.getCreepBodyPart(bodyConfig, energy);
    return structureSpawn.spawnCreep(bodyPart, `${role}${Game.time}`, { memory: CreepUtil.newCreepMem(role, level) }) === OK;
  };

  private static spawnHarvester = (spawnPoint: StructureSpawn) => {
    const harvester = CreepUtil.findTargetCreeper(Role.harvest);
    if (harvester.length < 2) {
      return this.spawnNewCreep(spawnPoint, Harvester.bodyConfig, Role.harvest);
    }
    return false;
  };

  private static spawnMiner = (spawnPoint: StructureSpawn) => {
    const miner = CreepUtil.findTargetCreeper(Role.mine);
    if (miner.length < Memory.energyPointCount) {
      return this.spawnNewCreep(spawnPoint, Mine.bodyConfig, Role.mine);
    }
    return false;
  };

  private static spawnBuilder(spawnPoint: StructureSpawn) {
    const builder = CreepUtil.findTargetCreeper(Role.build);
    const cs = Object.keys(Game.constructionSites);
    if (cs.length / 2 > builder.length) {
      return this.spawnNewCreep(spawnPoint, Builder.bodyConfig, Role.build);
    }
    return false;
  }

  private static spawnCarrier(spawnPoint: StructureSpawn) {
    const carrier = CreepUtil.findTargetCreeper(Role.carry);
    if (carrier.length < 5) {
      return this.spawnNewCreep(spawnPoint, Carrier.bodyConfig, Role.carry);
    }
    return false;
  }

  private static spawnUpgrader(spawnPoint: StructureSpawn) {
    const upgrader = CreepUtil.findTargetCreeper(Role.upgrade);
    if (upgrader.length < 10) {
      return this.spawnNewCreep(spawnPoint, Upgrade.bodyConfig, Role.upgrade);
    }
    return false;
  }

  private static spawnRepair(spawnPoint: StructureSpawn) {
    const repair = CreepUtil.findTargetCreeper(Role.repair);
    if (repair.length < 3) {
      return this.spawnNewCreep(spawnPoint, Repair.bodyConfig, Role.repair);
    }
    return false;
  }

  public static checkSpawn() {
    const spawn = Object.values(Game.spawns)[0];
    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];
      Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        { align: 'left', opacity: 0.8 });
      return;
    }
    if (this.spawnHarvester(spawn)) {
      return;
    }
    if (this.spawnUpgrader(spawn)) {
      return;
    }
    if (this.spawnRepair(spawn)) {
      return;
    }
    if (this.spawnMiner(spawn)) {
      return;
    }
    if (this.spawnCarrier(spawn)) {
      return;
    }
    if (this.spawnBuilder(spawn)) {
      return;
    }
  }
}



