(function() {
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    /// DONUT TOUCH ///////// DONUT TOUCH ////// DONUT TOUCH ////// DONUT TOUCH ////// DONUT TOUCH ///
    var resultsdiv = document.querySelector("#resultsdiv");

    var breakthis;

    var commitobjects = [];

    var commitnames = [];

    // Do not actually deploy this sort anywhere, not secure
    // correct way would be to store credentials in the server

    $("#gobutton").on("click", function(e) {
        for (var o = 0; o < removeEventListeners; o++) {
            document
                .querySelector(removeEventListeners[o])
                .removeEventListener("click");
        }
        removeEventListeners = [];
        // prevents page from refreshing and setting credentials to the url bar
        e.preventDefault();
        // notice the "" and '', cant use only double quotes or quotes, need both
        var username = $("input[name='username']").val();
        var password = $("input[name='password']").val();
        var userToSearch = $("input[name='user-to-search']").val();

        var baseUrl = "https://api.github.com";
        // what specific data I want from github? or other api. :username
        var endpoint = "/users/" + userToSearch + "/repos";
        var fullUrl = baseUrl + endpoint;

        var handleobjects = [];
        if (breakthis === undefined) {
            breakthis = setTimeout(function() {
                ajaxCallAvatar();
            }, 500);
        }

        function ajaxCallAvatar() {
            // Basic btoa(username : password)
            $.ajax({
                url: fullUrl,
                headers: {
                    Authorization: "Basic " + btoa(username + ":" + password)
                },
                success: function(data) {
                    $(document)
                        .find(".smallcontainer")
                        .remove();
                    $(document)
                        .find(".container")
                        .remove();
                    handleobjects = [];
                    commitnames = [];
                    for (var i = 0; i < data.length; i++) {
                        handleobjects.push({
                            avatar: data[i].owner.avatar_url,
                            reponame: data[i].full_name,
                            repodescription: data[i].description,
                            repodetails: data[i].commits_url,
                            targetdiv: "moreid_" + i,
                            targetmore: "moreid_" + i + "_button"
                        });
                        commitnames.push(data[i].full_name.split("/")[1]);
                    }
                    clearTimeout(breakthis);
                    breakthis = undefined;
                    goHandleBars();
                }
            });
        }
        // this part is still in the works, not finished, TODO
        function repoCommits(target) {
            $.ajax({
                url:
                    baseUrl +
                    "/repos/" +
                    userToSearch +
                    "/" +
                    commitnames[target.split("_")[1]] +
                    "/commits",
                headers: {
                    Authorization: "Basic " + btoa(username + ":" + password)
                },
                success: function(data) {
                    commitobjects = [];
                    for (var i = 0; i < Math.min(data.length, 10); i++) {
                        commitobjects.push({
                            smallavatar:
                                data[i].committer != null
                                    ? data[i].committer.avatar_url
                                    : "no_avatar.jpg",
                            committer: data[i].commit.author.name,
                            commit: data[i].commit.message,
                            commitdate: data[i].commit.author.date
                        });
                    }
                    commitHandleBars(
                        "#" + target.split("_")[0] + "_" + target.split("_")[1]
                    );
                }
            });
        }
        var removeEventListeners = [];
        function goHandleBars() {
            resultsdiv.innerHTML = Handlebars.templates.githubber({
                commitsArray: handleobjects
            });
            for (var x = 0; x < handleobjects.length; x++) {
                removeEventListeners.push("#" + "moreid_" + x + "_button");
                document
                    .querySelector("#" + "moreid_" + x + "_button")
                    .addEventListener("click", function(e) {
                        var thisid = e.target.id;
                        if (e.target.innerText === "Commits") {
                            e.target.innerText = "^ Hide";
                            repoCommits(thisid);
                        } else if (e.target.innerText === "^ Hide") {
                            e.target.innerText = "Commits";
                            var targetcontainer =
                                thisid.split("_")[0] +
                                "_" +
                                thisid.split("_")[1];
                            $("#" + targetcontainer)
                                .find(".smallcontainer")
                                .remove();
                        }
                    });
            }
        }

        function commitHandleBars(div) {
            var targetdic = document.querySelector(div);
            targetdic.innerHTML = Handlebars.templates.commits({
                commitsDetailArray: commitobjects
            });
        }
    });
})();
