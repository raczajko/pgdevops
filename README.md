# BigSQL DevOps Manager #




### Development setup :

* git clone bam3
* Download and untar a bigsql [sandbox](http://www.bigsql.org/postgresql/sandboxes.jsp)
* Set environment variables (of course, use your actual sandbox location):

```
#!bash

export PGC_HOME="$HOME/c/bigsql"
export PGC_LOGS="$PGC_HOME/logs/pgcli_log.out"
cd bam2
mkdir -p ../data/logs

```

*Install Prerequisites:*

* nodes & npm
* gulp  (sudo npm install --global gulp-cli)

Run gulp to keep gulp watching for changes to assets
```
#!bash

cd bam2-ng/bam_ui
gulp
```

Make a change to bam_ui/app/app.js (add a space to end of file) to trigger gulp repacking. You should see app-scripts and templates-dev being processed.

Start bam3 app server:
```
#!bash

sh bin/start_crossbar.sh
```

Open browser to http://localhost:8050

### To package a release:

run ./build.sh <version no>