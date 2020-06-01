module.exports = {
    ensureAuthenticated: function(req, res, next) {
        console.log('ensure isAuthenticated = ' + req.isAuthenticated())
      if (req.isAuthenticated()) {
        return next();
      }
    //   req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/');
    },
    forwardAuthenticated: function(req, res, next) {
        console.log('forward isAuthenticated = ' + req.isAuthenticated())
      if (!req.isAuthenticated()) {
        console.log("Forward next")
        return next();
      }
      console.log("Forward else")
      res.redirect('./user/allSites');      
    }
};