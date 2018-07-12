(function () {

    var _callBack, screenShotStream;

    function startScreenStreamFrom(streamId, canRequestAudioTrack) {
        var config = {};
        config['audio'] = {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId
            }
        };
        config['video'] = {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
                maxWidth: window.screen.width,
                maxHeight: window.screen.height
            }
        };
        !canRequestAudioTrack && (config['audio'] = false);
        navigator.mediaDevices.getUserMedia(config).then(function (stream) {
            screenShotStream = stream;
            _callBack(true, stream);
        }).catch(function (err) {
            console.error(err);
            _callBack(false, null);
        });
    }

    function initChrome() {
        // listen for messages from the content-script
        window.addEventListener('message', function (event) {
            var origin = event.origin, type = event.data.type, streamId = event.data.streamId,
                canRequestAudioTrack = event.data.canRequestAudioTrack;

            // NOTE: you should discard foreign events
            if (origin !== window.location.origin) {
                console.warn(
                    'ScreenStream: you should discard foreign event from origin:',
                    origin
                );
                // return;
            }

            // content-script will send a 'SS_PING' msg if extension is installed
            if (type === 'SS_PING') {
                window.CaptureClient.extensionInstalled = true;
            }

            // user chose a stream
            if (type === 'SS_DIALOG_SUCCESS') {
                startScreenStreamFrom(streamId, canRequestAudioTrack);
            }

            // user clicked on 'cancel' in choose media dialog
            if (type === 'SS_DIALOG_CANCEL') {
                console.log('User cancelled!');
            }
        });
    }


    function getBrowser() {
        var ua = window.navigator.userAgent;
        var isIE = window.ActiveXObject != undefined && ua.indexOf("MSIE") != -1;
        var isFirefox = ua.indexOf("Firefox") != -1;
        var isOpera = window.opr != undefined;
        var isChrome = ua.indexOf("Chrome") && window.chrome;
        var isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1;
        if (isIE) {
            return "IE";
        } else if (isFirefox) {
            return "Firefox";
        } else if (isOpera) {
            return "Opera";
        } else if (isChrome) {
            return "Chrome";
        } else if (isSafari) {
            return "Safari";
        } else {
            return "Unkown";
        }
    }


    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    function startChrome() {
        if (!window.CaptureClient.extensionInstalled) {
            this.logger.error('zc.b.ss Please install the extension:1. Go to chrome://extensions  ' +
                '2. Check: "Enable Developer mode   3. Click: "Load the unpacked extension... 4. ' +
                'Choose "extension" folder from the repository 5. Reload this page'
            );
            return false;
        } else {
            window.postMessage({type: 'SS_UI_REQUEST', text: 'start'}, '*');
        }
    }

    function startFirfox(mediaSource) {
        var config = {
            video: {}
        };
        config.video['mediaSource'] = mediaSource;


        navigator.mediaDevices.getUserMedia(config).then(function (stream) {
            screenShotStream = stream;
            _callBack(true, stream);
        }).catch(function (err) {
            console.logger.error(err);
            _callBack(false, null);
        });
    }

    function start(mediasource, callBack) {
        _callBack = callBack;
        if (getBrowser() === 'Firefox') {
            startFirfox(mediasource)
        } else if (getBrowser() === 'Chrome') {
            startChrome();
        } else {
            console.warn('暂不支持火狐，google以外的浏览器')
        }
    }

    function stop() {
        screenShotStream && screenShotStream.getTracks().forEach(track => {
            track.stop();
        });
        window.CaptureClient.extensionInstalled && window.postMessage({type: 'SS_UI_CANCEL', text: 'start'}, '*');
    }

    if (IsPC()) {
        if (getBrowser() === 'Firefox') {

        } else if (getBrowser() === 'Chrome') {
            initChrome();
        } else {
            console.warn('暂不支持火狐，google以外的浏览器')
        }
    } else {
        console.warn('暂不支持非pc端');
    }

    window.CaptureClient = {
        getBrowser: getBrowser,
        IsPC: IsPC,
        extensionInstalled: false,
        start: start,
        stop: stop
    }

})();