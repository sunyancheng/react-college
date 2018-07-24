import * as WebUtil from './webutil.js';
import RFB from '@novnc/novnc/core/rfb.js';

export default (params) => {
    var rfb;
    var desktopName;
    function updateDesktopName(e) {
        desktopName = e.detail.name;
    }
    function credentials() {
        var form = document.createElement('form');
        form.innerHTML = '<label></label>';
        form.innerHTML += '<input type=password size=10 id="password_input">';
        form.onsubmit = setPassword;
        document.getElementById('noVNC_status_bar').setAttribute("class", "noVNC_status_warn");
        document.getElementById('noVNC_status').innerHTML = '';
        document.getElementById('noVNC_status').appendChild(form);
        document.getElementById('noVNC_status').querySelector('label').textContent = 'Password Required: ';
    }
    function setPassword() {
        rfb.sendCredentials({ password: document.getElementById('password_input').value });
        return false;
    }
    function sendCtrlAltDel() {
        rfb.sendCtrlAltDel();
        document.querySelector('canvas').focus();
        return false;
    }
    function machineShutdown() {
        rfb.machineShutdown();
        return false;
    }
    function machineReboot() {
        rfb.machineReboot();
        return false;
    }
    function machineReset() {
        rfb.machineReset();
        return false;
    }
    function status(text, level) {
      switch (level) {
          case 'normal':
          case 'warn':
          case 'error':
              break;
          default:
              level = "warn";
      }
      document.getElementById('noVNC_status_bar').className = "noVNC_status_" + level;
      document.getElementById('noVNC_status').textContent = text;
    }

    function connected() {
      document.getElementById('sendCtrlAltDelButton').disabled = false;
      if (WebUtil.getConfigVar('encrypt',
                                (window.location.protocol === "https:"))) {
          status("Connected (encrypted) to " + desktopName, "normal");
      } else {
          status("Connected (unencrypted) to " + desktopName, "normal");
      }
    }

    function disconnected(e) {
      document.getElementById('sendCtrlAltDelButton').disabled = true;
      updatePowerButtons();
      if (e.detail.clean) {
          status("Disconnected", "normal");
      } else {
          status("Something went wrong, connection is closed", "error");
      }
    }

    function updatePowerButtons() {
      var powerbuttons;
      powerbuttons = document.getElementById('noVNC_power_buttons');
      if (rfb.capabilities.power) {
          powerbuttons.className= "noVNC_shown";
      } else {
          powerbuttons.className = "noVNC_hidden";
      }
    }

    document.getElementById('sendCtrlAltDelButton').onclick = sendCtrlAltDel;
    document.getElementById('machineShutdownButton').onclick = machineShutdown;
    document.getElementById('machineRebootButton').onclick = machineReboot;
    document.getElementById('machineResetButton').onclick = machineReset;

    WebUtil.init_logging(WebUtil.getConfigVar('logging', 'warn'));
    var { host, port, token } = params
    document.title = WebUtil.getConfigVar('title', host);
    // set manually
    if (!port) {
        if (window.location.protocol.substring(0,5) == 'https') {
            port = 443;
        }
        else if (window.location.protocol.substring(0,4) == 'http') {
            port = 80;
        }
    }

    var password = WebUtil.getConfigVar('password', '');
    var path = WebUtil.getConfigVar('path', 'websockify');

    // If a token variable is passed in, set the parameter in a cookie.
    // This is used by nova-novncproxy.
    // var token = WebUtil.getConfigVar('token', null);
    if (token) {
        // if token is already present in the path we should use it
        path = WebUtil.injectParamIfMissing(path, "token", token);

        WebUtil.createCookie('token', token, 1)
    }

    (function() {

        status("Connecting", "normal");

        if ((!host) || (!port)) {
            status('Must specify host and port in URL', 'error');
        }

        var url = 'wss';
        url += '://' + host;
        if(port) {
            url += ':' + port;
        }
        url += '/' + path;
        rfb = new RFB(document.querySelector('#app'), url,
                      { repeaterID: WebUtil.getConfigVar('repeaterID', ''),
                        shared: WebUtil.getConfigVar('shared', true),
                        credentials: { password: password } });
        rfb.viewOnly = WebUtil.getConfigVar('view_only', false);
        rfb.addEventListener("connect",  connected);
        rfb.addEventListener("disconnect", disconnected);
        rfb.addEventListener("capabilities", function () { updatePowerButtons(); });
        rfb.addEventListener("credentialsrequired", credentials);
        rfb.addEventListener("desktopname", updateDesktopName);
        rfb.scaleViewport = true;
        var timer = setTimeout(()=>{
            //手动给vnc添加focus
            document.querySelector('canvas').focus()
            clearTimeout(timer)
        }, 0)

        // rfb.resizeSession = true;
        // rfb.supportsContinuousUpdates = true
        // rfb.enabledContinuousUpdates = true
        // rfb.supportsSetDesktopSize = true;
        // rfb.supportsFence = true
        // rfb.qemuExtKeyEventSupported = true
        // rfb.flushing = true
        // rfb.clipViewport = true
    })();
}