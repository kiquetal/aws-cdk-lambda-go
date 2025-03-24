## Run with environment variables

AWS_ACCOUNT=0000000000017  AWS_REGION=us-east-1   cdk2 deploy AwsCdkLambdaGoStackDev --profile devKiquetal


## To be able to use arm 

docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

## Run locally

sam local start-api -t cdk.out/AwsCdkLambdaGoStackDev.template.json --profile devKiquetal


## To register the multi-arch create a service
sudo vim /etc/systemd/system/qemu-user-static-persistent.service

```

[Unit]
Description=Register QEMU user-mode static binaries for cross-architecture
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
User=root
Privileges=yes
WorkingDirectory=/root
ExecStart=/usr/bin/docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target


```
add to the startup

sudo systemctl enable qemu-user-static-persistent.service

sudo systemctl start qemu-user-static-persistent.service

sudo systemctl status qemu-user-static-persistent.service

## To verify multi-arch

ls -l /proc/sys/fs/binfmt_misc/
cat /proc/sys/fs/binfmt_misc/qemu-aarch64
