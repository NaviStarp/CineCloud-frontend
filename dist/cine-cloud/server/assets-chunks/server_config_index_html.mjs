export default `<!DOCTYPE html><html lang="en" data-beasties-container><head>
  <meta charset="utf-8">
  <title>CineCloud</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css" id="fa-auto-css">:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}</style><link rel="icon" type="image/x-icon" href="favicon.ico">
<style>@font-face{font-family:Tektur;font-style:normal;font-weight:400 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/tektur/v3/XoH62YHtS7q969kXCjzlV0aSkS_o8OacszacvGHE.woff2) format("woff2");unicode-range:U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}@font-face{font-family:Tektur;font-style:normal;font-weight:400 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/tektur/v3/XoH62YHtS7q969kXCjzlV0aSkS_o8Oacsz-cvGHE.woff2) format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}@font-face{font-family:Tektur;font-style:normal;font-weight:400 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/tektur/v3/XoH62YHtS7q969kXCjzlV0aSkS_o8OacszicvGHE.woff2) format("woff2");unicode-range:U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF}@font-face{font-family:Tektur;font-style:normal;font-weight:400 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/tektur/v3/XoH62YHtS7q969kXCjzlV0aSkS_o8OacszScvGHE.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}@font-face{font-family:Tektur;font-style:normal;font-weight:400 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/tektur/v3/XoH62YHtS7q969kXCjzlV0aSkS_o8OacszWcvGHE.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:Tektur;font-style:normal;font-weight:400 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/tektur/v3/XoH62YHtS7q969kXCjzlV0aSkS_o8OacszucvA.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttHOmDyw.woff2) format("woff2");unicode-range:U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtvXOmDyw.woff2) format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtuHOmDyw.woff2) format("woff2");unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttXOmDyw.woff2) format("woff2");unicode-range:U+1F00-1FFF}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtunOmDyw.woff2) format("woff2");unicode-range:U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttnOmDyw.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtt3OmDyw.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:Noto Sans;font-style:italic;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevtuXOm.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aPdu2ui.woff2) format("woff2");unicode-range:U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5ardu2ui.woff2) format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a_du2ui.woff2) format("woff2");unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aLdu2ui.woff2) format("woff2");unicode-range:U+1F00-1FFF}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a3du2ui.woff2) format("woff2");unicode-range:U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aHdu2ui.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aDdu2ui.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:Noto Sans;font-style:normal;font-weight:100 900;font-stretch:100%;font-display:swap;src:url(https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@layer theme{:root{--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;--color-red-50: oklch(.971 .013 17.38);--color-red-400: oklch(.704 .191 22.216);--color-red-500: oklch(.637 .237 25.331);--color-green-500: oklch(.723 .219 149.579);--color-blue-300: oklch(.809 .105 251.813);--color-blue-400: oklch(.707 .165 254.624);--color-blue-500: oklch(.623 .214 259.815);--color-neutral-50: #f8fafc;--color-neutral-100: #f1f5f9;--color-neutral-200: #e2e8f0;--color-neutral-300: #cbd5e1;--color-neutral-400: #94a3b8;--color-neutral-500: #64748b;--color-neutral-600: #475569;--color-neutral-700: #334155;--color-neutral-800: #1e293b;--color-neutral-900: #0f172a;--color-black: #000;--color-white: #fff;--spacing: .25rem;--container-md: 28rem;--container-lg: 32rem;--container-3xl: 48rem;--text-xs: .75rem;--text-xs--line-height: calc(1 / .75);--text-sm: .875rem;--text-sm--line-height: calc(1.25 / .875);--text-base: 1rem;--text-base--line-height: 1.5 ;--text-lg: 1.125rem;--text-lg--line-height: calc(1.75 / 1.125);--text-xl: 1.25rem;--text-xl--line-height: calc(1.75 / 1.25);--text-2xl: 1.5rem;--text-2xl--line-height: calc(2 / 1.5);--text-3xl: 1.875rem;--text-3xl--line-height: 1.2 ;--text-5xl: 3rem;--text-5xl--line-height: 1;--text-6xl: 3.75rem;--text-6xl--line-height: 1;--font-weight-medium: 500;--font-weight-semibold: 600;--font-weight-bold: 700;--font-weight-extrabold: 800;--tracking-tight: -.025em;--radius-md: .375rem;--radius-lg: .5rem;--radius-xl: .75rem;--radius-2xl: 1rem;--ease-in: cubic-bezier(.4, 0, 1, 1);--ease-out: cubic-bezier(0, 0, .2, 1);--ease-in-out: cubic-bezier(.4, 0, .2, 1);--animate-spin: spin 1s linear infinite;--animate-pulse: pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--blur-sm: 8px;--blur-lg: 16px;--blur-xl: 24px;--default-transition-duration: .15s;--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1);--default-font-family: var(--font-sans);--default-font-feature-settings: var(--font-sans--font-feature-settings);--default-font-variation-settings: var( --font-sans--font-variation-settings );--default-mono-font-family: var(--font-mono);--default-mono-font-feature-settings: var( --font-mono--font-feature-settings );--default-mono-font-variation-settings: var( --font-mono--font-variation-settings );--color-primary-200: #ddd6fe;--color-primary-300: #c4b5fd;--color-primary-400: #a78bfa;--color-primary-500: #8b5cf6;--color-primary-600: #7c3aed;--color-primary-700: #6d28d9;--color-primary-800: #5b21b6;--color-accent-300: #f9a8d4;--color-accent-400: #f472b6;--color-accent-500: #ec4899}}@layer base{*,:after,:before{box-sizing:border-box;margin:0;padding:0;border:0 solid}html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:var( --default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" );font-feature-settings:var(--default-font-feature-settings, normal);font-variation-settings:var( --default-font-variation-settings, normal );-webkit-tap-highlight-color:transparent}body{line-height:inherit}h2{font-size:inherit;font-weight:inherit}svg{display:block;vertical-align:middle}button,input{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;border-radius:0;background-color:transparent;opacity:1}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}}@layer utilities{.pointer-events-none{pointer-events:none}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:calc(var(--spacing) * 0)}.inset-y-0{inset-block:calc(var(--spacing) * 0)}.left-0{left:calc(var(--spacing) * 0)}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-5{margin-top:calc(var(--spacing) * 5)}.mb-1{margin-bottom:calc(var(--spacing) * 1)}.mb-2{margin-bottom:calc(var(--spacing) * 2)}.block{display:block}.flex{display:flex}.h-6{height:calc(var(--spacing) * 6)}.h-full{height:100%}.h-screen{height:100vh}.min-h-12{min-height:calc(var(--spacing) * 12)}.w-6{width:calc(var(--spacing) * 6)}.w-full{width:100%}.max-w-md{max-width:var(--container-md)}.-translate-x-full{--tw-translate-x: -100%;translate:var(--tw-translate-x) var(--tw-translate-y)}.transform{transform:var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y)}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.overflow-hidden{overflow:hidden}.rounded-lg{border-radius:var(--radius-lg)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-neutral-600\\/70{border-color:color-mix(in oklab,var(--color-neutral-600) 70%,transparent)}.bg-neutral-700\\/50{background-color:color-mix(in oklab,var(--color-neutral-700) 50%,transparent)}.bg-neutral-800{background-color:var(--color-neutral-800)}.bg-neutral-900{background-color:var(--color-neutral-900)}.bg-primary-600{background-color:var(--color-primary-600)}.bg-gradient-to-r{--tw-gradient-position: to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.from-transparent{--tw-gradient-from: transparent;--tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.via-white\\/10{--tw-gradient-via: color-mix(in oklab, var(--color-white) 10%, transparent);--tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-via-stops)}.to-transparent{--tw-gradient-to: transparent;--tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))}.p-8{padding:calc(var(--spacing) * 8)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-4{padding-inline:calc(var(--spacing) * 4)}.py-3{padding-block:calc(var(--spacing) * 3)}.pt-6{padding-top:calc(var(--spacing) * 6)}.pl-3{padding-left:calc(var(--spacing) * 3)}.pl-10{padding-left:calc(var(--spacing) * 10)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading, var(--text-2xl--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading, var(--text-sm--line-height))}.font-bold{--tw-font-weight: var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight: var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight: var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.text-green-500{color:var(--color-green-500)}.text-neutral-200{color:var(--color-neutral-200)}.text-neutral-300{color:var(--color-neutral-300)}.text-neutral-400{color:var(--color-neutral-400)}.text-primary-400{color:var(--color-primary-400)}.text-white{color:var(--color-white)}.placeholder-neutral-500::placeholder{color:var(--color-neutral-500)}.shadow-md{--tw-shadow: 0 4px 6px -1px var(--tw-shadow-color, rgb(0 0 0 / .1)), 0 2px 4px -2px var(--tw-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / .1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow: 0 20px 25px -5px var(--tw-shadow-color, rgb(0 0 0 / .1)), 0 8px 10px -6px var(--tw-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease, var(--default-transition-timing-function));transition-duration:var(--tw-duration, var(--default-transition-duration))}.duration-200{--tw-duration: .2s;transition-duration:.2s}.duration-300{--tw-duration: .3s;transition-duration:.3s}.duration-500{--tw-duration: .5s;transition-duration:.5s}.valid\\:border-green-500\\/70:valid{border-color:color-mix(in oklab,var(--color-green-500) 70%,transparent)}.valid\\:ring-green-500\\/30:valid{--tw-ring-color: color-mix(in oklab, var(--color-green-500) 30%, transparent)}.invalid\\:border-red-500\\/70:invalid{border-color:color-mix(in oklab,var(--color-red-500) 70%,transparent)}.invalid\\:ring-red-500\\/30:invalid{--tw-ring-color: color-mix(in oklab, var(--color-red-500) 30%, transparent)}.focus-within\\:scale-\\[1\\.01\\]:focus-within{scale:1.01}@media (hover: hover){.hover\\:bg-primary-700:hover{background-color:var(--color-primary-700)}}@media (hover: hover){.hover\\:shadow-2xl:hover{--tw-shadow: 0 25px 50px -12px var(--tw-shadow-color, rgb(0 0 0 / .25));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}@media (hover: hover){.hover\\:shadow-lg:hover{--tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / .1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}.focus\\:border-primary-500\\/70:focus{border-color:color-mix(in oklab,var(--color-primary-500) 70%,transparent)}.focus\\:bg-neutral-700\\/70:focus{background-color:color-mix(in oklab,var(--color-neutral-700) 70%,transparent)}.focus\\:ring-2:focus{--tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-primary-400\\/70:focus{--tw-ring-color: color-mix(in oklab, var(--color-primary-400) 70%, transparent)}.focus\\:ring-primary-500\\/70:focus{--tw-ring-color: color-mix(in oklab, var(--color-primary-500) 70%, transparent)}.focus\\:ring-offset-2:focus{--tw-ring-offset-width: 2px;--tw-ring-offset-shadow: var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.focus\\:ring-offset-neutral-800:focus{--tw-ring-offset-color: var(--color-neutral-800)}.focus\\:outline-none:focus{--tw-outline-style: none;outline-style:none}.disabled\\:bg-primary-800\\/70:disabled{background-color:color-mix(in oklab,var(--color-primary-800) 70%,transparent)}.disabled\\:text-primary-300:disabled{color:var(--color-primary-300)}}body{font-family:Noto Sans,Tektur,Helvetica,sans-serif;background-color:var(--color-neutral-900)}@property --tw-translate-x{syntax: "*"; inherits: false; initial-value: 0;}@property --tw-translate-y{syntax: "*"; inherits: false; initial-value: 0;}@property --tw-translate-z{syntax: "*"; inherits: false; initial-value: 0;}@property --tw-scale-x{syntax: "*"; inherits: false; initial-value: 1;}@property --tw-scale-y{syntax: "*"; inherits: false; initial-value: 1;}@property --tw-scale-z{syntax: "*"; inherits: false; initial-value: 1;}@property --tw-rotate-x{syntax: "*"; inherits: false; initial-value: rotateX(0);}@property --tw-rotate-y{syntax: "*"; inherits: false; initial-value: rotateY(0);}@property --tw-rotate-z{syntax: "*"; inherits: false; initial-value: rotateZ(0);}@property --tw-skew-x{syntax: "*"; inherits: false; initial-value: skewX(0);}@property --tw-skew-y{syntax: "*"; inherits: false; initial-value: skewY(0);}@property --tw-pan-x{syntax: "*"; inherits: false;}@property --tw-pan-y{syntax: "*"; inherits: false;}@property --tw-pinch-zoom{syntax: "*"; inherits: false;}@property --tw-scroll-snap-strictness{syntax: "*"; inherits: false; initial-value: proximity;}@property --tw-space-y-reverse{syntax: "*"; inherits: false; initial-value: 0;}@property --tw-space-x-reverse{syntax: "*"; inherits: false; initial-value: 0;}@property --tw-divide-x-reverse{syntax: "*"; inherits: false; initial-value: 0;}@property --tw-border-style{syntax: "*"; inherits: false; initial-value: solid;}@property --tw-divide-y-reverse{syntax: "*"; inherits: false; initial-value: 0;}@property --tw-gradient-position{syntax: "*"; inherits: false;}@property --tw-gradient-from{syntax: "<color>"; inherits: false; initial-value: #0000;}@property --tw-gradient-via{syntax: "<color>"; inherits: false; initial-value: #0000;}@property --tw-gradient-to{syntax: "<color>"; inherits: false; initial-value: #0000;}@property --tw-gradient-stops{syntax: "*"; inherits: false;}@property --tw-gradient-via-stops{syntax: "*"; inherits: false;}@property --tw-gradient-from-position{syntax: "<length-percentage>"; inherits: false; initial-value: 0%;}@property --tw-gradient-via-position{syntax: "<length-percentage>"; inherits: false; initial-value: 50%;}@property --tw-gradient-to-position{syntax: "<length-percentage>"; inherits: false; initial-value: 100%;}@property --tw-leading{syntax: "*"; inherits: false;}@property --tw-font-weight{syntax: "*"; inherits: false;}@property --tw-tracking{syntax: "*"; inherits: false;}@property --tw-ordinal{syntax: "*"; inherits: false;}@property --tw-slashed-zero{syntax: "*"; inherits: false;}@property --tw-numeric-figure{syntax: "*"; inherits: false;}@property --tw-numeric-spacing{syntax: "*"; inherits: false;}@property --tw-numeric-fraction{syntax: "*"; inherits: false;}@property --tw-shadow{syntax: "*"; inherits: false; initial-value: 0 0 #0000;}@property --tw-shadow-color{syntax: "*"; inherits: false;}@property --tw-inset-shadow{syntax: "*"; inherits: false; initial-value: 0 0 #0000;}@property --tw-inset-shadow-color{syntax: "*"; inherits: false;}@property --tw-ring-color{syntax: "*"; inherits: false;}@property --tw-ring-shadow{syntax: "*"; inherits: false; initial-value: 0 0 #0000;}@property --tw-inset-ring-color{syntax: "*"; inherits: false;}@property --tw-inset-ring-shadow{syntax: "*"; inherits: false; initial-value: 0 0 #0000;}@property --tw-ring-inset{syntax: "*"; inherits: false;}@property --tw-ring-offset-width{syntax: "<length>"; inherits: false; initial-value: 0px;}@property --tw-ring-offset-color{syntax: "*"; inherits: false; initial-value: #fff;}@property --tw-ring-offset-shadow{syntax: "*"; inherits: false; initial-value: 0 0 #0000;}@property --tw-outline-style{syntax: "*"; inherits: false; initial-value: solid;}@property --tw-blur{syntax: "*"; inherits: false;}@property --tw-brightness{syntax: "*"; inherits: false;}@property --tw-contrast{syntax: "*"; inherits: false;}@property --tw-grayscale{syntax: "*"; inherits: false;}@property --tw-hue-rotate{syntax: "*"; inherits: false;}@property --tw-invert{syntax: "*"; inherits: false;}@property --tw-opacity{syntax: "*"; inherits: false;}@property --tw-saturate{syntax: "*"; inherits: false;}@property --tw-sepia{syntax: "*"; inherits: false;}@property --tw-drop-shadow{syntax: "*"; inherits: false;}@property --tw-backdrop-blur{syntax: "*"; inherits: false;}@property --tw-backdrop-brightness{syntax: "*"; inherits: false;}@property --tw-backdrop-contrast{syntax: "*"; inherits: false;}@property --tw-backdrop-grayscale{syntax: "*"; inherits: false;}@property --tw-backdrop-hue-rotate{syntax: "*"; inherits: false;}@property --tw-backdrop-invert{syntax: "*"; inherits: false;}@property --tw-backdrop-opacity{syntax: "*"; inherits: false;}@property --tw-backdrop-saturate{syntax: "*"; inherits: false;}@property --tw-backdrop-sepia{syntax: "*"; inherits: false;}@property --tw-duration{syntax: "*"; inherits: false;}@property --tw-ease{syntax: "*"; inherits: false;}@property --tw-contain-size{syntax: "*"; inherits: false;}@property --tw-contain-layout{syntax: "*"; inherits: false;}@property --tw-contain-paint{syntax: "*"; inherits: false;}@property --tw-contain-style{syntax: "*"; inherits: false;}
</style><link rel="stylesheet" href="styles-Q6SGCVYV.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="styles-Q6SGCVYV.css"></noscript><style ng-app-id="ng">[_nghost-ng-c4177651683]{display:block;width:100%;height:100%}@keyframes _ngcontent-ng-c4177651683_fadeIn{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in[_ngcontent-ng-c4177651683]{animation:_ngcontent-ng-c4177651683_fadeIn .3s ease-in-out}.hover\\:shadow-2xl[_ngcontent-ng-c4177651683]:hover{box-shadow:0 25px 50px -12px #00000080}@keyframes _ngcontent-ng-c4177651683_pulse{0%{opacity:.8}50%{opacity:1}to{opacity:.8}}.animate-pulse[_ngcontent-ng-c4177651683]{animation:_ngcontent-ng-c4177651683_pulse 1.5s infinite}@keyframes _ngcontent-ng-c4177651683_progressGlow{0%{box-shadow:0 0 5px #3b82f680}50%{box-shadow:0 0 10px #3b82f6cc}to{box-shadow:0 0 5px #3b82f680}}.bg-primary-600[_ngcontent-ng-c4177651683]{animation:_ngcontent-ng-c4177651683_progressGlow 1.5s infinite}</style></head>
<body><!--nghm--><script type="text/javascript" id="ng-event-dispatch-contract">(()=>{function p(t,n,r,o,e,i,f,m){return{eventType:t,event:n,targetElement:r,eic:o,timeStamp:e,eia:i,eirp:f,eiack:m}}function u(t){let n=[],r=e=>{n.push(e)};return{c:t,q:n,et:[],etc:[],d:r,h:e=>{r(p(e.type,e,e.target,t,Date.now()))}}}function s(t,n,r){for(let o=0;o<n.length;o++){let e=n[o];(r?t.etc:t.et).push(e),t.c.addEventListener(e,t.h,r)}}function c(t,n,r,o,e=window){let i=u(t);e._ejsas||(e._ejsas={}),e._ejsas[n]=i,s(i,r),s(i,o,!0)}window.__jsaction_bootstrap=c;})();
</script><script>window.__jsaction_bootstrap(document.body,"ng",["submit","input","compositionstart","compositionend","click"],["blur"]);</script>
  <app-root ng-version="19.2.3" ngh="4" ng-server-context="ssg"><router-outlet></router-outlet><app-server-config _nghost-ng-c4177651683 ngh="3"><div _ngcontent-ng-c4177651683 class="flex flex-col items-center justify-center w-full h-screen bg-neutral-900"><div _ngcontent-ng-c4177651683 class="flex flex-col items-center space-y-6 max-w-md w-full bg-neutral-800 p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl"><div _ngcontent-ng-c4177651683 class="flex items-center justify-between w-full mb-2"><h2 _ngcontent-ng-c4177651683 class="text-2xl font-bold text-primary-400">Configuración de servidor</h2><div _ngcontent-ng-c4177651683 class="relative"><fa-icon _ngcontent-ng-c4177651683 class="ng-fa-icon h-6 w-6 transition-all duration-500 transform text-green-500" ngh="0"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-question" class="svg-inline--fa fa-circle-question" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg></fa-icon></div></div><form _ngcontent-ng-c4177651683 class="w-full space-y-5" jsaction="submit:;"><app-input _ngcontent-ng-c4177651683 id="serverUrl" controlname="serverUrl" label="URL del servidor" placeholder="Ingrese la dirección IP" errormessage="La URL del servidor es obligatoria" ngh="1"><div class="mt-5 ng-untouched ng-pristine ng-invalid" jsaction="submit:;"><label class="block text-sm font-medium text-neutral-300 mb-1" for="serverUrl">URL del servidor</label><div class="group relative transition-all duration-300 focus-within:scale-[1.01]"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><fa-icon class="ng-fa-icon text-neutral-400" ngh="0"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="server" class="svg-inline--fa fa-server" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg></fa-icon></div><input required class="pl-10 block w-full rounded-xl border border-neutral-600/70 py-3 px-3 text-neutral-200 bg-neutral-700/50 placeholder-neutral-500 shadow-sm focus:ring-2 focus:ring-primary-500/70 focus:border-primary-500/70 focus:bg-neutral-700/70 transition-all valid:border-green-500/70 valid:ring-green-500/30 invalid:border-red-500/70 invalid:ring-red-500/30 ng-untouched ng-pristine ng-invalid" id="serverUrl" type="text" placeholder="Ingrese la dirección IP" value jsaction="input:;blur:;compositionstart:;compositionend:;"></div><!----></div></app-input><app-input _ngcontent-ng-c4177651683 id="serverPort" controlname="serverPort" label="Puerto del servidor" placeholder="Ingrese el puerto" errormessage="El puerto es obligatorio" ngh="1"><div class="mt-5 ng-untouched ng-pristine ng-invalid" jsaction="submit:;"><label class="block text-sm font-medium text-neutral-300 mb-1" for="serverPort">Puerto del servidor</label><div class="group relative transition-all duration-300 focus-within:scale-[1.01]"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><fa-icon class="ng-fa-icon text-neutral-400" ngh="0"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="server" class="svg-inline--fa fa-server" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg></fa-icon></div><input required class="pl-10 block w-full rounded-xl border border-neutral-600/70 py-3 px-3 text-neutral-200 bg-neutral-700/50 placeholder-neutral-500 shadow-sm focus:ring-2 focus:ring-primary-500/70 focus:border-primary-500/70 focus:bg-neutral-700/70 transition-all valid:border-green-500/70 valid:ring-green-500/30 invalid:border-red-500/70 invalid:ring-red-500/30 ng-untouched ng-pristine ng-valid" id="serverPort" type="text" placeholder="Ingrese el puerto" value="8000" jsaction="input:;blur:;compositionstart:;compositionend:;"></div><!----></div></app-input><div _ngcontent-ng-c4177651683 class="pt-6"><app-button _ngcontent-ng-c4177651683 type="submit" icon="save" class="w-full" ngh="2"><button class="group relative cursor-pointer flex w-full justify-center rounded-xl bg-primary-600 py-3 px-4 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400/70 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:bg-primary-800/70 disabled:text-primary-300 transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden" style="background: linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%);" type="submit" disabled jsaction="click:;"><span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></span><!----> Guardar configuración
</button></app-button></div><!----><div _ngcontent-ng-c4177651683 class="min-h-12 mt-2 space-y-1"><!----><!----><!----></div></form></div></div></app-server-config><!----></app-root>
<script src="polyfills-FFHMD2TL.js" type="module"></script><script src="main-NZHTEYOK.js" type="module"></script>

<script id="ng-state" type="application/json">{"__nghData__":[{},{"t":{"7":"t0"},"c":{"7":[]}},{"t":{"2":"t1"},"c":{"2":[]}},{"t":{"12":"t3","14":"t4","15":"t5","16":"t6"},"c":{"12":[],"14":[],"15":[],"16":[]}},{"c":{"0":[{"i":"c4177651683","r":1}]}}]}</script></body></html>`;