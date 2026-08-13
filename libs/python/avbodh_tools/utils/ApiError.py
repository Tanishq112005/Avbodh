### Using the Api Error Class For Giving the Api Error 


class ApiError(Exception):
    message: str 
    errors: any 
    success: bool
    
    def __init__(self, message="An error occurred", errors={}):
        self.message = message 
        self.errors = errors
        self.success = False
        super().__init__(self.message)
        
        
    