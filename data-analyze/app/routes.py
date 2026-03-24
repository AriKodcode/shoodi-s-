from fastapi import APIRouter, HTTPException,Depends,Request
from schema import ClientRequest, MealsDB
import requests
from orchestrator import Orchestrator
import logging

router = APIRouter()

def get_manager(request:Request):
    return request.app.state.manager

@router.post('/analyze_client_choice',status_code=200)
def get_choice(request:ClientRequest, manager: Orchestrator = Depends(get_manager)):
    logger = logging.getLogger(__name__)

    try:
        response = requests.post(manager.db_uri, json=request.model_dump(),timeout=5)
        response.raise_for_status()
        logger.info('success send client request to db server')
    except Exception:
        logger.error('failed to send client request to db server',exc_info=True)
        raise HTTPException(status_code=521,detail='failed')
    try:
        data = MealsDB.model_validate(response.json())
    except Exception:
        logger.error('not correct data from db',exc_info=True)
        raise HTTPException(status_code=522,detail='unexpect data from db')
    try:
        info = manager.process_response(data,request)
        return {'result':info}
    except Exception as e:
        logger.error('failed analyze',exc_info=True)
        raise HTTPException(status_code=400,detail=f'failed analyze {str(e)}')
    