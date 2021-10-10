BANK SYSTEM API
Bank Reconciliation System provides API for client to call via HTTP(s) protocol to import the transactions
***
Before you continue, ensure you meet the following requirements:
 * KEYCLOAK SERVER  and Create RealmName : BANK_TRANSACTION -> create client : transaction_api
    -> import client transaction_api-keycloak-client.json  to RealmName BANK_TRANSACTION.
  after go tab installation and select keycloak OIDC JSON in format Option, download or copy Json String and paste to file: 
    keycloak.json

## Setup

Install **nodejs** and **npm** and then, simply run `npm install` and `npm start`. The server should now be running at 
`https://localhost:8443`.

### CURL for verify the APIs get token 
example curl
curl --request POST \
  --url 'http://localhost:8080/auth/realms/BANK_TRANSACTION/protocol/openid-connect/token' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type=client_credentials \
  --data client_id=transaction_api \
  --data client_secret=5c1bde36-8a48-40a3-8a34-c7486d8cdf92

### 


#### Endpoint API to import
* **Headers**
	* **Authorization**: `"Bearer " + AccessToken '`
	* **Content-Type**: `multipart/form-data`
* **Body**
	* **parameter**: `import_file`
example curl:
  curl --request POST \
  --url 'https://localhost:8443/restful-service' \
  --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdkxPak1WMFVfYXhWSGpLb091NlFXM3hOZDJkQk5jZ3Z2SWxzbkJLT1drIn0.eyJleHAiOjE2MzM4NTI0MjQsImlhdCI6MTYzMzg0ODgyNCwianRpIjoiNGQ0OGE1ZTktZTNiNy00NTY5LWFiNWQtNmNhY2FkMGY3MDgzIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL0JBTktfVFJBTlNBQ1RJT04iLCJhdWQiOlsidHJhbnNhY3Rpb25fYXBpIiwiYWNjb3VudCJdLCJzdWIiOiI5NjU2MjFiYy0yZDczLTRlMjItOGMyYy1lODE3YTBjYmZiMDQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0cmFuc2FjdGlvbl9hcGkiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYmFua190cmFuc2FjdGlvbiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiY2xpZW50SG9zdCI6IjE3Mi4xNy4wLjEiLCJjbGllbnRJZCI6InRyYW5zYWN0aW9uX2FwaSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXRyYW5zYWN0aW9uX2FwaSIsImNsaWVudEFkZHJlc3MiOiIxNzIuMTcuMC4xIn0.k4DZIUVCywxeUnTdpMrA2s93dmAZqlLp2zQJMNASvvTGke9Hg_xr4mlkKLhxNY5KxEh3p0RXPyig9IXLXx3EgUjPGQ9upInUybC6nbPdn4nzWExTx7DIckRfALFmffZvyBXpoqQR-0vBV7B3QIjJ1SE-eIhZsqZwA7LlCZIVH024wYH5F5GwC7ebgaF6kzdVnNOqma0PlrEN4h11mJy-m5lAgTlIF7W44RrejvhsDaJJw7UmuE3EUIoNNZcQ9GRXBw8sxNkm4JSn0Vl_7PIL9cd6CWf7Hlrmh0yvTSADaSoLwTg_segB6qYCw-LYEU3DRpFReLz2flYjWN_wjhWoOg'\
  --header 'content-type:multipart/form-data' \

##### User endpoint payload
- example "message":"import file complete" if file import to db
- example "message":"import fail import file not valid" if file import not like sameple file
- example "message":"Invalid filename extension ! Only Accepted .xlsx and .csv" if file import not like sameple file extension
- example "message":"file not exist" if file import not ile not exist
 
###### Explain some Library using
* Express :  framework support create API 
* keycloak-connect : Connect to Keycloak Server and configuration
* Multer : Upload file from http request
* Fast-csv : Support Read and Write  for CSV file ...
* Exceljs: Support Read and Write Excel file ...
* validator : Support validation date from import file
* mongoose: Support with mongodb
#######  Folder
* controller: 
  - ProcessCSV.js : reading CSV file from uploads folder after valid data and parse json and insert to db
  - ProcessExcel.js: reading XLSX file from uploads folder after  valid data and parse json and insert to db
* models:
  - Transactions.js Support define the shape and content of documents
* secure
  -sslcert: using for https
* uploads :
  -use for temporary save file import from client

