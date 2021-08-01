# Image Approximation with Triangles

## Overview

This program attempts to approximate an image using a set of triangles as closely as possible. The algorithm isn't particularly fast, taking around 10 minutes for 100 triangles, nor is it very accurate. Most of the time, the result will look like a blurred version of the original image, though edge detection is taken into account in an attempt to compensate. Despite the many flaws, I do have to say the results make really nice wallpapers.

## Setup

The algorithm was written in GLSL (via WebGL) and TypeScript, so Node.js is required to run it.

Upon cloning, install the dependencies:

```bash
npm install
```

Next, create and run a production build:

```bash
npm run build
npm start
```

The program will be running on http://localhost:3000.

On the webpage, you'll see an option to choose a file. The program should immediately start running upon selection. Note that support for WebGL on many devices and browsers is questionable, so it is very possible the algorithm won't run.

## Results

<p float="left">
    <img src="assets/forest.png" width="581" />
    <img src="assets/mona-lisa.png" width="219" />
</p>
<p float="left">
    <img src="assets/starry-night.png" width="366" />
    <img src="assets/winter.png" width="434" />
</p>
