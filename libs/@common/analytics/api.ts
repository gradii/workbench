import { getProjectVersion } from './version';

export interface UserProperties {
  id?: string;
  appEnvironment?: string;
  fullName?: string;
}

export function logEvent(type: string, eventProperties?: any) {
  const props: LogGTMProperties = {
    event: Event.LOG_EVENT,
    eventCategory: EventCategory.APP_BAKERY,
    eventType: type,
    eventLabel: '',
    eventProperties: eventProperties || {}
  };

  // gtm(props);
}

export function setUserId(userProperties: UserProperties) {
  const userId: UserId = getUserId(userProperties.id);
  const props = {
    event: Event.SET_USER_ID,
    eventCategory: EventCategory.APP_BAKERY,
    userIdProperties: { ...userProperties, ...userId }
  };

  // Log user at gtm
  // gtm(props);

  // Sentry.setUser({ id: userId.id });
}

export function setEnvironment(appEnvironment: string) {
  const props: EnvGTMProperties = {
    event: Event.SET_ENVIRONMENT,
    eventCategory: EventCategory.APP_BAKERY,
    envProperties: {
      appEnvironment,
      appVersion: getProjectVersion()
    }
  };

  // gtm(props);
}

enum Event {
  LOG_EVENT = 'logEvent',
  SET_ENVIRONMENT = 'setEnvProperties',
  SET_USER_ID = 'setUserId',
}

enum EventCategory {
  APP_BAKERY = '[App] Bakery',
}

interface BaseGTMEvent {
  event: Event;
  eventCategory: EventCategory;
}

interface EnvGTMProperties extends BaseGTMEvent {
  envProperties: EnvEventProperties;
}

interface LogGTMProperties extends BaseGTMEvent {
  eventType: string;
  eventLabel: string;
  eventProperties: any;
}

interface EnvEventProperties {
  appEnvironment: string;
  appVersion: string;
}

interface UserId {
  id: string;
  emailPrefix: string;
  emailPostfix: string;
}

declare const dataLayer: any;

// function gtm(event: BaseGTMEvent) {
//   dataLayer.push({ eventProperties: undefined });
//   dataLayer.push(event);
// }

function getUserId(email: string): UserId {
  const [emailPrefix, emailPostfix] = email.split('@');
  return {
    id: `${emailPrefix}|${emailPostfix}`,
    emailPrefix,
    emailPostfix
  };
}
