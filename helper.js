exports.helper = function(req, res, next) {
    if( req.isAuthenticated()) {
        res.locals.current_user = req.getAuthDetails().user.username;
    } else {
        res.locals.current_user = "";
    }

    res.locals.messages = function() {
        if(req.session.messages) {
            var buf = [];
            var msgs = req.session.messages
            buf.push('<div id="messages">');
            buf.push('  <ul class="error">');
            for (var i = 0, iz = msgs.length; i < iz; ++i) {
                buf.push('    <li>' + msgs[i] + '</li>');
            }
            buf.push('  </ul>');
            buf.push('</div>');
            return buf.join('\n');
        } else {
            return "";
        }
    };
    next();
}
