var path = require("path");
var fs = require("fs");
const Diawi = require("./diawi");

module.exports = function ($logger, hookArgs) {
  $logger.info("Diawi Upload plugin ");
  const buildData =
    hookArgs.buildData || hookArgs.androidBuildData || hookArgs.iOSBuildData;
  if (!buildData.env.diawi) {
    return;
  }
  const platform = buildData.platform.toLowerCase();
  if (platform === "ios" && !buildData.env.for - device && !buildData.release) {
    $logger.warn(
      "App cannot be uploaded for distribution unless the --release or --for-device flag is set"
    );
    return;
  }

  const configPath = path.resolve(
    buildData.projectDir,
    "diawi-upload.config.json"
  );
  let config;
  try {
    config = require(configPath);
  } catch (e) {
    throw new Error(
      "Config file diawi-upload.config.json is required in project root directory "
    );
  }

  return new Promise(function (resolve, reject) {
    console.log("");
    console.log(hookArgs.env);
    const env = buildData.env;

    var isReleaseBuild = !!(
      (hookArgs.buildOpts && hookArgs.buildOpts.projectChangesOptions) ||
      hookArgs.buildData
    ).release;

    var projectData =
      (hookArgs.buildOpts && hookArgs.buildOpts.projectData) ||
      hookArgs.projectData;
    var platformsDir = projectData.platformsDir;
    console.log("platformsDir ", platformsDir);
    let appPath;
    if (platform == "android") {
      appPath = path.resolve(
        platformsDir,
        platform,
        "/app/build/outputs/apk",
        isReleaseBuild ? "debug/app-debug.apk" : "release/app-release.apk"
      );
    } else {
      appPath = path.resolve(
        platformsDir,
        platform,
        "build",
        isReleaseBuild ? "Release-iphoneos" : "Debug-iphoneos",
        projectData.projectName
      );
    }

    const parameters = {
      token: config.token,
      path: appPath,
      callback_emails: config.emails,
      comment:
        "Build uploaded automatically by Jessica's magic plugin on: " +
        new Date(),
    };

    const diawi = new Diawi(parameters)
      .on("complete", (url) => {
        console.log("App successfully uplaoded to diawi - URL:");
        console.log(url);
        resolve();
      })
      .on("error", (err) => {
        console.log("error uploading to diawi, proceeding anyway", err);
        resolve();
      });

    diawi.execute();
  });
};
