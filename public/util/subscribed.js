$("#subBtn").click(function (e) {
    const that = $(this);
    const subName = this.dataset.sub;
    axios.put(
            `/r/${subName}/subscribe`
        )
        .then((res) => {
            res.data == "sub" ?
                that.text("Unsubscribe") :
                res.data == "unsub" ?
                that.text("Subscribe") :
                swal({
                    text: "Please log in before subscribe.",
                    button: "Got it!"
                })
        })
        .catch(err => console.log(err));
        e.stopImmediatePropagation();
})