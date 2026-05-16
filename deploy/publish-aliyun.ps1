# 从本机 Windows 上传 dist 并在阿里云执行切换（需已配置 SSH 或手动输入密码）
# 用法（在项目根目录）:
#   powershell -ExecutionPolicy Bypass -File deploy\publish-aliyun.ps1
# 可选参数:
#   -DistPath   默认 ..\dist（相对 deploy 目录）或改为绝对路径
param(
  [string]$Server = "47.83.228.49",
  [int]$Port = 50021,
  [string]$User = "bom",
  [string]$DistPath = ""
)

$ErrorActionPreference = "Stop"
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptRoot

if (-not $DistPath) {
  $DistPath = Join-Path $ProjectRoot "dist"
}

if (-not (Test-Path $DistPath)) {
  Write-Error "找不到打包目录: $DistPath 请先执行 npm run build:prod"
}

$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$remoteIncoming = "/home/bom/dist_incoming_$ts"
$installScript = Join-Path $ScriptRoot "install-remote.sh"

Write-Host "本地目录: $DistPath"
Write-Host "远端中转: ${User}@${Server}:${remoteIncoming}"
Write-Host ""

# 1) 创建远端目录
ssh -p $Port "${User}@${Server}" "mkdir -p `"$remoteIncoming`""

# 2) 上传 dist 内全部文件（在 dist 目录内执行 scp，避免 Windows 下 * 转义问题）
Push-Location $DistPath
try {
  scp -r -P $Port * "${User}@${Server}:${remoteIncoming}/"
} finally {
  Pop-Location
}

# 3) 上传安装脚本并执行（需要远端 sudo，会提示密码）
scp -P $Port $installScript "${User}@${Server}:/home/bom/install-remote.sh"
ssh -p $Port "${User}@${Server}" "chmod +x /home/bom/install-remote.sh && sudo bash /home/bom/install-remote.sh $remoteIncoming"

Write-Host ""
Write-Host "完成。若静态资源由 Nginx 提供，一般无需 reload；改配置后才需要 nginx -s reload。"
