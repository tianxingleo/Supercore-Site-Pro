# Project NEXUS (HK) - Windows 測試腳本

Write-Host "🚀 開始測試流程..." -ForegroundColor Green

# 1. 類型檢查
Write-Host "`n📝 運行類型檢查..." -ForegroundColor Yellow
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 類型檢查失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 類型檢查通過" -ForegroundColor Green

# 2. ESLint 檢查
Write-Host "`n🔍 運行 ESLint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ESLint 檢查失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✅ ESLint 檢查通過" -ForegroundColor Green

# 3. 構建測試
Write-Host "`n🏗️  構建生產版本..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 構建失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 構建成功" -ForegroundColor Green

# 4. 檢查構建輸出
Write-Host "`n📊 構建完成！" -ForegroundColor Yellow
Write-Host "💡 提示：運行 'npm run preview' 來預覽生產版本" -ForegroundColor Cyan
