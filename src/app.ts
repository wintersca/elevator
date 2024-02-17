import * as elevator from './elevator.js'
import { colors } from './constants.js';

console.log(`${colors.bg.black}${colors.fg.yellow}` +
'#######   ###                                  ##                      \n' +
'##         ##                                  ##                      \n' +
'##         ##      #####   ### ###   ######  ######    #####   ## ###  \n' +
'#####      ##     ##   ##   ## ##   ##   ##    ##     ##   ##  ###     \n' +
'##         ##     #######   ## ##   ##   ##    ##     ##   ##  ##      \n' +
'##         ##     ##         ###    ##  ###    ##     ##   ##  ##      \n' +
'#######   ####     #####     ###     ### ##     ###    #####   ##      \n' +
'                                                                       \n' +
' #####     ##                                                          \n' +
'##   ##                                                                \n' +
'##       ####     ### ##                                               \n' +
' #####     ##     ## # ##                                              \n' +
'     ##    ##     ## # ##                                              \n' +
'##   ##    ##     ## # ##                                              \n' +
' #####   ######   ##   ##                                              \n' +
'\n' +
'Welcome to Elevator Simulator, a new and exciting game.\n' +
`Hold on to your seat as you experience the thrill of riding an elevator!\n\n`)

elevator.printRules('./README.md');

elevator.getStartingFloor();