//delete account
$("#deleteAccount").click(function (e) {
    const loginUser = this.dataset.userid;
    swal({
            title: "Are you sure?",
            text: "The account can not be restored once deleted, but posts and comments will remain.",
            icon: "warning",
            buttons: ["Forget it", "100% sure!"],
            dangerMode: true
        })
        .then((value) => {
            if (value) {
                axios.delete(`/user/delete/account/${loginUser}`)
                    .then((res) => {
                        if (res.data) {
                            swal({
                                    text: "Success!",
                                    icon: "info"
                                })
                                .then((res) => {
                                    location.href = "/";
                                })
                        }
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
    e.stopImmediatePropagation();
});