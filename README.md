# shloball

Its a free to play game. It's like Deathball and Rocket League, a 2D multiplayer (2 players to start) game where each player is playing on the same screen. Each player is trying to get the ball in the opponent's net. The players are dogs. There are a variety of levels, with varying obstacles, but the general shape of each stage is rectangular. The gameplay is fast-pace and chaotic, but rewards a skilled player.

The game is implemented in Typescript for the browser. It uses the standard 2D HTML5 canvas.

Arena Dimensions
* 16:9 Aspect Ratio
* 960 pixels by 540 pixels

GameObject Dimensions
* Goal is 180 pixels tall and 20 pixels deep
* The ball is a circle with radius of 15 pixels
* The players are "dogs" with rough dimensions of 60 pixels wide and 30 pixels tall. 20 pixels tall when crouched.
* 20 pixels are dedicated on top and bottom to the floor and ceiling
* The left and right walls are set 40 pixels in, but the goal boundary is only 20 pizels in. This leaves room for 20 pixels between each goal and the boundary.
* The corners of the playing field are rounded with a border radius of 30 pixels.

Player Controls
* Player one is on the left and uses the A, W, S, D to control direction and the C key to jump.
* Player two is on the right and uses the Arrow keys to control direction and the L key to jump.
* When the player is on the ground, the down directional input makes the player 'duck' down.
* Jumping when the player is ducked, makes the player 'slide' along the ground to the left or right according to the direction the player is facing
* The player can jump while already in the air, as many times as they want, but the rate of jumping is limited to 5 jumps per second
* Each time the player jumps, a circle spawns at the player's center of mass. The circle's radius grows linearly from 10 pixels to 30 pixels over in 500 milliseconds. This circle is able to "hit" the ball. The circle disappears after 10 seconds, and only one circle can exist at a time for each player. So, while player one has a circle on the screen from a previous jump, subsequent jumps will not create a circle until the 5 seconds has passed and the existing circle has disappeared.
