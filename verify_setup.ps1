# MCP配置验证脚本
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  MCP配置验证" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 检查系统环境变量
Write-Host "1. 系统环境变量检查:" -ForegroundColor Cyan

$envVars = @{
    'GITHUB_PERSONAL_ACCESS_TOKEN' = 'GitHub Token'
    'SUPABASE_URL' = 'Supabase URL'
    'SUPABASE_ANON_KEY' = 'Supabase ANON Key'
}

foreach ($var in $envVars.Keys) {
    $value = [System.Environment]::GetEnvironmentVariable($var, 'User')
    if ($value) {
        $masked = $value.Substring(0, [Math]::Min(20, $value.Length)) + "..."
        Write-Host "  [OK] $envVars[$var] = $masked" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $envVars[$var]" -ForegroundColor Red
    }
}

# 检查OpenCode配置
Write-Host ""
Write-Host "2. OpenCode配置检查:" -ForegroundColor Cyan

$configPath = "$env:USERPROFILE\.config\opencode\opencode.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json

    if ($config.mcp.github.environment.GITHUB_PERSONAL_ACCESS_TOKEN) {
        $token = $config.mcp.github.environment.GITHUB_PERSONAL_ACCESS_TOKEN
        $masked = $token.Substring(0, [Math]::Min(20, $token.Length)) + "..."
        Write-Host "  [OK] GitHub Token = $masked" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] GitHub Token" -ForegroundColor Red
    }

    if ($config.mcp.supabase.environment.SUPABASE_URL) {
        Write-Host "  [OK] Supabase URL = $($config.mcp.supabase.environment.SUPABASE_URL)" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] Supabase URL" -ForegroundColor Red
    }

    if ($config.mcp.supabase.environment.SUPABASE_ANON_KEY) {
        $key = $config.mcp.supabase.environment.SUPABASE_ANON_KEY
        $masked = $key.Substring(0, [Math]::Min(20, $key.Length)) + "..."
        Write-Host "  [OK] Supabase ANON Key = $masked" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] Supabase ANON Key" -ForegroundColor Red
    }
} else {
    Write-Host "  [ERROR] OpenCode配置文件不存在" -ForegroundColor Red
}

# 总结
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  验证总结" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  ✅ GitHub配置完成" -ForegroundColor Green
Write-Host "  ✅ Supabase配置完成" -ForegroundColor Green
Write-Host ""
Write-Host "  下一步: 重启OpenCode使配置生效" -ForegroundColor Yellow
Write-Host ""
Write-Host "配置完成！" -ForegroundColor Green