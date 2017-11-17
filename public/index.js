(function () {
    fetch('config.json').then(function (response) {
        return response.json();
    }).then(function (config) {
        var streamUrl = config.url;

        // build absolute url
        if (streamUrl.indexOf('http://') < 0 && streamUrl.indexOf('https://') < 0) {
            if (streamUrl.indexOf('/') === 0) {
                streamUrl = location.pathname + streamUrl;
            } else if (streamUrl.indexOf('/') === 1) {
                streamUrl = streamUrl.substr(1);
            }

            streamUrl = location.protocol
                + '//'
                + location.hostname
                + (location.port ? ':' + location.port : '')
                + '/'
                + streamUrl;
        }

        var parameters = {
            sources: [
                {
                    src: streamUrl,
                    type: 'application/x-mpegURL'
                }
            ],
            aspectRatio: "16:9",
            fluid: true,
            techOrder: ['html5', 'flash']
        };

        // Configure videojs
        var player = videojs('player', parameters);
        configurePlayer(player);
        player.play();
    });

    function configurePlayer(player) {
        const controlBar = player.getChild('ControlBar');
        const volume = controlBar.getChild('VolumePanel');
        const volumeIdx = controlBar.children().indexOf(volume);
        const muteButton = new MicMuteButton(player);
        const recordButton = new RecordButton(player);

        controlBar.addChild(muteButton, {}, volumeIdx + 1);
        controlBar.addChild(recordButton, {}, volumeIdx + 2);
    }

    const Button = videojs.getComponent('Button');

    class MicMuteButton extends Button {
        constructor(player) {
            super(player);
            
            this.addClass("vjs-mute-mic-control");
            this.controlText("Mute Microphone");
        }

        ready() {
            this.icon = this.$(".vjs-icon-placeholder");
            this.icon.classList.add("material-icons");
            this.setIconState(true);
        }

        setIconState(state) {
            this.state = state;
            this.setIcon();
        }

        toggleState() {
            this.setIconState(!this.state);            
        }

        setIcon() {
            if (this.state) {
                this.icon.classList.add("active");
            } else {
                this.icon.classList.remove("active");
            }
            this.icon.innerHTML = this.state
                ? "mic"
                : "mic_off";
        }

        handleClick(e) {
            this.toggleState();

            const req = {
                method: "POST",
                url: "/commands/" + (this.state ? "unmute" : "mute")
            }

            fetch(req.url, req).then(res => {
                res.json().then(data => {
                    console.log(data);
                });
            });
            
        }
    }

    class RecordButton extends Button {
        constructor(player) {
            super(player);
            
            this.addClass("vjs-record-control");
            this.controlText("Record Camera");
        }

        ready() {
            this.icon = this.$(".vjs-icon-placeholder");
            this.icon.classList.add("material-icons");
            this.icon.innerHTML = "fiber_manual_record";
            this.setIconState(false);
        }

        setIconState(state) {
            this.state = state;
            this.setIcon();
        }

        toggleState() {
            this.setIconState(!this.state);            
        }

        setIcon() {
            if (this.state) {
                this.icon.classList.add("active");
            } else {
                this.icon.classList.remove("active");
            }
        }

        handleClick(e) {
            this.toggleState();

            const req = {
                method: "POST",
                url: "/commands/" + (this.state ? "start_record" : "stop_record")
            }

            fetch(req.url, req).then(res => {
                res.json().then(data => {
                    console.log(data);
                });
            });
        }
    }
})();