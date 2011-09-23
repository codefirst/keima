module.exports = function(server){
    server.dynamicHelpers({
        current_user : function(req, res){
            if( req.isAuthenticated()) {
                return req.getAuthDetails().user.username;
            } else {
                return null;
            }
        }});
}
