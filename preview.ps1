# Preview helper: start a local http.server if python is available, otherwise open index.html directly
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

try {
    $py = & python --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Python found. Starting simple HTTP server on http://localhost:8000"
        Start-Process -NoNewWindow -FilePath python -ArgumentList "-m","http.server","8000"
        Write-Host "Server started. Open http://localhost:8000 in your browser."
        return
    }
} catch {
    # ignore
}

Write-Host "Python not found or failed to run. Opening index.html directly in your browser."
Start-Process -FilePath (Join-Path $root 'index.html')
