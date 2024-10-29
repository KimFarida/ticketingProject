import AppLogo from '../../src/images/profitplaylogo.png'
import './ScrollAnimation.css'; 

function ScrollAnimation() {
  return (
    <div className="overflow-hidden scroll-container">
      <div className="flex space-x-16 scroll-content">
        {/* First set of icons */}
        {[...Array(11)].map((_, index) => (
          <img key={index} src={AppLogo} alt={`App Logo ${index + 1}`} className="w-32 text-gray-400" />
        ))}

        {/* Duplicated set of icons for seamless scrolling */}
        {[...Array(11)].map((_, index) => (
          <img key={`duplicate-${index}`} src={AppLogo} alt={`App Logo ${index + 1}`} className="w-32 text-gray-400" />

        ))}
      </div>
    </div>
  );
}

export default ScrollAnimation;
