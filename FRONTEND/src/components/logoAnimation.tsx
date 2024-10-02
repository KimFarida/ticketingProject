import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAppleAlt } from "@fortawesome/free-solid-svg-icons"


function ScrollAnimation(){

    return(
        <div className="overflow-hidden">
            <div className="flex space-x-16 animate-loop-scroll">
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl" />
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl" />
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl" />
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
                <FontAwesomeIcon icon={faAppleAlt} className="text-7xl"/>
            </div>
        </div>
    )
}


export  default ScrollAnimation;
