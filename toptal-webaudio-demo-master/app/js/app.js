////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////

 


angular
    .module('WebSynth', ['WebMIDI', 'Synth'])
    .controller('WebSynthCtrl', ['$scope', 'Devices', 'DSP', function($scope, devices, DSP) {
        $scope.devices = [];
        $scope.analyser = null;
        $scope.players = ["p1", "p2"];//["me"] + otherClients;

        $scope.oscTypes = ['sine', 'square', 'triangle', 'sawtooth'];
        $scope.filterTypes = ['lowpass', 'highpass'];


        function numSetting(val, lowBound, upBound) {
            var value = val;
            var lowerBound = lowBound;
            var upperBound = upBound;

            this.__defineGetter__("value", function() {
                return value;
            });
            this.__defineSetter__("value", function(val) {
                val = parseFloat(val);
                if (val > upperBound) {
                    val = upperBound;
                } 
                if (val < lowerBound) {
                    val = lowerBound;
                }
                value = val;
                console.log(value);
                updateSynthParams($scope.synth);
            });
        };

        function strSetting(val, ran) {
            var value = val;
            var range = ran;

            this.__defineGetter__("value", function() {
                return value;
            });
            this.__defineSetter__("value", function(val) {
                if (range.indexOf(value) != -1) {
                    value = val;
                }
                console.log(value);
                updateSynthParams($scope.synth);
            });
        };
       
        function updateSynthParams(newParams) {
            var params = mySynthParams;
            console.log(mySynthIndex);
            console.log(params);
            console.log(newParams);

            mySynth.voices.forEach(function(synth) {
                switch(mySynthIndex) {
                case 0:
                    synth.oscillator.type = newParams.oscType.value;
                    synth.envelope.attack = newParams.attack.value;
                    synth.envelope.decay = newParams.decay.value;
                    synth.envelope.sustain = newParams.sustain.value;
                    synth.envelope.release = newParams.release.value;
                break;
                }
            });
         
            
            //mySynth.voices[0] = synth;
            console.log(params);
            mySynthParams = params
            //DSP.changeSynthParams(params);
        }

        $scope.synth = {
            oscType: new strSetting("sine", ['sine', 'square', 'triangle', 'sawtooth']),
            attack:  new numSetting(0.001,0,10),
            decay:   new numSetting(0    ,0,10),
            sustain: new numSetting(1    ,0,1),
            release: new numSetting(0.5  ,0,10),
            volume: new numSetting(0 ,-20,20)
        };

        devices
            .connect()
            .then(function(access) {
                if('function' === typeof access.inputs) {
                    // deprecated
                    $scope.devices = access.inputs();
                    console.error('Update your Chrome version!');
                } else {
                    if(access.inputs && access.inputs.size > 0) {
                        var inputs = access.inputs.values(),
                        input, device;

                        // iterate through the devices
                        for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                            $scope.devices.push(input.value);
                        }

                        // create the frequency analyser
                        $scope.analyser = DSP.createAnalyser('#analyser');
                    } else {
                        console.error('No devices detected!');
                    }

                }
            })
            .catch(function(e) {
                console.error(e);
            });

        // watchers
        $scope.$watch('activeDevice', DSP.plug);
        $scope.$watch('synth.oscType', DSP.setOscType);
        $scope.$watch('synth.filterOn', DSP.enableFilter);
        $scope.$watch('synth.changeSynth', DSP.changeSynth);
        $scope.$watch('synth.filterType', DSP.setFilterType);
        $scope.$watch('synth.filterFreq', DSP.setFilterFrequency);
        $scope.$watch('synth.filterRes', DSP.setFilterResonance);
        $scope.$watch('synth.attack', DSP.setAttack);
        $scope.$watch('synth.release', DSP.setRelease);
        //$scope.$watch('otherClients')
    }])
    .directive('player', function() {

        return {
            templateUrl: "html/player.html",
            scope: { playerName: "="},
            link: function(scope, attrs, el) {
                scope.waveform_value = 0;
                scope.test = function() {
                    console.log(scope.waveform_value)
                }
            }

        };
    });


angular
    .element(document)
    .ready(function() {
        angular.bootstrap(document.body, ['WebSynth']);
    })
