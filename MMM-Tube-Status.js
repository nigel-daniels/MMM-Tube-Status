/* Magic Mirror Module: MMM-Tube-Status
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

Module.register('MMM-Tube-Status', {

    defaults: {
            app_id:     '',
            api_key:    '',
            show_all:   true,
            interval:   600000 // Every 10 mins
        },


    start:  function() {
        Log.log('Starting module: ' + this.name);

        if (this.data.classes === 'MMM-Tube-Status') {
            this.data.classes = 'bright medium';
            }

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        this.url = 'https://api.tfl.gov.uk/line/mode/tube/status';
        this.location = '';
        this.result = null;

        // Trigger the first request
        this.getAirQualityData(this);
        },


    getStyles: function() {
        return ['tube-status.css', 'font-awesome.css'];
        },


    getTubeStatusData: function(that) {
        // Make the initial request to the helper then set up the timer to perform the updates
        that.sendSocketNotification('GET-TUBE-STATUS', that.url);
        setTimeout(that.getTubeStatusData, that.config.interval, that);
        },


    getDom: function() {
        // Set up the local wrapper
        var wrapper = null;

        // If we have some data to display then build the results table
        if (this.loaded) {
            wrapper = document.createElement('div');
		    wrapper.className = 'airnow small';

            airLocation = document.createElement('div');
            airLocation.className = 'airLocation';
            airLocation.innerHTML = this.location;

            airDetails = document.createElement('table');

            if (this.result !== null) {
                // Build the air quality details
                for (var i=0; i < this.result.length; i++) {

                    var colourClass = '';
                    var catName = '';

                    switch (this.result[i].Category.Number) {
                        case 1:
                            colourClass = 'good';
                            catName = 'Good';
                            break;
                        case 2:
                            colourClass = 'moderate';
                            catName = 'Moderate';
                            break;
                        case 3:
                            colourClass = 'sensitive';
                            catName = 'Sensitivity Risk';
                            break;
                        case 4:
                            colourClass = 'unhealthy';
                            catName = 'Unhealthy';
                            break;
                        case 5:
                            colourClass = 'v_unhealthy';
                            catName = 'Very Unhealthy';
                            break;
                        case 6:
                            colourClass = 'hazardous';
                            catName = 'Hazardous';
                            break;
                        }

                    airRow = document.createElement('tr');
                    airRow.className = colourClass;

                    airParameter = document.createElement('td');
                    airParameter.className = 'airParameter normal';
                    airParameter.innerHTML = this.result[i].ParameterName;

                    airAQI = document.createElement('td');
                    airAQI.className = 'airAQI normal';
                    airAQI.innerHTML = this.result[i].AQI;

                    airName = document.createElement('td');
                    airName.className ='airName ' + colourClass;
                    airName.innerHTML = catName;

                    airRow.appendChild(airParameter);
                    airRow.appendChild(airAQI);
                    airRow.appendChild(airName);

                    airDetails.appendChild(airRow);
                    }
                }

            // Add elements to the now div
            wrapper.appendChild(airLocation);
            wrapper.appendChild(airDetails);
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = 'Loading tube status data...';
            }

        return wrapper;
        },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-TUBE-STATUS' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.location = payload.location;
                this.result = payload.result;
                this.updateDom(1000);
            }
        }
    });
