import os
import platform

PGC_HOME = os.getenv("PGC_HOME", "")
this_uname = str(platform.system())

class BackupRestore(object):
    def __init__(self):
        pass

    def backup_restore(self,ctime,action,host,port,username,dbname,sshserver,backup_directory,filename,format,adv_options,password=None):
        result = {}
        from detached_process import detached_process
        if action == "backup":
            pgc_cmd = PGC_HOME + os.sep + "pgc dbdump "
        elif action == "restore":
            pgc_cmd = PGC_HOME + os.sep + "pgc dbrestore "
        pgc_cmd = pgc_cmd + dbname + " " + host + " " + port + " " + username
        if password:
            pgc_cmd = pgc_cmd + " --pwd " + password
        if os.path.splitext(filename)[-1] == "":
            filename = filename + ".sql"
        if '-v' not in adv_options and not (action == "restore" and format == 'p'):
            adv_options = adv_options + " -v"
        pgc_cmd = pgc_cmd + ' "' + backup_directory + filename + '" ' + format + ' ' + adv_options
        if sshserver not in ["","localhost",None]:
            pgc_cmd = pgc_cmd + " --host " + sshserver
        if this_uname == "Windows":
            pgc_cmd = pgc_cmd.replace("\\", "\\\\")
        process_status = detached_process(pgc_cmd, ctime, process_type='backrest')
        result['error'] = None
        result['status'] = process_status['status']
        result['log_dir'] = process_status['log_dir']
        result['process_log_id'] = process_status['process_log_id']
        result['cmd'] = pgc_cmd
        return result