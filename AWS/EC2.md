
## EC2
Elastic Compute Cloude is basically a Virtual Machiene 

### Let's create an EC2 instance using UI
- Choose OS Image : Amazon Linux 2 (AMI), Ubuntu, Red Hat, Microsoft Windows, Most case we should use AMI which optimized by Amazon
- Choose Capacity : t2.nano, t2.micro, t2.small, t2.medium, t2.large etc. For learning purpose we will use t2.micro
- Network Configuration : default vpc,   enabled, other default
-- Network : default vpc
-- Subnet : default subnet
-- Auto assign public IP : enabled
- Add Storage : choose default
- Add tags (metadata) Optional : key-value pair
- Configure Security Group : This is for Firewall Rules, by default we also has a default security group, so we can assign that or create a new with different in-bound and out-bound rules.

below inbound rule means any ip can do ssh in this instance.
Type    Protocol    Port Range      Source
SSH     TCP         22              Custom 0.0.0.0/0
lession 110

When you click on Launch Instance button, it will ask for select a shh key pair or create a new one.
there is two options
1. create public/private key locally and paste public key at AWS and private will be at your side, for login
2. create public/private key at AWS and download private key for later use. public key will be automatic stored by AWS, so when you download, it will privide only private key in .pem file.

> [!NOTE]
> You can have different public/private key for each instance.

### Let's create an EC2 Instance using AWS CLI
#### 1. Find an Amazon Linux 2023 AMI
```
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters \
    "Name=name,Values=al2023-ami-2023.*-x86_64" \
    "Name=state,Values=available" \
  --query "Images | sort_by(@, &CreationDate)[-1].ImageId" \
  --output text)

echo "AMI ID: $AMI_ID"
```
**Output**
```
AMI ID: ami-0abcdef1234567891
```

#### 2. Create a key pair
You'll need an SSH key to connect to your EC2 instance.
```
aws ec2 create-key-pair \
  --key-name my-ec2-key \
  --query "KeyMaterial" \
  --output text > my-ec2-key.pem
```

Above command will create a `my-ec2-key.pem` file which is your private key and auto set public key.

Set secure permissions: So only you have read permission for this file in your local
```
chmod 400 my-ec2-key.pem
```
Keep this private key safe. AWS won't let you retrieve the private key again.

#### 3. Create a security group
```
aws ec2 create-security-group \
  --group-name ec2-learning-sg \
  --description "Security group for EC2 learning"
```
**Output**
```
{
    "GroupId": "sg-5ac903bc67da2a78e"
}
```
Save the returned GroupId.

For SSH access, allow port 22 from everyone

```
aws ec2 authorize-security-group-ingress \
  --group-id sg-5ac903bc67da2a78e \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

if you want only your IP address use Your public IP in cidr:
```
--cidr YOUR_PUBLIC_IP/32
```
For example
```
--cidr 203.0.113.25/32
```


#### 4. Launch EC2 instance
```
aws ec2 run-instances \
  --image-id ami-0abcdef1234567891 \
  --instance-type t2.micro \
  --key-name my-ec2-key \
  --security-group-ids sg-5ac903bc67da2a78e \
  --count 1 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-first-ec2}]'
