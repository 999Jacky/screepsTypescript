import { ErrorMapper } from 'utils/ErrorMapper';


export const loop = ErrorMapper.wrapLoop(() => {
  throw new Error('test');

})
loop();
//
// import { Role } from './role/role';
// import { EnergyPoint, roomStatus } from './brain/interface';
// import { Harvester } from './role/harvester';
// import { Mine } from './role/mine';
// import { Upgrade } from './role/upgrade';
// import { Brain } from './brain/brain';
// import { Builder } from './role/builder';
// import { Carrier } from './role/carrier';
// import { Repair } from './role/repair';
// import { Spawn } from './brain/spawn';
//
//
// export type Room = string;
// declare global {
//   interface Memory {
//     userName: string;
//     baseRoomName: string;
//     nextRoom: string | null;
//     controlRoom: string[];
//     energyRoom: roomStatus[];
//     energyPointCount: number;
//     energyPoint: Record<Room, EnergyPoint[]>;
//     isInit: boolean;
//   }
//
//   interface CreepMemory {
//     role: Role;
//     level: number;
//     targetRoom?: string | null;
//     target?: Id<any> | null;
//     energySourceId?: Id<Source> | null;
//     working: boolean;
//   }
// }
//
// // When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// // This utility uses source maps to get the line numbers and file names of the original, TS source code
// export const loop = ErrorMapper.wrapLoop(() => {
//
//   // Automatically delete memory of missing creeps
//   for (const name in Memory.creeps) {
//     if (!(name in Game.creeps)) {
//       console.log(`clear:${name}`);
//       delete Memory.creeps[name];
//     }
//   }
//   if (!Memory.isInit) {
//     console.log('initing');
//     Brain.Init();
//   }
//
//   if (Game.time % 5 === 0) {
//     Brain.refreshStatus();
//   }
//
//   Spawn.checkSpawn();
//
//   for (const creep of Object.values(Game.creeps)) {
//     switch (creep.memory.role) {
//       case Role.harvest:
//         Harvester.Run(creep);
//         break;
//       case Role.upgrade:
//         Upgrade.Run(creep);
//         break;
//       case Role.build:
//         Builder.Run(creep);
//         break;
//       case Role.mine:
//         Mine.Run(creep);
//         break;
//       case Role.carry:
//         Carrier.Run(creep);
//         break;
//       case Role.repair:
//         Repair.Run(creep);
//         break;
//     }
//   }
// });
