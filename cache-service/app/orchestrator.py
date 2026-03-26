import logging 
import redis
from schemas import ClientRequest


class Orchestrator():
    def __init__(self,redis_uri: str, ttl:int):
        self.logger = logging.getLogger(__name__)
        self.ttl = ttl
        try:
            self.redis_cache = redis.from_url(redis_uri,  decode_responses=True)
            self.redis_cache.ping()
            self.logger.info('success connect to redis server')
        except Exception as e :
            self.logger.critical(f'failed connect to redis. {str(e)}')

    def normalization_client_choice(self,request: ClientRequest):
        try: 
            request_data = request.model_dump(mode='json')
            weights = request_data['weights']
            type_choice = request_data['type']
            normalize_params_list = [str(value) for value in weights.values()]
            self.logger.info('success normalize client request for redis key')
            return f'search:v1:params:{type_choice}:{':'.join(normalize_params_list)}'
        except Exception as e:
            self.logger.error(f'failed normalize for key. {str(e)}')
            raise

    def check_in_cache(self, request: ClientRequest):
        try:
            key = self.normalization_client_choice(request)
            value = self.redis_cache.get(key)
            if value:
                return value
            return None
        except Exception as e:
            self.logger.error(f'get key failed {str(e)}')
            return None