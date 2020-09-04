# Notes on these acceptance tests

If you want to run these codeception tests, you will need codeception and vlucas/phpdotenv installed.

The test will upload files to pages on a website using Chromium.

> Files uploaded in this test will be created in the test website and your database.


1. Ensure ```symbiote/silverstripe-test-assist": "^4.0``` is installed as a --dev dependency (which requires codeception/codeception:^2.5 and vlucas/phpdotenv:^3)
1. Install codeception/codeception and required dependencies: ```composer require --dev codeception/codeception:^2.5 codeception/module-db codeception/module-webdriver codeception/module-asserts vlucas/phpdotenv:^3```
1. Make sure the PHP mysql package is installed and that the mysql host is accessible
1. For Ubuntu, install the package ```chromium-chromedriver``` or get ChromeDriver for your OS from https://sites.google.com/a/chromium.org/chromedriver/downloads (you can use other browser drivers if you like)
1. ```$ which chromedriver``` should return something like ```/usr/bin/chromedriver```
1. If you install the ```chromium-chromedriver``` package, it will install ```chromium-browser```. Chromium browser should be found at ```/usr/bin/chromium-browser```

## Checks

Run a few checks to see things are installed

```bash
chromium-browser --version
Chromium 85.0.4183.83 snap

chromedriver --version
ChromeDriver 85.0.4183.83 (94abc2237ae0c9a4cb5f035431c8adfb94324633-refs/branch-heads/4183@{#1658})
```

(Chromium might be installed as a snap package in more recent Ubuntus)

## Setup

You need to set up some pages and configuration for your own environment. This assumes you
1. Have a SilverStripe 4 website with the module installed
2. Have read the ../support/readme.md file for directions on getting test pages set up
3. Have copied the file ./supports/src/Models/UppyTestPage.phps to a relevant project directory (e.g mysite/src)
4. Have published a test page in the site tree

### Test Environment

Copy the ```.env.dist``` file to ```.env``` and modify the values to suit your environment setup:

```bash
# the website URL you are testing
WEBSITE_URL = https://test.local

# The id for the form containing the upload fields
DFU_FORM_ID = UploadForm

# the path to a test page that contains an UppyField
DFU_UPPY_PATH = /path-to-uppy-test-page/

# wait for this amount of time before checking for uploaded files, 3 should be enough
DFU_UPLOAD_WAIT = 3

# DB CONNECTION
SS_DATABASE_CLASS="MySQLPDODatabase"
SS_DATABASE_SERVER="localhost|127.0.0.1|etc.etc.etc"
SS_DATABASE_USERNAME="my_username
SS_DATABASE_PASSWORD="my_db_password"
SS_DATABASE_NAME="my_db_name"
```

> The UppyField should be configured for image uploads with at most 3 items uploadable.

When the test runs, it will use values from the .env file in the test

## Running

Ensure ChromeDriver is started:

```bash
chromedriver --url-base=/wd/hub
Starting ChromeDriver 85.0.4183.83 (94abc2237ae0c9a4cb5f035431c8adfb94324633-refs/branch-heads/4183@{#1658}) on port 9515
Only local connections are allowed.
Please see https://chromedriver.chromium.org/security-considerations for suggestions on keeping ChromeDriver safe.
ChromeDriver was started successfully.
```

Your project level codeception.yml file should have an include like:

```yml
include:
  - ./vendor/codem/silverstripe-damn-fine-uploader/codeception
```

Run the test from the project directory:

```bash
pwd
/path/to/project
```

Run codeception (use the -d flag for debug)
```
./vendor/bin/codecept run
```

## Output

Codeception outputs debug data like screenshots and failure output to ```./tests/_output```

## Troubleshooting

+ You get the error ```Can't connect to Webdriver at .... ``` - have you started ChromeDriver ?
+ You get the error ```unknown error: no chrome binary at /path/to/chromium-browser``` - was Chromium installed and available at the path shown?
+ You get various codeception errors about ```codeception/module-****``` - make sure these are installed
+ You get DB connection errors - is the DB accessible and are the credentials correct?
+ You get an error ```Uncaught Error: Call to undefined method Dotenv\Repository\RepositoryBuilder::create``` - see https://github.com/Codeception/Codeception/issues/5946 (tl;dr install vlucas/phpdotenv ^4 not ^5)
