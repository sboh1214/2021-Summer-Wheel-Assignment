#! /bin/bash

HOME=/home/ubuntu
echo "Start backup script for Chat DB."
current_date=$(date +"%Y-%m-%d-%T")
echo "============================================"
aws s3 ls s3://sparcs-chat
echo "============================================"
num=$(aws s3 ls s3://sparcs-chat | wc -l)
echo "${num} backups detected in AWS S3 sparcs-chat"
if [ ${num} -ge 5 ]
then
  echo "Equal or more than 5 backups detected. Removing the oldest backup..."
  old_file=$(aws s3 ls s3://sparcs-chat | awk '{print $4}' | head -n 1)
  echo "Removing file name: ${old_file}"
  aws s3 rm s3://sparcs-chat/${old_file}
fi
echo "Dump new backup."
sudo docker exec -t 2021-summer-wheel-assignment_db_1 pg_dumpall -c -U platypus > dump_${current_date}.sql
aws s3 mv dump_${current_date}.sql s3://sparcs-chat
echo "Upload Complete."
