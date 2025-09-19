#!/bin/bash
cd /home/kavia/workspace/code-generation/reviewmate-ai-53391-53621/BackendAPIService
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

