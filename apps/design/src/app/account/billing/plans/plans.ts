import { Plan } from '@account-state/billing/billing.service';

export interface AvailablePlan {
  billingPeriod: 'monthly' | 'annually';
  image: {
    small: string;
    big?: string;
  };
  title: string;
  price: number;
  discountResistant?: boolean;
  annuallyPrice?: number;
  priceBeforeDiscount?: number;
  features: string[];
  available: boolean;
  plan: Plan;
  link?: string;
}

export const PLANS_MONTHLY: AvailablePlan[] = [
  {
    billingPeriod: 'monthly',
    image: {
      small: 'assets/plans/template-small.png',
      big: 'assets/plans/template-big.png'
    },
    title: 'Template maker',
    price: 15,
    features: [
      '6 applications',
      'Unlimited pages',
      'Unlimited components & widgets',
      'Branding',
      'App & dashboard templates',
      'Dark theme',
      'Sharing the app',
      'Data connection',
      'Export frontend',
      'Email support'
    ],
    available: true,
    plan: Plan.TEMPLATE_MONTHLY
  },
  {
    billingPeriod: 'monthly',
    image: {
      small: 'assets/plans/light-small.png',
      big: 'assets/plans/light-big.png'
    },
    title: 'Frontend maker',
    price: 39,
    features: [
      'Unlimited applications',
      'Unlimited components & widgets',
      'Branding',
      'App & dashboard templates',
      'Unlimited themes',
      'Sharing the app',
      'Data connection',
      'Export frontend',
      'Email support'
    ],
    available: true,
    plan: Plan.LIGHT_MONTHLY
  },
  {
    billingPeriod: 'monthly',
    image: {
      small: 'assets/plans/standard-small.png',
      big: 'assets/plans/standard-big.png'
    },
    title: 'Web App maker',
    price: 79,
    features: [
      'Unlimited applications',
      'Unlimited components & widgets',
      'Branding',
      'App & dashboard templates',
      'Unlimited themes',
      'Sharing the app',
      'Data connection',
      'Export frontend',
      'Export data actions',
      'Priority support'
    ],
    available: true,
    plan: Plan.STANDARD_MONTHLY
  },
  {
    billingPeriod: 'monthly',
    image: {
      small: 'assets/plans/startups-small.png',
      big: 'assets/plans/startups-small.png'
    },
    title: 'Startups',
    priceBeforeDiscount: 79,
    price: 29,
    discountResistant: true,
    features: [
      'Unlimited projects',
      'Unlimited pages',
      'Preview/Sharing',
      'Advanced Branding',
      'Data Connection',
      'Export Full Code',
      'Unlimited themes'
    ],
    available: true,
    link: 'https://share.hsforms.com/1BbSYEne-RSuwZd_hDOF3wA1gk6e',
    plan: Plan.STARTUPS_MONTHLY
  }
];

export const PLANS_ANNUALLY: AvailablePlan[] = [
  {
    billingPeriod: 'annually',
    image: {
      small: 'assets/plans/template-small.png',
      big: 'assets/plans/template-big.png'
    },
    title: 'Template maker',
    price: 13,
    annuallyPrice: 150,
    features: [
      '6 applications',
      'Unlimited pages',
      'Unlimited components & widgets',
      'Branding',
      'App & dashboard templates',
      'Dark theme',
      'Sharing the app',
      'Data connection',
      'Export frontend',
      'Email support'
    ],
    available: true,
    plan: Plan.TEMPLATE_ANNUALLY
  },
  {
    billingPeriod: 'annually',
    image: {
      small: 'assets/plans/light-small.png',
      big: 'assets/plans/light-big.png'
    },
    title: 'Frontend maker',
    price: 33,
    annuallyPrice: 399,
    features: [
      'Unlimited applications',
      'Unlimited components & widgets',
      'Branding',
      'App & dashboard templates',
      'Unlimited themes',
      'Sharing the app',
      'Data connection',
      'Export frontend',
      'Email support'
    ],
    available: true,
    plan: Plan.LIGHT_ANNUALLY
  },
  {
    billingPeriod: 'annually',
    image: {
      small: 'assets/plans/standard-small.png',
      big: 'assets/plans/standard-big.png'
    },
    title: 'Web App maker',
    price: 67,
    annuallyPrice: 799,
    features: [
      'Unlimited applications',
      'Unlimited components & widgets',
      'Branding',
      'App & dashboard templates',
      'Unlimited themes',
      'Sharing the app',
      'Data connection',
      'Export frontend',
      'Export data actions',
      'Priority support'
    ],
    available: true,
    plan: Plan.STANDARD_ANNUALLY
  },
  {
    billingPeriod: 'annually',
    image: {
      small: 'assets/plans/startups-small.png',
      big: 'assets/plans/startups-small.png'
    },
    title: 'Startups',
    priceBeforeDiscount: 79,
    price: 29,
    discountResistant: true,
    features: [
      'Unlimited projects',
      'Unlimited pages',
      'Preview/Sharing',
      'Advanced Branding',
      'Data Connection',
      'Export Full Code',
      'Unlimited themes'
    ],
    available: true,
    link: 'https://share.hsforms.com/1BbSYEne-RSuwZd_hDOF3wA1gk6e',
    plan: Plan.STARTUPS_ANNUALLY
  }
];
