#!/bin/bash
source "./scripts/load-dotenv.sh"
source "./scripts/colors.sh"

echo -e "${CYAN}Uploading source to server...${NC}"
# Check if rsync is installed
if ! command -v rsync &> /dev/null
then
    echo -e "${RED}rsync could not be found. Please install rsync and try again.${NC}"
    exit 1
fi
rsync -avz --exclude-from '.gitignore' . $SERVER_USER@$SERVER_IP:$DEPLOY_PATH &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to upload source to server.${NC}"
    exit 1
fi

echo -e "${CYAN}Installing dependencies on server...${NC}"
sshpass ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_PATH && npm install" &> /dev/null

echo -e "${CYAN}Building project on server...${NC}"
sshpass ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_PATH && npm run build" &> /dev/null

echo -e "${CYAN}Starting server...${NC}"
sshpass ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_PATH && npm run preview"

out=$?

if [ $out -ne 0 ] && [ $out -ne 255 ]; then
    echo -e "${RED}Failed to start server.${NC}"
    exit 1
fi

echo -en "\r${CYAN}Stopping server...${NC}\n"
sshpass ssh $SERVER_USER@$SERVER_IP "netstat -tulpn | grep :8080 | awk '{print \$7}' | cut -d/ -f1 | xargs kill" &> /dev/null

echo -e "${GREEN}Done!${NC}"