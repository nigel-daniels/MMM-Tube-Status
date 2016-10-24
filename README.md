# MMM-Tube-Status
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop).   This module shows the status of the London Underground.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/nigel-daniels/MMM-Tube-Status`.  A new folder `MMM-Tube-Status` will appear, navigate into it.
2. Execute `npm install` to install the node dependencies.

## Config
The entry in `config.js` can include the following options:

|Option|Description|
|---|---|
|`app_id`|**Required** This is the App ID assigned to you on the TfL Open Data Portal.  Details on how to request an App ID can be found [here](https://api-portal.tfl.gov.uk/docs)<br><br>**Type:** `string`<br>|
|`api_key`|**Required** This is the API key assigned to you on the TfL Open Data Portal.  Details on how to request an API key can be found [here](https://api-portal.tfl.gov.uk/docs)<br><br>**Type:** `string`<br>|
|`show_all`|This determins if the module displays all of the tube lines or just those affected by some sort of outage.<br><br>**Type:** `boolean`<br>**Default value:** true|
|`interval`|How often the weather is updated.<br><br>**Type:** `integer`<br>**Default value:** `600000 // 10 minutes`|

Here is an example of an entry in `config.js`
```
{
    module:		'MMM-Tube-Status',
    position:	'top_left',
    config:		{
                app_id:   'xxxxx'
                api_key:  'xxxxxxxxxxxx',
                show_all:	 false
                }
},
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)

## Notes
I hope you like this module, this was built at the request of `djbenny07`on the MagicMirror2 forum.  Feel free to submit pull requests or post issues and I'll do my best to respond.

## Thanks To...
- [Michael Teeuw](https://github.com/MichMich) for the [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) framework that made this module possible.
- [Transport for London](https://tfl.gov.uk) for the guides and information they publish on their API.
