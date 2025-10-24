import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/Loading.json';

export function Loading({ className = "w-16 h-16" }) {
  return (
    <Lottie
      animationData={loadingAnimation}
      loop={true}
      autoplay={true}
      className={className}
    />
  );
}