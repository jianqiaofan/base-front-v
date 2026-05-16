#!/usr/bin/env bash
# 回滚到指定备份目录（由 install-remote.sh 生成的 /opt/bom_web/backup/bom_front_时间戳）
# 用法：sudo bash rollback-remote.sh /opt/bom_web/backup/bom_front_20260205_143022
set -euo pipefail

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "请使用 root 权限: sudo bash $0 ..."
  exit 1
fi

SNAP="${1:?用法: $0 /opt/bom_web/backup/bom_front_时间戳}"
LIVE="/opt/bom_web/bom_front"

if [[ ! -d "$SNAP" ]]; then
  echo "错误: 备份不存在: $SNAP"
  exit 1
fi

ROLL_TS="$(date +%Y%m%d_%H%M%S)"
BAD="${LIVE}_broken_${ROLL_TS}"

if [[ -e "$LIVE" ]]; then
  echo "将当前线上目录移开 -> $BAD"
  mv "$LIVE" "$BAD"
fi

echo "恢复备份 -> $LIVE"
mv "$SNAP" "$LIVE"
chown -R root:root "$LIVE"

echo "回滚完成。故障目录（可稍后删除）: $BAD"
