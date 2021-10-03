const glade = new Room("Glade")
const thicket = new Room("Thicket")
const woods = new Room("Woods")
const lake = new Room("Lake")

linkRoomsWestEast(glade, thicket);
linkRoomsWestEast(woods, lake);
linkRoomsSouthNorth(woods, glade);
linkRoomsSouthNorth(lake, thicket);

currentRoom = glade;
currentRoom.explored = true;
let playerHealth = 10;
let playerInventory = [];