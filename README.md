# bam3-DevOps #

### Setup python env

```
#!bash

mkvirtualenv bam3-env
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