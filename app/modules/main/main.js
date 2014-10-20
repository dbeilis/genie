chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'genie',
    innerBounds: {
    	height: 720,
    	width: 480,
    	minWidth: 460,
    	minHeight: 600
    },
    resizable: true,
    alwaysOnTop: true
  });
});


