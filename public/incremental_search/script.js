(function() {
    // change this if you add more inputfields,
    // for now just input as there is only one
    inputfield = $("input");

    var inputactive = false;

    var listlen = 6;
    var maxlen = 0;
    var listsel;
    var listvals = [];
    var input;

    // max requests per second
    var maxreqpersec = 2;

    function loopmaxreq() {
        var lasttimeout = setTimeout(function() {
            clearTimeout(lasttimeout);
            // doing latest latest ajaxCall
            if (maxreqpersec === 0) {
                ajaxCall(input);
            }

            maxreqpersec = 2;

            loopmaxreq();
        }, 1000);
    }
    loopmaxreq();

    // when everything works, did you mean?
    var latestgreatest = [];
    var outputextra = "";

    function createDivs(vals) {
        var output = "";
        for (var x = 0; x < $(".result").length; x++) {
            $(".result").remove();
        }
        if (vals.length != 0) {
            var fixlengths = [];
            for (var i = 0; i < vals.length; i++) {
                output +=
                    "<div class=result id=sid" + i + ">" + vals[i] + "</div>";
                if (vals[i].length > 15) {
                    fixlengths.push(i);
                }
            }
            $("#search").append(output);
            if (vals[0] === "no results") {
                $(".result").css("color", "lightgrey");
            } else if (outputextra != "") {
                $(".result").css("color", "darkgray");
            } else {
                $(".result").css("color", "black");
                for (var r = 0; r < fixlengths.length; r++) {
                    $(".result")
                        .eq(fixlengths[r])
                        .css(
                            "font-size",
                            16 -
                                Math.max(vals[fixlengths[r]].length - 15, 0) /
                                    3.2 +
                                "px"
                        );
                }
            }
        }
        maxlen = vals.length;
    }

    var hits = 0;

    var hajax;

    inputfield.on("input focus", function() {
        inputactive = false;
        input = $(this).val();
        if (maxreqpersec > 0) {
            if (hajax != undefined) {
                hajax.abort();
            }
            ajaxCall(input);
        } else {
            // still doing my typo checks if too fast typing
            afterAjax(input);
        }
    });

    function ajaxCall(inp) {
        hajax = $.ajax({
            url: "https://flame-egg.glitch.me/",
            data: {
                q: inp.toLowerCase()
            },
            success: function(dat) {
                hits = 0;
                listvals = [];
                hits = Math.min(dat.length, listlen);
                for (var x = 0; x < hits; x++) {
                    listvals.push(dat[x]);
                }
                if (hits > 0) {
                    latestgreatest = listvals;
                }
                afterAjax(inp);
            }
        });
        maxreqpersec--;
    }

    function afterAjax(inp) {
        if (inp.length > 0 && inp != listvals[0]) {
            if (listvals.length === 0) {
                var output = ["no results"];

                // extra part, did you mean ?
                outputextra = checkTypos(latestgreatest, inp);
                if (outputextra != "") {
                    listvals = [outputextra];
                    output = [outputextra];
                    hits = 1;
                }
                createDivs(output);
            } else {
                // extra part, did you mean ?
                latestgreatest = listvals;
                outputextra = "";
                if (inp != listvals[0]) {
                    createDivs(listvals);
                }
            }
        } else {
            createDivs([]);
        }
    }

    $("#search").on("mousedown", function(e) {
        for (var h = 0; h < listlen; h++) {
            if (e.target.id === "sid" + h) {
                listsel = h;
            }
        }
        highLight(listsel);
    });

    $("#search").on("mouseup", function(e) {
        if (e.target.className === "result on") {
            inputfield.val(listvals[listsel]);
            createDivs([]);
        }
    });

    // input key listener - only for jumping to list
    inputfield.on("keydown", function(e) {
        if (hits > 0) {
            // arrow keys
            if (!inputactive) {
                if (e.keyCode === 38) {
                    inputactive = true;
                    listsel = listlen + 1;
                    highLight(listsel);
                } else if (e.keyCode === 40) {
                    inputactive = true;
                    listsel = 0;
                    highLight(listsel);
                }
            }
        }
        if (e.keyCode === 9) {
            createDivs([]);
            inputfield.blur();
            e.preventDefault();
        }
    });

    function highLight(x) {
        for (var a = 0; a < $(".on").length; a++) {
            $(".on")
                .eq(a)
                .removeClass("on");
        }
        $(".result")
            .eq(x)
            .addClass("on");
    }

    $(document).on("click", function(e) {
        if (e.target.name != "countryinput") {
            createDivs([]);
        }
    });

    // key listener
    $(document).on("keydown", function(e) {
        if (inputactive) {
            if (e.keyCode === 38) {
                inputfield.blur();
                listsel = Math.max(listsel - 1, 0);
            } else if (e.keyCode === 40) {
                inputfield.blur();
                listsel = Math.min(listsel + 1, maxlen - 1);
            }
            highLight(listsel);
            if (e.keyCode === 13) {
                inputfield.val(listvals[listsel]);
                createDivs([]);
            }
        } else {
            if (e.keyCode === 13) {
                createDivs([]);
            }
        }
    });

    // extra part, did you mean ?
    function checkTypos(f, userf) {
        var candidate = "";
        // checking single letter typos
        var count;
        for (var z = 0; z < f.length; z++) {
            count = 0;
            for (var q = 0; q < f[z].length; q++) {
                if (q === userf.length - 1) {
                    break;
                }
                if (f[z][q].toLowerCase() === userf[q].toLowerCase()) {
                    count++;
                }
                // allows 2 typos
                if (count >= f[z].length - 2) {
                    candidate = f[z];
                    break;
                }
            }
        }
        // checking if there is one extra letter somewhere
        for (var s = 0; s < f.length; s++) {
            for (var b = 0; b < userf.length; b++) {
                if (
                    (userf.slice(0, b) + userf.slice(b + 1)).toLowerCase() ===
                    f[s].toLowerCase()
                ) {
                    candidate = f[s];
                    break;
                }
            }
        }
        // checking if there is one letter or space missing
        for (var s = 0; s < f.length; s++) {
            for (var b = 0; b < f[s].length; b++) {
                if (
                    (f[s].slice(0, b) + f[s].slice(b + 1)).toLowerCase() ===
                    userf.toLowerCase()
                ) {
                    candidate = f[s];
                    break;
                }
            }
        }

        return candidate;
    }
})();
