import logging
log = logging.getLogger(__name__)

from saas.app.core.services import get_service


def includeme(config):
    log.info('including: saas.app.modules.inventory')    

    config.include('saas.app.modules.inventory.stores')
    config.include('saas.app.modules.inventory.api')

    services = get_service(None)
    modules = services['modules']
    modules['inventory'] = {
        'navigators': [
            {
                'id': 'inventory',
                'title': 'Inventory',
                'help': 'Manage Inventory',
                'icon': '<span class="material-icons">view_quilt</span>',
                'template': 'saas.app.modules.inventory:templates/navigator.html',
                'permission': 'inventory.dashboard'
            }
        ],
        'js': [
            {
                'type': 'module',
                'script': '/static/js/modules/inventory/actions.js'
            },
            {
                'type': 'module',
                'script': '/static/js/modules/inventory/inventory.js',
                'async': True,
            },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/items-explorer/items-explorer.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/item-selector/item-selector.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/item-selector/item-selector-view.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/item-editor/item-editor.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/facility/facility-browser/facility-browser.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/facility/facility-editor/facility-editor.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/facility/facility-selector/facility-selector.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': '/static/custom-elements/inventory/facility/facility-selector/facility-selector-view.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': 'static/custom-elements/inventory/receiving-dashboard/receiving-dashboard.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': 'static/custom-elements/inventory/receiving-editor/receiving-editor.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': 'static/custom-elements/inventory/location-explorer/location-explorer.js',
            #     'async': True,
            # },
            # {
            #     'type': 'module',
            #     'script': 'static/custom-elements/inventory/location-editor/location-editor.js',
            #     'async': True,
            # },
            {
                'external': 'true',
                'script': 'https://unpkg.com/rxjs/bundles/rxjs.umd.min.js'
            }
        ],
        'elements': [
            {
                'tag': 'items-explorer',
                'script': '/static/custom-elements/inventory/items-explorer/items-explorer.js'
            },
            {
                'tag': 'item-editor',
                'script': '/static/custom-elements/inventory/item-editor/item-editor.js'
            },
            {
                'tag': 'facility-browser',
                'script': '/static/custom-elements/inventory/facility/facility-browser/facility-browser.js'
            },
            {
                'tag': 'facility-editor',
                'script': '/static/custom-elements/inventory/facility/facility-editor/facility-editor.js'
            },
            {
                'tag': 'facility-selector',
                'script': '/static/custom-elements/inventory/facility/facility-selector/facility-selector.js'
            },
            {
                'tag': 'facility-selector-view',
                'script': '/static/custom-elements/inventory/facility/facility-selector/facility-selector-view.js'
            },
            {
                'tag': 'location-explorer',
                'script': '/static/custom-elements/inventory/location-explorer/location-explorer.js'
            },
            {
                'tag': 'location-editor',
                'script': '/static/custom-elements/inventory/location-editor/location-editor.js'
            },
            {
                'tag': 'receiving-editor',
                'script': '/static/custom-elements/inventory/receiving-editor/receiving-editor.js'
            },
            {
                'tag': 'receiving-dashboard',
                'script': '/static/custom-elements/inventory/receiving-dashboard/receiving-dashboard.js'
            },
            {
                'tag': 'item-selector',
                'script': '/static/custom-elements/inventory/item-selector/item-selector.js'
            },
            {
                'tag': 'item-selector-view',
                'script': '/static/custom-elements/inventory/item-selector/item-selector-view.js'
            }
        ]
    }