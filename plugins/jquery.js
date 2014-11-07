"use strict";

var obj = require("../lib/obj.js");

function jqueryPlugin(api, config) {
    var $ = config.jQuery;
    var base = config.base || "";

    config.settings = config.settings || {};
    config.settings.contentType = config.settings.contentType || "application/json; charset=utf-8";

    api.transports.push({
        name: "http",
        deliver: function transport(method, url, data, callback) {
            var settings = obj.copy(config.settings);

            settings.type = method.toUpperCase();
            if (method !== "get" && settings.contentType.indexOf("application/json") > -1) {
                data = JSON.stringify(data);
            }
            settings.data = data;

            $.ajax(base + url, settings)
                .done(function onHttpSuccess(data) {
                    callback(null, data);
                })
                .fail(function onHttpFail(xhr) {
                    callback(new Error(xhr.responseText));
                });

            return true;
        },
        isAvailable: function () {
            return true;    // http is always available, Dude!
        }
    });
}

module.exports = jqueryPlugin;