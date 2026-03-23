import os 


class Configuration():
    def __init__(self):
        db_host = os.getenv('DB_HOST','db')
        db_port = os.getenv('DB_PORT','8001')

        client_host = os.getenv('CLIENT_HOST','client')
        client_port = os.getenv('CLIENT_PORT','8000')

        self.client_server = f'http://{client_host}:{client_port}'
        self.db_server = f'http://{db_host}:{db_port}'