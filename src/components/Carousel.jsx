import { useEffect, useState } from "react";
import "./Carousel.css";
import carousel1 from "../assets/images/h1.jpg";
import carousel2 from "../assets/images/h2.jpg";
import carousel3 from "../assets/images/h3.jpg";

const images = [carousel1, carousel2, carousel3];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="carousel">
      <div className="carousel-track">
        {images.map((image, index) => (
          <div
            key={index}
            className={
              index === currentSlide
                ? "carousel-slide active"
                : "carousel-slide"
            }
          >
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      <button className="carousel-btn previous" onClick={previousSlide}>
        ❮
      </button>

      <button className="carousel-btn next" onClick={nextSlide}>
        ❯
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={
              currentSlide === index ? "indicator active" : "indicator"
            }
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
