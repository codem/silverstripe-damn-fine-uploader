# Migrations

From time-to-time updates will occur requiring a migration of data.
There are currently two migrations:

## migrationDeprecateFineUploader

This migration obsoletes tables used by the now-deprecated FineUploader implementation.

This migration runs by default on dev/build, to turn it off, override in yaml and set to false.

## migrationManyManyHasMany

This migration moves uploaded files from the SubmittedUploadField many_many relationship to a has_many relationship. It will also rename the join table (which you can later drop manually)

By default, this does not run. To run it, override the value to false in your project configuration, and run a dev/build
