import { getDeepFromObject } from "@gradii/triangle/auth";

const VALIDATION_OPTIONS = {
  auth: {
    coupon: {
      maxLength: 20
    }
  },
  project: {
    name: {
      minLength: 4,
      maxLength: 250
    },
    description: {
      maxLength: 250
    }
  },
  profile: {
    name: {
      maxLength: 250
    },
    company: {
      maxLength: 250
    },
    role: {
      maxLength: 250
    }
  },
  theme: {
    name: {
      maxLength: 140
    }
  },
  account: {
    subscription: {
      cancelReasonMinLength: 10,
      upgradeReasonMinLength: 5
    }
  }
};

export function getConfigValue(key: string) {
  return getDeepFromObject(VALIDATION_OPTIONS, key, null);
}
