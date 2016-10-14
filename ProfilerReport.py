import os
import subprocess
import sys
import json
import plprofiler
import sys
import time
import StringIO

"""prof = plprofiler.plprofiler()
prof = plprofiler.plprofiler()
out = StringIO.StringIO()

# prof.connect({'dsn': 'host=db1 dbname=bench1 user=postgres port=54395'})
prof.connect({'dsn': ''})
prof.enable()
prof.execute_sql("SELECT tpcb(1,2,3,100); SELECT tpcb(1,2,3,100); SELECT tpcb(1,2,3,100); SELECT tpcb(1,2,3,100); SELECT tpcb(1,2,3,100);")

data = prof.get_local_report_data('test2', 10, None)
data['config']['title'] = "Demo Title"
prof.report(data, out)

html = out.getvalue()
print "html length =", len(html)
with open('test2.html', 'w') as fd:
    fd.write(html)
"""

from datetime import datetime

current_path=os.path.dirname(os.path.realpath(__file__))

class ProfilerReport(object):

    def __init__(self, *args, **kwargs):
        profiler_args=args[0]
        self.prof = plprofiler.plprofiler()
        os.environ['PGPASSWORD']=profiler_args['pgPass']
        self.prof.connect({'dsn': 'host={0} dbname={1} user={2} port={3}'.format(
            profiler_args['hostName'], profiler_args['pgDB'],
            profiler_args['pgUser'], profiler_args['pgPort']
        )})
        self.prof.enable()
        del os.environ['PGPASSWORD']

    def generateSQLReports(self, queries, title=None, desc=None):
        self.prof.execute_sql(queries)
        data = self.prof.get_local_report_data(title, 10, None)
        data['config']['title'] = title
        if desc:
            data['config']['desc'] = desc
        out = StringIO.StringIO()
        self.prof.report(data, out)
        html = out.getvalue()
        #print "html length =", len(html)
        report_file = str(datetime.now()) + ".html"
        with open(os.path.join(current_path, 'reports', report_file), 'w') as fd:
            fd.write(html)
        return report_file

    def close(self):
        self.prof.close()



