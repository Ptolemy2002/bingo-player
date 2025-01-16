#! /usr/bin/bash
if [ ! -d "../shared/dist" ]; then
    echo "Shared dependencies not built. Building now"
    # Get the current directory
    currentDir=$(pwd)

    cd ../shared
    pnpm build

    # Return to the current directory
    echo "Returning to the original directory: $currentDir"
    cd $currentDir
fi

echo "Linking shared dependencies"
pnpm link ../shared
echo "Finished linking shared dependencies"