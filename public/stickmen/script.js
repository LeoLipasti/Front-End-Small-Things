(function() {
    var cv = document.getElementById("canvas").getContext("2d");
    var txt = document.getElementById("oneliners");

    var linew = "2px";
    var linec = "purple";

    // for stick figures
    var leftarm;
    var rightarm;
    var leftleg;
    var rightleg;
    var body;
    var head;
    var offset;
    var sticksize;
    var stickhead;

    // animation related
    var restlessfactor = 4;
    var escapee = Array(808).fill(0);
    var returning = false;

    // draws a single stickman.
    drawStickman([5, 285], 4, cv);
    var dist = 5;
    document.addEventListener("keydown", function(arrow) {
        if (arrow.keyCode === 39) {
            cv.clearRect(0, 220, 900, 300);
            dist += 3;
            drawStickman([dist, 285], 4, cv);
            txt.innerHTML = "";
            frame++;
        } else if (arrow.keyCode === 37) {
            cv.clearRect(0, 220, 900, 300);
            dist -= 3;
            drawStickman([dist, 285], 4, cv);
            txt.innerHTML = "";
            frame++;
        }
        // making army unease
        if (restlessfactor != 10 && !returning) {
            if (dist < 20 || dist > 880) {
                restlessfactor = 4;
            } else {
                restlessfactor = 8;
            }
        }

        if (arrow.keyCode === 32 && restlessfactor != 10) {
            // space
            txt.innerHTML = "a-ten";
            restlessfactor = 6;
            frame = reqframeid;
        }
        if (frame - reqframeid > 5 && restlessfactor == 10) {
            restlessfactor = 8;
            drawingEveryFrame();
        }
    });

    drawingEveryFrame();
    var armyx = 0;
    var armyy = 0;
    var frame = 0;
    var moveup = 0;
    var count = 0;

    // draws an army of angry stickmen
    function drawingEveryFrame() {
        // some parts of the animation dont need to display every frame
        if (frame % (restlessfactor / 2) == 0) {
            cv.clearRect(0, 0, 900, 220);
            for (var r = 0; r < 808; r++) {
                // soldiers leave lines - misbehave - also checks a stickman above if space to move
                moveup = Math.floor(Math.random() * 3.5);
                if (dist < 0 || dist > 900) {
                    if (r > 101) {
                        if (escapee[r - 101] > escapee[r] + moveup) {
                            escapee[r] += moveup;
                        }
                    } else {
                        // top row - can move freely
                        escapee[r] += moveup;
                    }
                } else if (escapee[r] > 0) {
                    // fall back in line
                    if (r <= 707) {
                        if (escapee[r + 101] < escapee[r] - moveup * 2) {
                            escapee[r] -= moveup * 2;
                        }
                    } else {
                        //bottom row - can move freely
                        escapee[r] -= moveup * 2;
                    }
                }
                // now main offsets
                armyx = r * 9 - 9 * 101 * Math.floor(r / 101);
                armyy = Math.floor(r / 101) * 24 + 20;
                drawStickman(
                    [armyx, armyy - escapee[r]],
                    4 * (1.1 - Math.random() / restlessfactor),
                    cv
                );
            }
        }

        if (restlessfactor !== 6) {
            frame++;
            // checking if returning
            if (frame % 15 == 0) {
                count = 0;
                for (var es = 0; es < escapee.length; es++) {
                    count += escapee[es];
                }
                if (count > 0) {
                    restlessfactor = 2;
                    returning = true;
                } else {
                    returning = false;
                }
            }
        }
        if (restlessfactor == 6 && reqframeid - frame > 40) {
            txt.innerHTML = "a-ten-HUT!";
            restlessfactor = 10;
            // draw well behaved stickmen
            cv.clearRect(0, 0, 900, 220);
            for (var r = 0; r < 808; r++) {
                armyx = r * 9 - 9 * 101 * Math.floor(r / 101);
                armyy = Math.floor(r / 101) * 24 + 20;
                drawStickman([armyx, armyy], 4, cv);
            }
            for (var s = 0; s < escapee.length; s++) {
                escapee[s] = 0;
            }
        } else {
            reqframeid = requestAnimationFrame(drawingEveryFrame);
        }
    }

    function drawStickman(pos, size, target) {
        // point reference :

        // [ ][o][ ]
        // [ ][.[ ]
        // [/][\][\]
        // [ ][\][ ]
        // [/][ ][\]

        var scalemoveus = [];

        leftarm = [1, 1, 0, 2];
        scalemoveus.push(leftarm);
        rightarm = [1, 1, 2, 2];
        scalemoveus.push(rightarm);
        leftleg = [1, 3, 0, 4];
        scalemoveus.push(leftleg);
        rightleg = [1, 3, 2, 4];
        scalemoveus.push(rightleg);
        body = [1, 3, 1, 0.5];
        scalemoveus.push(body);
        stickhead = [1, 0, 0.5];
        scalemoveus.push(stickhead);

        for (var l = 0; l < scalemoveus.length; l++) {
            scalemoveus[l] = scaleAndOffest(scalemoveus[l], size, pos);
        }

        drawLimbs(
            [
                scalemoveus[0],
                scalemoveus[1],
                scalemoveus[2],
                scalemoveus[3],
                scalemoveus[4]
            ],
            scalemoveus[5],
            target
        );
    }

    function scaleAndOffest(a, s, p) {
        var modified = [];
        for (var u = 0; u < a.length; u++) {
            // head is unique and needs its own if for array length
            if (a.length == 3) {
                if (u == 0) {
                    modified.push(a[u] * s + p[0]);
                } else if (u == 1) {
                    modified.push(a[u] * s + p[1]);
                } else if (u == 2) {
                    modified.push(a[u] * s);
                }
            } else {
                if (u == 0) {
                    modified.push(a[u] * s + p[0]);
                } else if (u == 1) {
                    modified.push(a[u] * s + p[1]);
                } else if (u == 2) {
                    modified.push(a[u] * s + p[0]);
                } else if (u == 3) {
                    modified.push(a[u] * s + p[1]);
                }
            }
        }
        return modified;
    }

    function drawLimbs(a, b, t) {
        // a :
        // array of arrays, each one an array of 4
        // start x , start y , end x , end y
        // b :
        // array of 3
        // head position x , y, size
        for (var i = 0; i < a.length; i++) {
            t.beginPath();
            t.strokeStyle = linec;
            t.lineWidth = linew;
            t.moveTo(a[i][0], a[i][1]);
            t.lineTo(a[i][2], a[i][3]);
            t.closePath();
            t.stroke();
        }
        for (var o = 0; o < b.length; o++) {
            t.beginPath();
            t.strokeStyle = linec;
            t.lineWidth = linew;
            t.arc(b[0], b[1], b[2], 0, 2 * Math.PI);
            t.closePath();
            t.stroke();
        }
    }
})();
