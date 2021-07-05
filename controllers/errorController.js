exports.getErr = (req, res) => {
    res.status(404).render("error", {
        pageTitle: "Oops! Nothing found!"
    });
};