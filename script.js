// ====================================================
    // A. REGISTER CUSTOM WATERMARK COMPONENT
    // ====================================================
    const Component = videojs.getComponent('Component');

    class CustomWatermark extends Component {
      constructor(player, options) {
        super(player, options);
      }
      createEl() {
        return videojs.dom.createEl('a', {
          className: 'vjs-custom-watermark',
          href: this.options_.url || '#',
          target: '_blank',
          innerHTML: this.options_.text || 'MY BRAND'
        });
      }
    }
    videojs.registerComponent('CustomWatermark', CustomWatermark);

    // ====================================================
    // B. REGISTER CUSTOM CONTROL BAR BUTTON
    // ====================================================
    const Button = videojs.getComponent('Button');

    class CustomActionButton extends Button {
      constructor(player, options) {
        super(player, options);
        this.controlText('Bookmark Timestamp');
      }
      buildCSSClass() {
        return `vjs-custom-action-btn ${super.buildCSSClass()}`;
      }
      handleClick() {
        const currentSec = Math.floor(this.player().currentTime());
        alert(`Bookmarked video at ${currentSec} seconds!`);
      }
    }
    videojs.registerComponent('CustomActionButton', CustomActionButton);

    // ====================================================
    // C. INITIALIZE VIDEO.JS PLAYER
    // ====================================================
    const player = videojs('my-youtube-player', {
      techOrder: ['youtube'],
      controls: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        // Built-in 10-second rewind & forward buttons (Video.js 8.2+)
        skipButtons: {
          backward: 10,
          forward: 10
        },
        volumePanel: {
          inline: false // Vertical pop-up volume slider
        },
        pictureInPictureToggle: false,
        remainingTimeDisplay: false
      },
      sources: [{
        type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=haXpHV5-rEQ' // Replace with your YouTube URL
    
      }],
      youtube: {
        ytControls: 0,      // Hide YouTube native controls
        rel: 0,             // Restrict related videos
        iv_load_policy: 3,  // Hide annotations
        disablekb: 1,      // Disable YouTube keyboard shortcuts

      }
    });

    // ====================================================
    // D. ATTACH CUSTOM COMPONENTS & EVENT LISTENERS
    // ====================================================
    player.ready(function() {
      // 1. Add floating corner watermark
      player.addChild('CustomWatermark', {
        text: '★ PRO PLAYER',
        url: 'https://example.com'
      });

      // 2. Add custom star button to the right side of the control bar
      // Placing it right before the Fullscreen button
      const fullscreenIdx = player.controlBar.children().findIndex(
        c => c.name() === 'FullscreenToggle'
      );
      player.controlBar.addChild('CustomActionButton', {}, fullscreenIdx);
    });


    player.ready(function() {
    const curtain = player.addChild('EndCurtain');

    player.on('timeupdate', function() {
        const duration = player.duration();
        const currentTime = player.currentTime();

        if (duration > 0 && (duration - currentTime) <= 20 && !hasEndedHandled) {
        hasEndedHandled = true;
        player.pause();
        player.currentTime(0);

        curtain.show();
        if (player.bigPlayButton) player.bigPlayButton.show();
        }
    });

    player.on('play', function() {
        hasEndedHandled = false;
        curtain.hide();
    });
    });


    // 3. Prevent YouTube End-Screen Recommendations when video finishes
    player.on('ended', function() {
      player.currentTime(0);
      player.pause();
      player.posterImage.show();
      player.bigPlayButton.show();
    });