from wtforms import StringField, ValidationError, HiddenField
from flask_security.forms import RegisterForm, EqualTo, password_required
from wtforms.validators import InputRequired, Email, Length
from Components import Components as pgc
import os, sys
import subprocess
import json

PGC_HOME = os.getenv("PGC_HOME", "")
PGC_LOGS = os.getenv("PGC_LOGS", "")

pgc_scripts_path = os.path.join(PGC_HOME, 'hub', 'scripts')
if pgc_scripts_path not in sys.path:
    sys.path.append(pgc_scripts_path)

class RegisterForm(RegisterForm):

	def check_ami(ami_id="pgdevops"):
		cmd=os.path.join(PGC_HOME,"pgc")
		pgcCmd = "{0} {1} {2} {3}".format(cmd,"verify-ami",ami_id , "--json")
		rc=0
		msg=""
		try:
			process = subprocess.check_output(pgcCmd,
                          shell=True)
			final_out = json.loads(process.strip().decode('ascii'))[0]
			rc=process.returncode
			msg=str(final_out['msg'])
		except Exception as e:
			final_out = json.loads(e.output.strip().decode('ascii'))[0]
			rc = e.returncode
			msg = str(final_out['msg'])
		return {"rc": rc, "msg": msg}

   	checkAMI = check_ami()
	if checkAMI.get("rc")!=2:
		ami_form = True
		ami_id = StringField('AWS instance Id', validators=[Length(max=50)])

		def validate_ami_id(form, field):
			validationData = pgc.get_data("verify-ami", str(field.data))
			if validationData[0]['state'] == 'error':
				raise ValidationError(validationData[0]['msg'])
			else:
				pass