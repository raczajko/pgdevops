#!/bin/bash

#############################################
####     Copyright (c) 2015 BigSQL       ####
#############################################

DIR=$(cd "$(dirname "$0")"; pwd)
#export PYTHONPATH=$DIR/../lib
python $DIR/start_crossbar.py start --cbdir $DIR #--loglevel info --logtofile --logdir $DIR/../../data/logs/bam2
