### Using the Api Response Class For Giving the Api Response 



class ApiResponse(dict):
    def __init__(self, message="Successfully Get The Output", data={}):
        super().__init__(message=message, data=data, success=True)