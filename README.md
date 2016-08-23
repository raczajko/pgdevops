# BAM2 - BigSQL Manager II #


![toBe.png](https://bitbucket.org/repo/apMb9G/images/7373138-toBe.png)

### Development setup :

* git clone bam2-ng
* Download and untar a bigsql [sandbox](http://www.bigsql.org/postgresql/sandboxes.jsp)
* Set environment variables (of course, use your actual sandbox location):

```
#!bash

export PGC_HOME="$HOME/c/bigsql"
export PGC_LOGS="$PGC_HOME/logs/pgcli_log.out"
cd bam2-ng
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

Start bam2 app server:
```
#!bash

sh bin/start_crossbar.sh
```

Open browser to http://localhost:8050

### To package a release:

run ./build.sh <version no>