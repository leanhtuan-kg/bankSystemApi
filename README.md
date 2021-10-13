BANK SYSTEM API
Bank Reconciliation System provides API for client to call via HTTP(s) protocol to import the transactions
***
Before you continue, ensure you meet the following requirements:
 * KEYCLOAK SERVER  and Create RealmName : BANK_TRANSACTION -> create client : transaction_api
    -> import file `realm-export.json` in add Realm of Keycloak admin Console.
  after go tab installation and select keycloak OIDC JSON in format Option, download or copy Json String and replace content of variable `keycloakConfig` in file: keycloak-config.js

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
  --data client_secret=`get Secret in Keycloak Server`

### 

#### Endpoint API to import
* **Headers**
	* **Authorization**: `"Bearer " + AccessToken '`
	* **Content-Type**: `multipart/form-data`
  
* **Body**
	* **parameter**: `import_file`

example curl test endpoid :
  curl --request POST \
  --url 'https://localhost:8443/api/test' \
  --header 'authorization: Bearer `your AccessToken`'

  --header 'content-type:multipart/form-data' \

##### User endpoint payload
- example "message":"import file complete" if file import to db
- example "message":"import fail import file not valid" if file import not like sameple file
- example "message":"Invalid filename extension ! Only Accepted .xlsx and .csv" if file import not like sameple file extension
- example "message":"file not exist" if file import not ile not exist
- example "error code 403" if accesstoken invalid or expired
 
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
  - RouteController.js : route request from client
* models:
  - Transactions.js Support define the shape and content of documents
* secure
  -sslcert: using for https
* uploads :
  -use for temporary save file import from client

