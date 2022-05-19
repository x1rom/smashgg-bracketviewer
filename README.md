# smashgg-bracketviewer

## Install Guide:
In order to run this project, simply download the latest release and extract the zip file. If you're on Windows, run bracketviewer.bat. On Linux or Mac OS, run bracketviewer.sh. A terminal should appear displaying a Port.

In a Internet Browser of your choice, type localhost:PORT into the address bar.(replace PORT with the number in the terminal).
It's also possible to access the bracket from other devices within the local network (Like another computer or Phone), by typing IP_ADDRESS:PORT into the address bar, where IP_ADDRESS is the address of the host device.
If you want to use several devices, it is recommended to access Information from a single host, to save on Bandwidth and API requests.

## Appearance:
You can customise the look of the bracket, by writing a custom .pug and javascript files. Put them into the appearances folder.

Pug is a HTML rendering engine. Basically HTML with variables, inheritance etc. For reference, look up https://pugjs.org/api/getting-started.html

Your .pug file needs to ``include ../views/bracket.pug`` Write this at the top of the file. You can look up default.pug on how to write an appearance file.

You need to include a javascript file in your .pug file. The name and structure of this file is irrelevant, but it needs to have the two following functions:

**init(data)**
The init function is called at the beginning to build the bracket. It should provide all information needed about the bracket. The data is a JSON object containing all sets in a phase.

**update(data)**
The update function is called once every second to update the bracket. It contains information about scores and wins. In order to save data and keep requests to the Smashgg api small, it contains only minimal information. I.e player names, sponsors, country etc. are transmitted in the init() function and only the player ID is transmitted here.