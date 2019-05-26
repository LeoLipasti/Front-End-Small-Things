// create container divs
for (var c = 2; c <= 6; c++) {
    $("#frame1")
        .clone()
        .attr("id", "frame" + c)
        .appendTo($("#container"));
}

$("#frame1, #frame2, #frame3, #frame4, #frame5, #frame6").on(
    "mousemove",
    function(event) {
        var cursorX = event.pageX;
        var cursorY = event.pageY;
        for (var i = 1; i <= 6; i++) {
            var offset;
            offset = $("#frame" + i).offset();
            var up = "#frame" + i + " img:nth-child(1)";
            var down = "#frame" + i + " img:nth-child(2)";
            var left = "#frame" + i + " img:nth-child(3)";
            var right = "#frame" + i + " img:nth-child(4)";
            if (Math.abs(offset.top + 100 - cursorY) < 100) {
                if (offset.left + 150 < cursorX) {
                    addremoveclasses(left, right);
                } else {
                    addremoveclasses(right, left);
                }
            } else {
                resetclasses(right, left);
            }
            if (Math.abs(offset.left + 150 - cursorX) < 150) {
                if (offset.top + 100 < cursorY) {
                    addremoveclasses(down, up);
                } else {
                    addremoveclasses(up, down);
                }
            } else {
                resetclasses(up, down);
            }
        }
    }
);

function addremoveclasses(dimmer, brighter) {
    if (!$(dimmer).hasClass("twentyfive")) {
        $(dimmer).addClass("twentyfive");
    }
    if ($(dimmer).hasClass("seventyfive")) {
        $(dimmer).removeClass("seventyfive");
    }
    if (!$(brighter).hasClass("seventyfive")) {
        $(brighter).addClass("seventyfive");
    }
    if ($(brighter).hasClass("twentyfive")) {
        $(brighter).removeClass("twentyfive");
    }
}

function resetclasses(pairleft, pairright) {
    if ($(pairleft).hasClass("seventyfive")) {
        $(pairleft).removeClass("seventyfive");
    }
    if ($(pairright).hasClass("twentyfive")) {
        $(pairright).removeClass("twentyfive");
    }
    if ($(pairright).hasClass("seventyfive")) {
        $(pairright).removeClass("seventyfive");
    }
    if ($(pairleft).hasClass("twentyfive")) {
        $(pairleft).removeClass("twentyfive");
    }
}
