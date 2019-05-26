(function() {
    var board = $("board");
    // if board is different, these values need changing
    // maximum board size is 12, as thats how many listeners i've put
    var collimit = 7; //  min 7 Max 12
    var rowlimit = 6; // minmax 6

    // rounds change size by save in local storage
    if (localStorage.rounds) {
        localStorage.rounds = Number(localStorage.rounds) + 1;
    } else {
        localStorage.rounds = 0;
    }
    if (Number(localStorage.rounds) > 3) {
        localStorage.rounds = 0;
    }
    // varations for game size
    var round = Number(localStorage.rounds);
    if (round === 1) {
        collimit = 8; // 1-7 Max 12
        rowlimit = 6; // 1-6 Max 8
    } else if (round === 2) {
        collimit = 12; // 1-7 Max 12
        rowlimit = 6; // 1-6 Max 8
    }

    var activecolumn;

    var xcol;
    var ycol;

    // bool player turn
    var player2turn = false;
    var color;
    var resetrdy = false;

    // animation things
    var animationlock = false;
    var frametout;
    var winner = "";
    var breakcall;
    // wavesAnimation
    var waveframe = 1;
    // frame offsets for different wave effects
    var offsetwave2 = 1;
    var offsetwave3 = 3;
    var offsetwave4 = 6;
    var offsetwave5 = 10;
    var offsetwave6 = 12;
    // frame delay controls
    var physA = 35;
    var winA = 140;
    // for visual effect
    var highlights = [];

    // for demostration only
    demo = false;
    if (demo) {
        physA = 1000;
        winA = 1000;
    }

    buildBoard();

    function buildBoard() {
        var randomposition = Math.random();
        // building board here so html is not messy, also allows to build games of other size
        var domparent = $("#board");
        if (randomposition > 0.5) {
            domparent.css("margin-left", (2 - round) * 12 + "%");
            domparent.css("margin-right", "25%");
        }
        if (randomposition > 0.75) {
            domparent.css("margin-top", "6%");
        } else if (randomposition < 0.25) {
            domparent.css("margin-top", "2%");
        }
        var domstuff = "";
        var gridrows = "";

        for (var d = 1; d <= collimit; d++) {
            for (var r = 1; r <= rowlimit; r++) {
                domstuff +=
                    "<div class = " +
                    "'" +
                    "slot col" +
                    d +
                    " row" +
                    r +
                    "'" +
                    "></div>";
            }
        }
        domparent.append(domstuff);
        for (var t = 0; t < rowlimit; t++) {
            gridrows += " 75px";
        }
        domparent.css("grid-template-rows", gridrows);

        domparent = $("#pucks");
        if (randomposition > 0.5) {
            domparent.css("margin-left", (2 - round) * 12 + "%");
            domparent.css("margin-right", "25%");
        }
        if (randomposition > 0.75) {
            domparent.css("margin-top", "6%");
        } else if (randomposition < 0.25) {
            domparent.css("margin-top", "2%");
        }
        domstuff = "";
        for (var d = 1; d <= collimit; d++) {
            for (var r = 1; r <= rowlimit; r++) {
                domstuff +=
                    "<div class = " +
                    "'" +
                    "puck col" +
                    d +
                    " row" +
                    r +
                    "'" +
                    "></div>";
            }
        }
        domparent.append(domstuff);
        domparent.css("grid-template-rows", gridrows);

        breakcall = setTimeout(function() {
            introAnimation();
        }, winA / 2);
    }

    $(document).keypress(function(e) {
        if (e.keyCode === 114 && winner != "" && resetrdy) {
            // game reset
            location.reload();
        }
    });

    var columnitems;
    var coltype;
    $(
        ".puck.col1, .puck.col2, .puck.col3, .puck.col4, .puck.col5, .puck.col6, .puck.col7, .puck.col8, .puck.col9, .puck.col10, .puck.col11, .puck.col12"
    ).on("mousedown mouseover mouseout", function(e) {
        if (e.type === "mousedown" && !animationlock && winner === "") {
            columnitems = findallMyClasses($(this), "pucks", true, false);
            if (columnitems.eq(0).text() != "O") {
                if (player2turn) {
                    color = "yellow";
                    $("#tinyinformatic")
                        .css("color", "red")
                        .text("O");
                } else {
                    color = "red";
                    $("#tinyinformatic")
                        .css("color", "yellow")
                        .text("O");
                }
                columnitems.eq(0).text("O");
                animationlock = true;
                frametout = setTimeout(function() {
                    physicsAnimation(columnitems, 0, color);
                }, physA);
            }
        } else if (e.type === "mouseover" && !animationlock) {
            coltype = findallMyClasses($(this), "cols", true, false);
            for (var r = 0; r < coltype.length; r++) {
                if ($(coltype[r]).hasClass("slot")) {
                    $(coltype[r]).addClass("sel");
                }
            }
        } else if (e.type === "mouseout" && !animationlock) {
            coltype = findallMyClasses($(this), "cols", true, false);
            for (var r = 0; r < coltype.length; r++) {
                if ($(coltype[r]).hasClass("slot")) {
                    $(coltype[r]).removeClass("sel");
                }
            }
        }
    });

    function introAnimation() {
        clearTimeout(breakcall);
        for (var w = 0; w < waveframe; w++) {
            $(".slot.col" + (waveframe - w) + ".row" + (rowlimit - w)).text(
                " [ "
            );
        }
        for (var w = 0; w < waveframe - offsetwave2; w++) {
            $(
                ".slot.col" +
                    (waveframe - offsetwave2 - w) +
                    ".row" +
                    (rowlimit - w)
            ).text("[ ]");
        }
        if ($(".slot.col" + collimit + ".row1").text() !== "[ ]") {
            breakcall = setTimeout(function() {
                introAnimation();
            }, winA / 2);
            waveframe++;
        } else {
            // end anims use same waveframe so resetting it
            waveframe = 1;
        }
    }

    function physicsAnimation(columni, frame, colour) {
        clearTimeout(frametout);
        columni
            .eq(frame)
            .text("O")
            .addClass(colour);
        if (columni.eq(frame + 1).length != 0) {
            if (columni.eq(frame + 1).text() != "O") {
                columni
                    .eq(frame)
                    .text("")
                    .removeClass(colour);
                columni
                    .eq(frame + 1)
                    .text("O")
                    .addClass(colour);
                frametout = setTimeout(function() {
                    physicsAnimation(columni, (frame += 1), colour);
                }, physA);
            } else {
                animationlock = false;
                player2turn = !player2turn;
                $(columni)
                    .eq(frame)
                    .addClass("animatepuck");
                //color the slot under this puck
                $(".slot.row" + (frame + 1) + "." + activecolumn).addClass(
                    "hilit" + color
                );
                fireWinChecks(
                    frame,
                    parseInt(activecolumn.substring(3)),
                    colour
                );
            }
        } else {
            animationlock = false;
            player2turn = !player2turn;
            $(columni)
                .eq(frame)
                .addClass("animatepuck");
            //color the slot under this puck
            $(".slot.row" + (frame + 1) + "." + activecolumn).addClass(
                "hilit" + color
            );

            // check winnings
            fireWinChecks(frame, parseInt(activecolumn.substring(3)), colour);
        }
    }
    var endframe = 0;
    var enditems = [];
    for (var i = 1; i < 7; i++) {
        enditems.push(".slot.col1.row" + i);
    }
    for (var o = 1; o < 5; o++) {
        enditems.push(".slot.row6.col" + o);
    }
    var wintxt = ["W", "I", "N", "S"];

    // frames 1 - 4 : winning pieces highLight
    // frames 5 - 11: winner
    // frames 12 - 15: wins
    function winAnimation() {
        clearTimeout(breakcall);
        if (endframe < 5) {
            $(highlights[endframe]).css("color", "white");
        } else if (endframe - 5 < enditems.length) {
            if (endframe - 5 < winner.length) {
                $(enditems[endframe - 5])
                    .css("color", winner)
                    .text(winner[endframe - 5].toUpperCase());
            } else if (endframe - 5 < 6) {
                $(enditems[endframe - 5]).text("");
            } else {
                $(enditems[endframe - 5])
                    .text(wintxt[endframe - 5 - 6])
                    .css("color", winner);
            }
        }
        if (endframe - 5 < enditems.length) {
            breakcall = setTimeout(function() {
                winAnimation();
            }, winA / 2);
            endframe++;
        } else {
            $(".puck")
                .removeClass("yellow")
                .removeClass("red")
                .text("");
            breakcall = setTimeout(function() {
                wavesAnimation();
            }, winA * 2);
        }
    }

    function wavesAnimation() {
        clearTimeout(breakcall);
        // text wave
        for (var w = 0; w < waveframe; w++) {
            $(".slot.col" + (waveframe - w) + ".row" + (rowlimit - w)).text(
                "{ ]"
            );
        }
        // text wave
        for (var w = 0; w < waveframe - offsetwave2; w++) {
            $(
                ".slot.col" +
                    (waveframe - offsetwave2 - w) +
                    ".row" +
                    (rowlimit - w)
            ).text("{ }");
        }
        // text wave
        for (var w = 0; w < waveframe - offsetwave3; w++) {
            $(
                ".slot.col" +
                    (waveframe - offsetwave3 - w) +
                    ".row" +
                    (rowlimit - w)
            )
                .text("/ }")
                .css("color", "#663d00");
        }
        // text wave
        for (var w = 0; w < waveframe - offsetwave4; w++) {
            $(
                ".slot.col" +
                    (waveframe - offsetwave4 - w) +
                    ".row" +
                    (rowlimit - w)
            )
                .text("/ /")
                .css("color", "#331f00");
        }
        // text wave
        for (var w = 0; w < waveframe - offsetwave5; w++) {
            $(
                ".slot.col" +
                    (waveframe - offsetwave5 - w) +
                    ".row" +
                    (rowlimit - w)
            )
                .text(" /")
                .css("color", "#1a0f00");
        }
        // last wipe wave
        for (var w = 0; w < waveframe - offsetwave6; w++) {
            $(
                ".slot.col" +
                    (waveframe - offsetwave6 - w) +
                    ".row" +
                    (rowlimit - w)
            ).text("");
        }
        if ($(".slot.col" + collimit + ".row1").text() !== "") {
            breakcall = setTimeout(function() {
                wavesAnimation();
            }, winA / 2);
            waveframe++;
        } else {
            breakcall = setTimeout(function() {
                resetAnimation();
            }, winA);
            waveframe = 1;
        }
    }

    var infoarray = ["R", "-", "R", "E", "S", "E", "T"];
    function resetAnimation() {
        clearTimeout(breakcall);
        // text reset info typed
        for (var w = 0; w < waveframe; w++) {
            $(".slot.col" + (waveframe - w) + ".row2")
                .text("/")
                .css("color", "orange");
        }
        for (var w = 0; w < waveframe - offsetwave2; w++) {
            $(".slot.col" + (waveframe - offsetwave2 - w) + ".row2").text("-");
        }
        for (var w = 0; w < waveframe - offsetwave3; w++) {
            $(".slot.col" + (waveframe - offsetwave3 - w) + ".row2").text("\\");
        }
        for (var w = 0; w < waveframe - offsetwave4; w++) {
            $(".slot.col" + (waveframe - offsetwave4 - w) + ".row2").text("|");
        }
        for (var w = 0; w < waveframe - offsetwave5; w++) {
            $(".slot.col" + (waveframe - offsetwave5 - w) + ".row2").text("/");
        }
        waveframe++;
        if ($(".slot.col" + collimit + ".row2").text() !== "/") {
            breakcall = setTimeout(function() {
                resetAnimation();
            }, winA / 4);
        } else {
            for (var q = 0; q < infoarray.length; q++) {
                $(".slot.col" + (q + 1) + ".row2")
                    .text(infoarray[q])
                    .css("color", "white");
            }
            resetrdy = true;
            breakcall = setTimeout(function() {
                idleAnimation();
            }, winA);
        }
    }

    var idletargets = $(".slot");
    function idleAnimation() {
        clearTimeout(breakcall);
        for (var r = 0; r < idletargets.length; r++) {
            if (Math.random() > 0.7) {
                if (idletargets.eq(r).text() === "") {
                    idletargets
                        .eq(r)
                        .text("/")
                        .css("color", color);
                } else if (idletargets.eq(r).text() === "/") {
                    idletargets.eq(r).text("-");
                } else if (idletargets.eq(r).text() === "-") {
                    idletargets.eq(r).text("\\");
                } else if (idletargets.eq(r).text() === "\\") {
                    idletargets.eq(r).text("|");
                } else if (idletargets.eq(r).text() === "|") {
                    idletargets.eq(r).text("/");
                }
            }
        }
        breakcall = setTimeout(function() {
            idleAnimation();
        }, winA);
    }

    function fireWinChecks(id, column, colour) {
        // if parent undefined this is parent, then its passed to children,
        // last child should pass hits to parent
        var pucks = $("#pucks");
        var count;
        var win = false;

        var vertneighbors = findallMyClasses(
            $(".puck.col" + column).eq(id),
            "pucks",
            false,
            true
        );
        var horizontalneighbors = findallMyClasses(
            $(".puck.col" + column),
            "pucks",
            true,
            false
        );

        // check this row - VERTICAL - 0,1
        count = 0;
        for (var v = 0; v < vertneighbors.length; v++) {
            if ($(vertneighbors[v]).hasClass(colour) === true) {
                count++;
                // add candidates to array here for highlight effect for the end
                highlights.push(vertneighbors[v]);
            } else {
                count = 0;
                highlights = [];
            }
            if (count >= 4) {
                win = true;
                break;
            }
        }

        // check nearby neighbors - DIAGONAL - calling them R and L axis
        if (!win) {
            var friendsarrayR = [];
            var friendsarrayL = [];
            count = 0;

            // min id = 0 , min col = 1
            var friendsarray = [];
            var friendsid = id;
            var friendscol = column;
            // first moving origo to toppest left corner
            while (friendsid > 0 && friendscol > 1) {
                friendsid--;
                friendscol--;
            }
            // walking down n right
            while (friendsid < rowlimit - 1 && friendscol < collimit) {
                friendsarrayL.push(
                    ".puck.row" + (friendsid + 1) + ".col" + friendscol
                );
                friendsid++;
                friendscol++;
                if (friendsid === rowlimit - 1 || friendscol === collimit) {
                    friendsarrayL.push(
                        ".puck.row" + (friendsid + 1) + ".col" + friendscol
                    );
                }
            }
            // moving back to checking center
            friendsid = id;
            friendscol = column;
            // then moving origo to toppest right corner
            while (friendsid > 0 && friendscol < collimit) {
                friendsid--;
                friendscol++;
            }
            // walking down n left
            while (friendsid < rowlimit - 1 && friendscol > 0) {
                friendsarrayR.push(
                    ".puck.row" + (friendsid + 1) + ".col" + friendscol
                );
                friendsid++;
                friendscol--;
                if (friendsid === rowlimit - 1 || friendscol === 0) {
                    friendsarrayR.push(
                        ".puck.row" + (friendsid + 1) + ".col" + friendscol
                    );
                }
            }
            // looping through the arrays
            // check AXIS L
            count = 0;
            for (var l = 0; l < friendsarrayL.length; l++) {
                if ($(friendsarrayL[l]).hasClass(colour) === true) {
                    count++;
                    // add candidates to array here for highlight effect for the end
                    highlights.push(friendsarrayL[l]);
                } else {
                    count = 0;
                    highlights = [];
                }
                if (count >= 4) {
                    win = true;
                    break;
                }
            }
            // check AXIS R
            if (!win) {
                count = 0;
                for (var r = 0; r < friendsarrayR.length; r++) {
                    if ($(friendsarrayR[r]).hasClass(colour) === true) {
                        count++;
                        // add candidates to array here for highlight effect for the end
                        highlights.push(friendsarrayR[r]);
                    } else {
                        count = 0;
                        highlights = [];
                    }
                    if (count >= 4) {
                        win = true;
                        break;
                    }
                }
            }
        }

        // check this column - HORIZONTAL-6,7
        count = 0;
        if (!win) {
            for (var h = 0; h < horizontalneighbors.length; h++) {
                if ($(horizontalneighbors[h]).hasClass(colour) === true) {
                    count++;
                    // add candidates to array here for highlight effect for the end
                    highlights.push(horizontalneighbors[h]);
                } else {
                    count = 0;
                }
                if (count >= 4) {
                    win = true;
                }
            }
        }
        if (win) {
            winner = colour;
            breakcall = setTimeout(function() {
                winAnimation();
            }, 80);
            $("#tinyinformatic")
                .css("color", "black")
                .text("");
        } else {
            highlights = [];
        }
    }

    // find my all classes of the selection , narrowing down results
    // target , cols / pucks / slots / rows, column, row
    // jQuery , string, bool, bool
    function findallMyClasses(selection, classfind, colrequest, rowrequest) {
        var classarr = selection.attr("class").split(" ");
        var column = "";
        var row = "";

        if (colrequest) {
            for (var c = 0; c < classarr.length; c++) {
                if (classarr[c].substring(0, 3) === "col") {
                    column = "." + classarr[c];
                    activecolumn = classarr[c];
                }
            }
        }
        if (rowrequest) {
            for (var c = 0; c < classarr.length; c++) {
                if (classarr[c].substring(0, 3) === "row") {
                    row = "." + classarr[c];
                }
            }
        }
        // if I need column elements only
        if (classfind === "cols") {
            for (var c = 0; c < classarr.length; c++) {
                if (classarr[c].substring(0, 3) === "col") {
                    return $("." + classarr[c]);
                }
            }
        } else if (classfind === "pucks") {
            for (var c = 0; c < classarr.length; c++) {
                if (classarr[c] === "puck") {
                    return $(column + "." + classarr[c] + row);
                }
            }
        } else if (classfind === "slots") {
            for (var c = 0; c < classarr.length; c++) {
                if (classarr[c] === "slot") {
                    return $(column + "." + classarr[c] + row);
                }
            }
        }
    }
})();
