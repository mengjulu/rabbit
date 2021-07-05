//edit comment
$(".commentEdit").click(function (e) {
    const commentId = this.dataset.commentid;
    const comment = $(this).closest(".comment");
    const commentMenu = comment.find(".dropdown-menu");
    const commentContent = comment.find(".commentContent");
    const originalContent = commentContent.text();
    commentMenu.toggleClass("show");
    commentMenu.find(".commentEdit").hide();
    commentContent.html(`<textarea class="editComment" rows="3">${originalContent}</textarea>
    <div class="flexRow editCommentBox"><button class="btn btn-outline-warning editCancel">cancel</button> <button class="btn btn-warning editSubmit">submit</button></div>`);

    $(".editCancel").click(function () {
        commentContent.html(`<p> ${originalContent} </p>`);
        commentMenu.find(".commentEdit").show();
    });
    $(".editSubmit").click(function () {
        const changedContent = $(".editComment").val();
        axios({
                method: "patch",
                url: `/edit/comment/${commentId}`,
                data: {
                    changedContent: `${changedContent}`
                }
            })
            .then((res) => {
                if (res.data) {
                    commentContent.html(`<p> ${changedContent} </p>`);
                }
                commentMenu.find(".commentEdit").show();
            }).catch(err => console.log(err));
    });
    e.stopImmediatePropagation();
});

//delete comment 
$(".commentDelete").click(function (e) {
    const commentId = this.dataset.commentid;
    const postId = this.dataset.postid;
    const comment = $(this).closest(".comment");
    swal({
            text: "The comment is not able to recover once deleted.",
            icon: "warning",
            buttons: ["Forget it", "Yep!"],
            dangerMode: true
        })
        .then((value) => {
            if (value) {
                axios.delete(`/delete/comment/${postId}/${commentId}`)
                    .then((res) => {
                        res.data ? comment.remove() : null;
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    e.stopImmediatePropagation();
});