require("../vendor/jquery-1.11.0.min.js");
require("../vendor/jquery.finger.min.js");
require("../vendor/tooltipster.bundle.min.js");

require("./modules/app.js");
require("./modules/app-ui.js");
require("./modules/index-ui.js");

$(function () { app.init(); });
