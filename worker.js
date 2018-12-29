self.importScripts("./drawtest.js");

self.onmessage = event => {
  const offscreen = event.data.canvas;
  const context = offscreen.getContext("2d");

  draw(context);
};
