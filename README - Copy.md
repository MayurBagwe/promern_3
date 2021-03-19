
# Assignment 2 CS 648
## Steps to Setup the project
1. Copy and open the folder **Assignment 2** in VS Code
2. Open the terminal press __ctrl + `__
3. You can skip Step-4 if aws cli is already configured for user "**rew**" or else configure it using the below user to run the upload,delete,query scripts
4. Configure AWS CLI with below credentials
   - In the terminal type **_aws configure_**
   - Enter AWS Access Key ID : **AKIA5A7HQTECTGKWQ6MJ**
   - Enter AWS Secret Access Key: **d7R7Mr4t1aoEbDrgcyjS3+vOBCM95uICrmMjujDU**
   - Enter Default region name : **us-east-1**
   - Default output format : **json**
5. Run command **_npm install_**

---
## Steps to upload a file in S3 bucket
 - Run command **_node .\scripts\upload.js .\sampleFiles\sample3.txt_**

## Steps to delete a file from S3 bucket
 - Run command **_node .\scripts\delete.js .\sampleFiles\sample3.txt_**

## Steps to query dynamo db
1. To get list of files been in S3 bucket  -- Run command __node .\scripts\dynamoQuery.js --list__
2. To find file transactions for any given file -- Run command __node .\scripts\dynamoQuery.js --file sample1.txt__
3. To find last N transactions -- Run command __node .\scripts\dynamoQuery.js --last 4__

## Steps to fetch the records from dynamoDB using API Gateway
1. [Get unqiue Files](https://hdpz0f91cg.execute-api.us-east-1.amazonaws.com/default/lambdaAPI-gatewayFunction?list=true)
2. [Transactions for a given file](https://hdpz0f91cg.execute-api.us-east-1.amazonaws.com/default/lambdaAPI-gatewayFunction?file=sample1.txt)
3. [Latest N transactions in S3](https://hdpz0f91cg.execute-api.us-east-1.amazonaws.com/default/lambdaAPI-gatewayFunction?last=4)


---
## Steps to access the S3 Bucket, Dynamo DB Table, Lambda Functions (	lambdaAPI-gatewayFunction, multiple-TriggerLambdaFunction) as a temporary user using **Switch Role** from console.


- [AWS Switch Role](https://signin.aws.amazon.com/switchrole?roleName=DeveloperCrossAccountS3&account=281730369351  "AWS Switch Role")
- [AWS Console](https://aws.amazon.com/console/  "AWS Console")
1. Login as IAM User and Enter the below given details
- AccountID : 895449340165 
- Username : DeveloperA
- Password:  Test@123

2. After successful login 
- Click on **DeveloperA @ 8954-4934-0165** ---> **Switch Roles**
- Enter below details and click **Switch Role**
  - Account : **281730369351**
  - Role: **DeveloperCrossAccountS3**
- Now you can access the S3 bucket  **_aws-cs648-awslambdaapp_** , Dynamodb table **_S3BucketTransactions_** , Lambda Functions **_lambdaAPI-gatewayFunction, multiple-TriggerLambdaFunction_**
---