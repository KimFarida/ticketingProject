import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt } from "@fortawesome/free-solid-svg-icons";
import './ScrollAnimation.css'; 

function ScrollAnimation() {
  return (
    <div className="overflow-hidden scroll-container">
      <div className="flex space-x-16 scroll-content">
        {/* First set of icons */}
        {[...Array(11)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={faAppleAlt} className="text-7xl" />
        ))}

        {/* Duplicated set of icons for seamless scrolling */}
        {[...Array(11)].map((_, index) => (
          <FontAwesomeIcon key={`duplicate-${index}`} icon={faAppleAlt} className="text-7xl" />
        ))}
      </div>
    </div>
  );
}

export default ScrollAnimation;
