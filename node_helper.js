/* Magic Mirror Module: MMM-Tube-Status helper
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Tube-Status helper, started...');

        // Set up the local values
        this.result = null;
        },


    getTubeStatusData: function(payload) {

        var that = this;
        this.url = payload;

        request({url: this.url, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) {
                // Let's get the weather data for right now
                that.result = result;
            } else {
                // In all other cases it's some other error
                that.result = null;
                }

            // We have the response figured out so lets fire off the notifiction
            that.sendSocketNotification('GOT-TUBE-STATUS', {'url': that.url, 'result': that.result});
            });
        },


    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-TUBE-STATUS') {
            this.getTubeStatusData(payload);
            }
        }

    });
