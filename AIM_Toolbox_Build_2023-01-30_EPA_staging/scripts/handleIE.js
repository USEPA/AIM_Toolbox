function checkIfIE() {
    const isIE =
        navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0
            ? true
            : false;
    const browser = (function(agent) {
        switch (true) {
            case agent.indexOf("edge") > -1:
                return "MS Edge (EdgeHtml)";
            case agent.indexOf("edg") > -1:
                return "MS Edge Chromium";
            case agent.indexOf("opr") > -1 && !!window.opr:
                return "opera";
            case agent.indexOf("chrome") > -1 && !!window.chrome:
                return "chrome";
            case agent.indexOf("trident") > -1:
                return "Internet Explorer";
            case agent.indexOf("firefox") > -1:
                return "firefox";
            case agent.indexOf("safari") > -1:
                return "safari";
            default:
                return "other";
        }
    })(navigator.userAgent.toLowerCase());
    return isIE || browser !== "chrome";
}

function openEdge() {
    var version = parseFloat(
        window.navigator.appVersion
            .split("NT")[1]
            .split(";")[0]
            .trim()
    );
    if (typeof version === "number" && version !== NaN && version >= 10) {
        location.href = "microsoft-edge:" + window.location.href;
    }
}

function writeMessageToDocument() {
    document.body.innerHTML =
        '<div id="Main"><div class="ErrorWrapper"><div class="ie-error"><p>IE and Edge are not supported.&nbsp;  Please use Chrome.&nbsp;  (Firefox, Safari, etc. may work, but are not supported configurations.)</p></div></div>';
}

if (checkIfIE()) {
    writeMessageToDocument();
    // openEdge();
}
