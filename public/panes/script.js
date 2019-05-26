(function() {
    var barwidth = $(".bar").width() / 2;
    var percent = "0%";
    var pressed;

    $(document).on(
        "mousedown mouseup mousemove mouseleave",
        "#imagecontainer",
        function(e) {
            if (e.type == "mousedown") {
                pressed = true;

                percent =
                    ((e.pageX - $("#imagecontainer").offset().left) / 280) *
                        100 +
                    "%";
                $(".bar").css("left", percent);
                $(".top").css("width", percent);
            }
            if (e.type == "mouseup") {
                pressed = false;
            }
            if (e.type == "mouseleave") {
                pressed = false;
            }
            if (e.type == "mousemove" && pressed) {
                percent =
                    ((e.pageX - $("#imagecontainer").offset().left) / 280) *
                        100 +
                    "%";
                $(".bar").css("left", percent);
                $(".top").css("width", percent);
            }
        }
    );
})();