```
**Output**
```
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
                {
                    "Attachment": {
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
                {
                    "Attachment": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "AttachmentId": "eni-attach-dd49a48b22513b721",
                        "DeleteOnTermination": true,
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
                {
                    "Attachment": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "AttachmentId": "eni-attach-dd49a48b22513b721",
                        "DeleteOnTermination": true,
                        "DeviceIndex": 0,
                        "Status": "attached"
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
                {
                    "Attachment": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "AttachmentId": "eni-attach-dd49a48b22513b721",
                        "DeleteOnTermination": true,
                        "DeviceIndex": 0,
                        "Status": "attached"
                    },
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
                {
                    "Attachment": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "AttachmentId": "eni-attach-dd49a48b22513b721",
                        "DeleteOnTermination": true,
                        "DeviceIndex": 0,
                        "Status": "attached"
                    },
                    "Groups": [
:...skipping...
{
    "ReservationId": "r-71ab46e9accf84718",
    "OwnerId": "000000000000",
    "Groups": [],
    "Instances": [
        {
            "Architecture": "x86_64",
            "BlockDeviceMappings": [
                {
                    "DeviceName": "/dev/xvda",
                    "Ebs": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "DeleteOnTermination": true,
                        "Status": "attached",
                        "VolumeId": "vol-f07e403ecb48706ad"
                    }
                }
            ],
            "ClientToken": "706f637a-0fce-420a-a265-82d6b65fa171",
            "EbsOptimized": false,
            "EnaSupport": true,
            "Hypervisor": "xen",
            "NetworkInterfaces": [
                {
                    "Attachment": {
                        "AttachTime": "2026-11-02T09:22:35.905000+00:00",
                        "AttachmentId": "eni-attach-dd49a48b22513b721",
                        "DeleteOnTermination": true,
                        "DeviceIndex": 0,
                        "Status": "attached"
                    },
                    "Groups": [
                        {
                            "GroupId": "sg-5ac903bc67da2a78e",
                            "GroupName": "ec2-learning-sg"
                        }
                    ],
                    "NetworkInterfaceId": "eni-2bd410305426de432",
                    "OwnerId": "000000000000",
                    "PrivateDnsName": "ip-172-31-32-12.ec2.internal",
                    "PrivateIpAddress": "172.31.32.12",
                    "PrivateIpAddresses": [
                        {
                            "Primary": true,
                            "PrivateDnsName": "ip-172-31-32-12.ec2.internal",
                            "PrivateIpAddress": "172.31.32.12"
                        }
                    ],
                    "SourceDestCheck": true,
                    "Status": "in-use",
                    "SubnetId": "subnet-default-us-east-1-c",
                    "VpcId": "vpc-default-us-east-1"
                }
            ],
            "RootDeviceName": "/dev/xvda",
            "RootDeviceType": "ebs",
            "SecurityGroups": [
                {
                    "GroupId": "sg-5ac903bc67da2a78e",
                    "GroupName": "ec2-learning-sg"
                }
            ],
            "SourceDestCheck": true,
            "Tags": [
                {
                    "Key": "Name",
                    "Value": "my-first-ec2"
                }
            ],
            "VirtualizationType": "hvm",
            "CpuOptions": {
                "CoreCount": 1,
                "ThreadsPerCore": 1
            },
            "CapacityReservationSpecification": {
                "CapacityReservationPreference": "open"
            },
            "HibernationOptions": {
                "Configured": false
            },
            "MetadataOptions": {
                "State": "applied",
                "HttpTokens": "optional",
                "HttpPutResponseHopLimit": 1,
                "HttpEndpoint": "enabled",
                "HttpProtocolIpv6": "disabled",
                "InstanceMetadataTags": "disabled"
            },
            "EnclaveOptions": {
                "Enabled": false
            },
            "PrivateDnsNameOptions": {
                "HostnameType": "ip-name",
                "EnableResourceNameDnsARecord": false,
                "EnableResourceNameDnsAAAARecord": false
            },
            "MaintenanceOptions": {
                "AutoRecovery": "default"
            },
            "InstanceId": "i-08a76f8c238440d3f",
            "ImageId": "ami-0abcdef1234567891",
            "State": {
                "Code": 0,
                "Name": "pending"
            },
            "PrivateDnsName": "ip-172-31-32-12.ec2.internal",
            "KeyName": "my-ec2-key",
            "AmiLaunchIndex": 0,
            "InstanceType": "t2.micro",
            "LaunchTime": "2026-11-02T09:22:35.905000+00:00",
            "Placement": {
                "Tenancy": "default",
                "AvailabilityZone": "us-east-1c"
            },
            "Monitoring": {
                "State": "disabled"
            },
            "SubnetId": "subnet-default-us-east-1-c",
            "VpcId": "vpc-default-us-east-1",
            "PrivateIpAddress": "172.31.32.12"
        }
    ]
}
```

The response contains an InstanceId : 	i-08a76f8c238440d3f

#### 5. Check instance status
```
aws ec2 describe-instances \
  --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType,PublicIpAddress]" \
  --output table
```
**Output**
```
-------------------------------------------------------------
|                     DescribeInstances                     |
+----------------------+----------+-----------+-------------+
|  	i-08a76f8c238440d3f |  running |  t2.micro |  127.0.0.1  |
|  i-f0b7964d10cde4f70 |  running |  t2.micro |  127.0.0.1  |
+----------------------+----------+-----------+-------------+
```

#### 6. Start and stop EC2
Stop:
```
aws ec2 stop-instances --instance-ids 	i-08a76f8c238440d3f
```
Start:
```
aws ec2 start-instances --instance-ids 	i-08a76f8c238440d3f
```
Terminate:
```
aws ec2 terminate-instances --instance-ids i-f0b7964d10cde4f70
```

#### 7. Connect through SSH
```
ssh -i my-ec2-key.pem ec2-user@PUBLIC_IP
```
As we are using floci local emulator which not provide public ip, so we can not SSH right now, but in real AWS you can get public ipv4 address from instance security group section.

As we have use Amazon Linux image which by default has a ec2-user that's why we used this for ssh, so don't use root.