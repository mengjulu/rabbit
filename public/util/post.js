//save post
$(".savedPostBtn").click(function (e) {
    const postId = this.dataset.id;
    const that = $(this);
    axios.post(`/${postId}/save`)
        .then(res => {
            if (res.data === "login") {
                swal({
                    text: "Please log in before save post.",
                    button: "Got it!"
                })
            } else {
                res.data ?
                    that.text("Unsave") :
                    that.text("Save")
            }
        }).catch(err => console.log(err));
    e.stopImmediatePropagation();
});

//vote post
$(".voteBtn").click(function (e) {
    const postId = this.dataset.id;
    const vote = this.dataset.vote;
    const voteBox = $(this).closest("div");
    const uparrow = voteBox.find(".upVoteArrow");
    const voteNum = voteBox.find(".voteNum");
    const downarrow = voteBox.find(".downVoteArrow");

    axios.post(
            `/${postId}/${vote}`
        )
        .then((res) => {
            if (!res.data) {
                swal({
                    text: "Please log in before vote.",
                    button: "Got it!"
                })
            } else {
                const voteNumber = res.data.voteNum;
                voteNum.text(voteNumber);
                if (vote === "upvote") {
                    uparrow.toggleClass("voteClicked");
                    res.data.voteNumSet === 2 ? downarrow.removeClass("voteClicked") :
                        null;
                } else if (vote === "downvote") {
                    downarrow.toggleClass("voteClicked");
                    res.data.voteNumSet === -2 ? uparrow.removeClass("voteClicked") :
                        null;
                }
            }
        })
        .catch(err => console.log(err));
    e.stopImmediatePropagation();
});

//delete post
$(".deletePostBtn").click(function (e) {
    const subforum = this.dataset.sub;
    const postId = this.dataset.id;
    swal({
            text: "The post is not able to recover once deleted.",
            icon: "warning",
            buttons: ["Forget it", "Yep!"],
            dangerMode: true
        })
        .then((value) => {
            if (value) {
                axios.post(`/delete/post/${subforum}/${postId}`)
                    .then((res) => {
                        location.href = res.data ? `/r/${subforum}` : "/error"
                    });
            };
        })
        .catch(err => console.log(err));
    e.stopImmediatePropagation();
});