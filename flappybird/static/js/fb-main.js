// Debug
var debugmode = false;

// Game states
var states = Object.freeze({
    SplashScreen: 0,
    GameScreen: 1,
    ScoreScreen: 2
});

// Logic variables
var currentscore;
var gravity = 0.25;
var velocity = 0;
var position = 180;
var rotation = 0;
var jump = -4.6;

// Punctuation
var score = 0;
var highscore = 0;

// Pipe
var pipeheight = 90;
var pipewidth = 52;
var pipes = new Array();

// Replay
var replayclickable = false;

// Sounds
var volume = 30;
var soundJump = new buzz.sound("assets/sounds/sfx_wing.ogg");
var soundScore = new buzz.sound("assets/sounds/sfx_point.ogg");
var soundHit = new buzz.sound("assets/sounds/sfx_hit.ogg");
var soundDie = new buzz.sound("assets/sounds/sfx_die.ogg");
var soundSwoosh = new buzz.sound("assets/sounds/sfx_swooshing.ogg");
buzz.all().setVolume(volume);

// Loop
var loopGameloop;
var loopPipeloop;

// --------------------------------------------------- FUNCTIONS --------------------------------------------------- 

$(document).ready(function() {
    if (window.location.search == "?debug")
        deugmode = true;
    if (window.location.search == "?easy")
        pipeheight = 200;

    var savedscore = getCookie("highscore");
    if (savedscore !== "")
        highscore = parseInt(savedscore);

    showSplash();
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length)
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = "expires" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function showSplash() {
    // Current game state
    currentstate = states.SplashScreen;

    // Initial values
    velocity = 0;
    position = 180;
    rotation = 0;
    score = 0;

    // Reset player positions 
    $("#player").css({ y: 0, x: 0 });
    updatePlayer($("#player"));

    soundSwoosh.stop();
    soundSwoosh.play();

    // Clean the pipes
    $(".pipe").remove();
    pipes = new Array();

    // Start animations again
    $(".animated").css('animation-play-state', 'running');
    $(".animated").css('-webkit-animation-play-state', 'running');

    // Splash Screen appear
    $("#splash").transition({ opacity: 1 }, 2000, 'ease');
}

function startGame() {
    // Game status
    currentstate = states.GameScreen;

    // Splash screen disappear
    $("#splash").stop();
    $("#splash").transition({ opacity: 0 }, 500, 'ease');

    // Show the score
    setBigScore();

    // Debug
    if (debugmode) {
        $(".boundingbox").show();
    }

    // Start the game loops
    var updaterate = 1000.0 / 60.0; // 60 fps
    loopGameloop = setInterval(gameloop, updaterate);
    loopPipeloop = setInterval(updatePipes, 1400);

    // Jump to start the game
    playerJump();
}

function updatePlayer(player) {
    // Rotation
    rotation = Math.min((velocity / 10) * 90, 90);

    // Applying rotation in CSS
    $(player).css({ rotate: rotation, top: position });
}

function gameloop() {
    var player = $("#player");

    // player position and speed
    velocity += gravity;
    position += velocity;

    // Apply the new player values
    updatePlayer(player);

    // Create the bouding box hack for the player
    var box = document.getElementById('player').getBoundingClientRect();
    var origwidth = 34.0;
    var origheight = 24.0;

    var boxwidth = origwidth - (Math.sin(Math.abs(rotation) / 90) * 8);
    var boxheight = (origheight + box.height) / 2;
    var boxleft = ((box.width - boxwidth) / 2) + box.left;
    var boxtop = ((box.height - boxheight) / 2) + box.top;
    var boxright = boxleft + boxwidth;
    var boxbottom = boxtop + boxheight;

    // If you hit the footer, the player dies and returns to the game
    if (box.bottom >= $("#footer-game").offset().top) {
        playerDead();
        return;
    }

    // If you try to go over the top, it will reset his position at the top
    var ceiling = $("#ceiling");
    if (boxtop <= (ceiling.offset().top + ceiling.height()))
        position = 0;

    // If there is no pipe in the game it returns
    if (pipes[0] == null)
        return;

    // Determines the area for the next pipes
    var nextpipe = pipes[0];
    var nextpipeupper = nextpipe.children(".pipe_upper");

    var pipetop = nextpipeupper.offset().top + nextpipeupper.height();
    var pipeleft = nextpipeupper.offset().left - 2; // For some reason it starts with the displacement of the inner tubes, and not the outer tubes
    var piperight = pipeleft + pipewidth;
    var pipebottom = pipetop + pipeheight;

    // What happens if it falls into the tube
    if (boxright > pipeleft) {
        // Are we inside the tubes, have we gone through the top and bottom tubes?
        if (boxtop > pipetop && boxbottom < pipebottom) {
            // yes, we are within limits!

        } else {
            // we can't jump in the barrel, you died! return game!
            playerDead();
            return;
        }
    }


    // Have we passed the pipe yet?
    if (boxleft > piperight) {
        // if yes, remove and another one appears
        pipes.splice(0, 1);

        // scores from the moment it passes
        playerScore();
    }

}

$(document).keydown(function(e) {
    // Jump on the space bar
    if (e.keyCode == 32) {
        if (currentstate == states.ScoreScreen)
            $("#replay").click();
        else
            screenClick();
    }
});

// starts the game by clicking on the screen or space
if ("ontouchstart" in window)
    $(document).on("touchstart", screenClick);
else
    $(document).on("mousedown", screenClick);

function screenClick() {
    if (currentstate == states.GameScreen)
        playerJump();
    else if (currentstate == states.SplashScreen)
        startGame();
}

// jump function with sound
function playerJump() {
    velocity = jump;
    soundJump.stop();
    soundJump.play();

}

function setBigScore(erase) {
    var elemscore = $("#bigscore")
    elemscore.empty();

    if (erase)
        return;

    var digits = score.toString().split('');
    for (var i = 0; i < digits.length; i++)
        elemscore.append("<img src='assets/sprites/font_big_" + digits[i] + ".png' alt='" + digits[i] + "'>");
}

function setSmallScore() {

    var elemscore = $("#currentscore")
    elemscore.empty();

    var digits = score.toString().split('');
    for (var i = 0; i < digits.length; i++)
        elemscore.append("<img src='assets/sprites/font_small_" + digits[i] + ".png' alt='" + digits[i] + "'>");
}

function setHighScore() {

    var elemscore = $("#highscore")
    elemscore.empty();

    var digits = score.toString().split('');
    for (var i = 0; i < digits.length; i++)
        elemscore.append("<img src='assets/sprites/font_small_" + digits[i] + ".png' alt='" + digits[i] + "'>");
}

function setMedal() {
    var elemmedal = $("#medal");
    elemmedal.empty();

    if (score < 10)
        return;

    if (score >= 10)
        medal = "bronze";
    if (score >= 20)
        medal = "silver";
    if (score >= 30)
        medal = "gold";
    if (score >= 40)
        medal = "platinum";

    elemmedal.append('<img src="assets/sprites/medal_' + medal + '.png" alt="' + medal + '">');

    return true;
}

function playerDead() {
    $(".animated").css("animation-play-state", 'paused');
    $(".animated").css("-webkit-animation-play-state", 'paused');

    var playerbottom = $("#player").position().top + $("#player").width();
    var floor = $("#flyarea-game").height();
    var movey = Math.max(0, floor - playerbottom);
    $("#player").transition({ y: movey + 'px', rotate: 90 }, 1000, 'easeInOutCubic');

    currentstate = states.ScoreScreen;

    clearInterval(loopGameloop);
    clearInterval(loopPipeloop);
    loopGameloop = null;
    loopPipeloop = null;

    if (isIncompatible.any()) {
        showScore();
    } else {
        soundHit.play().bindOnce("ended", function() {
            soundDie.play().bindOnce("ended", function() {
                showScore();
            });
        });
    }

}


function showScore() {
    $("#scoreboard").css("display", "block");

    setBigScore(true);

    if (score > highscore) {
        highscore = score;
        setCookie("hightscore", highscore, 999);

    }

    setSmallScore();
    setHighScore();
    var wonmedal = setMedal();

    soundSwoosh.stop();
    soundSwoosh.play();


    $("#scoreboard").css({ y: '40px', opacity: 0 });
    $("#replay").css({ y: '40px', opacity: 0 });
    $("#scoreboard").transition({ y: '0px', opacity: 1 }, 600, 'ease', function() {
        soundSwoosh.stop();
        soundSwoosh.play();
        $("#replay").transition({ y: '0px', opacity: 1 }, 600, 'ease');

        if (wonmedal) {
            $("#medal").css({ scale: 2, opacity: 0 });
            $("#medal").transition({ scale: 1, opacity: 1 }, 1200, 'ease');
        }


    });

    replayclickable = true;


}

$("#replay").click(function() {

    if (!replayclickable)
        return;
    else
        replayclickable = false;

    soundSwoosh.stop();
    soundSwoosh.play();

    $("#scoreboard").transition({ y: '-40px', opacity: 1 }, 1000, 'ease', function() {
        $("#scoreboard").css("display", "none");

        showSplash();
    });
});

function playerScore() {

    score += 1;
    soundScore.stop();
    soundScore.play();
    setBigScore();
};

function updatePipes() {
    $(".pipe").filter(function() { return $(this).position().left <= -100; }).remove();

    var padding = 80;
    var constraint = 420 - pipeheight - (padding * 2);
    var topheight = Math.floor((Math.random() * constraint) + padding);
    var bottomheight = (420 - pipeheight) - topheight;
    var newpipe = $('<div class="pipe animated"><div class="pipe_upper" style="height: ' + topheight + 'px;"></div><div class="pipe_lower" style="height: ' + bottomheight + 'px;"></div></div>');
    $("#flyarea-game").append(newpipe);
    pipes.push(newpipe);
}

var isIncompatible = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Safari: function() {
        return (navigator.userAgent.match(/OS X.*Safari/) && !navigator.userAgent.match(/Chrome/));
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isIncompatible.Android() || isIncompatible.BlackBerry() || isIncompatible.iOS() || isIncompatible.Opera() || isIncompatible.Safari() || isIncompatible.Windows());
    }
};