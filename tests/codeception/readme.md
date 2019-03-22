# Notes on these acceptance tests

If you want to run these codeception tests, you will need codeception and vlucas/phpdotenv installed globally.

1. Install codeception globally: ```/path/to/composer global require codeception/codeception:^2.5 vlucas/phpdotenv:^3.3``` - this will install these packages and their dependencies to your home directory
2. Codeception will be installed to ```~/.composer/vendor/bin/codecept```
3. For Ubuntu Server, install the package ```chromium-chromedriver``` or get ChromeDriver for your OS from https://sites.google.com/a/chromium.org/chromedriver/downloads (you can use other browser drivers if you like)
4. ```$ which chromedriver``` should return something like ```/usr/bin/chromedriver```
5. If you install the ```chromium-chromedriver``` package, it will install ```chromium-browser```. Chromium browser should be found at ```/usr/bin/chromium-browser```

## Checks

Run a few checks to see things are installed:

```
$ chromium-browser --version
Chromium 73.0.3683.75 Built on Ubuntu , running on Ubuntu 16.04
$ chromedriver --version
ChromeDriver 73.0.3683.7
```

## Setup

You need to set up for your own environment. This assumes you
1. Have a SilverStripe 4 website with the module installed
2. Have set up a few pages with an UppyField

### Test Files

### Test Environment

Copy the ```.env.dist``` file to ```.env``` and modify the values to suit your environment setup:
```
# the website URL you are testing
WEBSITE_URL = https://test.local

# the path to a page that contains an UppyField
DFU_UPPY_PATH = /path-to-uppy-test-page/

# wait for this amount of time before checking for uploaded files
DFU_UPPY_UPLOAD_WAIT = 5

# DB CONNECTION
SS_DATABASE_SERVER="localhost"
SS_DATABASE_USERNAME="my_username
SS_DATABASE_PASSWORD="my_db_password"
SS_DATABASE_NAME="my_db_name"
```
> The UppyField should be configured for image uploads with at most 3 items uploadable.

When the test runs, it will use values from the .env file in the test

## Running

Ensure ChromeDriver is started:
```
$ chromedriver --url-base=/wd/hub
Starting ChromeDriver 73.0.3683.75 on port 9515
Only local connections are allowed.
Please protect ports used by ChromeDriver and related test frameworks to prevent access by malicious code.
```

Run the test from this directory:

```
~/.composer/vendor/bin/codecept run --steps tests/UppyUploadCest.php
```

## Output

Codeception outputs debug data like screenshots and failure output to ```./tests/_output```

## Troubleshooting

+ You get the error ```Can't connect to Webdriver at .... ``` - have you started ChromeDriver ?
+ You get the error ```unknown error: no chrome binary at /path/to/chromium-browser``` - was Chromium installed and available at the path shown?
