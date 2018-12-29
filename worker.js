self.importScripts("./drawtest.js");

self.onmessage = event => {
  const { canvas, width, height } = event.data;
  const context = canvas.getContext("2d");

  draw(context, width, height);
};
