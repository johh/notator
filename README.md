# notator

![npm bundle size](https://img.shields.io/bundlephobia/minzip/notator?color=green&style=for-the-badge) ![npm dependencies](https://img.shields.io/david/johh/notator?color=green&style=for-the-badge)

Reactive/Adaptive soundtracks for the web.


## Browser support

**notator** is built on top of the Web Audio API, which is still in the working draft stage.
All modern browsers are supported.

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png)
:---: | :---: | :---: | :---: | :---: | :---: |
33+ ✅ | 29+ ✅ | 20+ ✅ | 7.1+ ✅ | 12+ ✅ | ❌ |

[Web Audio API browser support](https://caniuse.com/#feat=audio-api)

## Installation

```
yarn add notator
```
```
npm i notator --save
```

## Usage

### Basic example

```typescript
import {
	defaultContext,
	Timeline,
	Track,
	Part,
	Sound,
} from 'notator';

import drums from './path/to/drums.mp3';
import arp from './path/to/arp.mp3';
import click from './path/to/click.mp3';


const timeline = new Timeline({
	bpm: 65,
});

const part = new Part({
	duration: 1, // duration in bars
	tracks: [
		new Track({
			duration: 1,
			src: drums,
		}),
		new Track({
			duration: 1,
			src: arp,
		}),
	],
});

const sound = new Sound({
	src: click,
	quantize: 1 / 16,
	gain: 2, // boost volume
});

someElement.addEventListener( 'click', () => {
	defaultContext.start()
		.then( () => timeline.cue( part ) );
});

document.addEventListener( 'click', () => {
	timeline.play( sound );
});

```

### Effects

Audio effects can be added to `Timelines`, `Parts`, `Tracks` and `Sounds`.

```typescript
import {
	defaultContext,
	Timeline,
	Track,
	Part,
	Sound,

	Gain,
	BiquadFilter,
	DynamicsCompressor,
	Delay,
	Convolver,
	EffectController,
} from 'notator';

import drums from './path/to/drums.mp3';
import arp from './path/to/arp.mp3';
import click from './path/to/click.mp3';


const timeline = new Timeline({
	bpm: 65,
	effects: [
		new DynamicsCompressor({
			threshold: -24,
			knee: 30,
			ratio: 12,
			attack: .003,
			release: .25,
		}),
	],
});

const part = new Part({
	duration: 1, // duration in bars
	effects: [
		new Gain({
			gain: .75,
		}),
	],
	tracks: [
		new Track({
			duration: 1,
			src: drums,
		}),
		new Track({
			duration: 1,
			src: arp,
			effects: [
				new Delay({
					delayTime: .1,
				}),
			],
		}),
	],
});

```

An `EffectController` is used to dynamically control parameters or to sync multiple effects:

```typescript
import {
	Gain,
	EffectController,
} from 'notator';

const gainA = new Gain();
const gainB = new Gain();
const ctrl = new EffectController({
	effects: [
		gainA,
		gainB,
	],
});

// parameters can now be dynamically changed
ctrl.set( 'gain', .5 );

```

## Troubleshooting

#### Audio cuts out entirely for a second once a new sound is played

This happens because the browsers' audio system is overloaded. Try reducing the amount of sounds being played simultaneously or the number of effects used. Complex effects like Convolvers are especially taxing.
Firefox seems to have a problem with Convolvers in general, so use them with caution for now.

---

#### Sounds are doubled, with varying delay! Some react to interactions, others don't? WTF?

Do you, by any chance, have multiple tabs/windows of the same project open? Yeah, no worries. It happened to me as well.

---

## Naming

**notator** is named after Notator SL, a MIDI sequencer for the Atari ST.

## Todo

* docs
* support for audio sprites
* hooks to randomise/vary playback
* additional Effects, like pan, crossfade, etc.
* customised signal routing for more complex mixes
* testing

## Licence

© 2020 [DOWNPOUR DIGITAL](https://downpour.digital), licensed under BSD-4-Clause
