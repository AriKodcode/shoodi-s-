from fastapi import FastAPI
from .routes import router
from contextlib import asynccontextmanager
from .orchestrator import Orchestrator
from .config import Configuration
import logging 

def setup_logging():
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s | %(name)s | %(levelname)s | %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

@asynccontextmanager
async def lifespan(app: FastAPI):
        setup_logging()
        logger = logging.getLogger(__name__)
        service_config = Configuration()
        manager = Orchestrator(service_config.client_server, service_config.db_server)
        app.state.manager = manager
        logger.info('start service')
        yield
        logger.info('service shutdown')

app = FastAPI(lifespan=lifespan)
app.include_router(router)




