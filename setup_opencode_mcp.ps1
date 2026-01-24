# OpenCode MCP环境变量配置脚本
# 使用方法：在PowerShell中运行 .\setup_opcode_mcp.ps1

param(
    [switch]$Reset
)

# 颜色设置
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 显示欢迎信息
Write-ColorOutput "====================================" "Cyan"
Write-ColorOutput "  OpenCode MCP环境变量配置" "Cyan"
Write-ColorOutput "====================================" "Cyan"
Write-ColorOutput ""

# OpenCode配置文件路径
$configPath = "$env:USERPROFILE\.config\opencode\opencode.json"

# 检查配置文件是否存在
if (-not (Test-Path $configPath)) {
    Write-ColorOutput "错误: 找不到OpenCode配置文件" "Red"
    Write-ColorOutput "路径: $configPath" "Gray"
    exit 1
}

# 读取配置文件
$config = Get-Content $configPath -Raw | ConvertFrom-Json

# 重置模式
if ($Reset) {
    Write-ColorOutput "正在重置OpenCode MCP环境变量..." "Yellow"
    
    if ($config.mcp.supabase.environment) {
        $config.mcp.supabase.environment.SUPABASE_URL = ""
        $config.mcp.supabase.environment.SUPABASE_ANON_KEY = ""
    }
    if ($config.mcp.postgres.environment) {
        $config.mcp.postgres.environment.POSTGRES_CONNECTION_STRING = ""
    }
    if ($config.mcp.github.environment) {
        $config.mcp.github.environment.GITHUB_PERSONAL_ACCESS_TOKEN = ""
    }
    if ($config.mcp.'brave-search'.environment) {
        $config.mcp.'brave-search'.environment.BRAVE_API_KEY = ""
    }
    if ($config.mcp.figma.environment) {
        $config.mcp.figma.environment.FIGMA_ACCESS_TOKEN = ""
    }
    
    $config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8
    Write-ColorOutput "OpenCode MCP环境变量已重置完成！" "Green"
    exit
}

# 输入函数（隐藏输入）
function Read-SecretInput {
    param([string]$Prompt)
    Write-Host "$Prompt: " -NoNewline
    $password = Read-Host -AsSecureString
    $passwordPtr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($passwordPtr)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPtr)
    return $plainPassword
}

# 输入函数（明文显示）
function Read-PlainInput {
    param([string]$Prompt)
    Write-Host "$Prompt: " -NoNewline
    return Read-Host
}

Write-ColorOutput "将配置以下MCP服务器的环境变量:" "Cyan"
Write-ColorOutput "  - supabase: SUPABASE_URL, SUPABASE_ANON_KEY" "Gray"
Write-ColorOutput "  - postgres: POSTGRES_CONNECTION_STRING" "Gray"
Write-ColorOutput "  - github: GITHUB_PERSONAL_ACCESS_TOKEN" "Gray"
Write-ColorOutput "  - brave-search: BRAVE_API_KEY" "Gray"
Write-ColorOutput "  - figma: FIGMA_ACCESS_TOKEN" "Gray"
Write-ColorOutput ""

# 获取Supabase配置
Write-ColorOutput "1. Supabase配置" "Cyan"
Write-ColorOutput "   获取地址: https://supabase.com/dashboard" "Gray"

$useSupabase = Read-Host "   是否配置Supabase? (y/n)"
if ($useSupabase -eq 'y' -or $useSupabase -eq 'Y') {
    $supabaseUrl = Read-PlainInput "   输入SUPABASE_URL"
    $supabaseAnonKey = Read-SecretInput "   输入SUPABASE_ANON_KEY"
    
    if ($config.mcp.supabase.environment) {
        $config.mcp.supabase.environment.SUPABASE_URL = $supabaseUrl
        $config.mcp.supabase.environment.SUPABASE_ANON_KEY = $supabaseAnonKey
    }
}

# 获取PostgreSQL配置
Write-ColorOutput "`n2. PostgreSQL配置" "Cyan"
$usePostgres = Read-Host "   是否配置PostgreSQL? (y/n)"
if ($usePostgres -eq 'y' -or $usePostgres -eq 'Y') {
    $postgresConn = Read-PlainInput "   输入POSTGRES_CONNECTION_STRING"
    
    if ($config.mcp.postgres.environment) {
        $config.mcp.postgres.environment.POSTGRES_CONNECTION_STRING = $postgresConn
    }
}

# 获取GitHub配置
Write-ColorOutput "`n3. GitHub配置" "Cyan"
$useGithub = Read-Host "   是否配置GitHub? (y/n)"
if ($useGithub -eq 'y' -or $useGithub -eq 'Y') {
    $githubToken = Read-SecretInput "   输入GITHUB_PERSONAL_ACCESS_TOKEN"
    
    if ($config.mcp.github.environment) {
        $config.mcp.github.environment.GITHUB_PERSONAL_ACCESS_TOKEN = $githubToken
    }
}

# 获取Brave Search配置
Write-ColorOutput "`n4. Brave Search配置" "Cyan"
$useBrave = Read-Host "   是否配置Brave Search? (y/n)"
if ($useBrave -eq 'y' -or $useBrave -eq 'Y') {
    $braveApiKey = Read-SecretInput "   输入BRAVE_API_KEY"
    
    if ($config.mcp.'brave-search'.environment) {
        $config.mcp.'brave-search'.environment.BRAVE_API_KEY = $braveApiKey
    }
}

# 获取Figma配置
Write-ColorOutput "`n5. Figma配置" "Cyan"
$useFigma = Read-Host "   是否配置Figma? (y/n)"
if ($useFigma -eq 'y' -or $useFigma -eq 'Y') {
    $figmaToken = Read-SecretInput "   输入FIGMA_ACCESS_TOKEN"
    
    if ($config.mcp.figma.environment) {
        $config.mcp.figma.environment.FIGMA_ACCESS_TOKEN = $figmaToken
    }
}

# 保存配置文件
Write-ColorOutput "`n====================================" "Cyan"
Write-ColorOutput "正在保存配置..." "Cyan"
Write-ColorOutput "====================================" "Cyan"

$config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8

Write-ColorOutput "✓ OpenCode MCP配置已保存！" "Green"
Write-ColorOutput "  配置文件: $configPath" "Gray"
Write-ColorOutput "`n注意: 需要重启OpenCode才能使配置生效" "Yellow"

# 验证配置
Write-ColorOutput "`n====================================" "Cyan"
Write-ColorOutput "配置验证" "Cyan"
Write-ColorOutput "====================================" "Cyan"

$mcpServers = @('supabase', 'postgres', 'github', 'brave-search', 'figma')
foreach ($server in $mcpServers) {
    if ($config.mcp.$server.environment) {
        $envVars = $config.mcp.$server.environment | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
        $hasValue = $false
        foreach ($var in $envVars) {
            if ($config.mcp.$server.environment.$var -ne "") {
                $hasValue = $true
                break
            }
        }
        
        if ($hasValue) {
            Write-ColorOutput "  ✓ $server" "Green"
        } else {
            Write-ColorOutput "  ○ $server (未配置)" "Gray"
        }
    }
}

Write-ColorOutput "`n配置完成！" "Green"
Write-ColorOutput "如果需要重置配置，请运行: .\setup_opencode_mcp.ps1 -Reset" "Gray"