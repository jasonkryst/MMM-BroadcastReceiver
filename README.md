# Module: Broadcast Receiver

A module for the MagicMirror that displays messages from an API on the mirror. This module is forked from <https://github.com/Jacopo1891/MMM-RandomQuotes>.

## Installation

Navigate into your MagicMirror's ~/MagicMirror/modules folder and execute git clone <https://github.com/jasonkryst/MMM-BroadcastReceiver.git>

## API Access

This module allows for the use of any API which uses Authorization based authentication. The return body should be of the following structure.

```json
[
    {
        "message": "My first test message",
        "author": "Jason Kryst"
    }
]
```

## Using the module

To use this module, add it to the modules array in the config/config.js file:

```JavaScript
let config = {
    modules: [
        {
            module: 'MMM-BroadcastReceiver',
            position: 'bottom_center',
            config: {
                apiUrl: `API Location`,
                apiKey: 'YOUR_KEY',
                updateInterval: 60,
                showSymbol: true,
                fadeSpeed: 4000,
                broadcastSize: "M", // S M L - Default M
                authorSize: "S", // S M L - Default S
                maxBroadcastLength: 180	// Max number of quote's characters
            },
        }
    ]
}
```