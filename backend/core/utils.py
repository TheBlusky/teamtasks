import ldap

from core import exceptions
from teamtasks import configuration


def ldap_authenticate(username, password):
    connexion = None
    try:
        connexion = ldap.initialize(configuration.LDAP_SERVER)
        user_dn = configuration.LDAP_DN_TEMPLATE.format(
            login=ldap.dn.escape_dn_chars(username)
        )
        connexion.simple_bind_s(user_dn, password)
        user_ldap = connexion.search_s(user_dn, ldap.SCOPE_BASE)[0]
        return {
            "username": user_ldap[1][configuration.LDAP_USERNAME_FIELD][0].decode(),
            "email": user_ldap[1][configuration.LDAP_EMAIL_FIELD][0].decode(),
        }
    except ldap.LDAPError:
        raise exceptions.AuthenticationFailed()
    finally:
        if connexion is not None:
            connexion.unbind_ext_s()
