const DOWNLOAD_URL = "https://dl.syamxm.com/c-aegis-v3.0.0.apk";

const SHOTS_DIR = "./assets/screenshots_latest";

const SHOT_GROUPS = [
  {
    key: "auth", label: "Get Started", files: [
      "login.jpeg", "signupCredentials.jpeg", "signupRoleSelection.jpeg", "signupOtpVerification.jpeg",
    ]
  },
  {
    key: "parent", label: "For Parents", files: [
      "parent_home.jpeg", "parent_radarActivity.jpeg", "parent_activityLogs.jpeg", "parent_digitalWellbeingSpace.jpeg",
      "parent_myChildren.jpeg", "parent_childStatus.jpeg", "parent_addChild.jpeg", "parent_pendingRequests.jpeg",
      "parent_navDrawer.jpeg", "parent_accountSection.jpeg",
    ]
  },
  {
    key: "child", label: "For Children", files: [
      "child_home.jpeg", "child_digitalWellbeingSpace.jpeg", "child_myParent.jpeg", "child_requestInbox.jpeg",
      "child_navDrawer.jpeg", "child_accountSection.jpeg",
    ]
  },
];

const SHOT_DEFAULT = "parent";

const DEMOS_DIR = "./assets/c-aegis_demo";

const DEMO_GROUPS = [
  {
    key: "parent", label: "Parent demos", clips: [
      { file: "add_child.mp4", title: "Link a child", desc: "Sending a secure link request to a child account.", dur: "0:22" },
      { file: "geofence.mp4", title: "Geofence alerts", desc: "Drawing a safe zone on the map and receiving the breach alert.", dur: "0:20" },
      { file: "offline_trimmed.mp4", title: "Offline caching", desc: "Locations cache while offline and sync on reconnect.", dur: "0:20" },
      { file: "logout_too_many_attempts_tamper.mp4", title: "PIN tamper alert", desc: "Repeated failed PIN attempts trigger a tamper alert.", dur: "0:47" },
      { file: "remove_device_admin_uninstall_tamper.mp4", title: "Uninstall protection", desc: "Device Admin revocation and uninstall attempts are detected and alerted.", dur: "0:16" },
    ]
  },
  {
    key: "child", label: "Child demos", clips: [
      { file: "terms_and_conditions_onboarding_process.mp4", title: "Consent gate", desc: "The child reviews and agrees before any monitoring begins.", dur: "0:29" },
      { file: "accept_request.mp4", title: "Accept the link", desc: "The child accepting the parent's link request.", dur: "0:08" },
      { file: "blocked_overlay.mp4", title: "App limit overlay", desc: "The full-screen block after a daily app limit is reached.", dur: "0:15" },
      { file: "admin_device_temper.mp4", title: "Tamper resistance setup", desc: "Setting up the PIN and device-admin permissions.", dur: "0:17" },
    ]
  },
];

const DEMO_DEFAULT = "parent";
