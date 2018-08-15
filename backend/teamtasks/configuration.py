import os

ALLOW_REGISTER = os.environ.get("TT_ALLOW_REGISTER", "true") == "true"

LDAP_ENABLED = os.environ.get("TT_LDAP_ENABLED", "false") == "true"
LDAP_SERVER = os.environ.get("TT_LDAP_SERVER", "ldap://127.0.0.1:389")
LDAP_DN_TEMPLATE = os.environ.get(
    "TT_LDAP_DN_TEMPLATE", "cn={login},ou=users,dc=example,dc=com"
)
LDAP_USERNAME_FIELD = os.environ.get("TT_LDAP_USERNAME_FIELD", "")
LDAP_EMAIL_FIELD = os.environ.get("TT_LDAP_EMAIL_FIELD", "")
