import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def test_conn():
    load_dotenv()
    uri = os.getenv("MONGODB_URI")
    print(f"Testing connection to: {uri}")
    client = AsyncIOMotorClient(uri)
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("MongoDB connection successful!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_conn())
