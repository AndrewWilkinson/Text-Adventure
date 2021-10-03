class Item {
    _description = "";

    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }
    set description(description) {
        if (description != "")
            this._description = description;
    }

}

class Equipment extends Item {
    _special = "";

    constructor(name) {
        super(name)
    }

    set special(special) {
        this._special = special;
    }
}

class Weapon extends Equipment {

    constructor(name, type, damage) {
        super(name)
        this._type = type;
        this._damage = damage;
    }

    get damage() {
        return this._damage;
    }

    get type() {
        return this._type;
    }

}

class Armour extends Equipment {
    constructor(name, defense) {
        super(name)
        this._defense = defense;
    }

    get defense() {
        return this._defense;
    }

}

class Key extends Item {
    _unlocks = "";

    constructor(name, unlocks) {
        super(name)
        this._unlocks = unlocks;
    }

    get unlocks() {
        return this._unlocks;
    }

}

class Consumable extends Item {

    constructor(name, affects, strength) {
        super(name)
        this._affects = affects;   //"Health", "Damage", etc.
        this._strength = strength;
    }

    get affects() {
        return this._affects;
    }
    get strength() {
        return this._strength;
    }

}

class Door {

    _name = ""
    _obstructs = "";    //should be a compass direction from the perspective of the room this obstruction is found it

    constructor(name, obstructs) {
        this._name = name;
        this._obstructs = obstructs;
    }

    get name() {
        return this._name;
    }

    get obstructs() {
        return this._obstructs;
    }

    unlock(key) {
        if (key.unlocks == this._name) {
            this._obstructs = "";
            return "Unlocked " + this._name;
        }
        else
            return "Nothing happened to " + this._name;
    }
}

class WeaponModificationStation {
    _special = "";

    constructor(name, special) {
        this._name = name;
        this._special = special;
    }

    get name() {
        return this._name;
    }

    get special() {
        return this._special;
    }

    modify(item) {

        if (item instanceof Weapon) {
            item.special = this._special;
            return "Enhanced " + item.name + "with" + this._special;
        }
        else
            return "Nothing happened to " + item.name;
    }
}

class Character {
    _name = "Unknown character";
    _description = "";
    _conversation = "";
    _inventory = [];
    _alive = true;
    _health = 1;
    _additionalAction = null;

    constructor(health) {
        this._health = health;
    }

    get name() {
        return this._name;
    }
    set name(name) {
        if (name != "")
            this._name = name;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        if (description != "")
            this._description = description;
    }

    set conversation(speech) {
        this._conversation = speech;
    }

    set additionalAction(actionFunction) {
        if (actionFunction instanceof Function) { this._additionalAction = actionFunction; }
    }

    talk() {
        return this._conversation;
    }
    giveCharacterItem(item) {
        this._inventory.push(item);
    }

    dropItem(itemName) {
        let itemToDrop
        _inventory.forEach(item => {
            if (itemName == item.name) {
                itemToDrop = item;
            }
        });

        return itemToDrop;  //may return null
    }

    die(location) {
        _inventory.forEach(item => {

            location.addContent(item);

        });

        this._inventory = [];

        this.alive = false;

    }

}

class Enemy extends Character {
    _damage = 0;
    _weakeness = "";

    constructor(health, weakness, damage) {
        super(health)
        this._weakness = weakness;
        this._damage = damage;
    }

    defend(attackDamage, attackType, special) {
        if (attackType == this._weakness || special == this._weakness) {
            attackDamage *= 2;
        }
        this._health -= attackDamage;

        if (this._health <= 0) {
            this.die()
        }
    }

    attack() {
        return this._damage;
    }
}

class Room {

    constructor(name) {
        this._name = name;
        this._explored = false;
        this._linkedRooms = {};
        this._description = "";
        this._contents = [];
    }

    set description(description) {
        if (typeof description === 'string' & description.length > 5)
            this._description = description;
    }

    get description() {
        return this._description;
    }

    linkRoom(direction, room) {
        this._linkedRooms[direction] = room;
    }

    get linkedRooms() {
        return this._linkedRooms;
    }

    get name() {
        return this._name;
    }

    set explored(explored) {
        this._explored = explored;
    }

    get explored() {
        return this._explored;
    }

    addContent(content) {
        this._contents.push(content);
    }

    get contents() {
        return this._contents;
    }

}

//safer way to create a two way passage between rooms
function linkRoomsSouthNorth(south, north) {
    south.linkRoom("North", north);
    north.linkRoom("South", south);
}
//safer way to create a two way passage between rooms
function linkRoomsWestEast(west, east) {
    west.linkRoom("East", east);
    east.linkRoom("West", west);
}

//
function drawMap() {
    // document.getElementById('map-container').hidden = false;

    ['North', 'East', 'South', 'West'].forEach(direction => {

        if (direction in currentRoom.linkedRooms)   //check for a path
        {
            //TODO if obstruction in current room blocking direction classList = "inaccesible";

            let obstructed = [];
            currentRoom.contents.forEach(content => {
                if (content instanceof Door) {
                    if (content.obstructs != "") {
                        obstructed.push(content.obstructs)
                    }

                }
            });


            if (obstructed.includes(direction)) {
                document.getElementById(direction).classList = "inaccesible";
                document.getElementById(direction).innerText = "Inaccessible Room";
            }
            else if (currentRoom.linkedRooms[direction].explored) {
                document.getElementById(direction).classList = "explored";
                document.getElementById(direction).innerText = currentRoom.linkedRooms[direction].name;
            }
            else {
                document.getElementById(direction).innerText = "Unexplored Room"
                document.getElementById(direction).classList = "unexplored";
            }
        }
        else {
            document.getElementById(direction).classList = "";  //no path so no map
            document.getElementById(direction).innerText = "";
        }

    });

    document.getElementById('Here').innerText = currentRoom.name;
    document.getElementById('Here').classList = "explored";

}

