self.importScripts("./drawtest.js");

self.onmessage = event => {
  const { offscreen, width, height } = event.data;
  const context = offscreen.getContext("2d");

  draw(context, width, height);
};
