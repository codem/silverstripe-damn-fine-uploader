# Devcontainer setup for a Silverstripe module

## What this is for

This devcontainer exists for exactly four things: `phpstan` analysis, `rector`
refactoring, `php-cs-fixer` formatting, and `phpunit` tests — all run directly
against the module in `/workspace`.

### Layout

```
your-module/
├── .devcontainer/
│   ├── devcontainer.json
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── post-create.sh
└── composer.json
└── // other module files
```

## 1. Open it in the devcontainer

In an IDE with Dev Containers support):
**Reopen in Container** — or see "Starting the devcontainer manually" below
to drive it directly with the Dev Containers CLI. First build takes a few
minutes: PHP 8.5 with the extensions Silverstripe needs, a MySQL 8 container
for phpunit's database-backed tests, and the Claude Code CLI via the official
[Claude Code Dev Container Feature](https://github.com/anthropics/devcontainer-features/tree/main/src/claude-code).

`postCreateCommand` runs `composer install` in `/workspace` automatically —
nothing else to do before running the tools.

## 2. Run the tools

Tests
```bash
vendor/bin/phpunit
```

Use the helper scripts to run the tools:
```bash
composer run-script phpstan-analyse
composer run-script rector-dryun
composer run-script rector-process
composer run-script phpcsfixer-fix
```

## 3. The database

`phpunit` tests that touch the ORM (anything extending `SapphireTest`) need a
real database connection — Silverstripe creates a temporary test database
through it at run time. The `db` service in `docker-compose.yml` (MySQL 8)
and the `SS_DATABASE_*` environment variables on the `app` service handle
this automatically.

## 4. Everyday workflow

- Edit the module code
- Re-run the relevant tool
- Commit your changes and push

## Starting the devcontainer manually

**Full devcontainer-spec compliant — the official Dev Containers CLI**, if you
want Features (Claude Code) and `postCreateCommand` applied just like
Zed/VS Code would, but without Zed's builder:

### Install devcontainers

On host machine:
```bash
npm install -g @devcontainers/cli
```

### Work with the devcontainer

Start it
```bash
devcontainer up --workspace-folder .
```

Start it but remove existing container
```bash
devcontainer up --workspace-folder . --remove-existing-container
```

Run phpunit
```bash
devcontainer exec --workspace-folder . vendor/bin/phpunit
```

Run Claude Code within the devcontainer. You will be prompted for setup on first run.
```bash
devcontainer exec --workspace-folder . claude
```

Build the frontend
```bash
devcontainer exec --workspace-folder . bun run build
```

Get a shell
```bash
devcontainer exec --workspace-folder . bash
```
