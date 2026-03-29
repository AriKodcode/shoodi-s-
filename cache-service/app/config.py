import os 


class Configuration():
    def __init__(self):
        redis_host = os.getenv("REDIS_HOST","redis://localhost")
        
        self.ttl = int(os.getenv("TTL_CACHE","42200"))
        self.redis_config = redis_host