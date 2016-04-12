/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("xbmcip.html", {
    id: 'mainWindow',
    innerBounds: { width: 1024, height: 768, minWidth: 1024, minHeight: 768 }
  });
});

/*window.addEventListener("DOMContentLoaded", function() {
    sandboxWin = window.open("script/jquery.carlos.js","SANDBOXED!","width=1024, height=827");       
});*/