from wtforms import StringField, ValidationError, HiddenField
from flask_security.forms import RegisterForm, EqualTo, password_required
from wtforms.validators import InputRequired, Email, Length
from Components import Components as pgc

class RegisterForm(RegisterForm):
    data = pgc.get_data("lablist")
    ami_form = False
    for lab in data:
    	if(lab['lab'] == 'aws-rds' and lab['enabled'] == 'on'):
    		ami_form = True

    if ami_form:
        ami_id = StringField('AWS instance Id', validators=[Length(max=50)])

        def validate_ami_id(form, field):
            validationData = pgc.get_data("verify-ami", str(field.data))
            if validationData[0]['state'] == 'error':
               raise ValidationError(validationData[0]['msg'])
	    else:
	       pass
    else:
        pass
