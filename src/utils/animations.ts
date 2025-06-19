export const fadeIn = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
};
export const slideUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
export const scale = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1
  }
};
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5
};
export const TRANSITION_EASINGS = {
  bounce: [0.175, 0.885, 0.32, 1.275],
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.43, 0.13, 0.23, 0.96]
};