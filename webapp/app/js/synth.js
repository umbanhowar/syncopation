self.osc1 = new Oscillator(self.ctx);
self.osc1.setOscType('sine');
self.amp = new Amp(self.ctx);

self.osc1.connect(self.amp.gain);

self.amp.connect(self.ctx.destination);
self.amp.setVolume(0.0, 0); //mute the sound
    self.filter1.disconnect();
    self.amp.disconnect();
    self.amp.connect(self.ctx.destination);
}

