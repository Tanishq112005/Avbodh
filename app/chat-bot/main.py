from fastapi  import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse 
from avbodh_tools import ApiResponse, ApiError

## docs url for this repo 
app = FastAPI(
    docs_url="/docs" 
)


@app.get("/health" , tags=["Health CheckUp"])


def health_check():
 
    return JSONResponse(
              ApiResponse(
        "Health of the server is Ok"
    ))

