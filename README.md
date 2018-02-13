# pgDevOps #

pgDevOps is a multi-user & multi-server PostgreSQL dev-ops web console that features integration with pgAdmin4.  

It's a WSGI Python27 Flask application that runs cross-platform (Windows, OSX & Linux) in Crossbar. pgDevOps is Open Source software, distributed under the GNU General Public License version 2.0 (GPLv2).


### Setup python env
Make sure you are running at least PIP 9.0.1

```
#!bash

mkvirtualenv devops-env
pip install -r requirements.txt

```

### Setup admin user (shared by pgDevOps and pgAdmin4 Web)
```
#!bash

python pgadmin/setup.py

```

### Startup crossbar
```
#!bash

export PGC_HOME="$HOME/c/bigsql"
export PGC_LOGS="$PGC_HOME/logs/pgcli_log.out"
./bin/start_crossbar.sh

```