export interface VideoTutorial {
  id: string;
  time: string;
  title: string;
}

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    title: 'How to get started',
    time: '2:05',
    id: 'yGfTFgR_oLM'
  },
  {
    title: '01 UI Builder interface',
    time: '5:59',
    id: '50QhsVdtDlo'
  },
  {
    title: '02 How to create a form',
    time: '4:31',
    id: 'hkDwLHB9zV0'
  },
  {
    title: '03 How to create a project',
    time: '0:58',
    id: '2QwBoGMK4SM'
  },
  {
    title: '04 How to change layout for the whole app',
    time: '1:37',
    id: 'VsMRuINKYpI'
  },
  {
    title: '05 How to change visual style of your app',
    time: '1:42',
    id: '54ETicZw6jY'
  },
  {
    title: '06 How to connect REST API',
    time: '6:44',
    id: 'Kpo8rGE1jBc'
  }
];

export const INITIAL_TUTORIAL: VideoTutorial = VIDEO_TUTORIALS[0];
