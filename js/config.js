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
