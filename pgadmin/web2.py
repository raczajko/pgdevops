from flask import Flask

import config

application = Flask(__name__)


@application.route("/")
def hello():
    return "<h1 style='color:blue'>Hello bam 3!</h1>"

if __name__ == '__main__':
    #app.run()
    try:
        application.debug = False
        #config.THREADED_MODE=False
        application.run(
            host=config.DEFAULT_SERVER,
            port=8080,
            #threaded=config.THREADED_MODE,
            processes=5
        )
    except IOError:
        app.logger.error("Error starting the app server: %s", sys.exc_info())