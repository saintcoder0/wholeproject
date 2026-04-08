# start_all.ps1
# Script to launch both backend and frontend servers together

Write-Host "Starting OJAS Backend..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd backend; `$env:OPENSSL_CONF = `"`$PWD\openssl.cfg`"; uv run uvicorn main:app --reload --port 8000" -WindowStyle Normal

Write-Host "Starting OJAS Frontend..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd frontend-react; npm run dev" -WindowStyle Normal

Write-Host "Both servers started in separate windows."
