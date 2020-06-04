# nativescript-diawi-distribution

## Prerequisites

- nativescript installed, ability to build nativescript apps
- Diawi account (free accounts available)

## Quick Start

1.  npm install --save-dev nativescript-diawi-distribution
2.  Generate a Diawi access token here [https://dashboard.diawi.com/profile/api](https://dashboard.diawi.com/profile/api)
3.  Copy the below config, insert the token from above step and save in project root as "diawi-upload.config.json"
    {
    "diawi_access_token": "[YOUR_TOKEN_HERE]",
    }
4.  Use nativescript build commands for ios/android and include --env.diawi flag
    4a. eg: tns build android --env.diawi
5.  Add diawi-upload.config.json to your .gitignore - this file includes your diaiw API key you do not want to store this in a repository

## Configuration

"emails" can also be specified as a field in the configuration file as a comma separated list. Addresses listed here will be notified of build completion with a link to download

## Credit

Diawi upload code originally by Ronak Doshi and can be found here as part of a github action: https://github.com/rnkdsh/action-upload-diawi
