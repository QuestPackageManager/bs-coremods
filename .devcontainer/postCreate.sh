#!/bin/bash
curl -fsSL https://deno.land/install.sh | CI=devcontainer sh
echo 'export PATH=$PATH:~/.deno/bin' >> ~/.bashrc
echo 'export PATH=$PATH:~/.deno/bin' >> ~/.zshrc
echo 'export DENO_INSTALL=~/.deno' >> ~/.bashrc
echo 'export DENO_INSTALL=~/.deno' >> ~/.zshrc