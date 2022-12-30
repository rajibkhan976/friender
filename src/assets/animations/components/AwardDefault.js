import Lottie from 'react-lottie-player';
import animation from '../award-animation.json';

export default function MyLottieAnimation(props) {
  return <Lottie animationData={animation} {...props} />;
}