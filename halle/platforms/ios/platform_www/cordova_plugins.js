cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-google-analytics.UniversalAnalytics",
        "file": "plugins/cordova-plugin-google-analytics/www/analytics.js",
        "pluginId": "cordova-plugin-google-analytics",
        "clobbers": [
            "analytics",
            "ga"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-google-analytics": "1.5.6"
};
// BOTTOM OF METADATA
});