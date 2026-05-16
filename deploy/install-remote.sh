#!/usr/bin/env bash
# 在服务器上执行：将已上传到 home 目录的中转文件夹原子切换到正式目录
# 用法：sudo bash install-remote.sh /home/bom/dist_incoming_YYYYMMDD_HHMMSS
set -euo pipefail

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "请使用 root 权限: sudo bash $0 ..."
  exit 1
fi

INCOMING="${1:?用法: $0 /home/bom/dist_incoming_时间戳}"
LIVE="/opt/bom_web/bom_front"
BACKUP_ROOT="/opt/bom_web/backup"
TS="$(date +%Y%m%d_%H%M%S)"
BACKUP="${BACKUP_ROOT}/bom_front_${TS}"

if [[ ! -d "$INCOMING" ]]; then
  echo "错误: 中转目录不存在: $INCOMING"
  exit 1
fi

mkdir -p "$BACKUP_ROOT"

if [[ -e "$LIVE" ]]; then
  echo "备份当前线上目录 -> $BACKUP"
  mv "$LIVE" "$BACKUP"
else
  echo "警告: $LIVE 不存在，将首次创建"
fi

echo "切换新版本 -> $LIVE"
mv "$INCOMING" "$LIVE"
chown -R root:root "$LIVE"

echo
echo "部署完成。"
echo "备份路径（回滚用）: $BACKUP"
echo "回滚示例:"
echo "  rm -rf $LIVE && mv $BACKUP $LIVE && chown -R root:root $LIVE"
