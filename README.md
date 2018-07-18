# № — notator
#### A Web Audio engine for interactive soundtracks


## Browser support
**notator** is built on top of the Web Audio API, which is still in the working draft stage.
All *modern* browsers are supported (i.e. not IE).

[Web Audio API browser support](https://caniuse.com/#feat=audio-api)

## Installation
```
yarn add notator
```
```
npm i notator --save
```

## Usage
```javascript
import {
	Context,
	Timeline,
	Layer,
	Part,
	ActionSound,
	Gain,
	Panner,
	Convolver,
	BiquadFilter,
	DynamicsCompressor,
} from 'notator';

Context.start();
```

## Troubleshooting
#### Audio cuts out entirely for a second once a new sound is played
This happens because the browsers' audio system is overloaded. Try reducing the amount of sounds being played simultaneously or the number of effects used. Complex effects like Convolvers are especially taxing.
Firefox seems to have a problem with Convolvers in general, so use them with caution for now.

---

#### Sounds are doubled, with varying delay! Some react to interactions, others don't? WTF?

Do you, by any chance, have multiple tabs/windows of the same site open? Yeah, no worries. It happened to me as well.

---

## Naming
**notator** is named after Notator SL, a MIDI sequencer for the Atari ST.

## Licence
© 2018 [johh](https://github.com/johh), licensed under BSD-4-Clause
