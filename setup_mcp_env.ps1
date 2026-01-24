# MCP服务器环境变量设置脚本
# 使用方法：在PowerShell中运行 .\setup_mcp_env.ps1

param(
    [switch]$Permanent,
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

# 清除环境变量的函数
function Remove-McpEnvironmentVariables {
    $vars = @(
        'GITHUB_PERSONAL_ACCESS_TOKEN',
        'BRAVE_API_KEY',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'FIGMA_ACCESS_TOKEN',
        'POSTGRES_CONNECTION_STRING'
    )
    
    Write-ColorOutput "正在清除MCP服务器环境变量..." "Yellow"
    
    foreach ($var in $vars) {
        if ($Permanent) {
            [System.Environment]::SetEnvironmentVariable($var, $null, 'User')
            Write-ColorOutput "  已永久移除: $var" "Gray"
        } else {
            Set-Item -Path "Env:$var" -Value $null -ErrorAction SilentlyContinue
            Write-ColorOutput "  已移除当前会话: $var" "Gray"
        }
    }
    
    Write-ColorOutput "环境变量已清除完成！" "Green"
}

# 重置模式
if ($Reset) {
    Remove-McpEnvironmentVariables
    exit
}

# 显示欢迎信息
Write-ColorOutput "====================================" "Cyan"
Write-ColorOutput "  MCP服务器环境变量配置向导" "Cyan"
Write-ColorOutput "====================================" "Cyan"
Write-ColorOutput ""

if ($Permanent) {
    Write-ColorOutput "模式: 永久设置（用户级别环境变量）" "Yellow"
    Write-ColorOutput "注意: 需要重启终端或应用程序才能生效" "Yellow"
} else {
    Write-ColorOutput "模式: 临时设置（当前PowerShell会话）" "Yellow"
    Write-ColorOutput "注意: 关闭终端后环境变量会丢失" "Yellow"
}

Write-ColorOutput ""

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

# 获取GitHub Personal Access Token
Write-ColorOutput "`n1. GitHub Personal Access Token" "Cyan"
Write-ColorOutput "   格式: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" "Gray"
$githubToken = Read-SecretInput "   输入GitHub Token"

# 获取Brave Search API Key
Write-ColorOutput "`n2. Brave Search API Key" "Cyan"
Write-ColorOutput "   格式: BSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" "Gray"
$braveApiKey = Read-SecretInput "   输入Brave API Key"

# 获取Supabase URL
Write-ColorOutput "`n3. Supabase Project URL" "Cyan"
Write-ColorOutput "   格式: https://xxxxxxxxx.supabase.co" "Gray"
$supabaseUrl = Read-PlainInput "   输入Supabase URL"

# 获取Supabase ANON Key
Write-ColorOutput "`n4. Supabase ANON Key" "Cyan"
Write-ColorOutput "   格式: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." "Gray"
$supabaseAnonKey = Read-SecretInput "   输入Supabase ANON Key"

# 获取Figma Access Token
Write-ColorOutput "`n5. Figma Access Token" "Cyan"
Write-ColorOutput "   格式: figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" "Gray"
$figmaToken = Read-SecretInput "   输入Figma Access Token"

# 获取PostgreSQL Connection String（可选）
Write-ColorOutput "`n6. PostgreSQL Connection String (可选)" "Cyan"
Write-ColorOutput "   格式: postgresql://用户名:密码@localhost:5432/数据库名" "Gray"
Write-ColorOutput "   如果不需要PostgreSQL，可以直接按Enter跳过" "Gray"
$postgresConn = Read-PlainInput "   输入PostgreSQL Connection String (或按Enter跳过)"

# 设置环境变量
Write-ColorOutput "`n====================================" "Cyan"
Write-ColorOutput "正在设置环境变量..." "Cyan"
Write-ColorOutput "====================================" "Cyan"

if ($Permanent) {
    # 永久设置（用户级别）
    [System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', $githubToken, 'User')
    Write-ColorOutput "✓ GITHUB_PERSONAL_ACCESS_TOKEN" "Green"
    
    [System.Environment]::SetEnvironmentVariable('BRAVE_API_KEY', $braveApiKey, 'User')
    Write-ColorOutput "✓ BRAVE_API_KEY" "Green"
    
    [System.Environment]::SetEnvironmentVariable('SUPABASE_URL', $supabaseUrl, 'User')
    Write-ColorOutput "✓ SUPABASE_URL" "Green"
    
    [System.Environment]::SetEnvironmentVariable('SUPABASE_ANON_KEY', $supabaseAnonKey, 'User')
    Write-ColorOutput "✓ SUPABASE_ANON_KEY" "Green"
    
    [System.Environment]::SetEnvironmentVariable('FIGMA_ACCESS_TOKEN', $figmaToken, 'User')
    Write-ColorOutput "✓ FIGMA_ACCESS_TOKEN" "Green"
    
    if ($postgresConn -ne "") {
        [System.Environment]::SetEnvironmentVariable('POSTGRES_CONNECTION_STRING', $postgresConn, 'User')
        Write-ColorOutput "✓ POSTGRES_CONNECTION_STRING" "Green"
    }
    
    Write-ColorOutput "`n✓ 所有环境变量已永久设置！" "Green"
    Write-ColorOutput "  请重启终端或重新登录以使环境变量生效" "Yellow"
    
} else {
    # 临时设置（当前会话）
    Set-Item -Path "Env:GITHUB_PERSONAL_ACCESS_TOKEN" -Value $githubToken
    Write-ColorOutput "✓ GITHUB_PERSONAL_ACCESS_TOKEN" "Green"
    
    Set-Item -Path "Env:BRAVE_API_KEY" -Value $braveApiKey
    Write-ColorOutput "✓ BRAVE_API_KEY" "Green"
    
    Set-Item -Path "Env:SUPABASE_URL" -Value $supabaseUrl
    Write-ColorOutput "✓ SUPABASE_URL" "Green"
    
    Set-Item -Path "Env:SUPABASE_ANON_KEY" -Value $supabaseAnonKey
    Write-ColorOutput "✓ SUPABASE_ANON_KEY" "Green"
    
    Set-Item -Path "Env:FIGMA_ACCESS_TOKEN" -Value $figmaToken
    Write-ColorOutput "✓ FIGMA_ACCESS_TOKEN" "Green"
    
    if ($postgresConn -ne "") {
        Set-Item -Path "Env:POSTGRES_CONNECTION_STRING" -Value $postgresConn
        Write-ColorOutput "✓ POSTGRES_CONNECTION_STRING" "Green"
    }
    
    Write-ColorOutput "`n✓ 所有环境变量已临时设置！" "Green"
    Write-ColorOutput "  注意：关闭当前PowerShell窗口后，这些环境变量将失效" "Yellow"
}

# 验证环境变量
Write-ColorOutput "`n====================================" "Cyan"
Write-ColorOutput "环境变量验证" "Cyan"
Write-ColorOutput "====================================" "Cyan"

$checkVars = @(
    'GITHUB_PERSONAL_ACCESS_TOKEN',
    'BRAVE_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'FIGMA_ACCESS_TOKEN',
    'POSTGRES_CONNECTION_STRING'
)

foreach ($var in $checkVars) {
    $value = [System.Environment]::GetEnvironmentVariable($var, 'User')
    if ($value) {
        $masked = $value.Substring(0, [Math]::Min(8, $value.Length)) + "..."
        Write-ColorOutput "  $var = $masked" "Green"
    } else {
        $sessionValue = Get-Item -Path "Env:$var" -ErrorAction SilentlyContinue
        if ($sessionValue) {
            $masked = $sessionValue.Value.Substring(0, [Math]::Min(8, $sessionValue.Value.Length)) + "..."
            Write-ColorOutput "  $var = $masked (临时)" "Yellow"
        }
    }
}

Write-ColorOutput "`n配置完成！" "Green"
Write-ColorOutput "如果需要重置环境变量，请运行: .\setup_mcp_env.ps1 -Reset" "Gray"