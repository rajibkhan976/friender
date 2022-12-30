import Lottie from "react-lottie-player";
import noDataLight from "../noDataAnimationLight.json";

export default function MyLottieAnimation(props) {
  return <Lottie animationData={noDataLight} {...props} />;
}
