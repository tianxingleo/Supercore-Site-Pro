# MCP服务器配置验证脚本
# 使用方法：在PowerShell中运行 .\verify_mcp_config.ps1

# 颜色设置
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 检查Node.js是否安装
Write-ColorOutput "====================================" "Cyan"
Write-ColorOutput "  MCP服务器配置验证" "Cyan"
Write-ColorOutput "====================================" "Cyan"
Write-ColorOutput ""

Write-ColorOutput "1. 检查Node.js环境" "Cyan"
try {
    $nodeVersion = node --version 2>&1
    $npmVersion = npm --version 2>&1
    Write-ColorOutput "  [OK] Node.js: $nodeVersion" "Green"
    Write-ColorOutput "  [OK] npm: $npmVersion" "Green"
} catch {
    Write-ColorOutput "  [ERROR] Node.js未安装或不在PATH中" "Red"
    Write-ColorOutput "  请先安装Node.js: https://nodejs.org/" "Yellow"
    exit 1
}

# 检查配置文件
Write-ColorOutput ""
Write-ColorOutput "2. 检查配置文件" "Cyan"

$claudeConfigPath = "$env:USERPROFILE\.claude.json"
$opencodeConfigPath = "$env:USERPROFILE\.config\opencode\opencode.json"

if (Test-Path $claudeConfigPath) {
    Write-ColorOutput "  [OK] Claude Code配置文件存在" "Green"
    try {
        $claudeConfig = Get-Content $claudeConfigPath -Raw | ConvertFrom-Json
        $mcpCount = ($claudeConfig.mcpServers | Get-Member -MemberType NoteProperty).Count
        Write-ColorOutput "  [OK] Claude Code配置包含 $mcpCount 个MCP服务器" "Green"
    } catch {
        Write-ColorOutput "  [ERROR] Claude Code配置文件格式错误" "Red"
    }
} else {
    Write-ColorOutput "  [ERROR] Claude Code配置文件不存在" "Red"
}

if (Test-Path $opencodeConfigPath) {
    Write-ColorOutput "  [OK] OpenCode配置文件存在" "Green"
    try {
        $opencodeConfig = Get-Content $opencodeConfigPath -Raw | ConvertFrom-Json
        $mcpCount = ($opencodeConfig.mcp | Get-Member -MemberType NoteProperty).Count
        Write-ColorOutput "  [OK] OpenCode配置包含 $mcpCount 个MCP服务器" "Green"
    } catch {
        Write-ColorOutput "  [ERROR] OpenCode配置文件格式错误" "Red"
    }
} else {
    Write-ColorOutput "  [ERROR] OpenCode配置文件不存在" "Red"
}

# 检查环境变量
Write-ColorOutput ""
Write-ColorOutput "3. 检查环境变量" "Cyan"

$envVars = @{
    'GITHUB_PERSONAL_ACCESS_TOKEN' = 'GitHub Personal Access Token'
    'BRAVE_API_KEY' = 'Brave Search API Key'
    'SUPABASE_URL' = 'Supabase URL'
    'SUPABASE_ANON_KEY' = 'Supabase ANON Key'
    'FIGMA_ACCESS_TOKEN' = 'Figma Access Token'
    'POSTGRES_CONNECTION_STRING' = 'PostgreSQL Connection String'
}

$missingVars = 0
foreach ($var in $envVars.Keys) {
    $value = [System.Environment]::GetEnvironmentVariable($var, 'User')
    if ($value) {
        $masked = $value.Substring(0, [Math]::Min(8, $value.Length)) + "..."
        Write-ColorOutput "  [OK] $var = $masked" "Green"
    } else {
        $sessionValue = Get-Item -Path "Env:$var" -ErrorAction SilentlyContinue
        if ($sessionValue) {
            $masked = $sessionValue.Value.Substring(0, [Math]::Min(8, $sessionValue.Value.Length)) + "..."
            Write-ColorOutput "  [WARN] $var = $masked (临时)" "Yellow"
        } else {
            Write-ColorOutput "  [MISSING] $var = 未设置" "Red"
            $missingVars++
        }
    }
}

# 检查MCP服务器配置
Write-ColorOutput ""
Write-ColorOutput "4. 验证MCP服务器配置" "Cyan"

$requiredServers = @('supabase', 'postgres', 'github', 'brave-search', 'figma', 'repomix', 'fetch')

if (Test-Path $claudeConfigPath) {
    Write-ColorOutput "  Claude Code配置检查:" "Cyan"
    $claudeConfig = Get-Content $claudeConfigPath -Raw | ConvertFrom-Json
    foreach ($server in $requiredServers) {
        if ($claudeConfig.mcpServers.$server) {
            Write-ColorOutput "    [OK] $server" "Green"
        } else {
            Write-ColorOutput "    [ERROR] $server 未找到配置" "Red"
        }
    }
}

if (Test-Path $opencodeConfigPath) {
    Write-ColorOutput ""
    Write-ColorOutput "  OpenCode配置检查:" "Cyan"
    $opencodeConfig = Get-Content $opencodeConfigPath -Raw | ConvertFrom-Json
    foreach ($server in $requiredServers) {
        if ($opencodeConfig.mcp.$server) {
            Write-ColorOutput "    [OK] $server" "Green"
        } else {
            Write-ColorOutput "    [ERROR] $server 未找到配置" "Red"
        }
    }
}

# 检查归档服务器警告
Write-ColorOutput ""
Write-ColorOutput "5. 重要提醒" "Cyan"
Write-ColorOutput "  [WARN] 以下MCP服务器已归档:" "Yellow"
Write-ColorOutput "    - @modelcontextprotocol/server-postgres" "Gray"
Write-ColorOutput "    - @modelcontextprotocol/server-github" "Gray"
Write-ColorOutput "    - @modelcontextprotocol/server-figma" "Gray"
Write-ColorOutput "  建议: 寻找社区维护的活跃替代方案" "Yellow"

# 总结
Write-ColorOutput ""
Write-ColorOutput "====================================" "Cyan"
Write-ColorOutput "  验证总结" "Cyan"
Write-ColorOutput "====================================" "Cyan"

$envSetCount = 6 - $missingVars
Write-ColorOutput "  配置文件: 已检查" "Green"
Write-ColorOutput "  环境变量: $envSetCount/6 已设置" "Green"

if ($missingVars -gt 0) {
    Write-ColorOutput ""
    Write-ColorOutput "  建议操作:" "Yellow"
    Write-ColorOutput "  1. 运行 .\setup_mcp_env.ps1 设置缺失的环境变量" "Gray"
    Write-ColorOutput "  2. 运行 .\setup_opencode_mcp.ps1 配置OpenCode环境变量" "Gray"
    Write-ColorOutput "  3. 参考MCP_API_KEYS_GUIDE.md获取API密钥" "Gray"
} else {
    Write-ColorOutput ""
    Write-ColorOutput "  所有配置已完成！" "Green"
}

Write-ColorOutput ""
Write-ColorOutput "验证完成！" "Green"
Write-ColorOutput "如果发现问题，请参考上方的详细信息进行修复。" "Gray"