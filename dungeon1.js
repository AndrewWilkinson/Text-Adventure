const entrance = new Room("Entrance")
const armoury = new Room("Armoury")
const pantry = new Room("Pantry")
const kitchen = new Room("Kitchen")

const northHallway = new Room("North Hallway")
const centralHallway = new Room("Central Hallway")
const southHallway = new Room("South Hallway")
const canteen = new Room("Canteen")

const callblockA = new Room("Cellblock A")
const cellblockB = new Room("Cellblock B")
const cellblockC = new Room("Cellblock C")
const recreationRoom = new Room("Recreation Room")

const burntPlace = new Room("Burnt Place")
const rearGates = new Room("Rear Gates")
const rockpiles = new Room("Rockpiles")
const exerciseYard = new Room("Exercise Yard")

const freedom = new Room("Freedom!")

linkRoomsSouthNorth(armoury, entrance);
linkRoomsSouthNorth(kitchen , pantry);
linkRoomsSouthNorth(centralHallway, northHallway);
linkRoomsSouthNorth(southHallway, centralHallway);
linkRoomsSouthNorth(canteen, southHallway);
linkRoomsSouthNorth(exerciseYard, rockpiles);
linkRoomsSouthNorth(rockpiles, rearGates);
linkRoomsSouthNorth(rearGates, burntPlace);

burntPlace.linkRoom("North", freedom)

linkRoomsWestEast(entrance, northHallway);
linkRoomsWestEast(pantry, southHallway);
linkRoomsWestEast(kitchen, canteen);
linkRoomsWestEast(canteen, recreationRoom);
linkRoomsWestEast(recreationRoom, exerciseYard);
linkRoomsWestEast(northHallway, callblockA);
linkRoomsWestEast(centralHallway, cellblockB);
linkRoomsWestEast(southHallway, cellblockC);

currentRoom = entrance;
entrance.explored;