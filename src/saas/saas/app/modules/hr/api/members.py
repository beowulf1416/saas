import logging
log = logging.getLogger(__name__)

from pyramid.view import view_config
import pyramid.httpexceptions as exception

from jsonschema.exceptions import ValidationError
import json


@view_config(
    route_name='api.hr.members.save',
    request_method='POST',
    renderer='json'
)
def api_hr_members_filter(request):
    params = request.json_body

    services = request.services()
    validator = services['validator.json']
    membersStore = services['store.hr.members']

    try:
        validator.validate(
            instance = params,
            schema_file = '/hr/country/member.json'
        )
        membersStore.save(params)
    except ValidationError as e:
        log.error(e)
        raise exception.HTTPBadRequest(
            detail=e.message,
            explanation='Incorrect parameters'
        )
    except Exception as e:
        log.error(e)
        raise exception.HTTPInternalServerError(
            detail=str(e),
            explanation=str(e)
        )

    raise exception.HTTPOk(
        detail='Member record created',
        body={
            'message': 'Member record created'
        }
    )