# Python V-Environement
- ```npm init```
- Set `.env` file at workspace root.
- Be sure that after that every python shell command you run are from the Virtual env (PT_Virtual_ENV)</>
- Be sure to switch the vscode python interpreter to your venv (F1 --> Python: Select interpreter)
- Install deps -> refer to `npm install`
- Hit F5 to launch program in debug mode
- ENJOY !!!

# AWS CLI Init [optional] but cloud configuration required
```shell
$ aws-shell
aws> configure
AWS Access Key ID [None]: your-access-key-id
AWS Secret Access Key [None]: your-secret-access-key
Default region name [None]: region-to-use (e.g us-west-2, us-west-1, etc).
Default output format [None]:
aws>
``` 
## AWS Config files: 
- *Windows*: C:\Users\username\\.aws

https://docs.aws.amazon.com/sdkref/latest/guide/file-format.html



# .env example
```
aws_region=us-east-1
aws_access_key_id=XXXXXXXXXXXXXXXXXXXXXX
aws_secret_access_key=XXXXXXXXXXXXXXXXXXXXXXXXX
openai_api_secret_key=XXXXXXXXXXXXXXXXXXXXXXXXX
```