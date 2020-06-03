var path = require('path');
var fs = require('fs');
const Diawi = require('../../megabuyte-build-hooks/diawi');

module.exports = function ($logger, hookArgs) {
  $logger.info('in Jessica Hook');
  const args = hookArgs.buildData || hookArgs.androidBuildData || hookArgs.iOSBuildData;

  return new Promise(function (resolve, reject) {
    if (args.env.diawi) {
      console.log('release ');

      var projectData = (hookArgs.buildOpts && hookArgs.buildOpts.projectData) || hookArgs.projectData;
      var platformsDir = projectData.platformsDir;
      console.log('platformsDir ', platformsDir);

      const p = path.resolve(platformsDir, 'ios/build/Release-iphoneos/mbmobile.ipa');
      console.log('path: ' + p);
      const parameters = {
        token: 'snKRBiLHXhCuaRc9wtW2fHM6NIaSm6lRobxFyxmfzJ',
        path: p,
        callback_emails: 'dev@megabuyte.com',
        comment: "Build uploaded automatically by Jessica's magic plugin on: " + new Date(),
      };

      const diawi = new Diawi(parameters)
        .on('complete', (url) => {
          console.log('App successfully uplaoded to diawi - URL:');
          console.log(url);
          resolve();
        })
        .on('error', (err) => {
          console.log('error uploading to diawi, proceeding anyway', err);
          resolve();
        });

      diawi.execute();
    }

    resolve();
  });
};
