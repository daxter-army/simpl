'use strict'

window.addEventListener("load", loadFunctions)

function loadFunctions() {
    // DOM NODES
    const VideoPlayer = document.getElementById('video-player')
    const VideoWrapper = document.getElementById('wrapper')
    const TitleBar = document.getElementById('title-bar-div')
    const ControlPanel = document.getElementById('control-panel-div')
    const TotalVideoTime = document.getElementById('total-video-time')
    const CurrVideoTime = document.getElementById('curr-video-time')
    const VideoSeekbarTotal = document.getElementById('video-seekbar-div')
    const VideoSeekProgressBar = document.getElementById('video-seek-progressbar')
    const PlayPauseControlBtn = document.getElementById('play-pause-button-div')
    const FullScreenControlBtn = document.getElementById('fullscreen-button-div')
    const CaptionsControlBtn = document.getElementById('captions-button-div')
    const CaptionsDiv = document.getElementById('captions-div')
    const LoadingImage = document.getElementById('loading-image')
    const VolumeRangerLogoDiv = document.getElementById('volume-range-icon-div')
    const IndicatorDiv = document.getElementById('indicator-div')

    let VideoFileName
    let VideoFileType
    let hideMouseSetTimeout
    let showCaptions = false
    let videoMute = false
    let volumeBeforeMute = 1.0

    let SKIP_TIME = 5
    let INDICATOR_ANIMATION_TIME_MS = 200
    let ACCENT_COLOR = '#f3ca20'

    // drag and drop
    VideoWrapper.addEventListener('dragover', (event) => {

        event.preventDefault()

        // console.log('dragging')
        LoadingImage.src = './files/images/file-video-solid.png'
        VideoWrapper.style.border = '3px var(--main-accent-color) solid'
    })

    // drag and drop
    VideoWrapper.addEventListener('dragleave', (event) => {

        event.preventDefault()

        LoadingImage.src = './files/images/simpl_logo.png'
        VideoWrapper.style.border = 'none'
        // console.log('why not dragging?')
    })

    VideoWrapper.addEventListener('drop', (event) => {
        event.preventDefault()

        VideoWrapper.style.border = 'none'

        let file = event.dataTransfer.files[0]
        VideoFileName = file.name
        VideoFileType = file.type

        VideoPlayer.src = URL.createObjectURL(file)
    })

    //* MAIN FUNCTION 
    VideoPlayer.addEventListener('loadeddata', () => {
        // set video time duration
        TitleBar.innerText = VideoFileName

        // set total duration of the video
        setVideoDuration()

        // give power to all the control buttons
        givePowerToVideoControllers()

        // time initial overlay
        showAndHideOverlayInitially()

        // show controls on mouse hover
        showControlsOnHover()

        // attach keyboard listeners
        attachKeyboardListeners()

        // attach the subtitles
        // attachSubtitles()
    })

    // VideoPlayer.onplay = function() {
    //     PlayPauseControlBtn.innerHTML = '<i id="control-panel-play-button-logo" class="fas fa-pause"></i>'
    // }


    VideoPlayer.ontimeupdate = function() {
        let rawCurrVideoTime = this.currentTime
        let currVideoTime = rawCurrVideoTime/this.duration * 100
        VideoSeekProgressBar.style.width= `${currVideoTime}%`

        // setting current time in the video UI
        let totalSeconds = rawCurrVideoTime.toFixed(0)
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds - minutes * 60
        let hours = 0

        if (minutes > 60) {
            hours = Math.floor(minutes / 60)
            minutes = minutes - hours*60
            hours < 10 ? hours = '0' + hours : hours = hours
        }
        
        if (seconds < 10) {
            seconds = '0' + seconds
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        
        CurrVideoTime.innerText = hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
    }
    
    function givePowerToVideoControllers() {
        VideoSeekbarTotal.addEventListener('click', jumpSeekbar)
        VideoPlayer.addEventListener('click', playPauseVideo)
        PlayPauseControlBtn.addEventListener('click', playPauseVideo)
        FullScreenControlBtn.addEventListener('click', toggleFullscreen)
        CaptionsControlBtn.addEventListener('click', toggleCaptions)
    }

    //! TODO
    // function attachSubtitles() {
    //     // hiding any default attached subtitles
    //     for (var i = 0; i < VideoPlayer.textTracks.length; i++) {
    //         VideoPlayer.textTracks[i].mode = 'hidden';
    //      }
    // }

    function attachKeyboardListeners() {
        document.onkeydown = function(event) {
            switch(event.keyCode) {
                case 37:
                    // skip to previous 5 seconds
                    toPrevSeconds(SKIP_TIME)
                    break
                case 38:
                    // increase volume
                    increaseVolume()
                    break
                case 39:
                    // skip to next 5 seconds
                    toNextSeconds(SKIP_TIME)
                    break
                case 40:
                    // decrease volume
                    decreaseVolume()
                    break
                case 32:
                    // play/pause video
                    playPauseVideo()
                    break
                case 70:
                    // toggle fullscreen
                    toggleFullscreen()
                    break
                case 77:
                    // toggle volume of the video
                    toggleMute()
                    break
                case 86:
                    // toggle captions of the video
                    toggleCaptions()
                    break
                case 67:
                    // open/close settings panel
                    toggleSettings()
                    break
                case 107:
                    // increase video speed by 0.25x
                    increaseSpeed()
                    break
                case 109:
                    // decrease video speed by 0.25x
                    decreaseSpeed()
                    break
            }
        }
    }

    function glowIndicator(indication, color = '#ffffff') {
        IndicatorDiv.style.display = 'flex'
        IndicatorDiv.style.color = color

        if(typeof(indication) === 'number') {
            IndicatorDiv.style.fontSize = 'medium'
            IndicatorDiv.innerHTML = `<p>${indication}x</p>`
        }
        else {
            IndicatorDiv.style.fontSize = 'xx-large'
            IndicatorDiv.innerHTML = `<i class="${indication}"></i>`
        }

        setTimeout(() => {
            IndicatorDiv.style.display = 'none'
        }, INDICATOR_ANIMATION_TIME_MS)
    }

    function increaseVolume(){
        let videoVolume = VideoPlayer.volume
    
        if(videoVolume <= 0.9) {
            videoVolume = videoVolume + 0.1
            videoVolume = videoVolume.toFixed(1)
            VideoPlayer.volume = videoVolume
            console.log(videoVolume)

            if(videoVolume == 1.0) {
                VolumeRangerLogoDiv.innerHTML = '<i class="fas fa-volume-up"></i>'
                glowIndicator('fas fa-volume-up', ACCENT_COLOR)
            }
            else {
                VolumeRangerLogoDiv.className = '<i class="fas fa-volume-down"></i>'
                glowIndicator('fas fa-volume-up')
            }
        }
        else {
            glowIndicator('fas fa-volume-up', ACCENT_COLOR)
        }

        console.log(VideoPlayer.volume)
    }

    function decreaseVolume() {
        let videoVolume = VideoPlayer.volume
                
        if(videoVolume >= 0.1) {
            videoVolume = videoVolume - 0.1
            videoVolume = videoVolume.toFixed(1)
            VideoPlayer.volume = videoVolume
            console.log(videoVolume)

            if(videoVolume == 0.0) {
                VolumeRangerLogoDiv.innerHTML = '<i class="fas fa-volume-off"></i>'
                glowIndicator('fas fa-volume-off')
            }
            else {
                VolumeRangerLogoDiv.innerHTML = '<i class="fas fa-volume-down"></i>'
                glowIndicator('fas fa-volume-down')
            }
        }
        else {
            glowIndicator('fas fa-volume-off')
        }
    }

    function increaseSpeed() {
        // MAX_SPEED = 2
        // MIN_SPEED = 0.25

        let videoSpeed = VideoPlayer.playbackRate

        if(videoSpeed <= 1.75) {
            videoSpeed = videoSpeed + 0.25
        }

        VideoPlayer.playbackRate = videoSpeed
        glowIndicator(videoSpeed)
    }

    function decreaseSpeed() {
        // MAX_SPEED = 2
        // MIN_SPEED = 0.25

        let videoSpeed = VideoPlayer.playbackRate

        if(videoSpeed >= 0.5) {
            videoSpeed = videoSpeed - 0.25
        }

        VideoPlayer.playbackRate = videoSpeed
        glowIndicator(videoSpeed)
    }

    function toPrevSeconds(skipTime) {
        VideoPlayer.currentTime = VideoPlayer.currentTime - skipTime
        glowIndicator('fas fa-chevron-left')
    }

    function toNextSeconds(skipTime) {
        VideoPlayer.currentTime = VideoPlayer.currentTime + skipTime
        glowIndicator('fas fa-chevron-right')
    }

    function playPauseVideo() {
        // event.stopPropagation()

        if (VideoPlayer.paused) {
            VideoPlayer.play()
            glowIndicator('fas fa-play')
            PlayPauseControlBtn.innerHTML = '<i id="control-panel-play-button-logo" class="fas fa-pause"></i>'
        }
        else {
            VideoPlayer.pause()
            glowIndicator('fas fa-pause')
            PlayPauseControlBtn.innerHTML = '<i id="control-panel-play-button-logo" class="fas fa-play"></i>'
        }
    }

    function showControlsOnHover() {
        document.addEventListener('mousemove', () => {
            TitleBar.style.display = 'block'
            ControlPanel.style.display = 'block'
            VideoPlayer.style.cursor = 'default'
            CaptionsDiv.style.bottom = '60px'
            
            clearTimeout(hideMouseSetTimeout)
            
            hideMouseSetTimeout = setTimeout(() => {
                TitleBar.style.display = 'none'
                ControlPanel.style.display = 'none'
                VideoPlayer.style.cursor = 'none'
                CaptionsDiv.style.bottom = '20px'
            }, 3000)
        })
    }

    function jumpSeekbar(event) {
        const clickedSeekPercent = event.pageX / window.innerWidth
        const estimatedVideoSeek = clickedSeekPercent * VideoPlayer.duration
        VideoPlayer.currentTime = estimatedVideoSeek
    }

    function setVideoDuration() {
        const totalSeconds = VideoPlayer.duration.toFixed(0)
        let minutes = Math.floor(totalSeconds/ 60)
        let seconds = totalSeconds - minutes * 60
        let hours = 0

        if (seconds < 10) {
            seconds = '0' + seconds
        }
        if(minutes > 60) {
            hours = Math.floor(minutes / 60)
            minutes = minutes - hours * 60
            hours < 10 ? hours = '0' + hours : hours = hours
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }

        TotalVideoTime.innerText = hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
    }

    function showAndHideOverlayInitially() {
        TitleBar.style.display = 'block'
        ControlPanel.style.display = 'block'
        CaptionsDiv.style.bottom = '60px'

        setTimeout(() => {
            TitleBar.style.display = 'none'
            ControlPanel.style.display = 'none'
            CaptionsDiv.style.bottom = '20px'
        }, 3000)
    }

    function toggleCaptions() {
        console.log('toggleCaptions')
        if(showCaptions) {
            CaptionsDiv.style.display = 'none'
            // CaptionsDiv.style.bottom = '0px'
            CaptionsControlBtn.innerHTML = '<i class="far fa-closed-captioning"></i>'
            showCaptions = false
        }
        else {
            CaptionsDiv.style.display = 'block'
            // CaptionsDiv.style.bottom = '75px'
            CaptionsControlBtn.innerHTML = '<i class="fas fa-closed-captioning"></i>'
            showCaptions = true
        }
    }

    function toggleFullscreen() {
        if(!document.fullscreenElement) {
            VideoWrapper.requestFullscreen()
            glowIndicator('fas fa-expand')
            FullScreenControlBtn.innerHTML = '<i class="fas fa-compress"></i>'
        }
        else {
            document.exitFullscreen()
            glowIndicator('fas fa-compress')
            FullScreenControlBtn.innerHTML = '<i class="fas fa-expand"></i>'
        }
    }

    function toggleMute() {
        if(videoMute) {
            VideoPlayer.volume = volumeBeforeMute
            VolumeRangerLogoDiv.style.color = 'white'

            if(volumeBeforeMute == 0.0) {
                VolumeRangerLogoDiv.innerHTML = '<i class="fas fa-volume-off"></i>'
                glowIndicator('fas fa-volume-off')
            }
            else if(volumeBeforeMute == 1.0) {
                VolumeRangerLogoDiv.innerHTML = '<i class="fas fa-volume-up"></i>'
                glowIndicator('fas fa-volume-up', ACCENT_COLOR)
            }
            else {
                VolumeRangerLogoDiv.innerHTML = '<i class="fas fa-volume-down"></i>'
                glowIndicator('fas fa-volume-down')
            }

            videoMute = false
        }
        else {
            volumeBeforeMute = VideoPlayer.volume
            VideoPlayer.volume = 0.0
            VolumeRangerLogoDiv.innerHTML = '<i class="fas fa-volume-mute"></i>'
            VolumeRangerLogoDiv.style.color = 'tomato'
            glowIndicator('fas fa-volume-mute', 'tomato')
            videoMute = true
        }

        console.log(VideoPlayer.volume)
    }

    function toggleSettings() {
        console.log('toggle settings')
    }
}