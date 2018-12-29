self.importScripts("./drawtest.js");

self.onmessage = event => {
  const { canvas, width, height } = event.data.canvas;
  const context = canvas.getContext("2d");

  draw(context);
};
