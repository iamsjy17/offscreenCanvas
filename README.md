# offscreenCanvas
OffscreenCanvas Test Page

HTML5에 새로 적용된 OffscreenCanvas에 대해서 소개와 예제입니다.

OffscreenCanvas에 대해 처음 접하게 된 것은 2018 Deview에서 삼성전자 방진호님이 `책에서는 맛 볼 수 없는 HTML5 Canvas이야기` 세션에서 였습니다.
참고: https://www.slideshare.net/deview/122-html5-canvas

Worker thread에서 Canvas Rendering을 돌릴 수 있다는 것이 너무 매력적으로 느껴져서 개인 프로젝트에 적용해보기로 했습니다.
적용 전에 예제들을 만들어보고 조사하면서 알게 된 것들에 대한 테스트용입니다.

## OffscreenCanvas

OffscreenCanvas 인터페이스는 화면 밖에서 렌더링 할 수 있는 캔버스를 제공합니다.
window와 worker contexts에서 사용할 수 있습니다.

## OffscreenCanvas를 사용하는 두 가지 방법

MDN에 가보면 OffscreenCanvas를 사용할 수 있는 두가지 방법이 나와 있습니다.
아래 두 예제는 MDN에서 그대로 인용하였습니다.

### Synchronous Rendering

먼저 OffscreenCanvas API를 동기적으로 사용하는 방법입니다.

이 방법은 OffscreenCanvas Object에서 가져온 RenderingContext를 사용하여 새 프레임을 생성합니다.
RenderingContext에서 새 프레임이 렌더링을 완료하면, 가장 최근에 렌더링된 이미지를 저장하기 위해 `transferToImageBitmap()` 메서드를 호출합니다.
이 메서드는 `ImageBitmap` 객체를 return합니다. 이 객체는 다양한 웹 API에서 사용할 수 있으며 사본을 만들지 않고 재사용할 수 있습니다.

`ImageBitmap`을 표시하려면 canvas.getContext("bitmaprenderer") 메서드를 호출하여 만들 수있는 ImageBitmapRenderingContext를 사용해야합니다.
`ImageBitmapRenderingContext`는 오직 주어진 ImageBitmap을 캔버스의 내용으로 대체하는 기능만을 제공합니다.
`ImageBitmapRenderingContext.transferFromImageBitmap()` 메서드를 사용해서 이전에 OffscreenCanvas에 그려지고 저장된 ImageBitmap 객체를 Canvas에 표시할 수 있습니다.

하나의 OffscreenCanvas로 다수의 ImageBitmapRenderingContext 객체에 프레임을 전달할 수 있습니다.

이미지 Copy없이 여러개의 snapshot을 뜰 수 있다는 점이 굉장히 좋은 것 같습니다.

```html
<canvas id="one"></canvas> <canvas id="two"></canvas>
```

```js
var one = document.getElementById("one").getContext("bitmaprenderer");
var two = document.getElementById("two").getContext("bitmaprenderer");

var offscreen = new OffscreenCanvas(256, 256);
var gl = offscreen.getContext("webgl");

// ... some drawing for the first canvas using the gl context ...

// Commit rendering to the first canvas
var bitmapOne = offscreen.transferToImageBitmap();
one.transferFromImageBitmap(bitmapOne);

// ... some more drawing for the second canvas using the gl context ...

// Commit rendering to the second canvas
var bitmapTwo = offscreen.transferToImageBitmap();
two.transferFromImageBitmap(bitmapTwo);
```

### Asynchronous Rendering

다음은 Worker thread에서 Rendering을 하는 방법입니다!
이 방법은 Main thread 혹은 다른 worker thread의 canvas Element에 대해 transferControlToOffscreen() 메서드를 호출하여 offscreenCanvas를 얻어냅니다.
이 메서드를 호출함으로써 Main Thread의 canvas 객체에서 OffscreenCanvas 객체를 얻어냅니다. 그리고 OffscreenCanvas 객체로 getContext() 메서드를 호출하여 RenderingContext가 얻어냅니다.

```html
<canvas id="one"></canvas> <canvas id="two"></canvas>
```

Main thread의 canvas로부터 offscreenCanvas를 얻어내고 Worker thread로 보낸다.

main.js

```js
var htmlCanvas = document.getElementById("canvas");
var offscreen = htmlCanvas.transferControlToOffscreen();

var worker = new Worker("offscreencanvas.js");
worker.postMessage({ canvas: offscreen }, [offscreen]);
```

Worker thread에서 받아서 처리한다.

worker.js

```js
onmessage = function(evt) {
  const canvas = evt.data.canvas;
  const gl = canvas.getContext("webgl");

  function render(time) {
    // ... some drawing using the gl context ...
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};
```

## 실적용 예제
