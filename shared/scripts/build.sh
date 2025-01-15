#! /usr/bin/bash
echo "Removing previous build"
rm -rf dist
echo "Building the project"
pnpm _build
echo "Finished building the project"