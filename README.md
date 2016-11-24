# DEVOPS : BigSQL DevOps #

DEVOPS is a multi-user & multi-server PostgreSQL dev-ops web console that features integration with pgAdmin4.  

It's a WSGI Python27 Flask application that runs cross-platform (Windows, OSX & Linux) in Crossbar. 


### Setup python env

```
#!bash

mkvirtualenv devops-env
pip install -r requirements.txt

```

### Setup admin user
```
#!bash

python pgadmin/setup.py

```

### Startup crossbar running pgAdmin4 (Dev) + BAM (Ops)
```
#!bash

export PGC_HOME="$HOME/c/bigsql"
export PGC_LOGS="$PGC_HOME/logs/pgcli_log.out"
./bin/start_crossbar.sh

```