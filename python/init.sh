#!/bin/bash

# Install the requirements
python -m pip install -r requirements.txt

# Run the uvicorn command
uvicorn main:app --reload