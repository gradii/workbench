
/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * R_开头的权限码是路由权限
 */
export class PermissionCode {
  // 系统设置, 拥有此权限,则可以操作所有的设置项页面及api
  static R_SYSTEM_SETTINGS = 'R_SYSTEM_SETTINGS';
  static API_SYSTEM_SETTINGS_MEMBER_LIST = 'API_SYSTEM_SETTINGS_MEMBER_LIST';
  static API_SYSTEM_SETTINGS_MEMBER_ROLE = 'API_SYSTEM_SETTINGS_MEMBER_ROLE';
  static API_SYSTEM_SETTINGS_PERMISSION_CODE_LIST = 'API_SYSTEM_SETTINGS_PERMISSION_CODE_LIST';
  static API_SYSTEM_SETTINGS_CONFIG_PERMISSION_ROLE_CODE = 'API_SYSTEM_SETTINGS_CONFIG_PERMISSION_ROLE_CODE';
  static API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_LIST = 'API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_LIST';
  static API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_MODIFY = 'API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_MODIFY';
  static API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_ADD = 'API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_ADD';
  static API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_DELETE = 'API_SYSTEM_SETTINGS_CONFIG_ROLE_ROLE_DELETE';
  static API_SYSTEM_SETTINGS_CONFIG_PERMISSION_PERMISSION_CODE_IMPORT = 'API_SYSTEM_SETTINGS_CONFIG_PERMISSION_PERMISSION_CODE_IMPORT';

  static R_SYSTEM_SETTINGS_CONFIG_MEMBER = 'R_SYSTEM_SETTINGS_CONFIG_MEMBER';
  static R_SYSTEM_SETTINGS_CONFIG_MEMBER_PERMISSION_CODE = 'R_SYSTEM_SETTINGS_CONFIG_MEMBER_PERMISSION_CODE';
  static R_SYSTEM_SETTINGS_CONFIG_PERMISSION_ROLE = 'R_SYSTEM_SETTINGS_CONFIG_PERMISSION_ROLE';

  static API_AUTH_REGISTER = 'API_AUTH_REGISTER';

  // 开发工具路由权限, 拥有此路由权限则可访问所有子路由
  static R_PLAYGROUND = 'R_PLAYGROUND';
  // csv 开发工具
  static R_PLAYGROUND_PLAY_CSV = 'R_PLAYGROUND_PLAY_CSV';
  // data table 开发工具
  static R_PLAYGROUND_PLAY_DATA_TABLE = 'R_PLAYGROUND_PLAY_DATA_TABLE';
  static R_PLAYGROUND_PLAY_JSON = 'R_PLAYGROUND_PLAY_JSON';
  static R_PLAYGROUND_PLAY_API = 'R_PLAYGROUND_PLAY_API';
  static R_PLAYGROUND_PLAY_API_ACTION = 'R_PLAYGROUND_PLAY_API_ACTION';
  static R_PLAYGROUND_PLAY_API_WORKFLOW = 'R_PLAYGROUND_PLAY_API_WORKFLOW';

  // 拥有此权限码, 可访问所有V1页面及API
  static R_V1 = 'R_V1';

  // static R_V1_DCS = 'R_V1_DCS';

  static R_V1_USER_ANALYSIS = 'R_V1_USER_ANALYSIS';

  static R_V1_DIAGNOSIS = 'R_V1_DIAGNOSIS';
  static API_V1_DIAGNOSIS = 'API_V1_DIAGNOSIS';


  // 拥有此权限码, 可访问所有流量回放页面及api
  static R_V1_REPLAY = 'R_V1_REPLAY';
  static R_V1_REPLAY_CREATE_TASK = 'R_V1_REPLAY_CREATE_TASK';
  static R_V1_REPLAY_TASK_LIST = 'R_V1_REPLAY_TASK_LIST';
  static API_V1_REPLAY_TASK_LIST = 'API_V1_REPLAY_TASK_LIST';
  static API_V1_REPLAY_CREATE_TASK = 'API_V1_REPLAY_CREATE_TASK';
  static API_V1_REPLAY_MODIFY_TASK = 'API_V1_REPLAY_MODIFY_TASK';
  static API_V1_REPLAY_TASK_DELETE = 'API_V1_REPLAY_TASK_DELETE';
  static API_V1_REPLAY_TASK_LOG_QUERY = 'API_V1_REPLAY_TASK_LOG_QUERY';

