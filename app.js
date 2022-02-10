/* eslint-env jquery */

let $board = $("#gameboard");
let $player = $("#player");
let $cpu = $("#cpu");



const game = {
    player: {
        score: 0,
        top: $player.position().top,
        right: $player.position().left + $player.width(),
        left: $player.position().left,
        bottom: $player.position().top + $player.height(),
    },
    cpu: {
        score: 0,
        top: $cpu.position().top,
        right: $cpu.position().left + $cpu.width(),
        bottom: $cpu.position().top + $cpu.height(),
        left: $cpu.position().left,
        center: 0,
        speed: 0,
    },
    ball: {
        speedX: 0,
        speedY: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        center: 0,
        directionX: 0,
        directionY: 0,
    },
    gameboard: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        centerX: 0,
        centerY: 0
    },
    gamestate: "off",
}

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

const moveDown = ($paddle) => {
    if (game.player.bottom <= game.gameboard.bottom) {
        game.player.top += 12;
        game.player.bottom += 12;
    } else game.player.top = game.gameboard.bottom - 144 + 0.1;
    $paddle.css("top", `${game.player.top}px`);
}
const moveUp = ($paddle) => {
    if (game.player.top >= game.gameboard.top) {
        game.player.top -= 12;
        game.player.bottom -= 12;
    } else game.player.top = game.gameboard.top - 0.1;
    $paddle.css("top", `${game.player.top}px`);
}

const generateBall = () => {
    const $ball = $("<div>").attr("id", "ball");
    game.ball.left = game.gameboard.centerX;
    game.ball.top = game.gameboard.centerY;
    setVelocity();
    $("#gameboard").append($ball);
}

const setVelocity = () => { //gives ball a speed relative to viewboard size     
    game.ball.speedX = Math.floor($board.width() / 100);
    game.ball.speedY = Math.random() * 5;
    game.ball.directionX = Math.floor(Math.random() * 2);
    game.ball.directionY = Math.floor(Math.random() * 2);
}

const moveBall = () => {
    if (game.ball.directionX === 0) { //0 = left 1 = right
        game.ball.left -= game.ball.speedX;
    } else {
        game.ball.left += game.ball.speedX;
    }

    if (game.ball.directionY === 0) { //0 = up 1 = down
        game.ball.top -= game.ball.speedY;
    } else {
        game.ball.top += game.ball.speedY;
    }
    // console.log($("#ball").position());
    // console.log($("#gameboard").position());

    $("#ball").css("left", game.ball.left);
    $("#ball").css("top", game.ball.top);

    if (game.ball.left + $("#ball").width() >= game.gameboard.right) {
        console.log("CPU scores");
        $("#ball").remove();
        game.cpu.score += 1;
        updateScreen();
    } else if (game.ball.left <= game.gameboard.left) {
        console.log("player scores");
        $("#ball").remove();
        game.player.score += 1;
        updateScreen();
    }

}

const checkCollision = () => {

    if (game.ball.top <= game.gameboard.top) {
        console.log("collided with board top");
        game.ball.directionY = 1;
    } else if (game.ball.bottom >= game.gameboard.bottom) {
        console.log("collided with board bottom");
        game.ball.directionY = 0;
    }

    if (game.ball.right >= game.player.left && game.ball.left <= game.player.right) {
        if (game.ball.top + $("#ball").height() / 2 >= game.player.top && game.ball.bottom - $("#ball").height() / 2 <= game.player.bottom) {
            game.ball.speedX += 0.2;
            game.ball.directionX = 0;
            console.log("collided with player side");
        }
        else if (game.ball.top + $("#ball").height() / 2 < game.player.top && game.ball.bottom >= game.player.top || (game.ball.bottom - $("#ball").height() / 2 > game.player.bottom && game.ball.top <= game.player.bottom)) {
            game.ball.speedY += 2;
            game.ball.speedX += 2;
            game.ball.directionX = 0;
            console.log("collided with player edge");
        }
    }

    if (game.ball.right >= game.cpu.left && game.ball.left <= game.cpu.right) {
        if (game.ball.top + $("#ball").height() / 2 >= game.cpu.top && game.ball.bottom - $("#ball").height() / 2 <= game.cpu.bottom) {
            game.ball.speedX += 0.2;
            game.ball.directionX = 1;
            console.log("collided with cpu side");
        }
        else if (game.ball.top + $("#ball").height() / 2 < game.cpu.top && game.ball.bottom >= game.cpu.top || (game.ball.bottom - $("#ball").height() / 2 > game.cpu.bottom && game.ball.top <= game.cpu.bottom)) {
            game.ball.speedY += 2;
            game.ball.speedX += 2;
            game.ball.directionX = 1;
            console.log("collided with cpu edge");
        }
    }
}

const updateCoordinates = () => {
    game.player.right = $player.position().left + $("#player").width();
    game.player.bottom = $player.position().top + $player.height();

    game.ball.right = $("#ball").position().left + $("#ball").width();
    game.ball.bottom = $("#ball").position().top + $("#ball").height();

    game.cpu.bottom = $("#cpu").position().top + $("#cpu").height();
}

const cpuMove = () => {
    game.cpu.center = game.cpu.top + $("#cpu").height() / 2
    game.ball.center = game.ball.top + $("#ball").height() / 2

    if (game.cpu.center !== game.ball.center) {
        if (game.cpu.center > game.ball.center && game.cpu.top >= game.gameboard.top) {
            game.cpu.top -= game.cpu.speed;
        } else if (game.cpu.bottom <= game.gameboard.bottom) {
            game.cpu.top += game.cpu.speed;
        }
    }
    $("#cpu").css("top", game.cpu.top);
}

const updateScreen = () => {
    $("#playerScore").text(game.player.score);
    $("#cpuScore").text(game.cpu.score);
    if (game.player.score === 10 || game.cpu.score === 10) {
        clearInterval(gameClock);
        $("#start").css("opacity", 1);
        if (game.player.score === 10) {
            $("#start").text("Player wins");
        } else $("#start").text("CPU wins");
    } else {
        generateBall();
    }
}

const initialise = () => {
    game.gameboard.top = $("#gameboard").position().top;
    game.gameboard.left = $("#gameboard").position().left;
    game.gameboard.bottom = $("#gameboard").position().top + $("#gameboard").height();
    game.gameboard.right = $("#gameboard").position().left + $("#gameboard").width();
    game.gameboard.centerX = (game.gameboard.right + game.gameboard.left) / 2;
    game.gameboard.centerY = game.cpu.top + $("#cpu").height() / 2;
}

$(() => {
    //initalise game
    initialise();
    //start game

    const $player = $("#player");
    $(document).keydown(function (event) {
        if (event.key === "ArrowDown") {
            moveDown($player);
        } else if (event.key === "ArrowUp") {
            moveUp($player);
        }

        // alert(`${event.key} was pressed`);
    });
    $("button").on("click", (event) => {
        const buttonID = $(event.currentTarget).attr("id");
        console.log(buttonID);
        $("#start").text("Press Enter to start \n Use Up/Down key to move paddle");
        game.cpu.speed = parseInt(buttonID);
        $("#button").remove();
        window.addEventListener("keydown", function (e) {
            if (e.key === 'Enter') {
                $("#start").css("opacity", 0);
                $(".tag").remove();
                game.gamestate = "start";
                generateBall();
            }
        }, false);
    });
})

const gameClock = setInterval(() => {
    if (game.gamestate === "start") {
        moveBall();
        updateCoordinates();
        checkCollision();
        cpuMove();
    }
}, 15);