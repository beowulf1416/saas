import logging
log = logging.getLogger(__name__)

from pyramid.view import view_config

@view_config(
    route_name='accounting.default',
    request_method='GET',
    renderer='saas.app.modules.accounting:templates/default.html'
)
def view_accounting_default(request):
    return {}