from fastapi import FastAPI
from contextlib import asynccontextmanager
from routes import router
import logging 
from config import Configuration
from orchestrator import Orchestrator


def setup_logging():
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s | %(name)s | %(levelname)s | %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

@asynccontextmanager
async def lifespan(app:FastAPI):
    setup_logging()
    logger = logging.getLogger(__name__)
    try:
        config = Configuration()
        manager = Orchestrator(config.redis_config, config.ttl)
        logger.info('server is on!')
    except Exception as e:
        logger.critical(f'sever crash {str(e)}')
    app.state.manager = manager
    yield

    logger.info('server down')
app = FastAPI(lifespan=lifespan)
app.include_router(router)