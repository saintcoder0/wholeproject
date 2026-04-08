from fastapi import APIRouter, HTTPException
from config import users_collection
from models import QuizSaveRequest, QuizResult

router = APIRouter(prefix="/quiz", tags=["quiz"])

@router.post("/save")
async def save_quiz_result(request: QuizSaveRequest):
    # Find user securely by email
    try:
        user = await users_collection.find_one({"email": request.user_email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found. You must be authenticated to save a quiz.")
            
        new_result = QuizResult(
            vata_score=request.vata,
            pitta_score=request.pitta,
            kapha_score=request.kapha,
            dominant_dosha=request.dominant,
            secondary_dosha=request.secondary
        )
        
        result_dict = new_result.model_dump()
        
        # Push to quiz_history array in Mongo document natively
        await users_collection.update_one(
            {"email": request.user_email},
            {"$push": {"quiz_history": result_dict}}
        )
        
        return {
            "status": "success", 
            "message": "Quiz result saved to database successfully", 
            "result": result_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Database Error: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Database connection failed. Please check if the database server is running and accessible."
        )

from models import TokenAuthRequest
from firebase_admin import auth as firebase_auth

@router.post("/history")
async def get_quiz_history(request: TokenAuthRequest):
    try:
        decoded_token = firebase_auth.verify_id_token(request.token)
        email = decoded_token.get("email")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    try:
        user = await users_collection.find_one({"email": email}, {"quiz_history": 1})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        history = user.get("quiz_history", [])
        return {"status": "success", "history": history}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Database Error: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Database connection failed. Please check if the database server is running and accessible."
        )
