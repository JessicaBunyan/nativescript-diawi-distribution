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
  if (platform === "ios" && !buildData.buildForDevice && !buildData.release) {
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
  if (!config.diawi_access_token) {
    throw new Error("diawi_access_token missing from configuration file");
  }
  return new Promise(function (resolve, reject) {
    const env = buildData.env;

    var isReleaseBuild = !!(
      (hookArgs.buildOpts && hookArgs.buildOpts.projectChangesOptions) ||
      hookArgs.buildData
    ).release;

    var projectData =
      (hookArgs.buildOpts && hookArgs.buildOpts.projectData) ||
      hookArgs.projectData;
    var platformsDir = projectData.platformsDir;
    let appPath;
    if (platform == "android") {
      appPath = path.join(
        platformsDir,
        platform,
        "/app/build/outputs/apk",
        isReleaseBuild ? "release/app-release.apk" : "debug/app-debug.apk"
      );
    } else {
      appPath = path.join(
        platformsDir,
        platform,
        "build",
        isReleaseBuild ? "Release-iphoneos" : "Debug-iphoneos",
        projectData.projectName + ".ipa"
      );
    }
    if (!fs.existsSync(appPath)) {
      throw new Error("Could not find packaged app at location: " + appPath);
    }

    const parameters = {
      token: config.diawi_access_token,
      path: appPath,
      callback_emails: config.emails || "",
      comment:
        "Build uploaded automatically by Jessica's magic plugin on: " +
        new Date(),
    };

    $logger.info("Begin app upload from local file: " + appPath);
    const diawi = new Diawi(parameters)
      .on("complete", (url) => {
        $logger.info("App successfully uplaoded to diawi - URL:");
        $logger.info(url);
        resolve();
      })
      .on("error", (err) => {
        $logger.warn("Error uploading to diawi, proceeding anyway", err);
        resolve();
      });

    diawi.execute();
  });
};
