chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'genie',
    innerBounds: {
    	height: 720,
    	width: 500,
    	minWidth: 460,
    	minHeight: 700
    },
    resizable: true,
    alwaysOnTop: true
  });
});


