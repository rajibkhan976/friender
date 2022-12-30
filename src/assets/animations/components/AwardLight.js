import Lottie from "react-lottie-player";
import awardLight from "../award-animation-light.json";

export default function MyLottieAnimation(props) {
  return <Lottie animationData={awardLight} {...props} />;
}
