# run.ps1 — Use this instead of `uvicorn main:app --reload --port 8000`
# Sets OPENSSL_CONF before Python/OpenSSL initializes, which fixes:
#   TLSV1_ALERT_INTERNAL_ERROR when connecting to MongoDB Atlas
#   (caused by OpenSSL 3.0 enforcing SECLEVEL=2 by default)

$env:OPENSSL_CONF = "$PSScriptRoot\openssl.cfg"
Write-Host "OPENSSL_CONF set to: $env:OPENSSL_CONF"
uvicorn main:app --reload --port 8000
