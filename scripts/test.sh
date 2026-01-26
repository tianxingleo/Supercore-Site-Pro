#!/bin/bash

# Project NEXUS (HK) - 測試和構建腳本

echo "🚀 開始測試流程..."

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 類型檢查
echo -e "\n${YELLOW}📝 運行類型檢查...${NC}"
npm run typecheck
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 類型檢查失敗${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 類型檢查通過${NC}"

# 2. ESLint 檢查
echo -e "\n${YELLOW}🔍 運行 ESLint...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ESLint 檢查失敗${NC}"
    exit 1
fi
echo -e "${GREEN}✅ ESLint 檢查通過${NC}"

# 3. 構建測試
echo -e "\n${YELLOW}🏗️  構建生產版本...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 構建失敗${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 構建成功${NC}"

# 4. 檢查構建輸出大小
echo -e "\n${YELLOW}📊 檢查構建輸出...${NC}"
BUILD_SIZE=$(du -sh .output/public | cut -f1)
echo "構建大小: $BUILD_SIZE"

# 5. 預覽生產版本
echo -e "\n${GREEN}✅ 所有測試通過！${NC}"
echo -e "${YELLOW}💡 提示：運行 'npm run preview' 來預覽生產版本${NC}"
