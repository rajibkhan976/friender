import Lottie from "react-lottie-player";
import noDataDefault from "../noDataAnimation.json";

export default function MyLottieAnimation(props) {
  return <Lottie animationData={noDataDefault} {...props} />;
}
