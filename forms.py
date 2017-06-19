from wtforms import StringField, ValidationError, HiddenField
from flask_security.forms import RegisterForm, EqualTo, password_required
from wtforms.validators import InputRequired, Email, Length

class RegisterForm(RegisterForm):
    ami_form = True
    if ami_form:
        ami_id = StringField('AWS instance Id', validators=[Length(max=50)])

        def validate_ami_id(form, field):
            raise ValidationError('AWS instance Id if needs to be valied')
    else:
        pass