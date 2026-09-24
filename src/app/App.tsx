import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { AppRoutes } from './routes';

const App = () => (
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <AppRoutes />
    </MotionConfig>
  </LazyMotion>
);
export default App;
