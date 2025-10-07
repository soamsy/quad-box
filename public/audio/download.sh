#!/bin/bash

base_url="https://mindbuilder.app/beta/voices/letter"
output_dir="letters"

# Create directory if not exists
mkdir -p "$output_dir"

# Loop through all lowercase letters a-z
for letter in {a..z}; do
    url="${base_url}/${letter}.mp3"
    output="${output_dir}/${letter}.mp3"
    echo "Downloading $url..."
    curl -s -L -o "$output" "$url"
done

echo "All downloads complete."

