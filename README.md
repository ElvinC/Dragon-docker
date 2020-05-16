# Dragon-docker
Autonomous PID-based code for the SpaceX Dragon docking simulator: https://iss-sim.spacex.com/

[Video of the code in action](https://youtu.be/-xl1kKetOv8).

Autonomous docking can be activated by pasting the code into the development console of a browser (at your own risk, always skim through code before executing to make sure it's safe). ``dragon-dock.js`` is the standard version. ``dragon_dock_slow.js`` has added velocity constraints to make it more realistic. Try tweaking the PID parameters to change how the Dragon moves. The default values are conservative and _work_, but can definetely be tuned. [Example of what modified PIDs can do](https://youtu.be/UOIZNoeefak).
