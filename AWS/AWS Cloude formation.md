# AWS CloudFormation

In EC2, we see how we can create an ec2 instance using AWS cli, but this is not a good way.

Instead of creating the key pair, security group, and EC2 instance separately with CLI commands, we'll define the infrastructure in one AWS CloudFormation YAML template.

CloudFormation uses Infrastructure as Code (IaC):

- You describe the desired infrastructure in YAML.
- CloudFormation creates the resources.
- You can update the YAML and update the stack.
- You can delete the stack to clean up the resources it manages.


## 1. Map your manual commands to CloudFormation

| What you did manually | CloudFormation resource   |
| --------------------- | ------------------------- |
| Create key pair       | `AWS::EC2::KeyPair`       |
| Create security group | `AWS::EC2::SecurityGroup` |
| Allow SSH on port 22  | `SecurityGroupIngress`    |
| Launch EC2 instance   | `AWS::EC2::Instance`      |
| Set instance name     | `Tags`                    |

One important difference: we'll pass the AMI ID as a template parameter. Floci environment returned `ami-0abcdef1234567891`, so we'll use that for this exercise rather than relying on the SSM AMI lookup that failed earlier.

## 2. Create the CloudFormation template

Create a file named `ec2-stack.yaml`:

```

AWSTemplateFormatVersion: '2010-09-09'

Description: >
  Learning stack - EC2 instance, SSH key pair and security group.

Parameters:
  AmiId:
    Type: String
    Description: Amazon Linux 2023 AMI ID
    Default: ami-0abcdef1234567891

  InstanceType:
    Type: String
    Description: EC2 instance type
    Default: t2.micro

  SSHLocation:
    Type: String
    Description: CIDR range allowed to connect through SSH
    Default: 0.0.0.0/0

Resources:

  EC2KeyPair:
    Type: AWS::EC2::KeyPair
    Properties:
      KeyName: my-ec2-key-cfn
      KeyType: rsa
      KeyFormat: pem

  EC2SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: ec2-learning-sg-cfn
      GroupDescription: Security group managed by CloudFormation
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: !Ref SSHLocation
      Tags:
        - Key: Name
          Value: ec2-learning-sg-cfn

  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !Ref AmiId
      InstanceType: !Ref InstanceType
      KeyName: !Ref EC2KeyPair
      SecurityGroupIds:
        - !GetAtt EC2SecurityGroup.GroupId
      Tags:
        - Key: Name
          Value: my-first-ec2-cfn

Outputs:

  InstanceId:
    Description: EC2 instance ID
    Value: !Ref EC2Instance

  PublicIp:
    Description: Public IP address
    Value: !GetAtt EC2Instance.PublicIp

  PrivateIp:
    Description: Private IP address
    Value: !GetAtt EC2Instance.PrivateIp

  SecurityGroupId:
    Description: Security group ID
    Value: !GetAtt EC2SecurityGroup.GroupId

  KeyPairId:
    Description: EC2 key pair ID
    Value: !GetAtt EC2KeyPair.KeyPairId

```

### Understand the important CloudFormation concepts

A. Parameters

```
Parameters:
  InstanceType:
    Type: String
    Default: t2.micro
```

Parameters let you reuse the same template with different values.

For example, you can deploy a `t2.micro` for learning and a different instance type in another environment.

B. Resources

```
Resources:
  EC2Instance:
    Type: AWS::EC2::Instance
```

Resources are the actual AWS infrastructure CloudFormation manages.

Notice how we reference other resources:

```
KeyName: !Ref EC2KeyPair
```

This means use the key pair's name.

```
SecurityGroupIds:
  - !GetAtt EC2SecurityGroup.GroupId
```

This means get the security group's `GroupId` attribute.

You don't need to manually copy generated IDs between commands anymore.

C. Outputs

```
Outputs:
  InstanceId:
    Value: !Ref EC2Instance
```

Outputs expose useful values after deployment, such as the instance ID and IP addresses.

## 3. Deploy the CloudFormation stack

You already have these environment variables configured:

```
AWS_ENDPOINT_URL=http://localhost:4566
AWS_DEFAULT_REGION=us-east-1
```

First, validate the template:

```
aws cloudformation validate-template \
  --template-body file://ec2-stack.yaml
```

Then create the stack:

