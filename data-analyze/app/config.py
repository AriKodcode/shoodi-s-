import os 


class Configuration():
    def __init__(self):
        db_host = os.getenv('DAL_HOST','db')
        db_port = os.getenv('DAL_PORT','8001')

        self.db_server = f'http://{db_host}:{db_port}'