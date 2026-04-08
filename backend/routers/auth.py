from fastapi import APIRouter, HTTPException
from firebase_admin import auth as firebase_auth
from config import users_collection
from models import TokenAuthRequest, UserInDB

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/verify", response_model=UserInDB)
async def verify_firebase_token(request: TokenAuthRequest):
    try:
        # Verify the Firebase ID token using the admin SDK
        decoded_token = firebase_auth.verify_id_token(request.token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase Token: {str(e)}")
        
    email = decoded_token.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Token does not contain an email address")
        
    # Firebase might not provide a name immediately on Email/Password signup
    name = decoded_token.get("name", email.split('@')[0]) 
    picture = decoded_token.get("picture")
    firebase_uid = decoded_token.get("uid")
    
    # Check if user exists in MongoDB
    try:
        existing_user = await users_collection.find_one({"email": email})
        
        if existing_user:
            # User exists, just return them
            existing_user["_id"] = str(existing_user["_id"])
            return UserInDB(**existing_user)
            
        # Create new user in Mongo syncing with Firebase UID
        new_user = UserInDB(
            email=email,
            name=name,
            picture=picture,
            google_id=firebase_uid # Using google_id field to store the primary firebase UID
        )
        user_dict = new_user.model_dump(by_alias=True, exclude_none=True)
        result = await users_collection.insert_one(user_dict)
        
        user_dict["_id"] = str(result.inserted_id)
        return UserInDB(**user_dict)
    except Exception as e:
        print(f"Database Error: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Database connection failed. Please check if the database server is running and accessible."
        )
