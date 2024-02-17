import * as readline from 'readline';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const travelTimeConst = 10;
var firstRun: boolean = true;
var startingFloor: number = 1;
var currentFloor: number = 1;
var direction = '';

/**
 * Prompts the user for the starting floor for the run. On the first run, the 
 * starting floor will also be used as the current floor for determining total
 * travel time. On subsequent runs of the same session, the current floor will
 * be the ending floor from the previous run.
 */
export function getStartingFloor(): void {
    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    reader.setPrompt('Please enter your starting floor. (int: e.g. 1): ');
    reader.prompt();
    reader.on('line', (input) => {
        if (!isInt(input)) {
            console.log("The input is not an integer.")
            reader.close();
            getStartingFloor();
        }
        else {
            startingFloor = Number(input);
            if (firstRun) {
                currentFloor = startingFloor;
                firstRun = false;
            }
            reader.close();
            getDirrection();
        }
    });
}

/**
 * Prompts the user for the direction that the elevator will travel first. If the input
 * provided is not acceptable, then the user will be shown an error message and prompted
 * for the dirrection again. Acceptable input is 'u' or 'up for up and 'd' or 'down' for 
 * down.
 */
export function getDirrection(): void {
    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    reader.setPrompt('Which direction are you going? (char: u or d): ');
    reader.prompt();
    reader.on('line', (input) => {
        const dir = input.toLowerCase();
        if (dir == 'u' || dir == 'up') {
            direction = 'u';
            reader.close();
            getFloors();
        }   
        else if (dir == 'd' || dir == 'down') {
            direction = 'd'
            reader.close();
            getFloors();
        }   
        else {
            console.log('Please choose either u or d')
            reader.close();
            getDirrection();
        }    
    });
}

/**
 * Prompts the user to input an array of integers which represent the floors that
 * will be visited by the elevator on this run. If the input is not an array, or 
 * the array does not contain the correct type, an error message will be shown and 
 * the user will be prompted for the information again.
 */
export function getFloors(): void {
    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    var validInput = true;
    reader.setPrompt('What floors are you visiting? (int[]: e.g. [1, 3, 15]): ');
    reader.prompt();
    reader.on('line', (input) => {
        try {
            const floors = JSON.parse(input);
            if (Array.isArray(floors)) {
                for (const floor of floors) {
                    if (!isInt(floor)) {
                        console.log(`Input value: ${floor} is not an int. Please only enter integer values in your floors array.`)
                        validInput = false;
                        break;
                    }
                }
                if (validInput) {
                    const floorNumbers: number[] = floors.map(Number);
                    reader.close();
                    travel(floorNumbers);
                }
                else {
                    reader.close();
                    getFloors();
                }
            } 
            else {
              console.log('The input is not an array.');
              reader.close();
              getFloors();
            }
        } 
        catch (e) {
            console.log('Invalid input. Please enter a valid array.');
            reader.close();
            getFloors();
        }  
    });
}

/**
 * Organizes the supplied floors to visit into two arrays of floors which are 
 * above and below the starting floor. Each floor will only be added to it's 
 * corresponding array once. Calls the goingUp() or goingDown() methods and
 * reports the total travel time and floors visited to the user.
 * 
 * @param floors 
 */
export function travel(floors: number[]) {
    var floorsAbove: number[] = [];
    var floorsBelow: number[] = [];
    var floorsVisited: number[] = [currentFloor];
    var travelTime: number = 0;
    if (currentFloor !== startingFloor) {
        travelTime += Math.abs(startingFloor - currentFloor) * travelTimeConst;
        floorsVisited.push(startingFloor);
        currentFloor = startingFloor;
    }
    
    console.log("*Ding* Here we go!");

    floors.sort((a, b) => a - b);

    for (const floor of floors) {
        if (floor > currentFloor && !floorsAbove.includes(floor)){
            floorsAbove.push(floor);
        }
        else if (floor < currentFloor && !floorsBelow.includes(floor)) {
            floorsBelow.push(floor);
        }
    }

    if (direction == 'u') {
        travelTime += goingUp(floorsAbove, floorsVisited);
        travelTime += goingDown(floorsBelow, floorsVisited);
    }
    else if (direction == 'd') {
        travelTime += goingDown(floorsBelow, floorsVisited);
        travelTime += goingUp(floorsAbove, floorsVisited);
    }
    
    console.log(`Total Travel Time: ${travelTime}\nFloors Visited: ${floorsVisited}\nCurrent Floor: ${currentFloor}`);
    console.log('\n\n What fun, ready for another ride?\n\n');
    getStartingFloor();
}

/**
 * Calculates and returns the travel time for the elevator when the chosen direction
 * was up. Floors that are above the starting floor will be visited first in 
 * ascending order.
 * 
 * @param floorsAbove 
 * @param floorsVisited 
 * @returns travelTime in seconds.
 */
export function goingUp(floorsAbove: number[], floorsVisited: number[]): number {
    var travelTime = 0;
    for (let i = 0; i < floorsAbove.length; i++){
        const elapsedTime = (floorsAbove[i] - currentFloor) * travelTimeConst;
        travelTime += elapsedTime;
        floorsVisited.push(floorsAbove[i]);
        currentFloor = floorsAbove[i];
    }
    return travelTime;
}

/**
 * Calculates and returns the travel time for the elevator when the chosen direction
 * was down. Floors that are below the starting floor will be visited first in 
 * descending order.
 * 
 * @param floorsBelow 
 * @param floorsVisited 
 * @returns travelTime in seconds.
 */
export function goingDown(floorsBelow: number[], floorsVisited: number[]): number {
    var travelTime = 0;
    for (let i = floorsBelow.length - 1; i >= 0; i--){
        const elapsedTime = (currentFloor - floorsBelow[i]) * travelTimeConst;
        travelTime += elapsedTime;
        floorsVisited.push(floorsBelow[i]);
        currentFloor = floorsBelow[i];
    }
    return travelTime;
}

/**
 * Returns true if a given string input can be cast to a number and if that number is an integer.
 * 
 * @param input 
 * @returns 
 */
export function isInt(input: string): boolean {
    if (input == undefined || input == '') {
        return false;
    }

    const num = Number(input);

    if (isNaN(num)) {
        return false;
    } else {
        return num % 1 == 0 ? true : false
    }
}


/**
 * Prints the rules section of the README.md file at the start of the simulator.
 * 
 * @param filePath 
 */
export function printRules(filePath: string): void {
    try {
        const path = resolve(filePath);
        const data = readFileSync(path, { encoding: 'utf-8' });
        const start = data.indexOf('### Rules');

        if (start !== -1) {
            const rules = data.substring(start);
            console.log(rules);
        }
        else {
            console.log("The Rules heading was not found in the README file.");
        }
    }
    catch (error) {
        console.error('Error reading the README file:', error);
    }
}