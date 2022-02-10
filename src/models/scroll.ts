export interface ScrollObserveEvent {
  position: {
    top: number;
    left: number;
  };
  direction: 'up' | 'down' | 'left' | 'right';
  directionChanged: boolean;
  delta: {
    top: number;
    left: number;
  };
  inflectionPoint: {
    top: number;
    left: number;
  };
}
