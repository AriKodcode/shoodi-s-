import os 


class Configuration():
    def __init__(self):
        db_host = os.getenv('DAL_HOST','db')
        db_port = os.getenv('DAL_PORT','8001')
        db_route = os.getenv('DAL_ROUTE','candidates')
        self.db_server = f'{db_host}/{db_route}'