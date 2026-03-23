from schema import DBResponse, ClientRequest
import logging 

class Orchestrator():
    def __init__(self,client_uri:str, db_uri:str):
        self.logger = logging.getLogger(__name__)
        self.client_uri = client_uri
        self.db_uri = db_uri 
    
    def match_to_client(self,score:DBResponse):
        return f'{score.score*100}%'
    
    def calculate_score(self, recipe:list[DBResponse]):
        result = []
        for rec in recipe:
            result.append({'recipe_id':rec.id,'match':self.match_to_client(rec),'information':self.get_status_recipe(rec)})
        return result 
    
    def get_status_recipe(self, data:DBResponse):
        status = []
        if data.health_score > 0.5:
            status.append('health')
        if data.light_score > 0.5:
            status.append('light')
        if data.protein_score > 0.5:
            status.append('protein')
        if data.popularity_score > 0.5 :
            status.append('popular')
        return status