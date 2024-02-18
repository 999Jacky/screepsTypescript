export class StructureUtil {
  public static findNeedEnergySpawn = (creep: Creep): StructureSpawn | null => {
    const s = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (s.length > 0) {
      return s[0] as StructureSpawn;
    }
    return null;
  };
  public static isStructureHasFreeCapacity = (struct: any) => {
    return struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  };

  public static findClosestNeedEnergyStructure = (creep: Creep, findStructures?: StructureConstant[]) => {
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (!findStructures || findStructures.includes(structure.structureType)) && this.isStructureHasFreeCapacity(structure)
    });
  };

  public static findStructure = (creep: Creep, findStructures?: StructureConstant[]) => creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => !findStructures || findStructures.includes(structure.structureType)
  });

  public static findRoomStructure = (room: Room, findStructures?: StructureConstant[]) => room.find(FIND_STRUCTURES, {
    filter: (structure) => !findStructures || findStructures.includes(structure.structureType)
  });


  public static findRoomAnyNeedRepair(room: Room) {
    return room.find(FIND_STRUCTURES, {
      filter: (structure) => (structure.hits < structure.hitsMax),
    });
  }
}




