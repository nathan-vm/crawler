#/bin/bash
set -e

$(aws ecr get-login --no-include-email)

export DEPLOY_VERSION=latest
export ECR_IMAGE_URL=868884350453.dkr.ecr.us-east-1.amazonaws.com/team-data-capture/time_green_hackathon_captura:$DEPLOY_VERSION

docker build -t $ECR_IMAGE_URL .
docker push $ECR_IMAGE_URL
docker rmi $(docker image ls -q $ECR_IMAGE_URL)
