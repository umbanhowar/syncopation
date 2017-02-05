////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////


angular
    .module('Synth', ['WebAudio', 'WebAnalyser'])
    .factory('DSP', ['AudioEngine', 'Analyser', function(Engine, Analyser) {
        var self = this;
        self.device = null;
        self.analyser = null;

        synthList = [Tone.Synth, Tone.AMSynth, Tone.FMSynth, Tone.DuoSynth];

        // works, works, works, no, no, no, no, works,
        mySynthIndex = 0;

        Engine.init();


        function _unplug() {
            self.device.onmidimessage = null;
            self.device = null;
        }

        function _plug(device) {
            if(device) {
                // unplug any already connected device
                if(self.device) {
                    _unplug();
                }

                self.device = device;
                self.device.onmidimessage = _onmidimessage;
            }
        }

        function _createAnalyser(canvas) {
            self.analyser = new Analyser(canvas);
            Engine.wire(self.analyser);

            return self.analyser;
        }

        function _midiToFreq(d) {
          var res = Math.pow(2, (d-69)/12.0)*440;
          return res;
        }

        function _startNoteOnMySynth(e) {
          var scaledVelocity = e.data[2]/127;
          var freq = _midiToFreq(e.data[1]);
          mySynth.triggerAttack(freq, 0, scaledVelocity);
          console.log("MyclientId "+clientId);
          socket.emit("note-on", {"note": e.data[1], "velocity":e.data[2], "id": clientId});
        }

        function _endNoteOnMySynth(e) {
          mySynth.triggerRelease(_midiToFreq(e.data[1]));
          socket.emit("note-off", {"note": e.data[1], "id": clientId});
        }

        function _onmidimessage(e) {
            /**
            * e.data is an array
            * e.data[0] = on (144) / off (128) / detune (224)
            * e.data[1] = midi note
            * e.data[2] = velocity || detune
            */
            console.log("MIDI received!");
            console.log(e);
            switch(e.data[0]) {
                case 153:
                  // midi pad start
                  _startNoteOnMySynth(e);
                break;
                case 137:
                  // midi pad end
                  _endNoteOnMySynth(e);
                break;
                case 144:
                    //Engine.noteOn(e.data[1], e.data[2]);
                    _startNoteOnMySynth(e);
                break;
                case 128:
                    //Engine.noteOff(e.data[1]);
                    _endNoteOnMySynth(e);
                break;
                case 224:
                    Engine.detune(e.data[2]);
                    socket.emit("detune", {"detune": e.data[2], "id": clientId});
                break;
            }

        }

        function _enableFilter(enable) {
            if(enable !== undefined) {
                if(enable) {
                    Engine.filter.connect();
                } else {
                    Engine.filter.disconnect();
                }
            }
        }

        function changeSynthById(id, params) {
          mySynthIndex = id;
          var synth = synthList[id];
          mySynthParams = synth.defaults;
          if (mySynth !== null) {
            mySynth.dispose();
          }
          mySynth = new Tone.PolySynth(6, synth).toMaster();
          socket.emit('synth-change', {"id": clientId, "synth": mySynthIndex, "params": params});
        }

        function _changeSynthParams(params) {
            console.log("change synth params!");
        
            socket.emit('synth-change', {"id": clientId, "synth": mySynthIndex, "params": params});
        }

        function _changeSynth(index, params) {
            if(index !== undefined) {
                mySynthIndex = index;
                changeSynthById(mySynthIndex, params);
                console.log("Synth changed!");
                console.log(synthList[mySynthIndex].toString());
            }
        }

        return {
            plug: _plug,
            createAnalyser: _createAnalyser,
            setOscType: Engine.osc.setType,
            setFilterType: Engine.filter.setType,
            setAttack: Engine.setAttack,
            setRelease: Engine.setRelease,
            setFilterFrequency: Engine.filter.setFrequency,
            setFilterResonance: Engine.filter.setResonance,
            enableFilter: _enableFilter,
            changeSynth: _changeSynth,
            midiToFreq: _midiToFreq,
            changeSynthParams: _changeSynthParams,
        };
    }]);
