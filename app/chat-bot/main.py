from fastapi  import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse 
from avbodh_tools import ApiResponse, ApiError
from router.chatBot import router as chat_router
from config.dependencies import Dependencies
## docs url for this repo 
app = FastAPI(
    docs_url="/docs" 
)

### Starting different dependenices 
Dependencies.get_chat_model() 
Dependencies.get_embedding_model() 
Dependencies.get_rabbitmq_client() 
Dependencies.get_redis_client() 
Dependencies.get_vector_client() 


# Include the ChatBot Router
app.include_router(chat_router)



@app.get("/health" , tags=["Health CheckUp"])
def health_check():
    return JSONResponse(
              ApiResponse(
        "Health of the server is Ok"
    ))