  // 拥有此权限码, 可访问所有EXCEL页面及api
  static R_V1_EXCEL = 'R_V1_EXCEL';
  static API_V1_EXCEL_INFO = 'API_V1_EXCEL_INFO';
  static API_V1_EXCEL_DOWNLOAD = 'API_V1_EXCEL_DOWNLOAD';
  static API_V1_EXCEL_CONTENT = 'API_V1_EXCEL_CONTENT';
  static API_V1_EXCEL_UPLOAD = 'API_V1_EXCEL_UPLOAD';

  // 拥有此权限码, 可访问所有视频推荐页面及api
  static R_V1_VIDEO = 'R_V1_VIDEO';
  static R_V1_VIDEO_DCS = 'R_V1_VIDEO_DCS';
  static R_V1_VIDEO_FIND_IDEAS = 'R_V1_VIDEO_FIND_IDEAS';
  static API_V1_VIDEO_FIND_IDEAS = 'API_V1_VIDEO_FIND_IDEAS';
  static API_V1_VIDEO_FIND_IDEAS_LOG = 'API_V1_VIDEO_FIND_IDEAS_LOG';
  static API_V1_VIDEO_FIND_IDEAS_DEVICE_USER_ADD = 'API_V1_VIDEO_FIND_IDEAS_DEVICE_USER_ADD';
  static API_V1_VIDEO_FIND_IDEAS_DEVICE_USER_EDIT = 'API_V1_VIDEO_FIND_IDEAS_DEVICE_USER_EDIT';
  static API_V1_VIDEO_FIND_IDEAS_DEVICE_USER_LIST = 'API_V1_VIDEO_FIND_IDEAS_DEVICE_USER_LIST';

  // 拥有此权限码, 可访问所有音乐推荐页面及api
  static R_V1_MUSIC = 'R_V1_MUSIC';
  static R_V1_MUSIC_DCS = 'R_V1_MUSIC_DCS';

  static R_V1_INFORMATION = 'R_V1_INFORMATION';

  static R_V1_ADS = 'R_V1_ADS';

  static R_V1_TOPIC = 'R_V1_TOPIC';


  static R_WORKFLOW = 'R_WORKFLOW';
  static API_V1_WORKFLOW = 'API_V1_WORKFLOW';
  static API_V1_WORKFLOW_PROJECT = 'API_V1_WORKFLOW_PROJECT';
  static API_V1_WORKFLOW_PROJECT_UPDATE_MODEL = 'API_V1_WORKFLOW_PROJECT_UPDATE_MODEL';


  static R_WORKBENCH = 'R_WORKBENCH';
  static API_V1_WORKBENCH_TEMPLATE = 'API_V1_WORKBENCH_TEMPLATE';
  static API_V1_WORKBENCH_PROJECT_INFO = 'API_V1_WORKBENCH_PROJECT_INFO';
  static API_V1_WORKBENCH_PROJECT_LIST = 'API_V1_WORKBENCH_PROJECT_LIST';
  static API_V1_WORKBENCH_PROJECT_CREATE = 'API_V1_WORKBENCH_PROJECT_CREATE';
  static API_V1_WORKBENCH_PROJECT_DELETE = 'API_V1_WORKBENCH_PROJECT_DELETE';
  static API_V1_WORKBENCH_PROJECT_THEME = 'API_V1_WORKBENCH_PROJECT_THEME';
  static API_V1_WORKFLOW_PROJECT_THUMBNAIL = 'API_V1_WORKFLOW_PROJECT_THUMBNAIL';

}