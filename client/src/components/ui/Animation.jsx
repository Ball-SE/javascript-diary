// สร้างไฟล์ใหม่: client/src/components/ui/LottieAnimation.jsx
import Lottie from 'lottie-react';
import morphingAnimation from '../../../public/Morphing.json';

export function Animation({ className = "w-10 h-10" }) {
  return (
    <Lottie
      animationData={morphingAnimation}
      loop={true}
      autoplay={true}
      className={className}
    />
  );
}