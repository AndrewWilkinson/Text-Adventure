// Narrate

class Room {

    constructor(name) {
        this._name = name;
        this._explored = false;
        this._linkedRooms = {};
        this.description = ""
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

    get linkedRooms()
    {
        return this._linkedRooms;
    }

    get name() {
        return this._name;
    }

    explored(){
        this._explored = true;
    }

    // get north()
    // {
    // return this._north;
    // }

    // get south()
    // {
    // return this._south;
    // }

    // get east()
    // {
    // return this._east;
    // }

    // get west()
    // {
    // return this._west;
    // }

}

//safer way to create a two way passage between rooms
function linkRoomsSouthNorth(south, north)
{
    south.linkRoom("North", north);
    north.linkRoom("South", south);
}
//safer way to create a two way passage between rooms
function linkRoomsWestEast(west, east)
{
    west.linkRoom("East", east);
    east.linkRoom("West", west);
}

// 

function attemptTravel(inputs) {
    const directions = ["North", "South", "East", "West"]
    let desiredExit = ""
    directions.forEach(direction => {
        if (inputs.includes(direction)) {
            desiredExit = direction;   //extracts a direction from input
        }
    });

    if (!directions.includes(desiredExit)) {
        document.getElementById('story').innerHTML += "<br> Please specify a valid direction";
    }
    else {
        //TODO check for obstructions
        if (desiredExit != "") {
            if (desiredExit in currentRoom.linkedRooms) {
                currentRoom = currentRoom.linkedRooms[desiredExit];
                document.getElementById('story').innerHTML += "<br> You travel " + desiredExit;
                document.getElementById('story').innerHTML += "<br> You are in: " + currentRoom.name; //+ " " + currentRoom.description;
            }
            else {
                document.getElementById('story').innerHTML += "<br> You cannot travel " + desiredExit;
            }
        }
    }
}

// Example Room Construction
// const kitchen = new Room("Kitchen");
// const hallway = new Room("Hallway");
// currentRoom = hallway;
// hallway.explored();
// linkRoomsWestEast(kitchen, hallway);
// hallway.linkRoom('North', kitchen);
// kitchen.linkRoom('South', hallway);


window.onload = () => {
    // document.getElementById('game').innerHTML = currentRoom.describe()
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            inputs = document.getElementById("command").value.split(" ");
            if (inputs.includes("travel")) {
                attemptTravel(inputs);
            }
            else if (inputs.includes("talk")) {
                //
            }
            else if (inputs.includes("take")) {
                //
            }
            else if (inputs.includes("look")) {
                //
            }
            else if (inputs.includes("use")) {
                //
            }
            else {
                alert("invalid command")
            }
            document.getElementById("story").scrollTop = document.getElementById("story").scrollHeight;
        }

    })

}