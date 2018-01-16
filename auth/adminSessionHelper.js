module.exports = (req, res, next) => {
    let token = req.session.x_token;
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(req.session.user != 'admin'){
        return res.redirect('/user/login');
    } 
    res.header('x-auth', token);
    next();
}