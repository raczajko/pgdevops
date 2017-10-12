# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------

from msrest.serialization import Model


class SubtaskInformation(Model):
    """Information about an Azure Batch subtask.

    :param id: The ID of the subtask.
    :type id: int
    :param node_info: Information about the compute node on which the subtask
     ran.
    :type node_info: :class:`ComputeNodeInformation
     <azure.batch.models.ComputeNodeInformation>`
    :param start_time: The time at which the subtask started running. If the
     subtask has been restarted or retried, this is the most recent time at
     which the subtask started running.
    :type start_time: datetime
    :param end_time: The time at which the subtask completed. This property is
     set only if the subtask is in the Completed state.
    :type end_time: datetime
    :param exit_code: The exit code of the program specified on the subtask
     command line. This property is set only if the subtask is in the completed
     state. In general, the exit code for a process reflects the specific
     convention implemented by the application developer for that process. If
     you use the exit code value to make decisions in your code, be sure that
     you know the exit code convention used by the application process.
     However, if the Batch service terminates the subtask (due to timeout, or
     user termination via the API) you may see an operating system-defined exit
     code.
    :type exit_code: int
    :param failure_info: Information describing the task failure, if any. This
     property is set only if the task is in the completed state and encountered
     a failure.
    :type failure_info: :class:`TaskFailureInformation
     <azure.batch.models.TaskFailureInformation>`
    :param state: The current state of the subtask. Possible values include:
     'preparing', 'running', 'completed'
    :type state: str or :class:`SubtaskState
     <azure.batch.models.SubtaskState>`
    :param state_transition_time: The time at which the subtask entered its
     current state.
    :type state_transition_time: datetime
    :param previous_state: The previous state of the subtask. This property is
     not set if the subtask is in its initial running state. Possible values
     include: 'preparing', 'running', 'completed'
    :type previous_state: str or :class:`SubtaskState
     <azure.batch.models.SubtaskState>`
    :param previous_state_transition_time: The time at which the subtask
     entered its previous state. This property is not set if the subtask is in
     its initial running state.
    :type previous_state_transition_time: datetime
    :param result: The result of the task execution. If the value is 'failed',
     then the details of the failure can be found in the failureInfo property.
     Possible values include: 'success', 'failure'
    :type result: str or :class:`TaskExecutionResult
     <azure.batch.models.TaskExecutionResult>`
    """

    _attribute_map = {
        'id': {'key': 'id', 'type': 'int'},
        'node_info': {'key': 'nodeInfo', 'type': 'ComputeNodeInformation'},
        'start_time': {'key': 'startTime', 'type': 'iso-8601'},
        'end_time': {'key': 'endTime', 'type': 'iso-8601'},
        'exit_code': {'key': 'exitCode', 'type': 'int'},
        'failure_info': {'key': 'failureInfo', 'type': 'TaskFailureInformation'},
        'state': {'key': 'state', 'type': 'SubtaskState'},
        'state_transition_time': {'key': 'stateTransitionTime', 'type': 'iso-8601'},
        'previous_state': {'key': 'previousState', 'type': 'SubtaskState'},
        'previous_state_transition_time': {'key': 'previousStateTransitionTime', 'type': 'iso-8601'},
        'result': {'key': 'result', 'type': 'TaskExecutionResult'},
    }

    def __init__(self, id=None, node_info=None, start_time=None, end_time=None, exit_code=None, failure_info=None, state=None, state_transition_time=None, previous_state=None, previous_state_transition_time=None, result=None):
        self.id = id
        self.node_info = node_info
        self.start_time = start_time
        self.end_time = end_time
        self.exit_code = exit_code
        self.failure_info = failure_info
        self.state = state
        self.state_transition_time = state_transition_time
        self.previous_state = previous_state
        self.previous_state_transition_time = previous_state_transition_time
        self.result = result
