import unittest
import requests
import json
import logging
import logging.config

logger = logging.getLogger(__name__)

with open("logging.json", 'rt') as f:
    config = json.load(f)
logging.config.dictConfig(config)

PGC_API = "http://localhost:8051/"

class Singleton(object):
    _instance = None
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Singleton, cls).__new__(
                            cls, *args, **kwargs)
            payload = {
                "email": "naveen.koppula@openscg.com",
                "password": "6442naveen"
            }
            headers = {
                "Content-Type": "application/json"
            }
            response = requests.post('http://localhost:8051/api/login/', json=payload, headers=headers)
            cls.response = response.json()
        return cls._instance

class BaseTest(unittest.TestCase):
    def setUp(self):
        response = Singleton().response
        self.assertEqual(response['code'], 200)
        self.auth_token = response['authentication_token']

    def validate_response(self,response, command):
        response.json()
        for resp in response.json():
            if 'state' in resp and resp['state'] == 'error':
                logger.error('Unexpected exception raised in %s : %s'%(command, resp['msg']))
                self.fail('Unexpected exception raised in %s : %s '%(command, resp['msg']))
            elif 'status' in resp and resp['status'] == 'error':
                logger.error('Unexpected exception raised in %s : %s'%(command, resp['msg']))
                self.fail('Unexpected exception raised in %s : %s '%(command, resp['msg']))



