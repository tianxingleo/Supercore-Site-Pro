# Clear Supabase environment variables from the current session
$env:SUPABASE_URL = $null
$env:SUPABASE_KEY = $null
$env:SUPABASE_SECRET_KEY = $null
$env:SUPABASE_ANON_KEY = $null
$env:SUPABASE_SERVICE_KEY = $null
$env:NUXT_PUBLIC_SUPABASE_URL = $null
$env:NUXT_PUBLIC_SUPABASE_KEY = $null

Write-Host "--------------------------------------------------"
Write-Host "🔍 checking connectivity to Supabase (115.191.15.139:8000)..."
try {
    $t = Test-NetConnection -ComputerName 115.191.15.139 -Port 8000 -WarningAction SilentlyContinue
    if ($t.TcpTestSucceeded) {
        Write-Host "✅ Connection Successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Connection FAILED!" -ForegroundColor Red
        Write-Host "   The server 115.191.15.139 is not reachable on port 8000."
        Write-Host "   Please check your VPN, Network, or Server Status."
        Write-Host "   Warning: Nuxt will likely fail to fetch data." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Cloud not run network test."
}

Write-Host "--------------------------------------------------"
Write-Host "✅ Supabase Environment Variables CLEARED from Shell Session"
Write-Host "   (This forces Nuxt to read from .env file)"
Write-Host "--------------------------------------------------"
Write-Host "Starting Nuxt development server..."

# Run the dev server
npm run dev