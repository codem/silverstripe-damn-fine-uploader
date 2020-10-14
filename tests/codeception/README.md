# Codeception testing notes

These tests require ChromeDriver to be installed on the testing environment.

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
1. Create an ```UploadPage``` (A page that handles file uploads) in the site tree, publish it
1. Configure the page for uploads, it should allow at least 3 uploads
1. Store the url segment in the environment configuration

### Test Environment

Ensure the following values are in your project .env (the test suite will load this)

```bash
# the website URL you are testing
CODECEPTION_WEBSITE_URL = https://test.local

# The id for the form containing the upload field (Form_ will be prefixed)
CODECEPTION_DFU_FORM_ID = UploadForm

# the path to a test page that contains an UppyField
CODECEPTION_DFU_UPPY_PATH = /path-to-test-page/

# wait for this amount of time before checking for uploaded files, 3 should be enough
CODECEPTION_DFU_UPLOAD_WAIT = 3
```

## Running

Ensure ChromeDriver is started:

```bash
chromedriver --url-base=/wd/hub
Starting ChromeDriver 85.0.4183.83 (94abc2237ae0c9a4cb5f035431c8adfb94324633-refs/branch-heads/4183@{#1658}) on port 9515
Only local connections are allowed.
Please see https://chromedriver.chromium.org/security-considerations for suggestions on keeping ChromeDriver safe.
ChromeDriver was started successfully.
```

Your project level codeception.dist.yml file should have an include pointing at the tests directory, something like:

```yml
include:
  - vendor/codem/silverstripe-damn-fine-uploader/tests/codeception
paths:
  log: /path/to/codeception-logs
```

# Running the test

Run codeception from the project directory
```
./vendor/bin/codecept run
```

## Output

Codeception outputs debug data like screenshots and failure output to `./tests/_output`

Have a look there to determine what might be going wrong.

## Troubleshooting

+ You get the error `Can't connect to Webdriver at ....` - have you started ChromeDriver ?
+ You get the error `unknown error: no chrome binary at /path/to/chromium-browser` - was Chromium installed and available at the path shown?
+ You get various codeception errors about `codeception/module-****` - make sure these are installed
+ You get DB connection errors - is the DB accessible and are the credentials correct? Check the host is accessible.
+ You get certificate errors - use localhost as the host name or use http:// to help chromedrive work around that

## Good to Know

+ Files uploaded in this test will be created in the test website and your database
