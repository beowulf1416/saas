import logging
log = logging.getLogger(__name__)

from saas.app.core.services.connection import ConnectionManager
from saas.app.core.stores.base import BaseStore

from uuid import UUID


class JournalStore(BaseStore):

    def __init__(self, manager: ConnectionManager, name: str):
        super(JournalStore, self).__init__(manager, name)

    def add(self, journal = {}):
        pass