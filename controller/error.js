
exports.get404Page = (req, res, next) => {
    res.status(404).render('404.ejs', {docTitle:'Page Not Found'});
};

exports.get500Page = (req, res, next) => {
    res.status(404).render('500.ejs', { docTitle: 'error' });
};