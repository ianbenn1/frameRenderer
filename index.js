let MAZEX = 0;
let MAZEY = 0;
let ENDPOINTX = 0;
let ENDPOINTY = 0;
let STARTTIME = 0;
let mazecells = document.getElementsByClassName("maze-block");
document.getElementById('build').onclick = function(){
    let x = document.getElementById('maze-height').value;
    let y = document.getElementById('maze-width').value;
    MAZEX = x;
    MAZEY = y;
    console.log(`X:${x} Y:${y}`);
    mazeBuilder(x, y);
    [].forEach.call(mazecells, function (el) {
        el.onclick = function(e) {
            e.target.dataset.taken = "true";
            e.target.className = e.target.className + " blocked-cell";
        };
    });
};

document.getElementById('solve').onclick = function() {
    var rendermode = document.getElementById("solvetype").value;
    STARTTIME = Date.now();
    if(rendermode == 'single') {
        solver(MAZEX, MAZEY, 0, 0, false, "#999", 1);
    }
    else if(rendermode == 'sli') {
        solver2(MAZEX, MAZEY, 0, 0);
    }
    
};



async function mazeBuilder(x, y) {
    let field = document.getElementsByClassName('field')[0];
    field.innerHTML = "";
    for(let i = 0; i < x; i++)
    {
        //console.log("Creating row " + i);
        let rowElement = document.createElement("div");
        rowElement.className = "maze-line line" + i;
        field.appendChild(rowElement);
        let row = document.getElementsByClassName('line' + i)[0];

        for(let j = 0; j < y; j++)
        {
            //console.log("Creating cell " + j + " in row " + i);
            let cell = document.createElement("div");
            if(i == 0 && j == 0)
            {
                //First Cell
                cell.className = "maze-block starting-cell cell" + i + "-" + j;
                //cell.dataset.taken = "true";
            }
            else if (i == (x-1) && j == (y-1))
            {
                //last cell
                cell.className = "maze-block ending-cell cell" + i + "-" + j;
                //cell.dataset.taken = "true";
                ENDPOINTX = i;
                ENDPOINTY = j;
            }
            else {
                cell.className = "maze-block cell" + i + "-" + j;
                cell.dataset.taken = "false";
            }
            row.appendChild(cell);
           // await sleep(1);
        }
    }
}


function solver (maze_size_x, maze_size_y, x, y, rev, colour, skip) {

    let done = false;
    let rendermode = document.getElementById("solvetype").value;
    let renderspd = document.getElementById("rendspd").value;
    let rendervario = getRandomInt(0, document.getElementById("vario").value);
    console.log(`rendvario: ${document.getElementById("vario").value} totalrand: ${rendervario}`)
    let renderTime = parseFloat(renderspd) + parseFloat(rendervario);
    console.log(`renderTime: ${renderTime}`);

    if (document.getElementsByClassName(`cell${x}-${y}`)[0].dataset.taken == "true") {
        console.log('done2 1');
        console.log("millis: ", Date.now() - STARTTIME)
        done = true;
    }
    else {
        document.getElementsByClassName(`cell${x}-${y}`)[0].dataset.taken = "true";
        document.getElementsByClassName(`cell${x}-${y}`)[0].style.backgroundColor = colour;
    }

    if(rev){
        y--
    }
    else {
       y++ 
    }
    if((rev && y == -1) || y == maze_size_y){
        if(rev) {
            y = maze_size_y-1
            x -= skip
        } else {
            x += skip
            y = 0;
        }
    }
    if (!rev && x == maze_size_x)
    {
        console.log("done? millis:")
        console.log(Date.now() - STARTTIME)
        done = true;
    }

    if(!done) {
        setTimeout(() => solver(maze_size_x, maze_size_y, x, y, rev, colour, skip), renderTime)
    }
}

function solver2 (maze_size_x, maze_size_y, x, y) {
    let halfx = Math.round(maze_size_x / 2)

    setTimeout(() => solver(halfx, maze_size_y, x, y, false, '#999', 1), 1)
    setTimeout(() => solver(halfx-1, maze_size_y, maze_size_x-1, maze_size_y-1, true, "#ccc", 1), 1)
}



//Helper functions
async function sleep(ms) {
    await setTimeout(()=>{}, ms);
}

function getRandomInt(min, max) {
    let x = 1
    min = Math.ceil(min);
    max = Math.floor(max);
    if(max == 1) x = 200;
    return (Math.floor(Math.random() * (max - min + 1)) + min) * x;
}