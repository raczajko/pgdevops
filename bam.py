####################################################################
#########            Copyright 2016 BigSQL               ###########
####################################################################

import sys
import platform
import os
import re
import subprocess

from autobahn.twisted.wamp import ApplicationSession
from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.util import sleep
from pygtail import Pygtail

this_uname = str(platform.system())

#if this_uname == "Darwin":
##    sys.path.append(os.path.join(os.path.dirname(__file__), 'lib', 'osx'))
#elif this_uname == "Linux":
#    sys.path.append(os.path.join(os.path.dirname(__file__), 'lib', 'linux'))

import psutil

if this_uname == "Windows":
    diskperf_cmd = os.getenv("SYSTEMROOT","") + os.sep + "System32" + os.sep + "diskperf -y"
    dp_res = subprocess.Popen(diskperf_cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE).communicate()


from Components import Components
from HostSettings import HostSettings
from Monitoring import Monitoring

BAM_VERSION = "bam_version_number"
PGC_HOME = os.getenv("PGC_HOME", "")
PGC_LOGS = os.getenv("PGC_LOGS", "")

os.environ['PGC_ISJSON'] = "True"


class AppSession(ApplicationSession):
    """
    Abstract for ApplicationSession class to create the WAMP
    application session for this application.
    """
    @inlineCallbacks
    def onJoin(self, details):
        """
        This method registers all the procedures required for remote calling.
        """
        components = Components(self)

        hostSettings = HostSettings(self)

        monitoring = Monitoring(self)

        self.register(monitoring.live_graphs_data, 'com.bigsql.live_graphs')

        self.register(monitoring.initial_graphs_data, 'com.bigsql.initial_graphs')

        self.register(monitoring.live_dbstats_data, 'com.bigsql.live_dbstats')

        self.register(monitoring.initial_dbstats_data, 'com.bigsql.initial_dbstats')

        self.register(monitoring.db_list, 'com.bigsql.db_list')

        self.register(monitoring.pg_settings, 'com.bigsql.pg_settings')

        self.register(monitoring.read_pg_hba_conf, 'com.bigsql.read_pg_hba_conf')

        self.register(components.install_comp, 'com.bigsql.install')

        self.register(components.remove_comp, 'com.bigsql.remove')

        self.register(components.list, 'com.bigsql.list')

        self.register(components.getBamConfig, 'com.bigsql.getBamConfig')

        self.register(components.setBamConfig, 'com.bigsql.setBamConfig')

        self.register(components.getTestSetting, 'com.bigsql.getTestSetting')

        self.register(components.setTestSetting, 'com.bigsql.setTestSetting')

        self.register(components.logIntLines, 'com.bigsql.logIntLines')

        self.register(components.isInstalled, 'com.bigsql.isInstalled')

        self.register(components.autostart, 'com.bigsql.autostart')

        self.register(components.info, 'com.bigsql.info')

        self.register(components.start, 'com.bigsql.start')

        self.register(components.stop, 'com.bigsql.stop')

        self.register(components.restart, 'com.bigsql.restart')

        self.register(components.serverStatus, 'com.bigsql.serverStatus')

        self.register(components.infoComponent, 'com.bigsql.infoComponent')

        self.register(components.init, 'com.bigsql.init')

        self.register(components.update, 'com.bigsql.update')

        self.register(components.updatesCheck, 'com.bigsql.updatesCheck')

        self.register(components.cancelInstall, 'com.bigsql.cancelInstall')

        self.register(hostSettings.get_host_settings, 'com.bigsql.get_host_settings')

        self.register(hostSettings.update_host_settings, 'com.bigsql.update_host_settings')

        self.register(components.selectedLog, 'com.bigsql.selectedLog')

        self.register(components.liveLog, 'com.bigsql.liveLog')

        self.register(components.checkLogdir, 'com.bigsql.checkLogdir')

        self.register(components.getAvailPort, 'com.bigsql.getAvailPort')

        self.register(components.checkOS, 'com.bigsql.checkOS')
        
        self.register(components.registerHost, 'com.bigsql.registerHost')

        self.register(monitoring.activity, 'com.bigsql.activity')

        ## PUBLISH and CALL every second .. forever
        ##
        counter = 0
        while True:
            monitoring.save_graphs_data()
            monitoring.save_dbstats_data()

            pgcCmd = PGC_HOME + os.sep + "pgc --json status"
            pgcProcess = subprocess.Popen(pgcCmd, stdout=subprocess.PIPE, shell=True)
            pgcInfo = pgcProcess.communicate()
            components = pgcInfo[0]
            pgcStatusData = re.sub("\n", "", components)
            # yield self.publish('com.bigsql.status', pgcStatusData)

            yield sleep(5)
