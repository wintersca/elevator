# Elevator Simulator

## Background
Elevator Simulator is a simple console game that allows the user to experience the thrill of riding an elevator without leaving the comfort of their desk.

## Requirements

### Functional Requirements

* The simulator will be an executable script written in TypeScript
* The simulator will accept an integer input for the starting floor.
* The simulator will accept a character input for the initial direction of travel, up or down (u or d).
* The simulator will accept an input of an array of ints representing the floors to visit.
* The travel time between floors will be a constant 10s.
* The output of a run will be the total travel time and the floors visited in the order they were visited.

### Non-functional Requirements

* The elevator will stop on intermediate floors on the way instead of visiting the floors in the exact order given. Given a starting floor of 12, a direction of down, and a list of floors to visit [2, 9, 1, 32] the elevator would visit the floors in the order [9, 2, 1, 32].
* Given a direction, the elevator will move in that direction first, even if another given floor in the opposite direction is closer to the starting position.
* If the starting floor for a run is different than the ending floor of the previous run, there will be travel time to arrive at the new starting floor.

## Installing the simulator

### Prerequisites
* Node.js and npm must be installed on your system. See https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
* You must install the typescript compiler using the command (sudo access may be required):
    * `npm install -g typescript` 

### Installation
1. Clone the package into your local repository
    * Https: `git clone https://github.com/wintersca/elevator.git`
    * Github CLI: `gh repo clone wintersca/elevator`
2. Navigate into the Elevator directory
    * `cd elevator`
3. Install required pacakges and build the script
    * `npm run build`
4. Run the Script
    * `npm run start`

### Troubleshooting
If there is an error, you can clean the project and uninstall all packages by running `npm run clean`. Then run the build command again to reinstall all required packages.

## Running the Elevator Simulator
After following the installation instructions above, you should be able to run the simulator and travel between floors at your leisure. To start a session run the command: 

`npm run start`

The rules below will be shown as soon as you start the simulator.

### Rules

1. When starting a run, you are required to enter a starting floor. Which represents the floor you are on when you call the elevator.

2. For all runs, you will need to input a direction `u` or `d` representing up and down respectively. This represents pressing the call button on the elevator.

3. All floors supplied in the array will be assumed to have been pressed at the same time, so the elevator will travel in the direction specified first, stopping at all floors in that direction, and then travel to any floors that were in the opposite direction of the call.
    * For example given a starting floor of 12, a direction of down, and a list of floors to visit [1, 9, 2, 34] the elevator will travel down and stop at floors 9, 2, 1 in that order before traveling to floor 34.

4. Fractional floors (e.g. 3.5) are not allowed.

5. After the final floor is reached, the total travel time, the list of floors visited in the order they were visited, and the current floor will be shown.

6. Runs don't need to start at the floor the last run ended on.
    * After the first run, pressing the call button (e.g. entering a starting floor and `u` or `d`) will call the elevator from the end position of the last run. Travel time will be added to the total run time representing the elevator traveling from its previous position to the new starting floor.


