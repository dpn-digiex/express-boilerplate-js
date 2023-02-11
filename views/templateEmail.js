// define template UI (Example email)
import Handlebars from 'handlebars';
var source = `<h3>Hello {{name}},</h3>
<p style="margin: 0px">A request has been received to reset password for your VietCredit account.</p>
<p style="margin: 0px">If this is true, please use this code to reset your password on website.</p>
<h4 style="margin-bottom: 0px">Code: </h4>
<h3><strong>{{codeConfirm}}</strong></h3>
<p>If you did not forgot your password you can safely ignore this email.</p>`;
export var templateEmail = Handlebars.compile(source);