chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'genie',
    innerBounds: {
    	height: 450,
    	width: 300,
    	minWidth: 300,
    	minHeight: 450
    },
    resizable: true
  });
});


