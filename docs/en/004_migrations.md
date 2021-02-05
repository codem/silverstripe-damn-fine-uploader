# Migrations

From time-to-time updates will occur requiring a migration of data.

The following migrations are available and turned off by default

## migrationDeprecateFineUploader

This migration obsoletes tables used by the now-deprecated FineUploader implementation.

## migrationManyManyHasMany

This migration moves uploaded files from the SubmittedUploadField many_many relationship to a has_many relationship. It will also rename the join table (which you can later drop manually)

## migrateAllowedMimeTypes

Migrates `AllowedMimeTypes` field to `SelectedFileTypes` field
