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
        this.getTubeStatusData(this);
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
        var wrapper = document.createElement('div');

        // If we have some data to display then build the results table
        if (this.loaded) {
            if (this.result !== null) {
                tubeResults = document.createElement('table');
                tubeResults.className = 'tubeStatus bright';

                for (var i=0; i < this.result.length; i++) {
                    lineRow = document.createElement('tr');

                    lineName = document.createElement('td');
                    lineName.className = 'lineName ' + this.result[i].id;
                    lineName.innerHTML = this.result[i].name;

                    lineStatus = document.createElement('td');

                    for (var j=0; j < this.result[i].lineStatuses.length; j++) {
                        if (this.result[i].lineStatuses[j].validityPeriods.length < 2) {
                            severity = this.result[i].lineStatuses[j].statusSeverityDescription;
                            lineStatus.innerHTML = this.result[i].lineStatuses[j].statusSeverityDescription;
                        } else {
                            for (var k=0; k < this.result[i].lineStatuses[j].validityPeriods.length; k++) {
                                if (this.result[i].lineStatuses[j].validityPeriods[k].isNow) {
                                    severity = this.result[i].lineStatuses[j].statusSeverityDescription;
                                    }
                                }
                            }
                        }

                    switch (severity) {
                        case 'Good Service':
                            lineStatus.className = 'lineStatus goodService';
                            break;
                        case 'Part Closure':
                            lineStatus.className = 'lineStatus partClosure';
                            break;
                        case 'Service Closed':
                            lineStatus.className = 'lineStatus serviceClosed';
                            break;
                        default:
                            lineStatus.className = 'lineStatus';
                            break;
                        }

                    lineStatus.innerHTML = severity;

                    lineRow.appendChild(lineName);
                    lineRow.appendChild(lineStatus);

                    if (this.config.show_all) {
                        tubeResults.appendChild(lineRow);
                    } else {

                        if (lineStatus.innerHTML != 'Good Service') {
                            tubeResults.appendChild(lineRow);
                            }
                        }

                    wrapper.appendChild(tubeResults);
                    }
            } else {
                // Otherwise lets just use a simple div
                wrapper.innerHTML = 'Error getting tube status.';
                }
        } else {
            // Otherwise lets just use a simple div
            wrapper.innerHTML = 'Loading tube status...';
            }

        return wrapper;
        },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-TUBE-STATUS' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.result = payload.result;
                this.updateDom(1000);
            }
        }
    });
