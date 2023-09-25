from datetime import timedelta

import os


MIXNET_01_NAME = os.environ.get("MIXNET_01_NAME", "mixserver01")
MIXNET_01_URL = os.environ.get("MIXNET_01_URL", "http://mixserver01:8000")
MIXNET_02_NAME = os.environ.get("MIXNET_02_NAME", "mixserver02")
MIXNET_02_URL = os.environ.get("MIXNET_02_URL", "http://mixserver02:8000")
MIXNET_03_NAME = os.environ.get("MIXNET_03_NAME", "mixserver03")
MIXNET_03_URL = os.environ.get("MIXNET_03_URL", "http://mixserver03:8000")
MIXNET_TOKEN =  os.environ.get("MIXNET_TOKEN")
MIXNET_WIDTH = int(os.environ.get("MIXNET_WIDTH", 6))
MIXNET_WAIT_INTERVAL = int(os.environ.get("MIXNET_WAIT_INTERVAL", 5))

TIMEZONE = os.environ.get("TIMEZONE", "Chile/Continental")
TOKEN_ANALYTICS_OP = os.environ.get("TOKEN_ANALYTICS_OP")

ORIGINS: list = [
    "*"
]