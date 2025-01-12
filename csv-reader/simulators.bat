@echo off

REM List of device IDs
set device_ids=ca0309f2-c2b4-455c-a1c4-d58402a329cb

REM Loop through each device ID and run the Java application
for %%i in (%device_ids%) do (
    echo Simulating device ID: %%i
    start cmd /k java -jar target/csv-reader-1.0.jar %%i > output_%%i.log 2>&1
)