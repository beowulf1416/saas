import logging
log = logging.getLogger(__name__)

from saas.app.core.services.module import BaseModule


class InventoryModule(BaseModule):

    def getModuleDescriptor(self):
        return {
            'name': 'inventory',
            'help': 'Inventory Module',
            'icon': '<span class="material-icons">view_quilt</span>'
        }

    def getContent(self):
        return {
            'template': 'saas.app.modules.inventory:templates/module.html'
        }