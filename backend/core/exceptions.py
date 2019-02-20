from rest_framework import status
from rest_framework.exceptions import APIException


class RegistrationNotAllowed(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "registration_not_allowed"
    default_detail = "registration_not_allowed"


class NotAdmin(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "not_admin"
    default_detail = "Only admin can perform this action"


class UserAlreadyExists(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "user_already_exists"
    default_detail = "User with same username or email already exists"


class AuthenticationFailed(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_code = "authentication_failed"
    default_detail = "The username / password mismatch"


class AlreadyInTeam(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "already_in_team"
    default_detail = "Cannot create team if already in team"


class AlreadyWorking(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "already_working"
    default_detail = "Cannot crate working day if already working"


class DayAlreadyExists(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "day_already_exists"
    default_detail = "day_already_exists"


class AlreadyPlanned(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "already_planned"
    default_detail = "already_planned"


class NotPlannedYet(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "not_planned_yet"
    default_detail = "not_planned_yet"


class AlreadyWorked(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "already_worked"
    default_detail = "already_worked"


class NoCurrentWorkDay(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "no_current_working_day"
    default_detail = "no_current_working_day"


class WorkDayAlreadyFinished(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "workday_already_finished"
    default_detail = "workday_already_finished"


class NotInCurrentWorkday(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "not_in_current_workday"
    default_detail = "not_in_current_workday"


class AlreadyPinged(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "already_pinged"
    default_detail = "already_pinged"


class TooEarly(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "too_early"
    default_detail = "too_early"


class CantSelfPing(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "cant_self_ping"
    default_detail = "cant_self_ping"


class AlreadyPlanned(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "already_planned"
    default_detail = "already_planned"
