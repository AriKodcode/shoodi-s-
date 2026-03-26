from fastapi import APIRouter, Request, Depends, HTTPException, Body
from schemas import ClientRequest
from orchestrator import Orchestrator
import json 
from typing import Any
import redis 
import logging 

router = APIRouter()

def get_manager(request:Request):
    return request.app.state.manager

@router.post('/cache_get',status_code=200)
def cache_cache(client_choice : ClientRequest, manager :Orchestrator = Depends(get_manager)):
    logger = logging.getLogger("get")
    try:
        data = manager.check_in_cache(client_choice)
        if data is None:
            logger.info('not data for this key')
            raise HTTPException(status_code=404,detail='not found data for this request')
        logger.info('hit find data')
        return json.loads(data)
    except Exception as e:
        logger.error(f'cache failed {str(e)}')
        raise HTTPException(status_code=404,detail=f'cache failed {str(e)}')


@router.post('/cache_set',status_code=200)
def get_data_for_cache(meals:Any =Body(...), data: ClientRequest = Body(...), manager:Orchestrator = Depends(get_manager)):
    try:
        logger = logging.getLogger('set')
        key = manager.normalization_client_choice(data)
        manager.redis_cache.setex(key, manager.ttl, json.dumps(meals))
        logger.info('set new data to db')
        return {"status": "success", "message": f"Data cached for {key}"}
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Data in Redis is not valid JSON")
    except redis.ConnectionError:
        raise HTTPException(status_code=404, detail="Redis down")    
    except Exception:
        raise HTTPException(status_code=404, detail="server failed")    
