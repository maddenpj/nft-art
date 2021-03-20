# Trippy Art for NFTs

This was forked from a Game of Life [implementation](https://github.com/DougHaber/nlife-color) with color. All the Game of Life stuff has been commented out for now. The goal here is to make a trippy color algorithm to run in the background and eventually color the Game of Life stuff with it.

## How it works

The main stuff happens in `function getColor(xPos, yPos, numCycles, board)`

This returns a hex color value for the given coordinates and number of cycles (the time variable). The red and green channels are controlled with `function wave(x, y, dt, phase, freq)` which represents a 2-dimensional Sine wave propogating from the top left corner (The origin - (0,0)).

The blue channel is controlled with `function polarWave(x, y, dt, phase, freq)` which is a sine wave in polar coordinates to give it a sweeping effect.