function attemptTravel(inputs) {
    const directions = ["North", "South", "East", "West"]
    let desiredExit = ""
    directions.forEach(direction => {
        if (inputs.includes(direction.toLowerCase())) {
            desiredExit = direction;   //extracts a direction from input
        }
    });

    if (!directions.includes(desiredExit)) {
        document.getElementById('story').innerHTML += "<br> Please specify a valid direction";
    }
    else {

        if (desiredExit != "") {

            let obstructed = [];
            currentRoom.contents.forEach(content => {
                if (content instanceof Door) {
                    if (content.obstructs != "") {
                        obstructed.push(content.obstructs)
                    }

                }
            });

            if (desiredExit in currentRoom.linkedRooms & !(obstructed.includes(desiredExit))) {
                currentRoom = currentRoom.linkedRooms[desiredExit];
                document.getElementById('story').innerHTML += "<br> You travel " + desiredExit;
                document.getElementById('story').innerHTML += "<br> You are in: " + currentRoom.name; //+ " " + currentRoom.description;
                currentRoom.explored = true;
                describeRoom(currentRoom)
                drawMap(currentRoom);
            }
            else {
                document.getElementById('story').innerHTML += "<br> You cannot travel " + desiredExit;
            }
        }
    }
}

function describeRoom(room) {
    if (room.contents.length > 0) {
        document.getElementById('story').innerHTML += "<br> This room contains: "
        room.contents.forEach(content => {
            document.getElementById('story').innerHTML += content.name + ". ";
        });
    }
}

function attemptTalk(inputs) {

    // let characters = [];
    currentRoom.contents.forEach(content => {
        if (content instanceof Character) {

            if (inputs.includes(content.name.toLowerCase())) {
                document.getElementById('story').innerHTML += " <br> " + content.name + " says: " + content.talk()
            }

        }
    });

    // if (desiredExit in currentRoom.linkedRooms & !(obstructed.includes(desiredExit))) {
    //     currentRoom = currentRoom.linkedRooms[desiredExit];
    //     document.getElementById('story').innerHTML += "<br> You travel " + desiredExit;
    //     document.getElementById('story').innerHTML += "<br> You are in: " + currentRoom.name; //+ " " + currentRoom.description;
    //     currentRoom.explored = true;
    //     describeRoom(currentRoom)
    //     drawMap(currentRoom);
    // }
    // else {
    //     document.getElementById('story').innerHTML += "<br> You cannot travel " + desiredExit;
    // }

}

function attemptTake(inputs) {

    itemFound = false;

    if (inputs.replace("take", "").replace(/ /g, '') == "") {
        document.getElementById('story').innerHTML += "<br> Please specify an item to take";
        return;
    }

    currentRoom.contents.forEach((content, index) => {
        if (content instanceof Item) {

            if (inputs.includes(content.name.toLowerCase())) {
                itemFound = true;
                document.getElementById('story').innerHTML += " <br> You take " + content.name;
                playerInventory.push(content);
                currentRoom.contents.splice(index, 1);
            }
        }

    });
    if (!itemFound) { document.getElementById('story').innerHTML += "<br> No such item was found"; }
}

function attemptUse(inputs) {

    if (inputs.replace("use", "").replace(/ /g, '') == "") {
        document.getElementById('story').innerHTML += "<br> Please specify something to use";
        return;
    }

    itemFound = false;

    playerInventory.forEach(item => {
        if (item instanceof Consumable) {
            if (inputs.includes(content.name.toLowerCase())) {

            }
        }
        if (item instanceof Equipment) {
            if (inputs.includes(content.name.toLowerCase())) {
                currentRoom.contents.forEach(content => {
                    if (content.name == item.unlocks) {
                        content.unlock(item);
                    }
                });
            }
        }
        if (item instanceof Key) {
            if (inputs.includes(item.name.toLowerCase())) {
                currentRoom.contents.forEach(content => {
                    if (content.name == item.unlocks) {
                        document.getElementById('story').innerHTML += "<br>" + content.unlock(item);
                        itemFound = true;
                    }
                });
            }
        }
    });

    if (!itemFound) { document.getElementById('story').innerHTML += "<br> No such item was found"; }
}

window.onload = () => {

    drawMap();
    describeRoom(currentRoom)

    // document.getElementById('map-container').hidden = false;

    // document.getElementById('game').innerHTML = currentRoom.describe()
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            inputs = document.getElementById("command").value.toLowerCase();
            if (inputs.includes("travel")) {
                attemptTravel(inputs);
            }
            else if (inputs.includes("talk")) {
                attemptTalk(inputs);
            }
            else if (inputs.includes("take")) {
                attemptTake(inputs);
            }
            else if (inputs.includes("look")) {
                // lookDirection;
            }
            else if (inputs.includes("use")) {
                attemptUse(inputs);
                drawMap();
            }
            else {
                alert("invalid command")
            }
            document.getElementById("story").scrollTop = document.getElementById("story").scrollHeight;
            if (playerHealth == 0) {
                document.getElementById("command").disabled = true;
                document.getElementById("story").innerHTML += "<br> You died! Oh no! ";
            }
        }

    })

}