#!/usr/bin/env bash

for f in src/*.ts; do
  echo "// $f"
  cat "$f"
  echo
  echo
done
