from fastapi import APIRouter, Request, Depends, HTTPException
from schemas import ClientRequest
from orchestrator import Orchestrator
import json 
from typing import Any
import redis 


router = APIRouter()

def get_manager(request:Request):
    return request.app.state.manager

@router.post('/check_get',status_code=200)
def cache_cache(client_choice : ClientRequest, manager :Orchestrator = Depends(get_manager)):
    try:
        data = manager.check_in_cache(client_choice)
        if data is None:
            raise HTTPException(status_code=404,detail='not found data for this request')
        return {"status":'hit','data':json.loads(data)}
    except Exception as e:
        
        raise HTTPException(status_code=404,detail=f'cache failed {str(e)}')


@router.post('/cache_set',status_code=200)
def get_data_for_cache(data:Any, client_choice: ClientRequest, manager:Orchestrator = Depends(get_manager)):
    try:
        key = manager.normalization_client_choice(client_choice)
        manager.redis_cache.setex(key, manager.ttl, json.dumps(data))
        return {"status": "success", "message": f"Data cached for {key}"}
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Data in Redis is not valid JSON")
    except redis.ConnectionError:
        raise HTTPException(status_code=404, detail="Redis down")    
    except Exception:
        raise HTTPException(status_code=404, detail="seer failed")    
