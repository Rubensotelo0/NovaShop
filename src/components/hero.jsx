import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroSlides } from '../data/hero';
import '../styles/hero.css';

function Hero() {
  const [actual, setActual] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActual((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (id) => {
    navigate(`/productos/${id}`);
  };

  const slide = heroSlides[actual];

  return (
    <div 
      className="hero-container" 
      onClick={() => handleClick(slide.id)}
    >
      <img 
        src={slide.imagen} 
        alt={slide.titulo} 
        className="hero-imagen" 
      />
      <div className="hero-overlay">
        <h1 className="hero-titulo">{slide.titulo}</h1>
        <p className="hero-subtitulo">{slide.subtitulo}</p>
      </div>

      <div className="hero-puntos">
        {heroSlides.map((_, index) => (
          <span
            key={index}
            className={`hero-punto ${index === actual ? 'activo' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActual(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;