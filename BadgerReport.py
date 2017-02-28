####################################################################
#########         Copyright 2016-2017 BigSQL             ###########
####################################################################

import os
import platform
import plprofiler
import StringIO
from datetime import datetime
import re
import subprocess
import time
from operator import itemgetter

import util

import psycopg2

current_path = os.path.dirname(os.path.realpath(__file__))

reports_path = os.path.join(current_path, "reports")

if not os.path.exists(reports_path):
    os.mkdir(reports_path)


badger_reports_path = os.path.join(reports_path, "badger")
if not os.path.exists(badger_reports_path):
    os.mkdir(badger_reports_path)

this_uname = str(platform.system())

PGC_HOME = os.getenv("PGC_HOME", "")

perl_path = os.path.join(PGC_HOME, "perl5", "perl", "bin")

path_env = os.environ.get("PATH")

if this_uname == "Windows" and perl_path not in path_env:
    os.environ['PATH'] = path_env + ";" + perl_path + ";"

log_param_dict={}
log_param_dict['log_min_duration_statement']=(1,-1)
log_param_dict['log_autovacuum_min_duration']=(2,0)
log_param_dict['log_temp_files']=(3,0)
log_param_dict['log_checkpoints']=(4,"on")
log_param_dict['log_lock_waits']=(5,"on")
log_param_dict['log_connections']=(6,"off")
log_param_dict['log_disconnections']=(7,"off")

class BadgerReport(object):
    def __init__(self):
        pass

    def generateReports(self, log_files, db=None, jobs=None, log_prefix=None, title=None):
        result={}
        time_stamp = str(datetime.now())
        file_name = re.sub('[^A-Za-z0-9]+', '', time_stamp)
        report_file = file_name + ".html"
        badger_path = os.path.join(PGC_HOME, "pgbadger", "pgbadger")
        pgbadger_command = "perl " + badger_path
        options = " ".join(log_files)
        if db:
            options = options + " -d " + db
        if jobs:
            options = options + " -j " + jobs
        if log_prefix:
            options = options + " -p " + log_prefix
        if title:
            options = options + " -T '" + title + "'"
            file_title=re.sub('[^A-Za-z0-9]+', '-', title)
            report_file = file_title + "-" +file_name + ".html"
        if title is None:
            options = options + ' -T "' + time_stamp + '"'

        options = options + " -o " + os.path.join(badger_reports_path, report_file)

        report_cmd = pgbadger_command + " " + options
        proc = subprocess.Popen(report_cmd, shell=True, stdout=subprocess.PIPE ,stderr=subprocess.PIPE)
        stdout_data, stderr_data  = proc.communicate()
        result['error']=None
        if proc.returncode != 0:
            result['error']=stderr_data
        result['file']="badger/" + report_file
        return result

    def getLoggingSettings(self,comp):
        util.read_env_file(comp)
        conn = psycopg2.connect("dbname='postgres' user='postgres' host='localhost'")
        query = "select category, name, setting, short_desc from pg_settings where name in " \
                + repr(tuple(map(str,log_param_dict.keys())))
        cursor = conn.cursor()
        cursor.execute(query)
        columns = [desc[0] for desc in cursor.description]
        result = []
        for res in cursor:
            result.append(dict(zip(columns, res)))
        cursor.close()
        conn.close()
        final_result=[]
        for k in result:
            f_row={}
            f_row['category']=k['category']
            f_row['name']=k['name']
            f_row['setting']=k['setting']
            if k['setting'] == 'on':
                f_row['enabled'] = True
            elif k['setting'] == 'off':
                f_row['enabled'] = False
            f_row['short_desc']=k['short_desc']                
            f_row['recommended']=log_param_dict[k['name']][1]
            f_row['order']=log_param_dict[k['name']][0]
            final_result.append(f_row)
        sorted_list=sorted(final_result, key=itemgetter('order'))
        return sorted_list

    def switchLogfile(self, comp, logFile):
        util.read_env_file(comp)
        conn = psycopg2.connect("dbname='postgres' user='postgres' host='localhost'")
        old_isolation_level = conn.isolation_level
        conn.set_isolation_level(0)
        cursor = conn.cursor()
        try:
            if logFile:
                alterQuery = "alter system set log_filename='%s';"%(logFile)
                notice_msg="pgDevOps by BigSQL: Switched logfile to {0}"
            else:
                alterQuery = "alter system reset log_filename;"
                notice_msg="pgDevOps by BigSQL: Reset logfile to {0}"
            cursor.execute(alterQuery)
            pgReloadQuery = "select pg_reload_conf();"
            cursor.execute(pgReloadQuery)
            rotateQuery = "select pg_rotate_logfile();"
            cursor.execute(rotateQuery)
            time.sleep(2)
            log_file_name_query="show log_filename;"
            cursor.execute(log_file_name_query)
            curResult=cursor.fetchone()
            log_file_name=curResult[0]
            log_file_name=log_file_name.replace("%","%%")
            notice_msg=notice_msg.format(log_file_name)
            query = """BEGIN;
                        SET log_min_messages = notice;
                        DO language plpgsql $$
                        BEGIN
                            RAISE NOTICE '{0}';
                        END
                        $$;
                        RESET log_min_messages;
                        END;"""

            raise_query = query.format(notice_msg)
            cursor.execute(raise_query)

            conn.set_isolation_level(old_isolation_level)
            conn.close()
            return True
        except Exception as e:
            conn.set_isolation_level(old_isolation_level)
            conn.close()
            return str(e)

    def changeLoggingParams(self, comp, logDict={}):
        util.read_env_file(comp)
        conn = psycopg2.connect("dbname='postgres' user='postgres' host='localhost'")
        old_isolation_level = conn.isolation_level
        conn.set_isolation_level(0)
        cursor = conn.cursor()
        try:
            for k in logDict.keys():
                alterQuery = "alter system set %s='%s';"%(k,logDict[k])
                cursor.execute(alterQuery)
            pgReloadQuery = "select pg_reload_conf();"
            cursor.execute(pgReloadQuery)
            conn.set_isolation_level(old_isolation_level)
            conn.close()
            return True
        except Exception as e:
            conn.set_isolation_level(old_isolation_level)
            conn.close()
            return str(e)
