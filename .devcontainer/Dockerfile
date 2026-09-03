# Silverstripe 6.2+ supports PHP 8.3-8.5
FROM php:8.5-cli-bookworm

# Avoids apt-get hanging/erroring on debconf prompts (e.g. from mysql-common,
# tzdata) when there's no TTY, which is the case during a container build.
ENV DEBIAN_FRONTEND=noninteractive

# System packages Silverstripe 6 needs. Split into its own RUN (rather than
# chained with the ext-install step below) so that if this fails, the build log
# shows exactly which of the two steps broke instead of a single opaque exit code.
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        unzip \
        zip \
        libzip-dev \
        libicu-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libxml2-dev \
        default-mysql-client \
        curl \
        sudo \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions to actually build. Two are deliberately NOT in this list even
# though Silverstripe needs them, because they're already present in the base
# php:8.5-cli-bookworm image and (as of 8.5) re-building them via
# docker-php-ext-install is either broken or pointless:
#
# - opcache: always compiled into core since PHP 8.5 (no more shared module,
#   no more --disable-opcache). Reinstalling it fails with a confusing
#   "cp: cannot stat 'modules/*': No such file or directory" because the build
#   genuinely produces nothing to copy.
#   https://github.com/docker-library/php/issues/1605
# - dom (and xml/simplexml/xmlreader/xmlwriter with it): enabled by default in
#   any stock PHP build, no special configure flags needed — confirmed against
#   docker-library's own Dockerfile for this image, which never passes
#   --disable-dom/--without-libxml. PHP 8.4+ added HTML5 parsing to ext/dom
#   backed by a vendored copy of the lexbor library; that vendored copy isn't
#   wired up correctly when dom is rebuilt in isolation via
#   docker-php-ext-install (as opposed to being built as part of the full PHP
#   ./configure the base image itself went through), so re-running it fails
#   with "lexbor/html/parser.h: No such file or directory". It's already
#   working in the base image — just don't touch it.
#   https://github.com/php/php-src/issues/20022
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        gd \
        intl \
        zip \
        pdo_mysql \
        mysqli \
        bcmath

# opcache and dom/xml are core/already-built (see above), so no
# docker-php-ext-enable step is needed for them either.
# opcache.enable is on by default for the "cli-server" SAPI (php -S, what the
# test project uses), but opcache.enable_cli defaults to 0 for straight
# `php script.php` invocations (e.g. vendor/bin/sake, vendor/bin/phpunit).
# Turn it on so those benefit from it too.
RUN echo "opcache.enable_cli=1" > /usr/local/etc/php/conf.d/opcache-cli.ini

# Fail the build loudly here rather than mysteriously later if any extension
# Silverstripe needs isn't actually loaded. opcache is checked separately via
# function_exists('opcache_get_status') rather than extension_loaded('opcache')
# — opcache doesn't register itself under the plain name "opcache" the same
# way ordinary extensions do (`php -m` shows it as "Zend OPcache" in its own
# "[Zend Modules]" section), and that's still true now that it's core-compiled
# in 8.5, so extension_loaded('opcache') returns false even though it's there
# and working. Checking for a function it defines sidesteps the naming
# question entirely instead of guessing at the "right" string.
RUN php -r ' \
    $required = ["gd", "intl", "zip", "pdo_mysql", "mysqli", "bcmath", "dom", "xml"]; \
    $missing = array_filter($required, fn($e) => !extension_loaded($e)); \
    if (!function_exists("opcache_get_status")) { $missing[] = "opcache"; } \
    if ($missing) { \
        fwrite(STDERR, "Missing PHP extensions: " . implode(", ", $missing) . PHP_EOL); \
        exit(1); \
    } \
    echo "All required PHP extensions loaded." . PHP_EOL; \
'

# Composer, installed via the official installer script rather than
# `COPY --from=composer:2 ...`. That cross-image COPY is a multi-stage-style
# reference, and Zed's dev container builder has an open bug where it mishandles
# exactly this pattern (auto-injects a build-stage label it then can't resolve,
# surfacing as a misleading "no such object"/"pull access denied" error —
# https://github.com/zed-industries/zed/issues/53848). Installing from the
# script sidesteps it entirely and works the same in VS Code/Codespaces too.
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php -r "if (hash_file('sha384', 'composer-setup.php') === file_get_contents('https://composer.github.io/installer.sig')) { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# Non-root user so `claude --dangerously-skip-permissions` is usable if you want it,
# and so file ownership on the bind-mounted workspace stays sane.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m -s /bin/bash $USERNAME \
    && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$USERNAME

USER $USERNAME
WORKDIR /workspace