```
aws cloudformation create-stack \
  --stack-name ec2-learning-stack \
  --template-body file://ec2-stack.yaml \
  --parameters \
    ParameterKey=AmiId,ParameterValue=ami-0abcdef1234567891 \
    ParameterKey=InstanceType,ParameterValue=t2.micro \
    ParameterKey=SSHLocation,ParameterValue=0.0.0.0/0
```

For a real AWS account, replace `0.0.0.0/0` with your public IP followed by `/32`. The open rule here is only for local learning.

Wait until CloudFormation finishes:

```
aws cloudformation wait stack-create-complete \
  --stack-name ec2-learning-stack
```

Check the stack:

```
aws cloudformation describe-stacks \
  --stack-name ec2-learning-stack \
  --query "Stacks[0].{Status:StackStatus,Outputs:Outputs}" \
  --output table
```

CloudFormation creates and tracks the resources as one stack. The stack status tells you whether the deployment completed successfully.

## 4. Retrieve the private key

There is an important difference between creating a key pair with the CLI and creating one through CloudFormation.

When CloudFormation creates an EC2 key pair, AWS stores the private key in Systems Manager Parameter Store. It does not automatically download a `.pem` file to your Mac.

We can retrieve it using these commands:

```
KEY_PAIR_ID=$(aws cloudformation describe-stacks \
  --stack-name ec2-learning-stack \
  --query "Stacks[0].Outputs[?OutputKey=='KeyPairId'].OutputValue | [0]" \
  --output text)

echo "$KEY_PAIR_ID"
```

Now retrieve the private key:

```
aws ssm get-parameter \
  --name "/ec2/keypair/$KEY_PAIR_ID" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text > my-ec2-key-cfn.pem
```

Set permissions:

```
chmod 400 my-ec2-key-cfn.pem
```

Keep this file private. Do not commit it to Git.

## 5. Connect to the EC2 instance

Check the Floci-managed Docker containers on your Mac:

```
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

Find the container corresponding to your new EC2 instance. Floci maps the instance's SSH port 22 to a host port, typically in the `2200–2299` range



For example, if you see:

```
0.0.0.0:2201->22/tcp
```

Connect using:

```
ssh -i my-ec2-key-cfn.pem -p 2201 ec2-user@127.0.0.1
```

Use the actual port shown by `docker ps`, not necessarily `2201`.

## 6. Understand the CloudFormation lifecycle

This is one of the biggest benefits of CloudFormation.

## CloudFormation stack lifecycle

1. Create stack
   ```
   aws cloudformation create-stack ...
   ```
   Creates the EC2 instance, key pair and security group.
2. Inspect stack
   ```
   aws cloudformation describe-stacks ...
   ```
   Shows status, outputs and parameters.
3. Update stack
   ```
   aws cloudformation update-stack ...
   ```
   Applies changes made to the template.
4. Delete stack
   ```
   aws cloudformation delete-stack \
     --stack-name ec2-learning-stack
   ```
   Deletes resources managed by the stack, subject to their deletion policies.

For example, if you change the instance tag in YAML from:

```
Value: my-first-ec2-cfn
```

to:

```
Value: my-updated-ec2-cfn
```

You can apply the change using:

```
aws cloudformation update-stack \
  --stack-name ec2-learning-stack \
  --template-body file://ec2-stack.yaml
```

CloudFormation determines which resources need updating. Not every change requires an EC2 replacement.

## 7. If deployment fails

Check the stack events:

```
aws cloudformation describe-stack-events \
  --stack-name ec2-learning-stack \
  --query "StackEvents[].[LogicalResourceId,ResourceStatus,ResourceStatusReason]" \
  --output table
```

This is particularly useful with Floci because an emulator may not implement every CloudFormation resource property exactly like real AWS.

Floci documents support for CloudFormation, EC2, SSM Parameter Store and Docker-backed EC2 instances.

## What we have learned

| Concept      | Purpose                                  |
| ------------ | ---------------------------------------- |
| Template     | YAML definition of infrastructure        |
| Parameters   | Configurable deployment inputs           |
| Resources    | AWS resources to create                  |
| `!Ref`       | Reference another resource or parameter  |
| `!GetAtt`    | Retrieve a resource attribute            |
| Outputs      | Expose deployment results                |
| Stack        | Collection of resources managed together |
| Stack events | Debug deployment failures                |

One important note: CloudFormation-created key pairs require SSM permissions to store and retrieve private key material. If the key-pair or SSM operation fails in Floci, we'll inspect the stack events and adapt the exercise rather than silently switching back to manual provisioning.