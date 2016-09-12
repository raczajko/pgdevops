# Secret key for signing CSRF data. Override this in config_local.py if
# running on a web server
CSRF_SESSION_KEY = '3b862b92-5eda-11e6-8b77-86f30ca893d3'

# Secret key for signing cookies. Override this in config_local.py if
# running on a web server
SECRET_KEY = '3b86232c-5eda-11e6-8b77-86f30ca893d3'

# Salt used when hashing passwords. Override this in config_local.py if
# running on a web server
SECURITY_PASSWORD_SALT = '3b862958-5eda-11e6-8b77-86f30ca893d3'

# Hashing algorithm used for password storage
SECURITY_PASSWORD_HASH = 'pbkdf2_sha512'

#SESSION_COOKIE_DOMAIN="0.0.0.0"
#SESSION_TYPE="sqlalchemy"

SECURITY_LOGIN_URL= "/auth"

SESSION_COOKIE_NAME = 'bam_session'


#APP_ICON="bigsql-logo"