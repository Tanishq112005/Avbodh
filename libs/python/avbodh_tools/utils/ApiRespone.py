### Using the Api Response Class For Giving the Api Response 



class ApiResponse:
    message : str 
    data : any 
    success : bool
    
    
    def __init__(self , message = "Success Fully Get The Output" , data = {}):
        self.message = message 
        self.data = data
        self.success = True 
        
        
        
    