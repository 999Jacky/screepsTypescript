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
    let name = `${role}${Game.time}`;
    if (level === 0) {
      name = `Low${name}`;
    }
    const isOk = structureSpawn.spawnCreep(bodyPart, name, { memory: CreepUtil.newCreepMem(role, level) }) === OK;
    if (isOk) {
      console.log(`spawning ${name}`);
    } else {
      console.log(`spawning FAIL: ${name}`);
    }
    return isOk;
  };

  private static spawnHarvester = (spawnPoint: StructureSpawn) => {
    const harvester = CreepUtil.findTargetCreeper(Role.harvest);
    const carrier = CreepUtil.findTargetCreeper(Role.carry);
    const miner = CreepUtil.findTargetCreeper(Role.mine);
    if ((miner.length === 0 || carrier.length < 2) && harvester.length < 2) {
      this.spawnNewCreep(spawnPoint, Harvester.bodyConfig, Role.harvest);
      return true;
    }
    return false;
  };

  private static spawnMiner = (spawnPoint: StructureSpawn) => {
    const miner = CreepUtil.findTargetCreeper(Role.mine);
    if (miner.length < Memory.energyPointCount) {
      this.spawnNewCreep(spawnPoint, Mine.bodyConfig, Role.mine);
      return true;
    }
    return false;
  };

  private static spawnBuilder(spawnPoint: StructureSpawn) {
    const builder = CreepUtil.findTargetCreeper(Role.build);
    const cs = Object.keys(Game.constructionSites);
    if (cs.length / 2 > builder.length) {
      this.spawnNewCreep(spawnPoint, Builder.bodyConfig, Role.build);
      return true;
    }
    return false;
  }

  private static spawnCarrier(spawnPoint: StructureSpawn) {
    const carrier = CreepUtil.findTargetCreeper(Role.carry);
    if (carrier.length < 5) {
      this.spawnNewCreep(spawnPoint, Carrier.bodyConfig, Role.carry);
      return true;
    }
    return false;
  }

  private static spawnUpgrader(spawnPoint: StructureSpawn) {
    const upgrader = CreepUtil.findTargetCreeper(Role.upgrade);
    if (upgrader.length < 10) {
      this.spawnNewCreep(spawnPoint, Upgrade.bodyConfig, Role.upgrade);
      return true;
    }
    return false;
  }

  private static spawnLowUpgrader(spawnPoint: StructureSpawn) {
    const upgrader = CreepUtil.findTargetCreeper(Role.upgrade);
    if (upgrader.length < 2) {
      this.spawnNewCreep(spawnPoint, Upgrade.bodyConfig, Role.upgrade);
      return true;
    }
    return false;
  }

  private static spawnRepair(spawnPoint: StructureSpawn) {
    const repair = CreepUtil.findTargetCreeper(Role.repair);
    if (repair.length < 3) {
      this.spawnNewCreep(spawnPoint, Repair.bodyConfig, Role.repair);
      return true;
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
    if (this.spawnLowUpgrader(spawn)) {
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
    if (this.spawnUpgrader(spawn)) {
      return;
    }
  }
}



